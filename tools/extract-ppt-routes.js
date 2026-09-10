#!/usr/bin/env node
/**
 * Read red PowerPoint connector candidates without changing the presentation.
 *
 * Usage:
 *   node tools/extract-ppt-routes.js surce/campus-map-source-line.pptx
 *
 * The JSON is intentionally a review artifact. It does not write routes.js.
 * A reviewer must choose the connector order, route meaning, and solid/turn
 * segment labels before a candidate becomes a formal route.
 */
import { readFile } from 'node:fs/promises'

const MAP_SIZE = { width: 1672, height: 941 }
const EOCD_SIGNATURE = 0x06054b50
const CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50
const LOCAL_FILE_SIGNATURE = 0x04034b50

const attr = (xml, name) => new RegExp(`\\b${name}="([^"]+)"`).exec(xml)?.[1] ?? null
const numberAttr = (xml, name) => Number(attr(xml, name) ?? 0)
const round = (value) => Math.round(value * 1000) / 1000

async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function zipEntries(file) {
  const bytes = await readFile(file)
  const eocdOffset = bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  if (eocdOffset < 0 || bytes.readUInt32LE(eocdOffset) !== EOCD_SIGNATURE) throw new Error('Not a readable ZIP/PPTX file.')

  const count = bytes.readUInt16LE(eocdOffset + 10)
  let cursor = bytes.readUInt32LE(eocdOffset + 16)
  const entries = new Map()

  for (let index = 0; index < count; index += 1) {
    if (bytes.readUInt32LE(cursor) !== CENTRAL_DIRECTORY_SIGNATURE) throw new Error('Invalid PPTX central directory.')
    const compression = bytes.readUInt16LE(cursor + 10)
    const compressedSize = bytes.readUInt32LE(cursor + 20)
    const nameLength = bytes.readUInt16LE(cursor + 28)
    const extraLength = bytes.readUInt16LE(cursor + 30)
    const commentLength = bytes.readUInt16LE(cursor + 32)
    const localOffset = bytes.readUInt32LE(cursor + 42)
    const name = bytes.subarray(cursor + 46, cursor + 46 + nameLength).toString('utf8')
    if (bytes.readUInt32LE(localOffset) !== LOCAL_FILE_SIGNATURE) throw new Error(`Invalid local header for ${name}.`)
    const localNameLength = bytes.readUInt16LE(localOffset + 26)
    const localExtraLength = bytes.readUInt16LE(localOffset + 28)
    const dataStart = localOffset + 30 + localNameLength + localExtraLength
    const compressed = bytes.subarray(dataStart, dataStart + compressedSize)
    const data = compression === 0 ? compressed : compression === 8 ? await inflateRaw(compressed) : null
    if (!data) throw new Error(`Unsupported ZIP compression method ${compression} for ${name}.`)
    entries.set(name, new TextDecoder().decode(data))
    cursor += 46 + nameLength + extraLength + commentLength
  }
  return entries
}

function pptPointToMap(point, slideSize) {
  return [
    round((point[0] / slideSize.width) * MAP_SIZE.width),
    round((point[1] / slideSize.height) * MAP_SIZE.height),
  ]
}

function extractRedConnectors(slideXml, slideSize) {
  const connectorBlocks = slideXml.match(/<p:cxnSp>[\s\S]*?<\/p:cxnSp>/g) ?? []
  return connectorBlocks.flatMap((block, connectorIndex) => {
    if (!/<a:srgbClr\s+val="FF0000"\s*\/>/i.test(block)) return []
    const transform = /<a:xfrm\b([^>]*)>[\s\S]*?<a:off\s+([^>]*)\/>[\s\S]*?<a:ext\s+([^>]*)\/>[\s\S]*?<\/a:xfrm>/.exec(block)
    if (!transform) return []
    const transformAttrs = transform[1]
    const offAttrs = transform[2]
    const extAttrs = transform[3]
    const x = numberAttr(offAttrs, 'x')
    const y = numberAttr(offAttrs, 'y')
    const cx = numberAttr(extAttrs, 'cx')
    const cy = numberAttr(extAttrs, 'cy')
    const flipH = attr(transformAttrs, 'flipH') === '1'
    const flipV = attr(transformAttrs, 'flipV') === '1'
    const rotation = numberAttr(transformAttrs, 'rot')
    const rawStart = [flipH ? x + cx : x, flipV ? y + cy : y]
    const rawEnd = [flipH ? x : x + cx, flipV ? y : y + cy]
    const name = /<p:cNvPr\b([^>]*)>/.exec(block)?.[1]
    return [{
      connectorIndex,
      name: attr(name ?? '', 'name'),
      ppt: { start: rawStart, end: rawEnd, rotation, flipH, flipV },
      map: { start: pptPointToMap(rawStart, slideSize), end: pptPointToMap(rawEnd, slideSize) },
      hasDirectionMarker: /<(a:headEnd|a:tailEnd)\s+type="(?!none)/.test(block),
      manualReviewRequired: rotation !== 0,
    }]
  })
}

const input = process.argv[2]
if (!input) throw new Error('Pass the PPTX path as the first argument.')
const entries = await zipEntries(input)
const presentation = entries.get('ppt/presentation.xml')
const sizeMatch = /<p:sldSz\s+cx="(\d+)"\s+cy="(\d+)"/.exec(presentation ?? '')
if (!sizeMatch) throw new Error('PPTX slide size was not found.')

const slideSize = { width: Number(sizeMatch[1]), height: Number(sizeMatch[2]), unit: 'EMU' }
const slides = [...entries]
  .filter(([name]) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
  .sort(([left], [right]) => Number(/\d+/.exec(left)[0]) - Number(/\d+/.exec(right)[0]))
  .map(([name, xml]) => ({
    slide: Number(/\d+/.exec(name)[0]),
    file: name,
    groupCount: (xml.match(/<p:grpSp\b/g) ?? []).length,
    redConnectors: extractRedConnectors(xml, slideSize),
  }))

console.log(JSON.stringify({ slideSize, mapSize: MAP_SIZE, slides }, null, 2))

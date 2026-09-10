#!/usr/bin/env node
/**
 * Confirm that every formal segment endpoint is one of the PPT candidate
 * connector endpoints. Direction may be reversed, but geometry may not differ.
 */
import { readFile } from 'node:fs/promises'
import { routes } from '../src/data/routes.js'

const candidates = JSON.parse(await readFile(new URL('./route-candidates.json', import.meta.url), 'utf8'))
const slideByNumber = new Map(candidates.slides.map((slide) => [slide.slide, slide]))
const samePoint = (left, right) => left[0] === right[0] && left[1] === right[1]
const matchesCandidate = (points, candidate) =>
  (samePoint(points[0], candidate.map.start) && samePoint(points.at(-1), candidate.map.end)) ||
  (samePoint(points[0], candidate.map.end) && samePoint(points.at(-1), candidate.map.start))

const errors = []
for (const route of routes) {
  const slide = slideByNumber.get(route.source.slide)
  if (!slide) {
    errors.push(`${route.id}: source slide is absent from candidate file`)
    continue
  }
  for (const segment of route.floors.flatMap((floorRoute) => floorRoute.segments)) {
    if (!slide.redConnectors.some((candidate) => matchesCandidate(segment.points, candidate))) {
      errors.push(`${route.id}: segment ${JSON.stringify(segment.points)} does not exactly match a candidate connector`)
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`Validated exact PPT candidate endpoints for ${routes.length} route(s).`)

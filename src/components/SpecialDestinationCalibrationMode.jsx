import { useEffect, useState } from 'react'
import { MAP_COORDINATE_SYSTEM, floorById, getMapImageUrl } from '../data/floors'
import { specialDestinationById } from '../data/specialDestinations'
import SpecialDestinationMarker from './SpecialDestinationMarker'

const storageKey = 'parent-day-map-v2:special-destination-calibration'
const defaultSize = Object.freeze({ width: 160, height: 58 })
const destination = specialDestinationById['general-forum']

function loadDraft() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function exportJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'special-destination-calibration.json'
  link.click()
  URL.revokeObjectURL(url)
}

export default function SpecialDestinationCalibrationMode() {
  const [draft, setDraft] = useState(loadDraft)
  const floor = floorById[destination.floorId]

  useEffect(() => {
    try {
      if (draft) window.localStorage.setItem(storageKey, JSON.stringify(draft))
    } catch {
      // The current session remains usable if localStorage is unavailable.
    }
  }, [draft])

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target
      if (!draft || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return
      const step = event.shiftKey ? 5 : 1
      const change = { ArrowUp: { y: -step }, ArrowDown: { y: step }, ArrowLeft: { x: -step }, ArrowRight: { x: step } }[event.key]
      if (!change) return
      event.preventDefault()
      setDraft((current) => ({ ...current, highlight: { ...current.highlight, x: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.width, current.highlight.x + (change.x ?? 0))), y: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.height, current.highlight.y + (change.y ?? 0))) }, label: { ...current.label, x: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.width, current.label.x + (change.x ?? 0))), y: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.height, current.label.y + (change.y ?? 0))) } }))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [draft])

  function selectMapPosition(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Number(((event.clientX - bounds.left) / bounds.width * MAP_COORDINATE_SYSTEM.width).toFixed(1))
    const y = Number(((event.clientY - bounds.top) / bounds.height * MAP_COORDINATE_SYSTEM.height).toFixed(1))
    setDraft({ id: destination.id, floorId: destination.floorId, highlight: { x, y, ...defaultSize }, label: { x, y } })
  }

  function update(key, value) {
    const numericValue = Number(value)
    setDraft((current) => ({ ...current, highlight: { ...current.highlight, [key]: numericValue }, label: ['x', 'y'].includes(key) ? { ...current.label, [key]: numericValue } : current.label }))
  }

  function clearDraft() {
    if (!window.confirm('確定要清除尚未匯出的綜合座談定位草稿嗎？')) return
    window.localStorage.removeItem(storageKey)
    setDraft(null)
  }

  const preview = draft && { ...destination, highlight: draft.highlight, label: draft.label }

  return (
    <main className="calibration-shell">
      <header className="calibration-header"><p className="eyebrow">開發工具 · 固定活動地點人工定位</p><h1>Special Destination Calibration</h1><p>此工具只標定「綜合座談」固定位置。草稿只存於此瀏覽器；請人工確認後匯出，再由維護者寫入正式資料檔。</p></header>
      <section className="calibration-controls"><strong>活動地點：{destination.displayName}｜{destination.locationLabel}</strong><span>樓層：{floor.label}</span></section>
      <section className="calibration-map" aria-label="綜合座談固定活動地點定位底圖"><div className="map-canvas calibration-canvas" onClick={selectMapPosition}><img alt="綜合座談 3 樓專用平面圖" src={getMapImageUrl('floor-3-1.webp')} /><svg className="calibration-overlay" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${MAP_COORDINATE_SYSTEM.width} ${MAP_COORDINATE_SYSTEM.height}`}>{preview && <SpecialDestinationMarker destination={preview} />}</svg></div></section>
      <section className="calibration-result" aria-live="polite"><strong>綜合座談｜B棟三樓</strong>{draft ? <><div className="calibration-fields"><label>X<input max={MAP_COORDINATE_SYSTEM.width} min="0" onChange={(event) => update('x', event.target.value)} step="0.1" type="number" value={draft.highlight.x} /></label><label>Y<input max={MAP_COORDINATE_SYSTEM.height} min="0" onChange={(event) => update('y', event.target.value)} step="0.1" type="number" value={draft.highlight.y} /></label><label>寬<input min="20" onChange={(event) => update('width', event.target.value)} type="number" value={draft.highlight.width} /></label><label>高<input min="20" onChange={(event) => update('height', event.target.value)} type="number" value={draft.highlight.height} /></label></div><p>點擊地圖建立預覽框；可用方向鍵微調 1 單位，Shift + 方向鍵微調 5 單位。</p></> : <p>尚未有正式座標。請直接點擊 3F 地圖建立人工定位預覽。</p>}<div className="calibration-export"><button disabled={!draft} onClick={() => exportJson(draft)} type="button">匯出定位資料</button><button className="clear-calibration" disabled={!draft} onClick={clearDraft} type="button">清除定位草稿</button></div></section>
    </main>
  )
}

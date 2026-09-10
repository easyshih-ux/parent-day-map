import { useEffect, useMemo, useState } from 'react'
import { destinations } from '../data/destinations'
import { floorById, floors, MAP_COORDINATE_SYSTEM } from '../data/floors'
import TargetClassHighlight from './TargetClassHighlight'

const storageKey = 'parent-day-map-v2:class-highlight-calibration'
const defaultSize = Object.freeze({ width: 76, height: 46 })
const classrooms = destinations.filter((destination) => destination.category === 'classroom')

function loadDrafts() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function positionFor(destination, record) {
  if (!record) return null
  return { x: record.x, y: record.y, width: record.width, height: record.height }
}

function exportJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function ClassHighlightCalibrationMode() {
  const [records, setRecords] = useState(loadDrafts)
  const [floorId, setFloorId] = useState('1F')
  const floorClasses = useMemo(() => classrooms.filter((destination) => destination.floor === floorId), [floorId])
  const [classId, setClassId] = useState(floorClasses[0].id)
  const [draft, setDraft] = useState(null)
  const [lastSize, setLastSize] = useState(defaultSize)
  const [showCompleted, setShowCompleted] = useState(true)
  const floor = floorById[floorId]
  const currentClass = classrooms.find((destination) => destination.id === classId)
  const completedOnFloor = floorClasses.filter((destination) => records[destination.displayName])

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(records))
    } catch {
      // Calibration remains usable for the current session if storage is unavailable.
    }
  }, [records])

  useEffect(() => {
    const first = floorClasses.find((destination) => !records[destination.displayName]) ?? floorClasses[0]
    setClassId(first.id)
    setDraft(positionFor(first, records[first.displayName]))
  }, [floorId]) // Deliberately reset only when the teacher chooses a floor.

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target
      if (!draft || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return
      const step = event.shiftKey ? 5 : 1
      const change = {
        ArrowUp: { y: -step }, ArrowDown: { y: step }, ArrowLeft: { x: -step }, ArrowRight: { x: step },
      }[event.key]
      if (!change) return
      event.preventDefault()
      setDraft((current) => ({ ...current, x: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.width, current.x + (change.x ?? 0))), y: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.height, current.y + (change.y ?? 0))) }))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [draft])

  function openClass(nextClassId) {
    const destination = classrooms.find((candidate) => candidate.id === nextClassId)
    setClassId(nextClassId)
    setDraft(positionFor(destination, records[destination.displayName]))
  }

  function selectMapPosition(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width * MAP_COORDINATE_SYSTEM.width
    const y = (event.clientY - bounds.top) / bounds.height * MAP_COORDINATE_SYSTEM.height
    setDraft({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), ...lastSize })
  }

  function updateDraft(key, value) {
    setDraft((current) => current && ({ ...current, [key]: Number(value) }))
  }

  function nextUnconfirmed(afterIndex, sourceRecords) {
    const candidates = [...floorClasses.slice(afterIndex + 1), ...floorClasses.slice(0, afterIndex)]
    return candidates.find((destination) => !sourceRecords[destination.displayName]) ?? null
  }

  function confirmAndNext() {
    if (!draft) return
    const confirmed = { floor: Number(floorId.slice(0, -1)), x: draft.x, y: draft.y, width: draft.width, height: draft.height }
    const nextRecords = { ...records, [currentClass.displayName]: confirmed }
    setRecords(nextRecords)
    setLastSize({ width: draft.width, height: draft.height })
    const currentIndex = floorClasses.findIndex((destination) => destination.id === currentClass.id)
    const next = nextUnconfirmed(currentIndex, nextRecords)
    if (next) {
      setClassId(next.id)
      setDraft(null)
    }
  }

  function previousClass() {
    const currentIndex = floorClasses.findIndex((destination) => destination.id === currentClass.id)
    if (currentIndex > 0) openClass(floorClasses[currentIndex - 1].id)
  }

  function skipClass() {
    const currentIndex = floorClasses.findIndex((destination) => destination.id === currentClass.id)
    const next = nextUnconfirmed(currentIndex, records)
    setDraft(null)
    if (next) setClassId(next.id)
  }

  function clearDrafts() {
    if (!window.confirm('確定要清除尚未匯出的人工定位資料嗎？')) return
    window.localStorage.removeItem(storageKey)
    setRecords({})
    setDraft(null)
    setLastSize(defaultSize)
  }

  const floorExport = Object.fromEntries(completedOnFloor.map((destination) => [destination.displayName, records[destination.displayName]]))
  const allExport = Object.fromEntries(Object.entries(records).sort(([first], [second]) => first.localeCompare(second, 'zh-Hant')))
  const floorComplete = completedOnFloor.length === floorClasses.length

  return (
    <main className="calibration-shell">
      <header className="calibration-header">
        <p className="eyebrow">開發工具 · 人工定位</p>
        <h1>班級 Highlight Calibration</h1>
        <p>每個 X／Y 均需由教師在正式底圖上點擊確認。暫存只存在此瀏覽器，匯出後再人工整理進正式資料檔。</p>
      </header>

      <section className="calibration-controls" aria-label="班級定位控制項">
        <label>樓層<select onChange={(event) => setFloorId(event.target.value)} value={floorId}>{floors.map((candidateFloor) => <option key={candidateFloor.id} value={candidateFloor.id}>{candidateFloor.label}</option>)}</select></label>
        <label>目前標定<select onChange={(event) => openClass(event.target.value)} value={classId}>{floorClasses.map((candidateClass) => <option key={candidateClass.id} value={candidateClass.id}>{records[candidateClass.displayName] ? '✓' : '○'} {candidateClass.displayName}</option>)}</select></label>
        <label className="completed-toggle"><input checked={showCompleted} onChange={(event) => setShowCompleted(event.target.checked)} type="checkbox" /> 顯示已完成框</label>
      </section>

      <p className="calibration-progress">{floor.label} 標定進度：{completedOnFloor.length} / {floorClasses.length}{floorComplete && ' · 本樓層班級標定完成'}</p>

      <section className="calibration-map" aria-label={floor.label + ' 班級定位底圖'}>
        <div className="map-canvas calibration-canvas" onClick={selectMapPosition}>
          <img alt={floor.label + ' 正式校園平面圖'} src={floor.image} />
          <svg className="calibration-overlay" preserveAspectRatio="xMidYMid meet" viewBox={'0 0 ' + MAP_COORDINATE_SYSTEM.width + ' ' + MAP_COORDINATE_SYSTEM.height}>
            {showCompleted && completedOnFloor.filter((destination) => destination.id !== currentClass.id).map((destination) => <TargetClassHighlight className="target-class-highlight target-class-highlight-complete" key={destination.id} {...records[destination.displayName]} />)}
            {draft && <TargetClassHighlight {...draft} />}
          </svg>
        </div>
      </section>

      <section className="calibration-result" aria-live="polite">
        <strong>目前標定：{currentClass.displayName}</strong>
        {draft ? <>
          <div className="calibration-fields">
            <label>X<input min="0" max={MAP_COORDINATE_SYSTEM.width} onChange={(event) => updateDraft('x', event.target.value)} step="0.1" type="number" value={draft.x} /></label>
            <label>Y<input min="0" max={MAP_COORDINATE_SYSTEM.height} onChange={(event) => updateDraft('y', event.target.value)} step="0.1" type="number" value={draft.y} /></label>
            <label>寬<input min="20" onChange={(event) => updateDraft('width', event.target.value)} type="number" value={draft.width} /></label>
            <label>高<input min="20" onChange={(event) => updateDraft('height', event.target.value)} type="number" value={draft.height} /></label>
          </div>
          <p>可用方向鍵微調 1 單位；Shift + 方向鍵微調 5 單位。輸入框聚焦時不會攔截方向鍵。</p>
        </> : <p>請點擊地圖上 {currentClass.displayName} 班號碼中央，建立預覽框。</p>}
        <div className="calibration-actions">
          <button disabled={floorClasses.findIndex((destination) => destination.id === currentClass.id) === 0} onClick={previousClass} type="button">上一班</button>
          <button disabled={!draft} onClick={confirmAndNext} type="button">確認並下一班</button>
          <button onClick={skipClass} type="button">跳過</button>
        </div>
      </section>

      <section className="calibration-export">
        <button disabled={!completedOnFloor.length} onClick={() => exportJson(floorExport, 'class-highlight-' + floorId + '.json')} type="button">匯出本層資料</button>
        <button disabled={!Object.keys(records).length} onClick={() => exportJson(allExport, 'class-highlight-positions.json')} type="button">匯出全部資料</button>
        <button className="clear-calibration" disabled={!Object.keys(records).length} onClick={clearDrafts} type="button">清除 Calibration 暫存</button>
      </section>
    </main>
  )
}

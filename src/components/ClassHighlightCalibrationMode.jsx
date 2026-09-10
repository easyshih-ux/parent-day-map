import { useEffect, useMemo, useState } from 'react'
import { floorById, floors, MAP_COORDINATE_SYSTEM } from '../data/floors'
import { getActiveClassrooms } from '../data/classroomResolver'
import ClassLabelOverlay from './ClassLabelOverlay'
import TargetClassHighlight from './TargetClassHighlight'

const storageKey = 'parent-day-map-v2:room-calibration'
const defaultSize = Object.freeze({ width: 76, height: 46 })

function loadDrafts() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
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
  const classrooms = useMemo(getActiveClassrooms, [])
  const [records, setRecords] = useState(loadDrafts)
  const [floorId, setFloorId] = useState('1F')
  const floorClasses = useMemo(() => classrooms.filter((classroom) => classroom.floor === floorId), [classrooms, floorId])
  const [classNumber, setClassNumber] = useState(floorClasses[0]?.classNumber)
  const [mode, setMode] = useState('highlight')
  const [draft, setDraft] = useState(null)
  const [lastSize, setLastSize] = useState(defaultSize)
  const [showCompleted, setShowCompleted] = useState(true)
  const floor = floorById[floorId]
  const currentClass = floorClasses.find((classroom) => classroom.classNumber === classNumber) ?? floorClasses[0]
  const completedOnFloor = floorClasses.filter((classroom) => records[classroom.roomId]?.[mode])

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(records))
    } catch {
      // Calibration remains usable for the current session if storage is unavailable.
    }
  }, [records])

  useEffect(() => {
    const first = floorClasses.find((classroom) => !records[classroom.roomId]?.[mode]) ?? floorClasses[0]
    setClassNumber(first?.classNumber)
    setDraft(first ? records[first.roomId]?.[mode] ?? first[mode] : null)
  }, [floorId, mode])

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target
      if (!draft || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return
      const step = event.shiftKey ? 5 : 1
      const change = { ArrowUp: { y: -step }, ArrowDown: { y: step }, ArrowLeft: { x: -step }, ArrowRight: { x: step } }[event.key]
      if (!change) return
      event.preventDefault()
      setDraft((current) => ({ ...current, x: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.width, current.x + (change.x ?? 0))), y: Math.max(0, Math.min(MAP_COORDINATE_SYSTEM.height, current.y + (change.y ?? 0))) }))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [draft])

  function openClass(nextClassNumber) {
    const classroom = floorClasses.find((candidate) => candidate.classNumber === nextClassNumber)
    setClassNumber(nextClassNumber)
    setDraft(classroom ? records[classroom.roomId]?.[mode] ?? classroom[mode] : null)
  }

  function selectMapPosition(event) {
    if (!currentClass) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Number(((event.clientX - bounds.left) / bounds.width * MAP_COORDINATE_SYSTEM.width).toFixed(1))
    const y = Number(((event.clientY - bounds.top) / bounds.height * MAP_COORDINATE_SYSTEM.height).toFixed(1))
    setDraft(mode === 'highlight' ? { x, y, ...lastSize } : { ...currentClass.label, x, y })
  }

  function updateDraft(key, value) {
    setDraft((current) => current && ({ ...current, [key]: Number(value) }))
  }

  function nextUnconfirmed(afterIndex, sourceRecords) {
    const candidates = [...floorClasses.slice(afterIndex + 1), ...floorClasses.slice(0, afterIndex)]
    return candidates.find((classroom) => !sourceRecords[classroom.roomId]?.[mode]) ?? null
  }

  function confirmAndNext() {
    if (!draft || !currentClass) return
    const nextRecords = { ...records, [currentClass.roomId]: { ...records[currentClass.roomId], [mode]: draft } }
    setRecords(nextRecords)
    if (mode === 'highlight') setLastSize({ width: draft.width, height: draft.height })
    const currentIndex = floorClasses.findIndex((classroom) => classroom.classNumber === currentClass.classNumber)
    const next = nextUnconfirmed(currentIndex, nextRecords)
    if (next) {
      setClassNumber(next.classNumber)
      setDraft(next[mode])
    }
  }

  function previousClass() {
    const currentIndex = floorClasses.findIndex((classroom) => classroom.classNumber === currentClass?.classNumber)
    if (currentIndex > 0) openClass(floorClasses[currentIndex - 1].classNumber)
  }

  function skipClass() {
    const currentIndex = floorClasses.findIndex((classroom) => classroom.classNumber === currentClass?.classNumber)
    const next = nextUnconfirmed(currentIndex, records)
    if (next) openClass(next.classNumber)
  }

  function clearDrafts() {
    if (!window.confirm('確定要清除尚未匯出的固定教室定位資料嗎？')) return
    window.localStorage.removeItem(storageKey)
    setRecords({})
    setDraft(currentClass?.[mode] ?? null)
    setLastSize(defaultSize)
  }

  const floorExport = Object.fromEntries(completedOnFloor.map((classroom) => [classroom.roomId, records[classroom.roomId]]))
  const allExport = Object.fromEntries(Object.entries(records).sort(([first], [second]) => first.localeCompare(second, 'en')))
  const floorComplete = completedOnFloor.length === floorClasses.length
  const previewClassroom = currentClass && { ...currentClass, [mode]: draft ?? currentClass[mode] }

  return (
    <main className="calibration-shell">
      <header className="calibration-header"><p className="eyebrow">開發工具 · 固定教室人工定位</p><h1>Classroom Calibration</h1><p>校正資料以固定 roomId 保存；班級名稱只來自目前啟用學年度。暫存只存在此瀏覽器，匯出後再人工整理進正式 rooms 資料。</p></header>
      <section className="calibration-controls" aria-label="教室定位控制項">
        <label>樓層<select onChange={(event) => setFloorId(event.target.value)} value={floorId}>{floors.map((candidateFloor) => <option key={candidateFloor.id} value={candidateFloor.id}>{candidateFloor.label}</option>)}</select></label>
        <label>校正項目<select onChange={(event) => setMode(event.target.value)} value={mode}><option value="highlight">Highlight 校正</option><option value="label">班級文字校正</option></select></label>
        <label>目前班級<select onChange={(event) => openClass(event.target.value)} value={currentClass?.classNumber}>{floorClasses.map((candidate) => <option key={candidate.classNumber} value={candidate.classNumber}>{records[candidate.roomId]?.[mode] ? '✓' : '○'} {candidate.classNumber} · {candidate.roomId}</option>)}</select></label>
        <label className="completed-toggle"><input checked={showCompleted} onChange={(event) => setShowCompleted(event.target.checked)} type="checkbox" /> 顯示已完成資料</label>
      </section>
      <p className="calibration-progress">{floor.label} {mode === 'highlight' ? 'Highlight' : '班級文字'}校正進度：{completedOnFloor.length} / {floorClasses.length}{floorComplete && ' · 本樓層校正完成'}</p>
      <section className="calibration-map" aria-label={floor.label + ' 固定教室定位底圖'}><div className="map-canvas calibration-canvas" onClick={selectMapPosition}><img alt={floor.label + ' 固定空白校園平面圖'} src={floor.image} /><svg className="calibration-overlay" preserveAspectRatio="xMidYMid meet" viewBox={'0 0 ' + MAP_COORDINATE_SYSTEM.width + ' ' + MAP_COORDINATE_SYSTEM.height}>{showCompleted && mode === 'highlight' && completedOnFloor.filter((candidate) => candidate.roomId !== currentClass?.roomId).map((candidate) => <TargetClassHighlight className="target-class-highlight target-class-highlight-complete" key={candidate.roomId} {...records[candidate.roomId].highlight} />)}{showCompleted && mode === 'label' && <ClassLabelOverlay classrooms={completedOnFloor.filter((candidate) => candidate.roomId !== currentClass?.roomId).map((candidate) => ({ ...candidate, label: records[candidate.roomId].label }))} />}{mode === 'highlight' && draft && <TargetClassHighlight {...draft} />}{mode === 'label' && previewClassroom && <ClassLabelOverlay classrooms={[previewClassroom]} />}</svg></div></section>
      <section className="calibration-result" aria-live="polite"><strong>目前班級：{currentClass?.classNumber}　固定教室：{currentClass?.roomId}</strong>{draft ? <><div className="calibration-fields"><label>X<input max={MAP_COORDINATE_SYSTEM.width} min="0" onChange={(event) => updateDraft('x', event.target.value)} step="0.1" type="number" value={draft.x} /></label><label>Y<input max={MAP_COORDINATE_SYSTEM.height} min="0" onChange={(event) => updateDraft('y', event.target.value)} step="0.1" type="number" value={draft.y} /></label>{mode === 'highlight' && <><label>寬<input min="20" onChange={(event) => updateDraft('width', event.target.value)} type="number" value={draft.width} /></label><label>高<input min="20" onChange={(event) => updateDraft('height', event.target.value)} type="number" value={draft.height} /></label></>}</div><p>可用方向鍵微調 1 單位；Shift + 方向鍵微調 5 單位。</p></> : <p>請點擊地圖，建立 {mode === 'highlight' ? 'Highlight 預覽框' : '班級文字預覽'}。</p>}<div className="calibration-actions"><button disabled={floorClasses.findIndex((candidate) => candidate.classNumber === currentClass?.classNumber) === 0} onClick={previousClass} type="button">上一班</button><button disabled={!draft} onClick={confirmAndNext} type="button">確認並下一班</button><button onClick={skipClass} type="button">跳過</button></div></section>
      <section className="calibration-export"><button disabled={!completedOnFloor.length} onClick={() => exportJson(floorExport, 'room-calibration-' + floorId + '.json')} type="button">匯出本層資料</button><button disabled={!Object.keys(records).length} onClick={() => exportJson(allExport, 'room-calibration.json')} type="button">匯出全部資料</button><button className="clear-calibration" disabled={!Object.keys(records).length} onClick={clearDrafts} type="button">清除 Calibration 暫存</button></section>
    </main>
  )
}

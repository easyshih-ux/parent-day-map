import { useEffect, useMemo, useState } from 'react'
import { academicYear115 } from '../data/academicYears/115'
import { academicYear116 } from '../data/academicYears/116'
import { academicYearDraftStorageKey } from '../data/academicYearPreview'
import { validateAcademicYearAssignments } from '../data/academicYearValidation'
import { rooms } from '../data/rooms'

const expectedClassNumbers = Object.keys(academicYear115.assignments).sort((first, second) => Number(first) - Number(second))

function load116Draft() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(academicYearDraftStorageKey) ?? 'null')
    return saved?.assignments && typeof saved.assignments === 'object' ? { ...academicYear116.assignments, ...saved.assignments } : { ...academicYear116.assignments }
  } catch {
    return { ...academicYear116.assignments }
  }
}

function save116Draft(assignments) {
  window.localStorage.setItem(academicYearDraftStorageKey, JSON.stringify({ academicYear: '116', assignments }))
}

function download(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function toJavaScript(assignments) {
  const lines = expectedClassNumbers.map((classNumber) => `    '${classNumber}': '${assignments[classNumber] ?? ''}',`).join('\n')
  return `export const academicYear116 = Object.freeze({\n  academicYear: '116',\n  assignments: Object.freeze({\n${lines}\n  }),\n})\n`
}

const sameAssignments = (first, second) => expectedClassNumbers.every((classNumber) => first[classNumber] === second[classNumber])
const roomOptionLabel = (room) => `${room.id}｜${room.building}棟｜${room.floor}`

export default function AcademicYearConfigMode() {
  const [selectedYear, setSelectedYear] = useState('116')
  const [draft116, setDraft116] = useState(load116Draft)
  const [floorFilter, setFloorFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const isReadOnly = selectedYear === '115'
  const assignments = isReadOnly ? academicYear115.assignments : draft116
  const validation = useMemo(() => validateAcademicYearAssignments(assignments, expectedClassNumbers), [assignments])
  const changedClassNumbers = expectedClassNumbers.filter((classNumber) => assignments[classNumber] !== academicYear115.assignments[classNumber])
  const duplicateByClass = useMemo(() => new Map(validation.duplicates.flatMap(({ roomId, classNumbers }) => classNumbers.map((classNumber) => [classNumber, roomId]))), [validation])
  const errorClassNumbers = useMemo(() => new Set([...validation.missing, ...validation.invalid, ...duplicateByClass.keys()]), [validation, duplicateByClass])
  const dirty = !sameAssignments(draft116, academicYear116.assignments)

  useEffect(() => {
    save116Draft(draft116)
  }, [draft116])

  const rows = expectedClassNumbers.filter((classNumber) => {
    const room = rooms.find((candidate) => candidate.id === assignments[classNumber])
    const matchesFloor = floorFilter === 'all' || room?.floor === floorFilter
    const normalizedSearch = search.trim().toUpperCase()
    const matchesSearch = !normalizedSearch || classNumber.includes(normalizedSearch) || assignments[classNumber]?.toUpperCase().includes(normalizedSearch)
    const changed = changedClassNumbers.includes(classNumber)
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'changed' && changed) || (statusFilter === 'unchanged' && !changed) || (statusFilter === 'errors' && errorClassNumbers.has(classNumber))
    return matchesFloor && matchesSearch && matchesStatus
  })

  function updateAssignment(classNumber, roomId) {
    setDraft116((current) => ({ ...current, [classNumber]: roomId }))
    setNotice('116 草稿已暫存於此瀏覽器。')
  }

  function copy115To116() {
    if (dirty && !window.confirm('116 草稿已有未儲存修改。確定要以 115 配置覆蓋嗎？')) return
    setDraft116({ ...academicYear115.assignments })
    setNotice('已複製 115 配置到 116 草稿。')
  }

  function reset116Draft() {
    if (!window.confirm('確定要將 116 草稿重設回 116.js 的初始內容嗎？')) return
    setDraft116({ ...academicYear116.assignments })
    setNotice('116 草稿已重設。')
  }

  function preview116() {
    if (!validation.usable) return setNotice('請先修正未配置、無效或重複 room 的問題，才能預覽。')
    save116Draft(draft116)
    window.location.assign(`${import.meta.env.BASE_URL}?previewAcademicYear=116`)
  }

  async function copyJavaScript() {
    try {
      await navigator.clipboard.writeText(toJavaScript(draft116))
      setNotice('116.js 內容已複製到剪貼簿。')
    } catch {
      setNotice('無法直接複製；請改用 JSON 匯出。')
    }
  }

  return <main className="academic-config-shell">
    <header className="academic-config-header"><p className="eyebrow">開發工具 · 年度班級配置</p><h1>學年度班級配置管理</h1><p>115 為正式唯讀參考；116 僅編輯此瀏覽器的草稿，不會改動正式年度或專案檔案。</p></header>
    <section className="academic-config-controls" aria-label="年度配置控制項">
      <label>學年度<select onChange={(event) => setSelectedYear(event.target.value)} value={selectedYear}><option value="115">115｜正式年度（唯讀）</option><option value="116">116｜草稿</option></select></label>
      <label>樓層<select onChange={(event) => setFloorFilter(event.target.value)} value={floorFilter}><option value="all">全部</option>{['1F', '2F', '3F', '4F', '5F'].map((floor) => <option key={floor} value={floor}>{floor}</option>)}</select></label>
      <label>顯示<select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option value="all">全部</option><option value="changed">已變更</option><option value="unchanged">未變更</option><option value="errors">有錯誤</option></select></label>
      <label>搜尋<input onChange={(event) => setSearch(event.target.value)} placeholder="班級或 roomId，例如 801、C-2F" type="search" value={search} /></label>
    </section>
    <section className={'academic-config-summary ' + (validation.usable ? 'is-valid' : 'has-errors')}><strong>{selectedYear} 學年度{isReadOnly ? '｜正式年度，只讀' : '｜草稿'}</strong><span>已配置：{validation.configured} / {validation.total}</span><span>未配置：{validation.missing.length}</span><span>重複 room：{validation.duplicates.length}</span><span>無效 room：{validation.invalid.length}</span><b>配置狀態：{validation.usable ? '可用' : '有問題'}</b></section>
    {!isReadOnly && <section className="academic-config-actions"><button onClick={copy115To116} type="button">複製 115 配置到 116</button><button onClick={reset116Draft} type="button">重設回 116.js</button><button disabled={!validation.usable} onClick={preview116} type="button">預覽 116</button><button onClick={() => download({ academicYear: '116', assignments: draft116 }, 'academic-year-116.json')} type="button">匯出 116 配置</button><button onClick={copyJavaScript} type="button">複製 116.js 內容</button></section>}
    {!isReadOnly && <p className="academic-config-comparison">與 115 比較：已變更 {changedClassNumbers.length} 班／未變更 {validation.total - changedClassNumbers.length} 班。</p>}
    {validation.duplicates.length > 0 && <section className="academic-config-warnings">{validation.duplicates.map(({ roomId, classNumbers }) => <p key={roomId}>⚠ {roomId} 同時被 {classNumbers.join('、')} 使用</p>)}</section>}
    {notice && <p className="academic-config-notice" aria-live="polite">{notice}</p>}
    <section className="academic-config-table" aria-label={selectedYear + ' 學年度班級配置'}><div className="academic-config-row academic-config-heading"><span>班級</span><span>{isReadOnly ? '115 roomId' : '116 roomId'}</span><span>樓層</span><span>棟別</span><span>Route</span><span>與 115 比較</span></div>{rows.map((classNumber) => {
      const roomId = assignments[classNumber] ?? ''
      const room = rooms.find((candidate) => candidate.id === roomId)
      const changed = roomId !== academicYear115.assignments[classNumber]
      const error = errorClassNumbers.has(classNumber)
      return <div className={'academic-config-row ' + (error ? 'has-error' : '')} key={classNumber}><strong>{classNumber}</strong>{isReadOnly ? <span>{roomOptionLabel(room)}</span> : <select aria-label={classNumber + ' 的固定教室'} onChange={(event) => updateAssignment(classNumber, event.target.value)} value={roomId}><option value="">未配置</option>{rooms.map((candidate) => <option key={candidate.id} value={candidate.id}>{roomOptionLabel(candidate)}</option>)}</select>}<span>{room?.floor ?? '—'}</span><span>{room?.building ? room.building + '棟' : '—'}</span><code>{room?.routeId ?? '無效 roomId'}</code><span>{changed ? '已變更' : '未變更'}{error && ' · 有錯誤'}</span></div>
    })}</section>
  </main>
}

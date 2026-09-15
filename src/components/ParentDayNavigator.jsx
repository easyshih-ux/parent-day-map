import { useEffect, useState } from 'react'
import CampusMap from './CampusMap'
import { floorById, getMapImageUrl } from '../data/floors'
import { routes } from '../data/routes'
import { getEntranceMarker } from '../data/entranceMarkers'
import { getTransitionMarker } from '../data/transitionMarkers'
import { getElevatorStraightPresentation, getElevatorTransitionMarker } from '../data/elevatorTransitionMarkers'
import { isMarkerOnlyArrivalFloor } from '../data/arrivalPresentation'
import { getSpiralTransitionMarker } from '../data/spiralTransitionMarkers'
import { getElevatorDestinationPresentation } from '../data/elevatorDestinationPresentation'
import { getRouteSummary } from '../utils/routeSummary'
import { getClassroomsForFloor, resolveClassroom } from '../data/classroomResolver'
import { getPreviewAcademicYear } from '../data/academicYearPreview'
import { specialDestinationById } from '../data/specialDestinations'

const normalizeClassNumber = (value) => value.trim().replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
const getHomeImageUrl = (filename) => `${import.meta.env.BASE_URL}images/${filename}`

export default function ParentDayNavigator() {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [navigation, setNavigation] = useState(null)
  const previewAcademicYear = import.meta.env.DEV ? getPreviewAcademicYear() : null

  function exitAcademicYearPreview() {
    window.location.assign(import.meta.env.BASE_URL)
  }

  function startNavigation(event) {
    event.preventDefault()
    const classNumber = normalizeClassNumber(input)
    if (!classNumber) return setMessage('請先輸入班級。')
    const classroom = resolveClassroom(classNumber)
    if (!classroom) return setMessage(`查無 ${classNumber} 班的導航資料，請確認班級後重新輸入。`)
    setMessage('')
    setInput(classNumber)
    setNavigation({ classNumber, routeId: classroom.routeId, floorIndex: 0 })
  }

  function resetNavigation() {
    setInput('')
    setMessage('')
    setNavigation(null)
  }

  function openSpecialDestination(destinationId) {
    setMessage('')
    setNavigation({ kind: 'special-destination', destinationId })
  }

  useEffect(() => {
    if (!navigation || navigation.floorIndex !== 0) return

    const route = routes.find((item) => item.id === navigation.routeId)
    const destinationFloorId = route?.floors.at(-1)?.floorId
    if (!route || route.floors[0]?.floorId !== '1F' || destinationFloorId === '1F') return

    const preloadImage = new Image()
    preloadImage.src = floorById[destinationFloorId].image
  }, [navigation])

  if (!navigation) return <main className="parent-home">
    <picture aria-hidden="true" className="home-background"><source media="(max-width: 768px)" srcSet={getHomeImageUrl('parent-day-home-mobile.webp')} /><img alt="" src={getHomeImageUrl('parent-day-home-desktop.webp')} /></picture>
    <div className="parent-home-content">
      {previewAcademicYear && <section className="academic-preview-banner academic-preview-banner-home" aria-label="開發預覽模式"><strong>開發預覽：{previewAcademicYear} 學年度</strong><button onClick={exitAcademicYearPreview} type="button">返回正式 115</button></section>}
      <header className="home-hero" aria-labelledby="home-title">
        <p className="school-name">新北市立義學國民中學</p>
        <h1 id="home-title">家長日校園導航</h1>
        <p>輸入孩子的班級，立即查看前往教室的路線</p>
      </header>
      <section className="home-card" aria-label="班級搜尋">
        <form className="class-search" onSubmit={startNavigation}>
          <label htmlFor="class-number">請輸入您要前往的班級</label>
          <div className="class-input-wrap"><input autoComplete="off" id="class-number" inputMode="numeric" onChange={(event) => setInput(event.target.value)} placeholder="例如：703、811、901" type="text" value={input} /></div>
          <button type="submit">開始導航 <span aria-hidden="true">→</span></button>
          <p>輸入班級後，將顯示前往教室的路線圖</p>
        </form>
        {message && <p aria-live="polite" className="search-message">{message}</p>}
      </section>
      <section className="special-destination-entry" aria-label="活動地點">
        <div className="special-destination-icon" aria-hidden="true"><svg fill="none" viewBox="0 0 24 24"><path d="M20 10c0 5.4-8 11-8 11S4 15.4 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg></div>
        <div className="special-destination-copy"><strong>綜合座談</strong><b>⌂　B棟三樓</b><span>班級家長日結束後，可由此查看座談位置</span></div>
        <button onClick={() => openSpecialDestination('general-forum')} type="button">查看位置 <span aria-hidden="true">→</span></button>
      </section>
    </div>
    <footer className="site-credit">made by Wen Yi</footer>
  </main>

  const specialDestination = navigation.kind === 'special-destination' ? specialDestinationById[navigation.destinationId] : null
  if (specialDestination) {
    const specialFloor = floorById[specialDestination.floorId]
    const hasConfirmedMarker = Boolean(specialDestination.highlight)
    return <main className="parent-navigation"><header className="navigation-header"><div><p className="eyebrow">固定活動地點</p><h1>{specialDestination.displayName}</h1><p className="navigation-origin">位置：<strong>{specialDestination.locationLabel}</strong></p></div><button className="reset-button" onClick={resetNavigation} type="button">返回首頁</button></header><section className="navigation-stage" aria-label={`${specialFloor.label} ${specialDestination.displayName}位置`}><div className="floor-status">目前：{specialFloor.label}</div><CampusMap floorId={specialFloor.id} image={getMapImageUrl('floor-3-1.webp')} specialDestination={specialDestination} /></section><section className="arrival-message special-destination-message"><p>{hasConfirmedMarker ? `已標示${specialDestination.displayName}位置。` : `${specialDestination.displayName}位置標示等待人工標定。`}</p><button onClick={resetNavigation} type="button">返回首頁</button></section><footer className="site-credit">made by Wen Yi</footer></main>
  }

  const route = routes.find((item) => item.id === navigation.routeId)
  const classroom = resolveClassroom(navigation.classNumber)
  if (!classroom) return <main className="parent-home"><section className="home-card"><p className="search-message">目前學年度找不到此班級配置。</p></section></main>
  const routeFloor = route.floors[navigation.floorIndex]
  const floor = floorById[routeFloor.floorId]
  const transition = routeFloor.transition
  const entranceMarker = getEntranceMarker(route.to, floor.id)
  const transitionMarker = getTransitionMarker(route, routeFloor)
  const elevatorTransitionMarker = getElevatorTransitionMarker(route, routeFloor)
  const elevatorStraightPresentation = getElevatorStraightPresentation(elevatorTransitionMarker)
  const mapImage = elevatorTransitionMarker ? getMapImageUrl('floor-1b-base.png') : floor.image
  const horizontalOnlyTerminal = getElevatorDestinationPresentation(route, routeFloor)
  const hideRouteSegments = isMarkerOnlyArrivalFloor(route, floor.id)
  const spiralTransitionMarker = getSpiralTransitionMarker(route, routeFloor)
  const routeSummary = getRouteSummary(route)
  const targetHighlight = classroom.floor === floor.id ? classroom.highlight : null
  const classLabels = getClassroomsForFloor(floor.id)

  const transitionTitle = { stairs: '樓梯導航', 'spiral-stairs': '旋轉樓梯導航', elevator: '電梯導航' }[transition?.type]

  return <main className="parent-navigation">{previewAcademicYear && <section className="academic-preview-banner"><strong>開發預覽：{previewAcademicYear} 學年度</strong><button onClick={exitAcademicYearPreview} type="button">返回正式 115</button></section>}<header className="navigation-header"><div><p className="eyebrow">家長日校園導航</p><h1>前往 {classroom.classNumber} 班</h1><p className="navigation-origin"><span>{routeSummary.origin}</span>{routeSummary.transition && <><span aria-hidden="true"> → </span><strong>{routeSummary.transition}</strong></>}</p></div><button className="reset-button" onClick={resetNavigation} type="button">重新搜尋班級</button></header><section className="navigation-stage" aria-label={`${floor.label} 導航`}><div className="floor-status">目前：{floor.label}</div><CampusMap classLabels={classLabels} elevatorTransitionMarker={elevatorTransitionMarker} entranceMarker={entranceMarker} floorId={floor.id} hideRouteSegments={hideRouteSegments} horizontalOnlyTerminal={horizontalOnlyTerminal} image={mapImage} presentationSegments={elevatorStraightPresentation} routeFloor={routeFloor} spiralTransitionMarker={spiralTransitionMarker} targetHighlight={targetHighlight} transitionMarker={transitionMarker} /></section>{transition ? <section className="transition-card" aria-live="polite"><span>{transitionTitle}</span><p>{transition.label}</p><button onClick={() => setNavigation((current) => ({ ...current, floorIndex: current.floorIndex + 1 }))} type="button">我已到 {floorById[transition.toFloorId].label}</button></section> : <section className="arrival-message"><p>已抵達 {classroom.classNumber} 班所在區域</p><button onClick={resetNavigation} type="button">重新搜尋班級</button></section>}<footer className="site-credit">made by Wen Yi</footer></main>
}

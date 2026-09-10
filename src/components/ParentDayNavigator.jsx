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

const normalizeClassNumber = (value) => value.trim().replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))

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

  useEffect(() => {
    if (!navigation || navigation.floorIndex !== 0) return

    const route = routes.find((item) => item.id === navigation.routeId)
    const destinationFloorId = route?.floors.at(-1)?.floorId
    if (!route || route.floors[0]?.floorId !== '1F' || destinationFloorId === '1F') return

    const preloadImage = new Image()
    preloadImage.src = floorById[destinationFloorId].image
  }, [navigation])

  if (!navigation) return <main className="parent-home"><div className="parent-home-content">{previewAcademicYear && <section className="academic-preview-banner academic-preview-banner-home" aria-label="開發預覽模式"><strong>開發預覽：{previewAcademicYear} 學年度</strong><button onClick={exitAcademicYearPreview} type="button">返回正式 115</button></section>}<section className="home-card" aria-labelledby="home-title"><p className="eyebrow">新北市義學國民中學</p><h1 id="home-title">家長日校園導航</h1><p className="home-copy">輸入班級，立即查看前往路線</p><form className="class-search" onSubmit={startNavigation}><label htmlFor="class-number">請輸入您要前往的班級</label><input autoComplete="off" id="class-number" inputMode="numeric" onChange={(event) => setInput(event.target.value)} placeholder="例如：703、811、901" type="text" value={input} /><button type="submit">開始導航</button></form>{message && <p aria-live="polite" className="search-message">{message}</p>}</section></div><footer className="site-credit">made by Wen Yi</footer></main>

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

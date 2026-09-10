import { useState } from 'react'
import CampusMap from './CampusMap'
import { findRouteIdForClass } from '../data/classRouteMap'
import { destinationById } from '../data/destinations'
import { floorById } from '../data/floors'
import { routes } from '../data/routes'
import { getEntranceMarker } from '../data/entranceMarkers'
import { getTransitionMarker } from '../data/transitionMarkers'
import { getElevatorStraightPresentation, getElevatorTransitionMarker } from '../data/elevatorTransitionMarkers'
import { isMarkerOnlyArrivalFloor } from '../data/arrivalPresentation'
import { getSpiralTransitionMarker } from '../data/spiralTransitionMarkers'
import { getElevatorDestinationPresentation } from '../data/elevatorDestinationPresentation'
import { getRouteSummary } from '../utils/routeSummary'
import { classHighlightPositions } from '../data/classHighlightPositions'

const normalizeClassNumber = (value) => value.trim().replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))

export default function ParentDayNavigator() {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [navigation, setNavigation] = useState(null)

  function startNavigation(event) {
    event.preventDefault()
    const classNumber = normalizeClassNumber(input)
    if (!classNumber) return setMessage('請先輸入班級。')
    const destinationId = `classroom-${classNumber}`
    const routeId = findRouteIdForClass(destinationId)
    if (!routeId) return setMessage(`查無 ${classNumber} 班的導航資料，請確認班級後重新輸入。`)
    setMessage('')
    setInput(classNumber)
    setNavigation({ destinationId, routeId, floorIndex: 0 })
  }

  function resetNavigation() {
    setInput('')
    setMessage('')
    setNavigation(null)
  }

  if (!navigation) return <main className="parent-home"><section className="home-card" aria-labelledby="home-title"><p className="eyebrow">校園家長日</p><h1 id="home-title">家長日校園導航</h1><p className="home-copy">輸入班級，立即查看前往路線</p><form className="class-search" onSubmit={startNavigation}><label htmlFor="class-number">請輸入您要前往的班級</label><input autoComplete="off" id="class-number" inputMode="numeric" onChange={(event) => setInput(event.target.value)} placeholder="例如：703、811、916" type="text" value={input} /><button type="submit">開始導航</button></form>{message && <p aria-live="polite" className="search-message">{message}</p>}</section></main>

  const route = routes.find((item) => item.id === navigation.routeId)
  const destination = destinationById[navigation.destinationId]
  const routeFloor = route.floors[navigation.floorIndex]
  const floor = floorById[routeFloor.floorId]
  const transition = routeFloor.transition
  const entranceMarker = getEntranceMarker(route.to, floor.id)
  const transitionMarker = getTransitionMarker(route, routeFloor)
  const elevatorTransitionMarker = getElevatorTransitionMarker(route, routeFloor)
  const elevatorStraightPresentation = getElevatorStraightPresentation(elevatorTransitionMarker)
  const mapImage = elevatorTransitionMarker ? '/maps/floor-1b.png' : floor.image
  const horizontalOnlyTerminal = getElevatorDestinationPresentation(route, routeFloor)
  const hideRouteSegments = isMarkerOnlyArrivalFloor(route, floor.id)
  const spiralTransitionMarker = getSpiralTransitionMarker(route, routeFloor)
  const routeSummary = getRouteSummary(route)
  const storedHighlight = classHighlightPositions[destination.displayName]
  const targetHighlight = destination.floor === floor.id && storedHighlight?.floor === Number(floor.id.slice(0, -1)) ? storedHighlight : null

  if (import.meta.env.DEV && destination.floor === floor.id && !storedHighlight) console.warn(`Missing class highlight position for ${destination.displayName}`)

  const transitionTitle = { stairs: '樓梯導航', 'spiral-stairs': '旋轉樓梯導航', elevator: '電梯導航' }[transition?.type]

  return <main className="parent-navigation"><header className="navigation-header"><div><p className="eyebrow">家長日校園導航</p><h1>前往 {destination.displayName} 班</h1><p className="navigation-origin"><span>{routeSummary.origin}</span>{routeSummary.transition && <><span aria-hidden="true"> → </span><strong>{routeSummary.transition}</strong></>}</p></div><button className="reset-button" onClick={resetNavigation} type="button">重新搜尋班級</button></header><section className="navigation-stage" aria-label={`${floor.label} 導航`}><div className="floor-status">目前：{floor.label}</div><CampusMap elevatorTransitionMarker={elevatorTransitionMarker} entranceMarker={entranceMarker} floorId={floor.id} hideRouteSegments={hideRouteSegments} horizontalOnlyTerminal={horizontalOnlyTerminal} image={mapImage} presentationSegments={elevatorStraightPresentation} routeFloor={routeFloor} spiralTransitionMarker={spiralTransitionMarker} targetHighlight={targetHighlight} transitionMarker={transitionMarker} /></section>{transition ? <section className="transition-card" aria-live="polite"><span>{transitionTitle}</span><p>{transition.label}</p><button onClick={() => setNavigation((current) => ({ ...current, floorIndex: current.floorIndex + 1 }))} type="button">我已到 {floorById[transition.toFloorId].label}</button></section> : <section className="arrival-message"><p>已抵達 {destination.displayName} 班所在區域</p><button onClick={resetNavigation} type="button">重新搜尋班級</button></section>}</main>
}

import { useRef, useState } from 'react'
import { floorById } from '../data/floors'
import RouteOverlay from './RouteOverlay'

export default function CampusMap({ floorId, routeFloor, entranceMarker, transitionMarker, elevatorTransitionMarker, spiralTransitionMarker, presentationSegments, image, horizontalOnlyTerminal, hideRouteSegments, targetHighlight }) {
  const floor = floorById[floorId]
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 })
  const [loadedImageSource, setLoadedImageSource] = useState(null)
  const pointers = useRef(new Map())
  const gesture = useRef(null)

  if (!floor) return null

  const imageSource = image ?? floor.image
  const isMapLoaded = loadedImageSource === imageSource

  function pointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, [event.clientX, event.clientY])
    const values = [...pointers.current.values()]
    gesture.current = values.length === 2
      ? { mode: 'pinch', distance: Math.hypot(values[0][0] - values[1][0], values[0][1] - values[1][1]), view }
      : { mode: 'pan', point: values[0], view }
  }

  function pointerMove(event) {
    if (!pointers.current.has(event.pointerId) || !gesture.current) return
    pointers.current.set(event.pointerId, [event.clientX, event.clientY])
    const values = [...pointers.current.values()]
    if (values.length === 2) {
      const distance = Math.hypot(values[0][0] - values[1][0], values[0][1] - values[1][1])
      const scale = Math.min(3, Math.max(1, gesture.current.view.scale * (distance / gesture.current.distance)))
      setView((current) => ({ ...current, scale }))
    } else if (values.length === 1 && gesture.current.mode === 'pan' && gesture.current.view.scale > 1) {
      setView({ ...gesture.current.view, x: gesture.current.view.x + values[0][0] - gesture.current.point[0], y: gesture.current.view.y + values[0][1] - gesture.current.point[1] })
    }
  }

  function pointerUp(event) {
    pointers.current.delete(event.pointerId)
    gesture.current = null
  }

  return (
    <section className="campus-map" aria-label={`${floor.label} 校園地圖`}>
      <div aria-busy={!isMapLoaded} className="map-viewport" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
        <div className="map-canvas" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}>
          <img alt={`${floor.label} 正式校園平面圖`} key={imageSource} onLoad={() => setLoadedImageSource(imageSource)} src={imageSource} />
          <RouteOverlay elevatorTransitionMarker={elevatorTransitionMarker} entranceMarker={entranceMarker} height={floor.height} hideRouteSegments={hideRouteSegments} horizontalOnlyTerminal={horizontalOnlyTerminal} presentationSegments={presentationSegments} routeFloor={routeFloor} spiralTransitionMarker={spiralTransitionMarker} targetHighlight={isMapLoaded ? targetHighlight : null} transitionMarker={transitionMarker} width={floor.width} />
        </div>
        {!isMapLoaded && <span className="map-loading" role="status">地圖載入中…</span>}
        {view.scale > 1 && <button className="map-reset" onClick={() => setView({ scale: 1, x: 0, y: 0 })} type="button">恢復原始比例</button>}
      </div>
      <p className="map-help">可用兩指放大地圖，拖曳查看細節</p>
    </section>
  )
}

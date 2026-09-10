const pointString = (points) => points.map(([x, y]) => `${x},${y}`).join(' ')
import { entranceMarkerPresentation } from '../data/entranceMarkers'
import { presentHorizontalOnlyTerminal, presentRouteSegments, trimRouteForSpiralTransitionMarker, trimRouteForTransitionMarker } from '../utils/terminalPresentation'
import TargetClassHighlight from './TargetClassHighlight'
import ClassLabelOverlay from './ClassLabelOverlay'

export default function RouteOverlay({ width, height, routeFloor, entranceMarker, transitionMarker, elevatorTransitionMarker, spiralTransitionMarker, presentationSegments, horizontalOnlyTerminal = false, hideRouteSegments = false, targetHighlight, classLabels = [] }) {
  const sourceSegments = presentationSegments ?? routeFloor?.segments
  if (!sourceSegments?.length) return null
  const presentedSegments = horizontalOnlyTerminal ? presentHorizontalOnlyTerminal(sourceSegments, entranceMarker, horizontalOnlyTerminal.elevatorIconBounds) : presentRouteSegments(sourceSegments, entranceMarker)
  const displaySegments = hideRouteSegments ? [] : trimRouteForSpiralTransitionMarker(trimRouteForTransitionMarker(trimRouteForTransitionMarker(presentedSegments, transitionMarker), elevatorTransitionMarker), spiralTransitionMarker)

  return (
    <svg aria-label="人工確認的導航路線" className="route-overlay" preserveAspectRatio="xMidYMid meet" role="img" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <marker id="route-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="7" refY="3.5" viewBox="0 0 7 7">
          <path d="M0,0 L7,3.5 L0,7 Z" />
        </marker>
      </defs>
      {displaySegments.map((segment, index) => (
        <polyline
          className={segment.type === 'turn' ? 'route-turn-hint' : 'route-line'}
          key={`${segment.type}-${index}`}
          markerEnd={segment.showArrow ? 'url(#route-arrow)' : undefined}
          points={pointString(segment.points)}
        />
      ))}
      {entranceMarker && <path aria-label={`${entranceMarker.building} 棟入口指示`} className="entrance-marker" d={`M ${entranceMarker.x} ${entranceMarker.y} L ${entranceMarker.x - entranceMarkerPresentation.halfWidth} ${entranceMarker.y + entranceMarkerPresentation.height} L ${entranceMarker.x + entranceMarkerPresentation.halfWidth} ${entranceMarker.y + entranceMarkerPresentation.height} Z`} />}
      {transitionMarker && <path aria-label={`${transitionMarker.building} 棟樓梯提示`} className="transition-marker" d={`M ${transitionMarker.x} ${transitionMarker.y - entranceMarkerPresentation.height} L ${transitionMarker.x - entranceMarkerPresentation.halfWidth} ${transitionMarker.y} L ${transitionMarker.x + entranceMarkerPresentation.halfWidth} ${transitionMarker.y} Z`} />}
      {elevatorTransitionMarker && <path aria-label="電梯提示" className="elevator-transition-marker" d={`M ${elevatorTransitionMarker.x} ${elevatorTransitionMarker.y - entranceMarkerPresentation.height} L ${elevatorTransitionMarker.x - entranceMarkerPresentation.halfWidth} ${elevatorTransitionMarker.y} L ${elevatorTransitionMarker.x + entranceMarkerPresentation.halfWidth} ${elevatorTransitionMarker.y} Z`} />}
      {spiralTransitionMarker && <path aria-label="旋轉樓梯提示" className="spiral-transition-marker" d={`M ${spiralTransitionMarker.x - entranceMarkerPresentation.halfWidth} ${spiralTransitionMarker.y - entranceMarkerPresentation.height} L ${spiralTransitionMarker.x + entranceMarkerPresentation.halfWidth} ${spiralTransitionMarker.y - entranceMarkerPresentation.height} L ${spiralTransitionMarker.x} ${spiralTransitionMarker.y} Z`} />}
      {targetHighlight && <TargetClassHighlight className="target-class-highlight target-class-highlight-formal" {...targetHighlight} />}
      <ClassLabelOverlay classrooms={classLabels} />
    </svg>
  )
}

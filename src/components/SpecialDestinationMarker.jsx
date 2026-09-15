import TargetClassHighlight from './TargetClassHighlight'

export default function SpecialDestinationMarker({ destination }) {
  const { displayName, highlight } = destination
  if (!highlight) return null

  return (
    <g aria-label={`${displayName}位置`}>
      <TargetClassHighlight className="target-class-highlight target-class-highlight-formal" {...highlight} />
    </g>
  )
}

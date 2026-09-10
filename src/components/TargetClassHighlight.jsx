export default function TargetClassHighlight({ x, y, width, height, className = 'target-class-highlight' }) {
  return (
    <g className={className} transform={`translate(${x - width / 2} ${y - height / 2})`}>
      <rect height={height} rx="10" width={width} />
    </g>
  )
}

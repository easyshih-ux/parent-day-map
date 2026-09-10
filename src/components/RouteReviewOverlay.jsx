const midpoint = (start, end) => [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]

export default function RouteReviewOverlay({ height, segments, width }) {
  return (
    <svg
      aria-label="PPT connector 審核標示"
      className="route-review-overlay"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      {segments.map((segment, segmentIndex) => {
        const start = segment.points[0]
        const end = segment.points.at(-1)
        const [labelX, labelY] = midpoint(start, end)
        const segmentLabel = `S${segmentIndex + 1}`
        const startLabel = `P${segmentIndex * 2 + 1}`
        const endLabel = `P${segmentIndex * 2 + 2}`

        return (
          <g key={segmentLabel}>
            <polyline className="review-segment" points={segment.points.map(([x, y]) => `${x},${y}`).join(' ')} />
            <g className="review-point" transform={`translate(${start[0]} ${start[1]})`}>
              <circle r="16" />
              <text x="21" y="-19">{startLabel}</text>
            </g>
            <g className="review-point" transform={`translate(${end[0]} ${end[1]})`}>
              <circle r="16" />
              <text x="21" y="-19">{endLabel}</text>
            </g>
            <g className="review-segment-label" transform={`translate(${labelX} ${labelY})`}>
              <rect height="52" rx="12" width="76" x="-38" y="-26" />
              <text textAnchor="middle" y="16">{segmentLabel}</text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}

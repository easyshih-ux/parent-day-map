import { entranceMarkerPresentation } from '../data/entranceMarkers.js'

const isSamePoint = (first, second) => first[0] === second[0] && first[1] === second[1]

function rectangleFor(marker) {
  const { halfWidth, height, clearance } = entranceMarkerPresentation
  return {
    left: marker.x - halfWidth - clearance,
    right: marker.x + halfWidth + clearance,
    top: marker.y - clearance,
    bottom: marker.y + height + clearance,
  }
}

function upwardTriangleRectangle(marker) {
  const { halfWidth, height, clearance } = entranceMarkerPresentation
  return {
    left: marker.x - halfWidth - clearance,
    right: marker.x + halfWidth + clearance,
    top: marker.y - height - clearance,
    bottom: marker.y + clearance,
  }
}

function downwardTriangleRectangle(marker) {
  const { halfWidth, height, clearance } = entranceMarkerPresentation
  return {
    left: marker.x - halfWidth - clearance,
    right: marker.x + halfWidth + clearance,
    top: marker.y - height - clearance,
    bottom: marker.y + clearance,
  }
}

// Returns where a line first reaches the visual exclusion rectangle, or null.
// The formal data is never changed; this only determines where SVG rendering stops.
function firstRectangleHit([x1, y1], [x2, y2], rectangle) {
  const dx = x2 - x1
  const dy = y2 - y1
  let start = 0
  let end = 1

  for (const [p, q] of [[-dx, x1 - rectangle.left], [dx, rectangle.right - x1], [-dy, y1 - rectangle.top], [dy, rectangle.bottom - y1]]) {
    if (p === 0) {
      if (q < 0) return null
      continue
    }
    const value = q / p
    if (p < 0) start = Math.max(start, value)
    else end = Math.min(end, value)
    if (start > end) return null
  }

  return start <= 1 ? [x1 + dx * start, y1 + dy * start] : null
}

function terminalApproach(start, marker) {
  const { height, clearance } = entranceMarkerPresentation
  const stop = [marker.x, marker.y + height + clearance]
  const corner = [start[0], stop[1]]
  const points = [start]
  if (!isSamePoint(start, corner)) points.push(corner)
  if (!isSamePoint(points.at(-1), stop)) points.push(stop)
  return { type: 'solid', points, presentationOnly: true }
}

export function presentRouteSegments(segments, entranceMarker) {
  if (!entranceMarker) return segments

  const rectangle = rectangleFor(entranceMarker)
  const result = []

  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
    const segment = segments[segmentIndex]
    for (let pointIndex = 1; pointIndex < segment.points.length; pointIndex += 1) {
      const start = segment.points[pointIndex - 1]
      const hit = firstRectangleHit(start, segment.points[pointIndex], rectangle)
      if (!hit) continue

      if (!isSamePoint(start, hit)) {
        result.push({ ...segment, points: [start, hit], showArrow: false, presentationOnly: true })
      }
      if (entranceMarker.terminalApproach === 'none') return result
      result.push(terminalApproach(hit, entranceMarker))
      return result
    }
    result.push(segment)
  }

  // Some original endpoints lie beside, rather than inside, the new centred marker.
  // Replace only that final visual segment with the common bottom approach.
  const finalSegment = result.pop()
  if (!finalSegment) return result
  result.push(terminalApproach(finalSegment.points[0], entranceMarker))
  return result
}

// Elevator destinations on 4F/5F retain only the formal horizontal approach.
// The formal vertical terminal remains untouched in routes.js for PPT checks;
// it is simply not part of this destination-floor presentation.
export function presentHorizontalOnlyTerminal(segments, entranceMarker, elevatorIconBounds) {
  if (!entranceMarker) return segments

  const rectangle = rectangleFor(entranceMarker)
  const result = []

  for (const segment of segments) {
    for (let pointIndex = 1; pointIndex < segment.points.length; pointIndex += 1) {
      const start = segment.points[pointIndex - 1]
      const end = segment.points[pointIndex]
      if (start[1] !== end[1]) continue

      const direction = Math.sign(end[0] - start[0])
      const elevatorClearance = 10
      const extendedStart = elevatorIconBounds && direction !== 0
        ? [
            direction < 0 ? Math.max(start[0], elevatorIconBounds.left - elevatorClearance) : Math.min(start[0], elevatorIconBounds.right + elevatorClearance),
            start[1],
          ]
        : start

      const hit = firstRectangleHit(extendedStart, end, rectangle)
      if (hit) {
        if (!isSamePoint(extendedStart, hit)) result.push({ ...segment, points: [extendedStart, hit], showArrow: false, presentationOnly: true })
        return result
      }
      result.push({ ...segment, points: [extendedStart, end], presentationOnly: true })
    }
  }

  return result
}

// The 1F stair marker is an upward triangle whose base is the formal transition
// endpoint. Trim only the displayed final portion before it reaches that marker.
export function trimRouteForTransitionMarker(segments, transitionMarker) {
  if (!transitionMarker) return segments

  const rectangle = upwardTriangleRectangle(transitionMarker)
  const result = []
  for (const segment of segments) {
    for (let pointIndex = 1; pointIndex < segment.points.length; pointIndex += 1) {
      const start = segment.points[pointIndex - 1]
      const hit = firstRectangleHit(start, segment.points[pointIndex], rectangle)
      if (!hit) continue
      if (!isSamePoint(start, hit)) result.push({ ...segment, points: [start, hit], showArrow: false, presentationOnly: true })
      return result
    }
    result.push(segment)
  }
  return result
}

export function trimRouteForSpiralTransitionMarker(segments, spiralTransitionMarker) {
  if (!spiralTransitionMarker) return segments

  const rectangle = downwardTriangleRectangle(spiralTransitionMarker)
  const result = []
  for (const segment of segments) {
    for (let pointIndex = 1; pointIndex < segment.points.length; pointIndex += 1) {
      const start = segment.points[pointIndex - 1]
      const hit = firstRectangleHit(start, segment.points[pointIndex], rectangle)
      if (!hit) continue
      if (!isSamePoint(start, hit)) result.push({ ...segment, points: [start, hit], showArrow: false, presentationOnly: true })
      return result
    }
    result.push(segment)
  }
  return result
}

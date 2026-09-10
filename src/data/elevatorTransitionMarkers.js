import { routes } from './routes'
import { entranceMarkerPresentation } from './entranceMarkers'

// Presentation-only marker for the single 1F administrative-building elevator.
// Its position is read from the formal 1F elevator transition endpoint, while
// all route geometry remains solely in routes.js.
const elevatorReferenceRouteId = 'ppt-start-to-a-wing-4f-access'

// Presentation-only bounds measured from the 1672 × 941 1F base map. These
// describe the elevator icon, not a navigation point or a formal route shape.
const elevatorIconBounds = Object.freeze({ left: 1153, right: 1190, top: 317, bottom: 363 })
const startMarkerBounds = Object.freeze({ left: 1157, right: 1196, top: 727, bottom: 766 })
const iconClearance = 10
const startClearance = 8

function referenceElevatorPoint() {
  const referenceRoute = routes.find((route) => route.id === elevatorReferenceRouteId)
  return referenceRoute?.floors[0]?.segments.at(-1)?.points.at(-1) ?? null
}

export function getElevatorTransitionMarker(route, routeFloor) {
  if (routeFloor.floorId !== '1F' || routeFloor.transition?.type !== 'elevator') return null

  const transitionPoint = referenceElevatorPoint()
  if (!transitionPoint) return null

  // The upward-pointing triangle must approach the icon from below without
  // intersecting it. Its base remains one marker-height below the safe tip.
  // floor-1b places the existing "起" marker on the same practical axis as
  // the elevator icon (within its bounds). Keeping that axis makes the
  // presentation route a single vertical line without moving the base image.
  const x = (startMarkerBounds.left + startMarkerBounds.right) / 2
  const tipY = elevatorIconBounds.bottom + iconClearance
  const y = tipY + entranceMarkerPresentation.height

  return {
    floorId: '1F',
    referenceTransitionPoint: transitionPoint,
    iconBounds: elevatorIconBounds,
    startMarkerBounds,
    x,
    y,
  }
}

export function getElevatorStraightPresentation(marker) {
  if (!marker) return null

  return [{
    type: 'solid',
    presentationOnly: true,
    points: [
      [marker.x, marker.startMarkerBounds.top - startClearance],
      [marker.x, marker.y + entranceMarkerPresentation.clearance],
    ],
  }]
}

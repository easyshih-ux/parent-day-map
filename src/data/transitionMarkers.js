import { routes } from './routes'

// Presentation-only markers for confirmed 1F B/C stair transitions.
// Each building shares the original 2F reference route's formal transition point.
const transitionMarkerTargets = Object.freeze({
  'b-wing-2f-access': { building: 'B', floorId: '1F', toFloorId: '2F', referenceRouteId: 'ppt-start-to-b-wing-2f-access' },
  'b-wing-3f-access': { building: 'B', floorId: '1F', toFloorId: '3F', referenceRouteId: 'ppt-start-to-b-wing-2f-access' },
  'c-wing-2f-access': { building: 'C', floorId: '1F', toFloorId: '2F', referenceRouteId: 'ppt-start-to-c-wing-2f-access' },
  'c-wing-3f-access': { building: 'C', floorId: '1F', toFloorId: '3F', referenceRouteId: 'ppt-start-to-c-wing-2f-access' },
})

function referenceTransitionPoint(referenceRouteId) {
  const referenceRoute = routes.find((route) => route.id === referenceRouteId)
  return referenceRoute?.floors[0]?.segments.at(-1)?.points.at(-1) ?? null
}

export function getTransitionMarker(route, routeFloor) {
  const marker = transitionMarkerTargets[route.to]
  const transition = routeFloor.transition
  if (!marker || routeFloor.floorId !== marker.floorId || transition?.toFloorId !== marker.toFloorId) return null

  const transitionPoint = referenceTransitionPoint(marker.referenceRouteId)
  if (!transitionPoint) return null

  return { ...marker, x: transitionPoint[0], y: transitionPoint[1] }
}

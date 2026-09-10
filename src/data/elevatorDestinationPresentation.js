// Presentation-only elevator icon bounds, measured from the 1672 × 941
// official 4F/5F base maps. They control only where the visible horizontal
// approach starts; no formal route data is altered.
const elevatorIconBoundsByFloorId = Object.freeze({
  '4F': Object.freeze({ left: 1194, right: 1231, top: 325, bottom: 365 }),
  '5F': Object.freeze({ left: 1214, right: 1253, top: 333, bottom: 376 }),
})

export function getElevatorDestinationPresentation(route, routeFloor) {
  const isDestinationFloor = routeFloor.floorId === route.floors.at(-1)?.floorId
  const isElevatorRoute = route.floors[0]?.transition?.type === 'elevator'
  const elevatorIconBounds = elevatorIconBoundsByFloorId[routeFloor.floorId]
  if (!isDestinationFloor || !isElevatorRoute || !elevatorIconBounds) return null

  return { elevatorIconBounds }
}

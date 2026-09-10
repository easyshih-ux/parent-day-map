// Presentation-only arrivals confirmed for the 2F and 3F review passes.
// Formal route segments remain in routes.js for source validation.
const markerOnlyArrivalDestinations = new Set([
  'a-wing-2f-access',
  'b-wing-2f-access',
  'c-wing-2f-access',
  'a-wing-3f-access',
  'b-wing-3f-access',
  'c-wing-3f-access',
])

export function isMarkerOnlyArrivalFloor(route, floorId) {
  return ['2F', '3F'].includes(floorId) && markerOnlyArrivalDestinations.has(route.to)
}

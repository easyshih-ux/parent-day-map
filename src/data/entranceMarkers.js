// Presentation-only entrance indicators. These coordinates do not participate in
// route geometry, PPT transcription, or route validation.
// Each tip is manually aligned to the centre of the named building's lower entrance.
export const entranceMarkerPresentation = Object.freeze({
  side: 'bottom',
  halfWidth: 28,
  height: 48,
  clearance: 8,
})

export const entranceMarkerByDestinationId = Object.freeze({
  'b-wing-1f-access': { building: 'B', floorId: '1F', x: 662, y: 315, terminalApproach: 'none' },
  'a-wing-2f-access': { building: 'A', floorId: '2F', x: 1062, y: 306 },
  'b-wing-2f-access': { building: 'B', floorId: '2F', x: 688, y: 306 },
  'c-wing-2f-access': { building: 'C', floorId: '2F', x: 318, y: 306 },
  'a-wing-3f-access': { building: 'A', floorId: '3F', x: 1062, y: 306 },
  'b-wing-3f-access': { building: 'B', floorId: '3F', x: 688, y: 306 },
  'c-wing-3f-access': { building: 'C', floorId: '3F', x: 318, y: 306 },
  'a-wing-4f-access': { building: 'A', floorId: '4F', x: 1057, y: 315 },
  'b-wing-4f-access': { building: 'B', floorId: '4F', x: 697, y: 315 },
  'c-wing-4f-access': { building: 'C', floorId: '4F', x: 317, y: 315 },
  'a-wing-5f-access': { building: 'A', floorId: '5F', x: 1057, y: 315 },
  'b-wing-5f-access': { building: 'B', floorId: '5F', x: 697, y: 315 },
  'c-wing-5f-access': { building: 'C', floorId: '5F', x: 317, y: 315 },
})

export function getEntranceMarker(destinationId, floorId) {
  const marker = entranceMarkerByDestinationId[destinationId]
  return marker?.floorId === floorId ? marker : null
}

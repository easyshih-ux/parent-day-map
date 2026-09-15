// Fixed non-class destinations. These do not participate in academic-year
// assignments, classroom routing, or class highlight calibration.
export const specialDestinations = Object.freeze([
  Object.freeze({
    id: 'general-forum',
    displayName: '綜合座談',
    locationLabel: 'B棟三樓',
    floorId: '3F',
    building: 'B',
    // Manually calibrated against the floor-3-1.webp presentation map.
    highlight: Object.freeze({ x: 745.4, y: 254.6, width: 70, height: 65 }),
    label: null,
  }),
])

export const specialDestinationById = Object.freeze(Object.fromEntries(
  specialDestinations.map((destination) => [destination.id, destination]),
))

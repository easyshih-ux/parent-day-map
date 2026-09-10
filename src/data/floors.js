export const MAP_COORDINATE_SYSTEM = Object.freeze({ width: 1672, height: 941 })

const mapBaseUrl = import.meta.env?.BASE_URL || '/'

export const getMapImageUrl = (filename) => `${mapBaseUrl}maps/${filename}`

export const floors = Object.freeze([
  { id: '1F', label: '1 樓', image: getMapImageUrl('floor-1.png'), width: 1672, height: 941, order: 1 },
  { id: '2F', label: '2 樓', image: getMapImageUrl('floor-2.png'), width: 1672, height: 941, order: 2 },
  { id: '3F', label: '3 樓', image: getMapImageUrl('floor-3.png'), width: 1672, height: 941, order: 3 },
  { id: '4F', label: '4 樓', image: getMapImageUrl('floor-4.png'), width: 1672, height: 941, order: 4 },
  { id: '5F', label: '5 樓', image: getMapImageUrl('floor-5.png'), width: 1672, height: 941, order: 5 },
])

export const floorById = Object.freeze(Object.fromEntries(floors.map((floor) => [floor.id, floor])))

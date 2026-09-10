export const MAP_COORDINATE_SYSTEM = Object.freeze({ width: 1672, height: 941 })

export const floors = Object.freeze([
  { id: '1F', label: '1 樓', image: '/maps/floor-1.png', width: 1672, height: 941, order: 1 },
  { id: '2F', label: '2 樓', image: '/maps/floor-2.png', width: 1672, height: 941, order: 2 },
  { id: '3F', label: '3 樓', image: '/maps/floor-3.png', width: 1672, height: 941, order: 3 },
  { id: '4F', label: '4 樓', image: '/maps/floor-4.png', width: 1672, height: 941, order: 4 },
  { id: '5F', label: '5 樓', image: '/maps/floor-5.png', width: 1672, height: 941, order: 5 },
])

export const floorById = Object.freeze(Object.fromEntries(floors.map((floor) => [floor.id, floor])))

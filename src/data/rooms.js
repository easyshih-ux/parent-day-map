// Permanent physical classroom locations. These records are independent from
// annual class numbers, formal route geometry, and the base-map artwork.
const defineRoom = (id, floor, building, routeId, x, y) => Object.freeze({
  id,
  floor,
  building,
  routeId,
  highlight: Object.freeze({ x, y, width: 76, height: 46 }),
  // Highlight coordinates are already centre coordinates in the SVG map system.
  label: Object.freeze({ x, y, fontSize: 28 }),
})

export const rooms = Object.freeze([
  defineRoom('B-1F-01', '1F', 'B', 'ppt-start-to-b-wing-1f-access', 600.6, 97.4),
  defineRoom('B-1F-02', '1F', 'B', 'ppt-start-to-b-wing-1f-access', 600.5, 164.3),

  defineRoom('B-2F-01', '2F', 'B', 'ppt-start-to-b-wing-2f-access', 629.4, 100),
  defineRoom('B-2F-02', '2F', 'B', 'ppt-start-to-b-wing-2f-access', 628.4, 171.2),
  defineRoom('B-2F-03', '2F', 'B', 'ppt-start-to-b-wing-2f-access', 628.4, 234.6),
  defineRoom('C-2F-01', '2F', 'C', 'ppt-start-to-c-wing-2f-access', 377.2, 121.6),
  defineRoom('C-2F-02', '2F', 'C', 'ppt-start-to-c-wing-2f-access', 377.2, 257.7),
  defineRoom('C-2F-03', '2F', 'C', 'ppt-start-to-c-wing-2f-access', 263.6, 106.3),
  defineRoom('C-2F-04', '2F', 'C', 'ppt-start-to-c-wing-2f-access', 263.8, 172.4),
  defineRoom('C-2F-05', '2F', 'C', 'ppt-start-to-c-wing-2f-access', 263.6, 234.6),
  defineRoom('A-2F-01', '2F', 'A', 'ppt-start-to-a-wing-2f-access', 1001.5, 235.1),
  defineRoom('A-2F-02', '2F', 'A', 'ppt-start-to-a-wing-2f-access', 1001.5, 172.6),
  defineRoom('A-2F-03', '2F', 'A', 'ppt-start-to-a-wing-2f-access', 1001.5, 100),
  defineRoom('A-2F-04', '2F', 'A', 'ppt-start-to-a-wing-2f-access', 1128.1, 121.6),

  defineRoom('B-3F-01', '3F', 'B', 'ppt-start-to-b-wing-3f-access', 754.5, 118.4),
  defineRoom('B-3F-02', '3F', 'B', 'ppt-start-to-b-wing-3f-access', 629.4, 98.4),
  defineRoom('B-3F-03', '3F', 'B', 'ppt-start-to-b-wing-3f-access', 630.5, 167.1),
  defineRoom('B-3F-04', '3F', 'B', 'ppt-start-to-b-wing-3f-access', 630.4, 230.8),
  defineRoom('C-3F-01', '3F', 'C', 'ppt-start-to-c-wing-3f-access', 379.8, 121.6),
  defineRoom('C-3F-02', '3F', 'C', 'ppt-start-to-c-wing-3f-access', 379.8, 249.8),
  defineRoom('C-3F-03', '3F', 'C', 'ppt-start-to-c-wing-3f-access', 262.6, 100.8),
  defineRoom('C-3F-04', '3F', 'C', 'ppt-start-to-c-wing-3f-access', 262, 168.1),
  defineRoom('C-3F-05', '3F', 'C', 'ppt-start-to-c-wing-3f-access', 261, 230.8),
  defineRoom('A-3F-01', '3F', 'A', 'ppt-start-to-a-wing-3f-access', 1000.5, 234.6),
  defineRoom('A-3F-02', '3F', 'A', 'ppt-start-to-a-wing-3f-access', 999.3, 171.8),
  defineRoom('A-3F-03', '3F', 'A', 'ppt-start-to-a-wing-3f-access', 1001.5, 100.6),
  defineRoom('A-3F-04', '3F', 'A', 'ppt-start-to-a-wing-3f-access', 1126.5, 252),
  defineRoom('A-3F-05', '3F', 'A', 'ppt-start-to-a-wing-3f-access', 1126.5, 120.6),

  defineRoom('B-4F-01', '4F', 'B', 'ppt-start-to-b-wing-4f-access', 627.2, 109.5),
  defineRoom('B-4F-02', '4F', 'B', 'ppt-start-to-b-wing-4f-access', 628.4, 168.8),
  defineRoom('B-4F-03', '4F', 'B', 'ppt-start-to-b-wing-4f-access', 627.8, 229.8),
  defineRoom('B-4F-04', '4F', 'B', 'ppt-start-to-b-wing-4f-access', 767.1, 108.5),
  defineRoom('C-4F-01', '4F', 'C', 'ppt-start-to-c-wing-4f-access', 385, 109.5),
  defineRoom('C-4F-02', '4F', 'C', 'ppt-start-to-c-wing-4f-access', 244.6, 109.1),
  defineRoom('C-4F-03', '4F', 'C', 'ppt-start-to-c-wing-4f-access', 244.6, 170.8),
  defineRoom('C-4F-04', '4F', 'C', 'ppt-start-to-c-wing-4f-access', 246.4, 231),
  defineRoom('A-4F-01', '4F', 'A', 'ppt-start-to-a-wing-4f-access', 985.6, 229.4),
  defineRoom('A-4F-02', '4F', 'A', 'ppt-start-to-a-wing-4f-access', 984.5, 169.1),
  defineRoom('A-4F-03', '4F', 'A', 'ppt-start-to-a-wing-4f-access', 985.6, 109.5),
  defineRoom('A-4F-04', '4F', 'A', 'ppt-start-to-a-wing-4f-access', 1131.9, 256.7),
  defineRoom('A-4F-05', '4F', 'A', 'ppt-start-to-a-wing-4f-access', 1131.9, 109.5),

  defineRoom('B-5F-01', '5F', 'B', 'ppt-start-to-b-wing-5f-access', 608.2, 116.8),
  defineRoom('B-5F-02', '5F', 'B', 'ppt-start-to-b-wing-5f-access', 609, 221.3),
  defineRoom('C-5F-01', '5F', 'C', 'ppt-start-to-c-wing-5f-access', 241.5, 167.5),
  defineRoom('C-5F-02', '5F', 'C', 'ppt-start-to-c-wing-5f-access', 242, 227.8),
  defineRoom('A-5F-01', '5F', 'A', 'ppt-start-to-a-wing-5f-access', 977.1, 227.2),
  defineRoom('A-5F-02', '5F', 'A', 'ppt-start-to-a-wing-5f-access', 977.7, 172.8),
  defineRoom('A-5F-03', '5F', 'A', 'ppt-start-to-a-wing-5f-access', 977.1, 116.2),
  defineRoom('A-5F-04', '5F', 'A', 'ppt-start-to-a-wing-5f-access', 1132.3, 257.1),
  defineRoom('A-5F-05', '5F', 'A', 'ppt-start-to-a-wing-5f-access', 1130.7, 116.4),
])

export const roomById = Object.freeze(Object.fromEntries(rooms.map((room) => [room.id, room])))

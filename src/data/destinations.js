const classroom = (number, floor) => ({
  id: `classroom-${number}`,
  displayName: number,
  floor,
  category: 'classroom',
})

// Confirmed labels transcribed from campus-map-source-line.pptx.
export const destinations = Object.freeze([
  ...['701', '702'].map((number) => classroom(number, '1F')),
  ...['703', '704', '705', '801', '802', '803', '804', '805', '916', '917', '918', '919'].map((number) => classroom(number, '2F')),
  ...['706', '707', '708', '709', '806', '807', '808', '809', '810', '911', '912', '913', '914', '915'].map((number) => classroom(number, '3F')),
  ...['710', '711', '712', '714', '811', '812', '813', '814', '906', '907', '908', '909', '910'].map((number) => classroom(number, '4F')),
  ...['713', '715', '815', '816', '901', '902', '903', '904', '905'].map((number) => classroom(number, '5F')),
  { id: 'main-gate', displayName: '校門', floor: '1F', category: 'entrance' },
  // `起` is the source PPT's verified route origin. It is intentionally not
  // renamed to 校門: the two labels occupy different locations on the map.
  { id: 'ppt-route-start', displayName: '起點（PPT 標示）', floor: '1F', category: 'route-origin' },
  { id: 'b-wing-1f-access', displayName: 'B 棟 1F 入口', floor: '1F', category: 'building-access' },
  { id: 'a-wing-2f-access', displayName: 'A 棟 2F 入口', floor: '2F', category: 'building-access' },
  { id: 'b-wing-2f-access', displayName: 'B 棟 2F 入口', floor: '2F', category: 'building-access' },
  { id: 'c-wing-2f-access', displayName: 'C 棟 2F 入口', floor: '2F', category: 'building-access' },
  { id: 'a-wing-3f-access', displayName: 'A 棟 3F 入口', floor: '3F', category: 'building-access' },
  { id: 'b-wing-3f-access', displayName: 'B 棟 3F 入口', floor: '3F', category: 'building-access' },
  { id: 'c-wing-3f-access', displayName: 'C 棟 3F 入口', floor: '3F', category: 'building-access' },
  { id: 'a-wing-4f-access', displayName: 'A 棟 4F 入口', floor: '4F', category: 'building-access' },
  { id: 'b-wing-4f-access', displayName: 'B 棟 4F 入口', floor: '4F', category: 'building-access' },
  { id: 'c-wing-4f-access', displayName: 'C 棟 4F 入口', floor: '4F', category: 'building-access' },
  { id: 'a-wing-5f-access', displayName: 'A 棟 5F 入口', floor: '5F', category: 'building-access' },
  { id: 'b-wing-5f-access', displayName: 'B 棟 5F 入口', floor: '5F', category: 'building-access' },
  { id: 'c-wing-5f-access', displayName: 'C 棟 5F 入口', floor: '5F', category: 'building-access' },
  { id: 'administration-building', displayName: '行政大樓', floor: '1F', category: 'administration' },
  { id: 'library', displayName: '圖書館', floor: '1F', category: 'facility' },
  { id: 'auditorium', displayName: '演藝廳', floor: '1F', category: 'facility' },
  { id: 'specialty-building', displayName: '專科大樓', floor: '1F', category: 'special-classroom' },
])

export const destinationById = Object.freeze(Object.fromEntries(destinations.map((destination) => [destination.id, destination])))

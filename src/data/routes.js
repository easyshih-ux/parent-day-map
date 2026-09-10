// This file is the only source of formal navigation geometry.
// Do not generate, infer, simplify, or alter points in components.
// Every point below was converted by tools/extract-ppt-routes.js, then manually
// checked against the named slide in surce/campus-map-source-line.pptx.
export const routes = Object.freeze([
  {
    id: 'ppt-start-to-b-wing-1f-access',
    status: 'pass',
    from: 'ppt-route-start',
    to: 'b-wing-1f-access',
    source: { type: 'pptx', slide: 1, connectorCount: 5, candidateConnectors: [0, 1, 2, 3, 4] },
    floors: [
      {
        floorId: '1F',
        segments: [
          { type: 'solid', points: [[1154.463, 736.187], [1154.463, 689.712]] },
          { type: 'solid', points: [[1154.463, 687.001], [799.43, 639.574]], showArrow: true },
          { type: 'solid', points: [[797.225, 636.863], [672.191, 356.157]] },
          // This short source connector is deliberately marked by the reviewer.
          { type: 'turn', points: [[671.079, 356.157], [639.807, 357.116]] },
          { type: 'solid', points: [[639.807, 356.157], [639.807, 301.283]], showArrow: true },
        ],
      },
    ],
  },
  {
    id: 'ppt-start-to-a-wing-2f-access',
    status: 'pass',
    from: 'ppt-route-start',
    to: 'a-wing-2f-access',
    source: { type: 'pptx', slide: 2, connectorCount: 3, candidateConnectors: [0, 1, 2] },
    floors: [
      {
        floorId: '1F',
        segments: [
          { type: 'solid', points: [[1154.463, 736.187], [1154.463, 414.637]], showArrow: true },
          { type: 'solid', points: [[1154.463, 416.779], [1033.969, 416.779]] },
        ],
        transition: { type: 'spiral-stairs', toFloorId: '2F', label: '請由旋轉樓梯上 2 樓' },
      },
      {
        floorId: '2F',
        segments: [
          { type: 'solid', points: [[1033.969, 414.637], [1033.969, 301.283]], showArrow: true },
        ],
      },
    ],
  },
  {
    id: 'ppt-start-to-b-wing-2f-access', status: 'pass', from: 'ppt-route-start', to: 'b-wing-2f-access',
    source: { type: 'pptx', slide: 3, connectorCount: 5 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 689.712]] },
      { type: 'solid', points: [[1154.463, 687.001], [799.43, 639.574]] },
      { type: 'solid', points: [[797.225, 636.863], [672.191, 356.157]] },
      { type: 'solid', points: [[671.079, 356.157], [559.241, 356.157]] },
    ], transition: { type: 'stairs', toFloorId: '2F', label: '請由 B 棟樓梯上 2 樓' } }, { floorId: '2F', segments: [
      { type: 'solid', points: [[559.241, 350.679], [559.241, 298.948]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-c-wing-2f-access', status: 'pass', from: 'ppt-route-start', to: 'c-wing-2f-access',
    source: { type: 'pptx', slide: 4, connectorCount: 5 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 689.712]] },
      { type: 'solid', points: [[1154.463, 687.001], [799.43, 639.574]] },
      { type: 'solid', points: [[797.225, 636.863], [672.191, 356.157]] },
      { type: 'solid', points: [[670.056, 356.157], [187.255, 356.157]] },
    ], transition: { type: 'stairs', toFloorId: '2F', label: '請由 C 棟樓梯上 2 樓' } }, { floorId: '2F', segments: [
      { type: 'solid', points: [[187.255, 356.157], [187.255, 301.283]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-a-wing-3f-access', status: 'pass', from: 'ppt-route-start', to: 'a-wing-3f-access',
    source: { type: 'pptx', slide: 5, connectorCount: 3 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 414.637]] },
      { type: 'solid', points: [[1154.463, 416.779], [1033.969, 416.779]] },
    ], transition: { type: 'spiral-stairs', toFloorId: '3F', label: '請由旋轉樓梯上 3 樓' } }, { floorId: '3F', segments: [
      { type: 'solid', points: [[1033.969, 414.637], [1033.969, 301.283]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-b-wing-3f-access', status: 'pass', from: 'ppt-route-start', to: 'b-wing-3f-access',
    source: { type: 'pptx', slide: 6, connectorCount: 5 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 689.712]] },
      { type: 'solid', points: [[1154.463, 689.712], [799.43, 639.574]] },
      { type: 'solid', points: [[797.225, 636.863], [672.191, 356.157]] },
      { type: 'solid', points: [[671.079, 356.157], [560.235, 356.157]] },
    ], transition: { type: 'stairs', toFloorId: '3F', label: '請由 B 棟樓梯上 3 樓' } }, { floorId: '3F', segments: [
      { type: 'solid', points: [[560.235, 348.542], [560.235, 302.246]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-c-wing-3f-access', status: 'pass', from: 'ppt-route-start', to: 'c-wing-3f-access',
    source: { type: 'pptx', slide: 7, connectorCount: 5 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 689.712]] },
      { type: 'solid', points: [[1154.463, 689.712], [799.43, 639.574]] },
      { type: 'solid', points: [[797.225, 636.863], [672.191, 356.157]] },
      { type: 'solid', points: [[671.079, 356.157], [185.045, 356.157]] },
    ], transition: { type: 'stairs', toFloorId: '3F', label: '請由 C 棟樓梯上 3 樓' } }, { floorId: '3F', segments: [
      { type: 'solid', points: [[185.045, 356.157], [185.045, 299.895]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-a-wing-4f-access', status: 'pass', from: 'ppt-route-start', to: 'a-wing-4f-access',
    source: { type: 'pptx', slide: 8, connectorCount: 3 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 347.115]] },
    ], transition: { type: 'elevator', toFloorId: '4F', label: '請搭乘電梯至 4 樓' } }, { floorId: '4F', segments: [
      { type: 'solid', points: [[1154.463, 331.94], [1026.819, 331.94]] },
      { type: 'solid', points: [[1026.819, 331.94], [1026.819, 301.035]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-b-wing-4f-access', status: 'pass', from: 'ppt-route-start', to: 'b-wing-4f-access',
    source: { type: 'pptx', slide: 9, connectorCount: 3 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 341.657]] },
    ], transition: { type: 'elevator', toFloorId: '4F', label: '請搭乘電梯至 4 樓' } }, { floorId: '4F', segments: [
      { type: 'solid', points: [[1154.463, 331.94], [643.453, 331.94]] },
      { type: 'solid', points: [[643.453, 331.94], [643.453, 301.035]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-c-wing-4f-access', status: 'pass', from: 'ppt-route-start', to: 'c-wing-4f-access',
    source: { type: 'pptx', slide: 10, connectorCount: 3 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 341.657]] },
    ], transition: { type: 'elevator', toFloorId: '4F', label: '請搭乘電梯至 4 樓' } }, { floorId: '4F', segments: [
      { type: 'solid', points: [[1154.463, 331.94], [272.604, 331.94]] },
      { type: 'solid', points: [[272.604, 333.716], [272.604, 302.811]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-a-wing-5f-access', status: 'pass', from: 'ppt-route-start', to: 'a-wing-5f-access',
    source: { type: 'pptx', slide: 11, connectorCount: 3 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 347.115]] },
    ], transition: { type: 'elevator', toFloorId: '5F', label: '請搭乘電梯至 5 樓' } }, { floorId: '5F', segments: [
      { type: 'solid', points: [[1154.463, 331.94], [1026.819, 331.94]] },
      { type: 'solid', points: [[1026.819, 331.94], [1026.819, 301.035]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-b-wing-5f-access', status: 'pass', from: 'ppt-route-start', to: 'b-wing-5f-access',
    source: { type: 'pptx', slide: 12, connectorCount: 3 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 341.657]] },
    ], transition: { type: 'elevator', toFloorId: '5F', label: '請搭乘電梯至 5 樓' } }, { floorId: '5F', segments: [
      { type: 'solid', points: [[1154.463, 331.94], [643.453, 331.94]] },
      { type: 'solid', points: [[643.453, 331.94], [643.453, 301.035]], showArrow: true },
    ] }],
  },
  {
    id: 'ppt-start-to-c-wing-5f-access', status: 'pass', from: 'ppt-route-start', to: 'c-wing-5f-access',
    source: { type: 'pptx', slide: 13, connectorCount: 3 },
    floors: [{ floorId: '1F', segments: [
      { type: 'solid', points: [[1154.463, 736.187], [1154.463, 341.657]] },
    ], transition: { type: 'elevator', toFloorId: '5F', label: '請搭乘電梯至 5 樓' } }, { floorId: '5F', segments: [
      { type: 'solid', points: [[1154.463, 331.94], [272.604, 331.94]] },
      { type: 'solid', points: [[272.604, 333.716], [272.604, 302.811]], showArrow: true },
    ] }],
  },
])

export function findRoute(from, to) {
  return routes.find((route) => route.from === from && route.to === to) ?? null
}

/*
Route shape for phase two:
{
  id: 'main-gate-to-701',
  from: 'main-gate',
  to: 'classroom-701',
  floors: [
    {
      floorId: '1F',
      points: [[x, y], [x, y]],
      turnHints: [{ fromPointIndex: 1, toPointIndex: 2 }],
      instruction: '請前往 …',
      transition: { type: 'stairs', toFloorId: '2F', message: '請上 2 樓' }
    }
  ]
}
*/

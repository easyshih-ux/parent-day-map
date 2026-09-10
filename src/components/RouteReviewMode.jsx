import { useState } from 'react'
import { floorById, floors } from '../data/floors'
import { routes } from '../data/routes'
import RouteReviewOverlay from './RouteReviewOverlay'

const reviewRoutes = routes.filter((route) => route.status === 'needs-review')

export default function RouteReviewMode() {
  const [routeIndex, setRouteIndex] = useState(0)
  const [floorId, setFloorId] = useState('1F')
  const route = reviewRoutes[routeIndex]
  if (!route) {
    return <main className="review-shell"><p className="eyebrow">開發工具 · 唯讀</p><h1>沒有待審核路線</h1><p>Slides 3–13 已完成人工確認，正式 transition 已寫入 route data。</p></main>
  }
  // Review intentionally flattens the already stored source connectors. It does
  // not infer, merge, hide, or reassign a connector to a floor.
  const segments = route.floors.flatMap((floorRoute) => floorRoute.segments)
  const floor = floorById[floorId]

  return (
    <main className="review-shell">
      <header className="review-header">
        <p className="eyebrow">開發工具 · 唯讀</p>
        <h1>PPT Slide {route.source.slide}</h1>
        <code>{route.id}</code>
        <p>切換底圖只影響背景。所有 S／P 標示始終顯示同一條 PPT 原始 connector 幾何。</p>
      </header>

      <section className="review-controls" aria-label="Route Review 控制項">
        <div className="review-route-buttons">
          <button disabled={routeIndex === 0} onClick={() => setRouteIndex((index) => index - 1)} type="button">上一條</button>
          <span>{routeIndex + 1} / {reviewRoutes.length}</span>
          <button disabled={routeIndex === reviewRoutes.length - 1} onClick={() => setRouteIndex((index) => index + 1)} type="button">下一條</button>
        </div>
        <nav className="floor-tabs" aria-label="切換審核底圖">
          {floors.map((candidate) => (
            <button className={candidate.id === floorId ? 'is-active' : ''} key={candidate.id} onClick={() => setFloorId(candidate.id)} type="button">
              {candidate.label}
            </button>
          ))}
        </nav>
      </section>

      <section className="review-map" aria-label={`${floor.label} 審核底圖`}>
        <div className="map-canvas">
          <img alt={`${floor.label} 正式校園平面圖`} src={floor.image} />
          <RouteReviewOverlay height={floor.height} segments={segments} width={floor.width} />
        </div>
      </section>

      <section className="review-legend" aria-label="標示說明">
        <p><strong>S1、S2…</strong>：依 PPT 實際行走順序排列的 connector。</p>
        <p><strong>P1、P2…</strong>：每個 connector 的原始起訖端點。端點即使很接近也不會合併。</p>
      </section>
    </main>
  )
}

const originLabel = '從行政大樓出發'

// The transition label is formal route data. This helper only formats it for
// the navigation header; it does not infer the travel method or destination.
export function getRouteSummary(route) {
  const transition = route.floors.find((floorRoute) => floorRoute.transition)?.transition
  if (!transition) return { origin: originLabel, transition: null }

  return {
    origin: originLabel,
    transition: transition.label.replace(/^請/, ''),
  }
}

// Presentation-only marker for the shared 1F spiral-stair transition to A wing.
// Its anchor is read from the confirmed formal transition endpoint at render time.
const spiralTransitionTargets = new Set([
  'a-wing-2f-access',
  'a-wing-3f-access',
])

export function getSpiralTransitionMarker(route, routeFloor) {
  if (routeFloor.floorId !== '1F' || routeFloor.transition?.type !== 'spiral-stairs' || !spiralTransitionTargets.has(route.to)) return null

  const transitionPoint = routeFloor.segments.at(-1)?.points.at(-1)
  if (!transitionPoint) return null

  return { building: 'A', x: transitionPoint[0], y: transitionPoint[1] }
}

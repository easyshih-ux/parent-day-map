#!/usr/bin/env node
/** Validate data shape only. This script never changes route geometry. */
import { destinationById } from '../src/data/destinations.js'
import { destinations } from '../src/data/destinations.js'
import { floorById } from '../src/data/floors.js'
import { routes } from '../src/data/routes.js'
import { classRouteMap } from '../src/data/classRouteMap.js'

const validSegmentTypes = new Set(['solid', 'turn'])
const validStatuses = new Set(['pass', 'needs-review', 'not-tested'])
const errors = []
const seenRouteIds = new Set()
const routeById = new Map(routes.map((route) => [route.id, route]))

for (const route of routes) {
  if (seenRouteIds.has(route.id)) errors.push(`${route.id}: duplicate route id`)
  seenRouteIds.add(route.id)
  if (!validStatuses.has(route.status)) errors.push(`${route.id}: invalid status`)
  if (!destinationById[route.from]) errors.push(`${route.id}: unknown from destination`)
  if (!destinationById[route.to]) errors.push(`${route.id}: unknown to destination`)
  if (route.source?.type !== 'pptx' || !Number.isInteger(route.source?.slide) || route.source.slide < 1 || route.source.slide > 13) errors.push(`${route.id}: invalid PPTX source`)
  if (!Array.isArray(route.floors) || route.floors.length === 0) errors.push(`${route.id}: no floor segments`)

  for (const [index, floorRoute] of route.floors.entries()) {
    if (!floorById[floorRoute.floorId]) errors.push(`${route.id}: unknown floor ${floorRoute.floorId}`)
    if (!Array.isArray(floorRoute.segments) || floorRoute.segments.length === 0) errors.push(`${route.id}/${floorRoute.floorId}: no segments`)
    for (const segment of floorRoute.segments ?? []) {
      if (!validSegmentTypes.has(segment.type)) errors.push(`${route.id}/${floorRoute.floorId}: invalid segment type ${segment.type}`)
      if (!Array.isArray(segment.points) || segment.points.length < 2) errors.push(`${route.id}/${floorRoute.floorId}: segment needs at least two points`)
      for (const point of segment.points ?? []) {
        if (!Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite)) errors.push(`${route.id}/${floorRoute.floorId}: invalid point`)
        else if (point[0] < 0 || point[0] > 1672 || point[1] < 0 || point[1] > 941) errors.push(`${route.id}/${floorRoute.floorId}: point is outside map bounds`)
      }
    }
    if (floorRoute.transition && index === route.floors.length - 1) errors.push(`${route.id}/${floorRoute.floorId}: final floor cannot transition`)
    if (floorRoute.transition && floorRoute.transition.toFloorId !== route.floors[index + 1]?.floorId) errors.push(`${route.id}/${floorRoute.floorId}: transition target must match next route floor`)
  }
  const segmentCount = route.floors.flatMap((floorRoute) => floorRoute.segments ?? []).length
  if (route.source?.connectorCount !== segmentCount) errors.push(`${route.id}: source connector count does not match transcribed segment count`)
}

for (const classroom of destinations.filter((destination) => destination.category === 'classroom')) {
  const routeId = classRouteMap[classroom.id]
  if (!routeId) errors.push(`${classroom.id}: missing class-to-route mapping`)
  else if (!routeById.has(routeId)) errors.push(`${classroom.id}: mapped route does not exist`)
}
for (const [classId, routeId] of Object.entries(classRouteMap)) {
  if (destinationById[classId]?.category !== 'classroom') errors.push(`${classId}: mapping key is not a classroom destination`)
  if (!routeById.has(routeId)) errors.push(`${classId}: mapping references unknown route`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`Validated ${routes.length} route(s) and ${Object.keys(classRouteMap).length} class-to-route mappings: data shape, destination IDs, floor IDs, bounds, segment types, and transitions are valid.`)

import { classHighlightPositions } from '../src/data/classHighlightPositions.js'
import { destinations } from '../src/data/destinations.js'
import { MAP_COORDINATE_SYSTEM } from '../src/data/floors.js'

const classrooms = destinations.filter((destination) => destination.category === 'classroom')
const expectedIds = new Set(classrooms.map((destination) => destination.displayName))
const highlightIds = Object.keys(classHighlightPositions)
const errors = []

if (classrooms.length !== 50) errors.push(`expected 50 classroom destinations, received ${classrooms.length}`)
if (highlightIds.length !== 50) errors.push(`expected 50 highlight records, received ${highlightIds.length}`)

for (const classroom of classrooms) {
  const highlight = classHighlightPositions[classroom.displayName]
  if (!highlight) {
    errors.push(`${classroom.displayName}: missing highlight record`)
    continue
  }

  const expectedFloor = Number(classroom.floor.slice(0, -1))
  if (highlight.floor !== expectedFloor) errors.push(`${classroom.displayName}: floor ${highlight.floor} does not match ${classroom.floor}`)
  for (const key of ['x', 'y', 'width', 'height']) {
    if (typeof highlight[key] !== 'number' || !Number.isFinite(highlight[key])) errors.push(`${classroom.displayName}: ${key} must be a finite number`)
  }
  if (highlight.width <= 0 || highlight.height <= 0) errors.push(`${classroom.displayName}: width and height must be positive`)
  if (highlight.x < 0 || highlight.x > MAP_COORDINATE_SYSTEM.width || highlight.y < 0 || highlight.y > MAP_COORDINATE_SYSTEM.height) errors.push(`${classroom.displayName}: x/y outside formal map bounds`)
}

for (const id of highlightIds) if (!expectedIds.has(id)) errors.push(`${id}: no matching classroom destination`)

if (errors.length) {
  console.error(`Highlight validation failed:\n${errors.join('\n')}`)
  process.exit(1)
}

console.log(`Validated ${highlightIds.length} human-confirmed class highlight record(s) against ${classrooms.length} classroom destination(s).`)

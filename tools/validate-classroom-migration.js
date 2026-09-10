#!/usr/bin/env node
import { activeAcademicYear } from '../src/data/activeAcademicYear.js'
import { academicYear115 } from '../src/data/academicYears/115.js'
import { academicYear116 } from '../src/data/academicYears/116.js'
import { validateAcademicYearAssignments } from '../src/data/academicYearValidation.js'
import { getActiveAcademicYearConfig, resolveClassroom } from '../src/data/classroomResolver.js'
import { classHighlightPositions } from '../src/data/classHighlightPositions.js'
import { classRouteMap } from '../src/data/classRouteMap.js'
import { destinations } from '../src/data/destinations.js'
import { MAP_COORDINATE_SYSTEM } from '../src/data/floors.js'
import { roomById, rooms } from '../src/data/rooms.js'
import { routes } from '../src/data/routes.js'

const errors = []
const classrooms = destinations.filter((destination) => destination.category === 'classroom')
const routeIds = new Set(routes.map((route) => route.id))
const assignmentEntries = Object.entries(academicYear115.assignments)
const roomIds = new Set()

if (!getActiveAcademicYearConfig() || activeAcademicYear !== '115') errors.push('activeAcademicYear does not resolve to 115')
function validateAcademicYear(academicYear) {
  const validation = validateAcademicYearAssignments(academicYear.assignments, classrooms.map((classroom) => classroom.displayName))
  if (validation.total !== 50) errors.push(`${academicYear.academicYear}: expected 50 classes, received ${validation.total}`)
  if (validation.missing.length) errors.push(`${academicYear.academicYear}: missing assignments for ${validation.missing.join(', ')}`)
  if (validation.invalid.length) errors.push(`${academicYear.academicYear}: invalid roomIds for ${validation.invalid.join(', ')}`)
  for (const duplicate of validation.duplicates) errors.push(`${academicYear.academicYear}: ${duplicate.roomId} is assigned to ${duplicate.classNumbers.join(', ')}`)
  if (validation.incompleteRooms.length) errors.push(`${academicYear.academicYear}: incomplete rooms ${validation.incompleteRooms.join(', ')}`)
}

validateAcademicYear(academicYear115)
validateAcademicYear(academicYear116)

for (const room of rooms) {
  if (roomIds.has(room.id)) errors.push(`${room.id}: duplicate roomId`)
  roomIds.add(room.id)
  if (!room.floor) errors.push(`${room.id}: missing floor`)
  if (!room.routeId || !routeIds.has(room.routeId)) errors.push(`${room.id}: missing or unknown routeId`)
  for (const field of ['x', 'y', 'width', 'height']) {
    if (!Number.isFinite(room.highlight?.[field])) errors.push(`${room.id}: invalid highlight.${field}`)
  }
  for (const field of ['x', 'y']) if (!Number.isFinite(room.label?.[field])) errors.push(`${room.id}: invalid label.${field}`)
  if (room.highlight?.x < 0 || room.highlight?.x > MAP_COORDINATE_SYSTEM.width || room.highlight?.y < 0 || room.highlight?.y > MAP_COORDINATE_SYSTEM.height) errors.push(`${room.id}: highlight is outside formal map bounds`)
}

for (const [classNumber, roomId] of assignmentEntries) if (!roomById[roomId]) errors.push(`${classNumber}: assignment references unknown room ${roomId}`)
for (const classroom of classrooms) {
  const classNumber = classroom.displayName
  const resolved = resolveClassroom(classNumber)
  const legacyHighlight = classHighlightPositions[classNumber]
  const legacyRouteId = classRouteMap[classroom.id]
  if (!resolved) {
    errors.push(`${classNumber}: active resolver returned no classroom`)
    continue
  }
  if (resolved.floor !== classroom.floor) errors.push(`${classNumber}/${resolved.roomId}: floor differs (legacy ${classroom.floor}, new ${resolved.floor})`)
  if (resolved.routeId !== legacyRouteId) errors.push(`${classNumber}/${resolved.roomId}: routeId differs (legacy ${legacyRouteId}, new ${resolved.routeId})`)
  for (const field of ['x', 'y', 'width', 'height']) if (resolved.highlight[field] !== legacyHighlight?.[field]) errors.push(`${classNumber}/${resolved.roomId}: highlight.${field} differs (legacy ${legacyHighlight?.[field]}, new ${resolved.highlight[field]})`)
}

for (const [classNumber] of assignmentEntries) if (!classrooms.some((classroom) => classroom.displayName === classNumber)) errors.push(`${classNumber}: assignment has no legacy classroom`)

if (errors.length) {
  console.error(`Classroom migration validation failed:\n${errors.join('\n')}`)
  process.exit(1)
}

console.log(`Validated ${rooms.length} fixed rooms plus 115/116 academic-year configurations; 115's 50 classes match legacy floor, route, and highlight data.`)

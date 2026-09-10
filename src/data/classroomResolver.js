import { activeAcademicYear } from './activeAcademicYear.js'
import { academicYears } from './academicYears/index.js'
import { getPreviewAcademicYear, getPreviewAssignments } from './academicYearPreview.js'
import { roomById } from './rooms.js'

export function getActiveAcademicYearConfig(options = {}) {
  const academicYear = options.academicYear ?? getPreviewAcademicYear() ?? activeAcademicYear
  const configuredYear = academicYears[academicYear]
  if (!configuredYear) return null
  const assignments = options.assignments ?? getPreviewAssignments(academicYear) ?? configuredYear.assignments
  return Object.freeze({ ...configuredYear, assignments })
}

export function resolveClassroom(classNumber, options) {
  const normalizedClassNumber = String(classNumber)
  const academicYear = getActiveAcademicYearConfig(options)
  const roomId = academicYear?.assignments[normalizedClassNumber]
  const room = roomId ? roomById[roomId] : null
  if (!academicYear || !room) return null

  return Object.freeze({
    classNumber: normalizedClassNumber,
    academicYear: academicYear.academicYear,
    roomId,
    floor: room.floor,
    building: room.building,
    routeId: room.routeId,
    highlight: room.highlight,
    label: room.label,
  })
}

export function getClassroomsForFloor(floorId, options) {
  const academicYear = getActiveAcademicYearConfig(options)
  if (!academicYear) return []

  return Object.keys(academicYear.assignments)
    .sort((first, second) => Number(first) - Number(second))
    .map((classNumber) => resolveClassroom(classNumber, options))
    .filter((classroom) => classroom?.floor === floorId)
}

export function getActiveClassrooms(options) {
  const academicYear = getActiveAcademicYearConfig(options)
  return academicYear ? Object.keys(academicYear.assignments).sort((first, second) => Number(first) - Number(second)).map((classNumber) => resolveClassroom(classNumber, options)) : []
}

export { academicYears }

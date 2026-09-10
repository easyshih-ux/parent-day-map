import { activeAcademicYear } from './activeAcademicYear.js'
import { academicYear115 } from './academicYears/115.js'
import { roomById } from './rooms.js'

const academicYears = Object.freeze({ '115': academicYear115 })

export function getActiveAcademicYearConfig() {
  return academicYears[activeAcademicYear] ?? null
}

export function resolveClassroom(classNumber) {
  const normalizedClassNumber = String(classNumber)
  const academicYear = getActiveAcademicYearConfig()
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

export function getClassroomsForFloor(floorId) {
  const academicYear = getActiveAcademicYearConfig()
  if (!academicYear) return []

  return Object.keys(academicYear.assignments)
    .sort((first, second) => Number(first) - Number(second))
    .map(resolveClassroom)
    .filter((classroom) => classroom?.floor === floorId)
}

export function getActiveClassrooms() {
  const academicYear = getActiveAcademicYearConfig()
  return academicYear ? Object.keys(academicYear.assignments).sort((first, second) => Number(first) - Number(second)).map(resolveClassroom) : []
}

export { academicYears }

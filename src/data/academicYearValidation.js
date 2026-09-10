import { roomById, rooms } from './rooms.js'

export function validateAcademicYearAssignments(assignments, expectedClassNumbers) {
  const missing = expectedClassNumbers.filter((classNumber) => !assignments[classNumber])
  const invalid = expectedClassNumbers.filter((classNumber) => assignments[classNumber] && !roomById[assignments[classNumber]])
  const assignedRooms = new Map()

  for (const classNumber of expectedClassNumbers) {
    const roomId = assignments[classNumber]
    if (!roomById[roomId]) continue
    const classNumbers = assignedRooms.get(roomId) ?? []
    assignedRooms.set(roomId, [...classNumbers, classNumber])
  }

  const duplicates = [...assignedRooms.entries()].filter(([, classNumbers]) => classNumbers.length > 1).map(([roomId, classNumbers]) => ({ roomId, classNumbers }))
  const incompleteRooms = rooms.filter((room) => !room.floor || !room.routeId || !room.highlight || !room.label).map((room) => room.id)
  const configured = expectedClassNumbers.length - missing.length - invalid.length

  return Object.freeze({
    total: expectedClassNumbers.length,
    configured,
    missing,
    invalid,
    duplicates,
    incompleteRooms,
    usable: missing.length === 0 && invalid.length === 0 && duplicates.length === 0 && incompleteRooms.length === 0,
  })
}

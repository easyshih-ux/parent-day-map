import { academicYear116 } from './academicYears/116.js'

export const academicYearDraftStorageKey = 'parent-day-map-v2:academic-year-config:116'

export function getPreviewAcademicYear() {
  if (!import.meta.env?.DEV || typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('previewAcademicYear') === '116' ? '116' : null
}

export function getPreviewAssignments(academicYear) {
  if (!import.meta.env?.DEV || academicYear !== '116' || typeof window === 'undefined') return null
  try {
    const saved = JSON.parse(window.localStorage.getItem(academicYearDraftStorageKey) ?? 'null')
    return saved?.assignments && typeof saved.assignments === 'object' ? saved.assignments : academicYear116.assignments
  } catch {
    return academicYear116.assignments
  }
}

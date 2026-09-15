import ParentDayNavigator from './components/ParentDayNavigator'
import RouteReviewMode from './components/RouteReviewMode'
import ClassHighlightCalibrationMode from './components/ClassHighlightCalibrationMode'
import AcademicYearConfigMode from './components/AcademicYearConfigMode'
import SpecialDestinationCalibrationMode from './components/SpecialDestinationCalibrationMode'

export default function App() {
  const developmentPath = window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/'
  if (import.meta.env.DEV && developmentPath === '/review') return <RouteReviewMode />
  if (import.meta.env.DEV && developmentPath === '/class-calibration') return <ClassHighlightCalibrationMode />
  if (import.meta.env.DEV && developmentPath === '/academic-year-config') return <AcademicYearConfigMode />
  if (import.meta.env.DEV && developmentPath === '/special-destination-calibration') return <SpecialDestinationCalibrationMode />
  return <ParentDayNavigator />
}

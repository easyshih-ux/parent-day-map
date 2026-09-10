import ParentDayNavigator from './components/ParentDayNavigator'
import RouteReviewMode from './components/RouteReviewMode'
import ClassHighlightCalibrationMode from './components/ClassHighlightCalibrationMode'

export default function App() {
  const developmentPath = window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/'
  if (import.meta.env.DEV && developmentPath === '/review') return <RouteReviewMode />
  if (import.meta.env.DEV && developmentPath === '/class-calibration') return <ClassHighlightCalibrationMode />
  return <ParentDayNavigator />
}

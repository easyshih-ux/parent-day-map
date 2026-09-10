import ParentDayNavigator from './components/ParentDayNavigator'
import RouteReviewMode from './components/RouteReviewMode'
import ClassHighlightCalibrationMode from './components/ClassHighlightCalibrationMode'

export default function App() {
  if (import.meta.env.DEV && window.location.pathname === '/review') return <RouteReviewMode />
  if (import.meta.env.DEV && window.location.pathname === '/class-calibration') return <ClassHighlightCalibrationMode />
  return <ParentDayNavigator />
}

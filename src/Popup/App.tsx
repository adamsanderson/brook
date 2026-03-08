import ErrorBoundary from '../components/ErrorBoundary'
import PopupPaneLayout from '../layouts/PopupPaneLayout'

export default function App() {
  return (
    <ErrorBoundary message="An error occurred while running Brook.">
      <PopupPaneLayout />
    </ErrorBoundary>
  )
}

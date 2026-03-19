import ErrorBoundary from '../components/ErrorBoundary'
import DualPaneLayout from '../layouts/DualPaneLayout'

export default function App() {
  return (
    <ErrorBoundary message="An error occurred while running Brook.">
      <DualPaneLayout />
    </ErrorBoundary>
  )
}

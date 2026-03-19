import ErrorBoundary from '../components/ErrorBoundary'
import OptionsForm from '../containers/OptionsForm'

export default function App() {
  return (
    <ErrorBoundary message="An error ocurred.">
      <OptionsForm />
    </ErrorBoundary>
  )
}

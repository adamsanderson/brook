import FolderToolbar from '../containers/FolderToolbar'
import ErrorBoundary from '../components/ErrorBoundary'
import type { Folder } from '../redux/types'

type Props = {
  folder?: Folder
}

export default function FolderPanel({ folder }: Props) {
  return (
    <ErrorBoundary message="An error ocurred while displaying this folder.">
      <div className="Panel">
        <FolderToolbar folder={folder} />
      </div>
    </ErrorBoundary>
  )
}

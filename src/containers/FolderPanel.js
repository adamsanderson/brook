import React from 'react'
import PropTypes from 'prop-types'

import FolderToolbar from '../containers/FolderToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

FolderPanel.propTypes = {
  folder: PropTypes.object,
}

export default function FolderPanel({folder}){
  return (
    <ErrorBoundary message="An error ocurred while displaying this folder.">  
      <div className="Panel">
        <FolderToolbar folder={folder} />
      </div>
    </ErrorBoundary>
  )
}
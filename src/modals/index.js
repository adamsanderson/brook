import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import modal from '../redux/modules/modal'
import SubscribeMenu from './SubscribeMenu'
import FeedTreeMenu from "./FeedTreeMenu"
import FolderMenu from "./FolderMenu"

/*
  Adapted From:
  http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680
*/

const MODALS_COMPONENTS = {
  SubscribeMenu,
  FeedTreeMenu,
  FolderMenu,
}

/**
 * All available named modals.
 */
export const MODALS = {}
Object.keys(MODALS_COMPONENTS).forEach(key => MODALS[key] = key)

const ModalRoot = ({type, props}) => {
  if (!type) { return null }
  
  const SpecificModal = MODALS_COMPONENTS[type]
  if (!SpecificModal) {
    throw new Error("Unknown modal type: "+type)
  }
  
  return <SpecificModal {...props} />
}

ModalRoot.propTypes = {
  type: PropTypes.string,
  props: PropTypes.object
}

export default connect(
  state => modal.selectors.modal(state)
)(ModalRoot)
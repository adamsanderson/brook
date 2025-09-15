import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import modal, { closeModal } from '../redux/modules/modal'
import SubscribeMenu from './SubscribeMenu'
import AddByUrlMenu from './AddByUrlMenu'
import FeedTreeMenu from './FeedTreeMenu'
import TreeViewMenu from './TreeViewMenu'
import FolderMenu from "./FolderMenu"
import FeedMenu from "./FeedMenu"
import DebugMenu from "./DebugMenu"

/*
  Adapted From:
  http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680
*/

const MODALS_COMPONENTS = {
  SubscribeMenu,
  AddByUrlMenu,
  FeedTreeMenu,
  TreeViewMenu,
  FolderMenu,
  FeedMenu,
  DebugMenu,
}

/**
 * All available named modals.
 */
export const MODALS = {}
Object.keys(MODALS_COMPONENTS).forEach(key => MODALS[key] = key)

ModalRoot.propTypes = {
  type: PropTypes.string,
  props: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
}

/**
 * ModalRoot displays the current modal.
 */
function ModalRoot({ type, props, closeModal }) {
  let modal = null

  if (type) {
    const SpecificModal = MODALS_COMPONENTS[type]
    if (!SpecificModal) {
      console.error('Unknown modal type', type)
      throw new Error("Unknown modal type: " + type)
    }
    modal = (
        <div className='Modal'>
          <SpecificModal closeModal={closeModal} {...props} />
        </div>
    )
  }

  return modal
}

export default connect(
  state => modal.selectors.modal(state),
  { closeModal }
)(ModalRoot)

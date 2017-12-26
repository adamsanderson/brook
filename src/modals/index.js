import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group';


import modal, {closeModal} from '../redux/modules/modal'
import SubscribeMenu from './SubscribeMenu'
import ImportModal from './ImportModal'
import FeedTreeMenu from "./FeedTreeMenu"
import FolderMenu from "./FolderMenu"
import FeedDetailMenu from "./FeedDetailMenu"

/*
  Adapted From:
  http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680
*/

const MODALS_COMPONENTS = {
  SubscribeMenu,
  FeedTreeMenu,
  FolderMenu,
  FeedDetailMenu,
  ImportModal,
}

/**
 * All available named modals.
 */
export const MODALS = {}
Object.keys(MODALS_COMPONENTS).forEach(key => MODALS[key] = key)

/**
 * ModalRoot displays the current modal.
 */
const ModalRoot = ({type, props, closeModal}) => {
  let modal = null

  if (type) {
    const SpecificModal = MODALS_COMPONENTS[type]
    if (!SpecificModal) {
      throw new Error("Unknown modal type: "+type)
    }
    modal = (
      <CSSTransition classNames="Modal" addEndListener={(node, done) => {
        node.addEventListener('transitionend', done)
      }} >
        <SpecificModal closeModal={closeModal} {...props} />
      </CSSTransition>
    )
  }
  
  return (
    <TransitionGroup>
      {modal}
    </TransitionGroup>
  )
}

ModalRoot.propTypes = {
  type: PropTypes.string,
  props: PropTypes.object
}

export default connect(
  state => modal.selectors.modal(state),
  { closeModal }
)(ModalRoot)

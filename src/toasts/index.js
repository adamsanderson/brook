import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import toast, {hideToast} from '../redux/modules/toast'
import UndoToast from './UndoToast'
/*
  Adapted From:
  http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680
*/

const TOAST_COMPONENTS = {
  UndoToast
}

/**
 * All available named toasts.
 */
export const TOASTS = {}
Object.keys(TOAST_COMPONENTS).forEach(key => TOASTS[key] = key)

ToastRoot.propTypes = {
  type: PropTypes.string.isRequired,
  props: PropTypes.object,
  hideToast: PropTypes.func.isRequired,
}

/**
 * ToastRoot displays the current toast.
 */
function ToastRoot({type, props, hideToast}) {
  let toast = null

  if (type) {
    const SpecificToast = TOAST_COMPONENTS[type]
    if (!SpecificToast) {
      throw new Error("Unknown toast type: "+type)
    }
    toast = (
      <CSSTransition classNames="Modal" addEndListener={(node, done) => {
        node.addEventListener('transitionend', done)
      }} >
        <div className="Toast">
          <SpecificToast hideToast={hideToast} {...props} />
          <a className="Toast-close" onClick={hideToast} >
            ✖
          </a>
        </div>
      </CSSTransition>
    )
  }
   
  return (
    <TransitionGroup>
      {toast}
    </TransitionGroup>
  )
}

export default connect(
  state => toast.selectors.toast(state),
  { hideToast }
)(ToastRoot)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import toast, {hideToastNow as hideToast, holdToast, releaseToast} from '../redux/modules/toast'
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
  type: PropTypes.string,
  props: PropTypes.object,
  hideToast: PropTypes.func.isRequired,
  holdToast: PropTypes.func.isRequired,
  releaseToast: PropTypes.func.isRequired,
}

/**
 * ToastRoot displays the current toast.
 */
function ToastRoot({type, props, hideToast, holdToast, releaseToast}) {
  let toast = null

  if (type) {
    const SpecificToast = TOAST_COMPONENTS[type]
    if (!SpecificToast) {
      throw new Error("Unknown toast type: "+type)
    }
    toast = (
        <div className="Toast" onMouseEnter={holdToast} onMouseLeave={releaseToast}>
          <SpecificToast hideToast={hideToast} {...props} />
          <a className="Toast-close" onClick={hideToast} >
            ✖
          </a>
        </div>
    )
  }
   
  return toast
}

export default connect(
  state => toast.selectors.toast(state),
  { 
    hideToast,
    holdToast,
    releaseToast,
  }
)(ToastRoot)

import { connect, ConnectedProps } from 'react-redux'

import toast, { hideToastNow as hideToast, holdToast, releaseToast } from '../redux/modules/toast'
import UndoToast from './UndoToast'
import type { RootState } from '../redux/types'

/*
  Adapted From:
  http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680
*/

const TOAST_COMPONENTS = {
  UndoToast
} as const

/**
 * All available named toasts.
 */
export const TOASTS: Record<string, string> = {}
Object.keys(TOAST_COMPONENTS).forEach(key => {
  TOASTS[key] = key
})

type StateProps = {
  type?: string
  toastProps?: object
}

const mapStateToProps = (state: RootState): StateProps => {
  const toastState = toast.selectors.toast(state)

  if ('type' in toastState) {
    return {
      type: toastState.type,
      toastProps: toastState.props,
    }
  }

  return {
    type: undefined,
    toastProps: undefined,
  }
}

const connector = connect(mapStateToProps, {
  hideToast,
  holdToast,
  releaseToast,
})

/**
 * ToastRoot displays the current toast.
 */
function ToastRoot({ type, toastProps, hideToast, holdToast, releaseToast }: ConnectedProps<typeof connector>) {
  if (!type) return null

  const SpecificToast = TOAST_COMPONENTS[type as keyof typeof TOAST_COMPONENTS]
  if (!SpecificToast) {
    throw new Error(`Unknown toast type: ${type}`)
  }

  return (
    <div className="Toast" onMouseEnter={() => holdToast()} onMouseLeave={() => releaseToast()}>
      <SpecificToast hideToast={hideToast} {...(toastProps || {})} />
      <a className="Toast-close" onClick={() => hideToast()}>
        ✖
      </a>
    </div>
  )
}

export default connector(ToastRoot)

import { TOASTS } from '../../toasts'
import { showToast } from '../modules/toast'

const notifications = store => next => action => {
  const result = next(action)
  
  if (action.meta && action.meta.checkpoint) {
    const name = action.meta.checkpoint
    next(showToast(TOASTS.UndoToast, { name }))
  }

  return result
}

export default notifications
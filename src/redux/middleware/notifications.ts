import type { Middleware, UnknownAction } from 'redux'
// @ts-expect-error migration
import { TOASTS } from '../../toasts'
import { showToast } from '../modules/toast'

type CheckpointAction = UnknownAction & {
  meta?: {
    checkpoint?: string
  }
}

const notifications: Middleware = _store => next => (action: unknown): unknown => {
  const result = next(action)

  const checkpointAction = action as CheckpointAction
  if (checkpointAction.meta?.checkpoint) {
    const name = checkpointAction.meta.checkpoint
    next(showToast(TOASTS.UndoToast, { name }))
  }

  return result
}

export default notifications
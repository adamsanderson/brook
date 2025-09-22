import type { FEED, FeedsState } from './modules/feeds'
import type { FOLDER, FoldersState } from './modules/folders'
import type { UIState } from './modules/ui'
import type { ViewsState } from './modules/views'
import type { ActiveTabState } from './modules/activeTab'
import type { DiscoveryState } from './modules/discovery'
import type { ModalState } from './modules/modal'
import type { OptionsState } from './modules/options'
import type { ToastState } from './modules/toast'
import type { WorkersState } from './modules/workers'
import type { PopupState } from './modules/popup'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type Thunk<T = void> = ThunkAction<T, RootState, unknown, Action>

// Root state type - will be expanded as we migrate more modules
export type RootState = {
  feeds: FeedsState
  folders: FoldersState
  ui: UIState
  views: ViewsState
  discovery: DiscoveryState
  activeTab: ActiveTabState
  modal: ModalState
  toast: ToastState
  workers: WorkersState
  popup: PopupState
  options: OptionsState
}

// Node reference type (used in children arrays for folders)
export type NodeRef = {
  type: typeof FEED | typeof FOLDER
  id: string
}

// Extended action type with webext-redux _sender property
export type WebExtAction = {
  _sender: {
    tab: {
      id: number
    }
  }
}
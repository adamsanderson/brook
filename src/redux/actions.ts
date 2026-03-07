import type { ActiveTabAction } from './modules/activeTab'
import type { DiscoveryAction } from './modules/discovery'
import type { FeedAction } from './modules/feeds'
import type { FolderAction } from './modules/folders'
import type { ModalAction } from './modules/modal'
import type { OptionsAction } from './modules/options'
import type { PopupAction } from './modules/popup'
import type { ToastAction } from './modules/toast'
import type { UIAction } from './modules/ui'
import type { ViewsAction } from './modules/views'
import type { WorkersAction } from './modules/workers'

export type AppAction =
  | ActiveTabAction
  | DiscoveryAction
  | FeedAction
  | FolderAction
  | ModalAction
  | OptionsAction
  | PopupAction
  | ToastAction
  | UIAction
  | ViewsAction
  | WorkersAction

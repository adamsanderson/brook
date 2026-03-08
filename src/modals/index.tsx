import { connect, ConnectedProps } from 'react-redux'

import modal, { closeModal } from '../redux/modules/modal'
import type { RootState } from '../redux/types'
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
} as const

/**
 * All available named modals.
 */
export const MODALS: Record<string, string> = {}
Object.keys(MODALS_COMPONENTS).forEach(key => MODALS[key] = key)

const mapStateToProps = (state: RootState) => {
  const modalState = modal.selectors.modal(state)

  if ('type' in modalState) {
    return {
      type: modalState.type,
      modalProps: modalState.props,
    }
  }

  return {
    type: undefined,
    modalProps: undefined,
  }
}

const connector = connect(mapStateToProps, { closeModal })

/**
 * ModalRoot displays the current modal.
 */
function ModalRoot({ type, modalProps, closeModal }: ConnectedProps<typeof connector>) {
  if (!type) return null

  const SpecificModal = MODALS_COMPONENTS[type as keyof typeof MODALS_COMPONENTS]
  if (!SpecificModal) {
    console.error('Unknown modal type', type)
    throw new Error("Unknown modal type: " + type)
  }

  return (
    <div className='Modal'>
      {/* @ts-expect-error This is loosely typed at best for now */}
      <SpecificModal closeModal={closeModal} {...(modalProps || {})} />
    </div>
  )
}

export default connector(ModalRoot)

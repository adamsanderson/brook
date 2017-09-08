import store from './redux/store'
import { wrapStore } from 'react-chrome-redux'

wrapStore(store, {portName: 'Brook'})
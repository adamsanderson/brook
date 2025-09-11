import React from 'react'
import BundledImage from './BundledImage'

import emptyPath from '../images/empty.jpg'
import importPath from '../images/import.jpg'
import optionsPath from '../images/options.jpg'
import readPath from '../images/read.jpg'

export const EmptyImage = (props) => <BundledImage {...props} src={emptyPath}/>
export const ImportImage = (props) => <BundledImage {...props} src={importPath}/>
export const OptionsImage = (props) => <BundledImage {...props} src={optionsPath}/>
export const ReadImage = (props) => <BundledImage {...props} src={readPath}/>
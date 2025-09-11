import React from 'react'

import emptyPath from './empty.jpg'
import importPath from './import.jpg'
import optionsPath from './options.jpg'
import readPath from './read.jpg'

export const EmptyImage = (props) => <img {...props} src={emptyPath}/>
export const ImportImage = (props) => <img {...props} src={importPath}/>
export const OptionsImage = (props) => <img {...props} src={optionsPath}/>
export const ReadImage = (props) => <img {...props} src={readPath}/>
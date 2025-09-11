import React from 'react'

import emptyPath from '../images/empty.jpg'
import importPath from '../images/import.jpg'
import optionsPath from '../images/options.jpg'
import readPath from '../images/read.jpg'

export const EmptyImage = (props) => <img {...props} src={browser.runtime.getURL(emptyPath)}/>
export const ImportImage = (props) => <img {...props} src={browser.runtime.getURL(importPath)}/>
export const OptionsImage = (props) => <img {...props} src={browser.runtime.getURL(optionsPath)}/>
export const ReadImage = (props) => <img {...props} src={browser.runtime.getURL(readPath)}/>
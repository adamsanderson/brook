import type { ImgHTMLAttributes } from 'react'

import emptyPath from './empty.jpg'
import importPath from './import.jpg'
import optionsPath from './options.jpg'
import readPath from './read.jpg'

type Props = ImgHTMLAttributes<HTMLImageElement>

export const EmptyImage = (props: Props) => <img {...props} src={emptyPath}/>
export const ImportImage = (props: Props) => <img {...props} src={importPath}/>
export const OptionsImage = (props: Props) => <img {...props} src={optionsPath}/>
export const ReadImage = (props: Props) => <img {...props} src={readPath}/>

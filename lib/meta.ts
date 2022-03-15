import {ImageProps} from 'next/image';
import { ReactNode } from 'react';

export type ToolMetaInline = {
  id: string
  name: string
  icon: Exclude<ImageProps['src'], string>
  draft?: boolean
  details?: ReactNode
}

export type ToolMeta = ToolMetaInline & {
  path: string // file path
  link: string // url path
}

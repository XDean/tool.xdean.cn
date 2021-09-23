import {ImageProps} from "next/image";

export type ToolMetaInline = {
  name: string
  icon: Exclude<ImageProps['src'], string>
  draft?: boolean
}

export type ToolMeta = ToolMetaInline & {
  path: string // file path
  link: string // url path
}

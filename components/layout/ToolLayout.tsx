import {PropsWithChildren} from "react";
import {ToolMeta} from "../../lib/meta";
import {DefaultLayout} from "./DefaultLayout";

type Props = PropsWithChildren<{
  meta: ToolMeta
}>

export const ToolLayout = (props: Props) => {
  const {children, meta} = props
  return (
    <DefaultLayout meta={meta}>
      {children}
    </DefaultLayout>
  )
}
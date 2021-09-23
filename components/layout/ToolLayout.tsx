import {PropsWithChildren} from "react";
import {ToolMeta} from "../../lib/meta";
import {DefaultLayout} from "./DefaultLayout";

type Props = PropsWithChildren<{
  meta: ToolMeta
}>

export const ToolLayout = (props: Props) => {
  const {children, meta} = props
  return (
    <DefaultLayout>
      <div className={'flex flex-row items-center justify-center mb-4 text-4xl'}>
        {meta.name}
      </div>
      {children}
    </DefaultLayout>
  )
}
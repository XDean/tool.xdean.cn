import {PropsWithChildren} from "react";
import {useRouter} from "next/router";
import {ToolLayout} from "./ToolLayout";
import {DefaultLayout} from "./DefaultLayout";

type Props = PropsWithChildren<{}>

export const Layout = (props: Props) => {
  const {children} = props
  const router = useRouter();
  if (router.asPath.startsWith('/tool/')) {
    const meta = (children as any).type.meta
    return <ToolLayout meta={meta} children={children}/>
  } else {
    return <DefaultLayout children={children}/>
  }
}
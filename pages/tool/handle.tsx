import logo from 'public/tool/handle/favicon.svg';
import { Handle } from 'src/tools/handle/Main';
import Info  from 'src/tools/handle/Info.mdx';
import { ToolMetaInline } from '../../src/lib/meta';

export default Handle;

(Handle as any).meta = {
  id: 'handle',
  name: '汉兜',
  icon: logo,
  details: <Info/>,
} as ToolMetaInline;
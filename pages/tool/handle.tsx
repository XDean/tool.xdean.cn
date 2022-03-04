import logo from 'public/tool/handle/favicon.svg';
import { Handle } from 'tools/handle/Main';
import { ToolMetaInline } from '../../lib/meta';

export default Handle;

(Handle as any).meta = {
  id: 'handle',
  name: '汉兜(改)',
  icon: logo,
} as ToolMetaInline;
import {GuoBiaoMainView} from 'components/guobiao/Main';
import {ToolMetaInline} from '../../lib/meta';
import logo from 'public/tool/guobiao/logo_512.webp';

export default GuoBiaoMainView;

(GuoBiaoMainView as any).meta = {
  id: 'guobiao',
  name: '国标麻将算番器',
  icon: logo,
} as ToolMetaInline;
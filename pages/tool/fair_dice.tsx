import {Main} from 'tools/fair_dice/components/Main';
import {ToolMetaInline} from '../../lib/meta';
import logo from 'public/tool/fair_dice/logo_512.webp';

export default Main;

(Main as any).meta = {
  id: 'fair_dice',
  name: '公平的骰子',
  icon: logo,
} as ToolMetaInline;
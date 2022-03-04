import idioms from 'public/data/idiom.json';
import idiomsSimple from 'public/data/idiom_simple.json';
import { apiHandler } from '../../common/api/handler';

export default apiHandler({
  handler: {
    GET: ({helper}) => {
      const type = helper.museQuery('type', 'simple');
      let idx = Number(helper.museQuery('idx', 'NaN'));
      if (Number.isNaN(idx)) {
        if (type === 'simple') {
          while (true) {
            const word = idiomsSimple[Math.floor(Math.random() * idiomsSimple.length)];
            idx = idioms.findIndex(e => e.word === word);
            if (idx !== -1) {
              break;
            }
          }
        } else {
          idx = Math.floor(Math.random() * idioms.length);
        }
      }
      return {
        idx,
        ...idioms[idx],
      };
    },
  },
});
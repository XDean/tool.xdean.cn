import idioms from 'public/data/idiom.json';
import idiomsSimple from 'public/data/idiom_simple.json';
import { apiError, apiHandler } from '../../common/api/handler';

export default apiHandler({
  handler: {
    GET: ({helper}) => {
      const type = helper.museQuery('type', 'simple');
      let id = Number(helper.museQuery('id', 'NaN'));
      if (Number.isNaN(id)) {
        if (type === 'simple') {
          while (true) {
            const word = idiomsSimple[Math.floor(Math.random() * idiomsSimple.length)];
            id = idioms.findIndex(e => e.word === word);
            if (id !== -1) {
              break;
            }
          }
        } else {
          id = Math.floor(Math.random() * idioms.length);
        }
      }
      const idiom = idioms[id];
      if (!idiom) {
        throw apiError(400, `no such idiom, id = ${id}`);
      }
      return {
        id,
        ...idiom,
      };
    },
  },
});
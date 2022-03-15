import {apiHandler} from 'common/api/handler';
import {addRead, getReadOnly} from '../../common/api/impl/read';


export default apiHandler({
  handler: {
    GET: async ({helper}) => {
      const id = helper.museQuery('id');
      const add = helper.museQuery('add', 'true').toLowerCase() === 'true';
      const userId = helper.getUserId();
      if (add) {
        await addRead({objId:id, userId});
      }
      return getReadOnly({objId:id});
    },
  },
});
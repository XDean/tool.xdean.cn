import { apiError, apiHandler } from 'common/api/handler';
import { getObjStats } from '../../common/api/impl/stat';


export default apiHandler({
  handler: {
    GET: async ({helper, req}) => {
      const ids: string[] = req.body['ids'];
      if (!ids || !Array.isArray(ids)) {
        throw apiError(400, `required query parameter "ids" not exist`);
      }
      return getObjStats({
        objIds: ids,
        userId: helper.getUserId(),
      });
    },
  },
});
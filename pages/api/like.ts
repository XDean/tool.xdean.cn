import {apiHandler} from "common/api/handler";
import {stringToBoolean} from "../../common/util/base";
import {getLike, setLike} from "../../common/api/impl/like";


export default apiHandler({
  handler: {
    GET: async ({helper}) => {
      const id = helper.museQuery('id')
      const userId = helper.getUserId()
      return await getLike({
        objId: id,
        userId
      })
    },
    POST: async ({helper}) => {
      const id = helper.museQuery('id')
      const userId = helper.getUserId()
      const like = stringToBoolean(helper.museQuery('value', 'true'))
      await setLike({
        objId: id,
        userId,
        like,
      })
    }
  }
})
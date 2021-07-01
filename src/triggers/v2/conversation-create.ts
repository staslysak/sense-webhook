import {smoochClient} from '../../clients'
import {getErrorResponse, logginJSON} from '../../utils'

export const extractData = async (body) => {
  try {
    const {
      app: {id: appId},
      events: [
        {
          payload: {
            user: {id: appUserId},
          },
        },
      ],
    } = body

    const {data: dataClients} = await smoochClient(
      `/v2/apps/${appId}/users/${appUserId}/clients`,
    )

    const appleClient = dataClients.clients.find(({type}) => type === 'apple')

    return {
      appId,
      appUserId,
      isChatSuggest: appleClient?.raw?.group === 'chat_suggest',
      externalId: appleClient?.raw?.intent,
    }
  } catch {
    return {}
  }
}

export const handler = async ({
  appId,
  appUserId,
  externalId,
  isChatSuggest,
}) => {
  if (!externalId || isChatSuggest) {
    return {
      status: 400,
      message: 'Invalid intent',
    }
  }

  // const user = await smoochClient(`/v2/apps/${appId}/users/${externalId}`)
  //   .then(({data}) => {
  //     logginJSON('TRIGGER Use existing user', {level: 'DEBUG'})

  //     return data.user
  //   })
  //   .catch(async (error) => {
  //     const notFoundError = (error?.response?.data?.errors ?? []).find(
  //       ({code}) => code === 'user_not_found',
  //     )

  //     if (notFoundError) {
  //       const {data} = await smoochClient({
  //         method: 'POST',
  //         url: `/v2/apps/${appId}/users`,
  //         data: {
  //           externalId,
  //         },
  //       })

  //       logginJSON('TRIGGER Use created user', {level: 'DEBUG'})

  //       return data.user
  //     }
  //   })

  try {
    await smoochClient({
      method: 'PUT',
      url: `/v1.1/apps/${appId}/appusers/${appUserId}`,
      data: {
        properties: {
          contragentID: externalId,
        },
      },
    })

    return {
      status: 200,
      message: 'User successfully updated',
    }

    // if (user?.id) {
    //   await smoochClient({
    //     method: 'POST',
    //     url: `/v1.1/apps/${appId}/appusers/merge`,
    //     data: {
    //       surviving: {
    //         _id: appUserId,
    //       },
    //       discarded: {
    //         _id: user.id,
    //       },
    //     },
    //   })

    //   return {
    //     status: 200,
    //     message: 'Successfully merged',
    //   }
    // } else {
    //   throw new Error('User not found')
    // }
  } catch (error) {
    return getErrorResponse(error, {status: 400})
  }
}

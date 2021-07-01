import config from '../../config'
import {smoochClient, zendeskClient} from '../../clients'

export const handleAuth = async ({contragentId, ticketId, appUserId}) => {
  const user = await smoochClient(
    `/v2/apps/${config.smooch.appId}/users/${contragentId}`,
  )
    .then(({data}) => data.user)
    .catch(async (error) => {
      const notFoundError = (error?.response?.data?.errors ?? []).find(
        ({code}) => code === 'user_not_found',
      )

      if (notFoundError) {
        const {data} = await smoochClient({
          method: 'POST',
          url: `/v2/apps/${config.smooch.appId}/users`,
          data: {
            externalId: contragentId,
          },
        })

        return data.user
      }
    })

  const userId = user?.id

  if (!userId) throw new Error('User not found')

  if (userId !== appUserId) {
    await smoochClient({
      method: 'POST',
      url: `/v1.1/apps/${config.smooch.appId}/appusers/merge`,
      data: {
        surviving: {
          _id: appUserId,
        },
        discarded: {
          _id: userId,
        },
      },
    })

    // await smoochClient({
    //   method: 'PATCH',
    //   url: `/v2/apps/${config.smooch.appId}/users/${appUserId}`,
    //   data: {
    //     metadata: {
    //       contragentID: contragentId,
    //     },
    //   },
    // })
  }

  await zendeskClient({
    method: 'PUT',
    url: `/api/v2/tickets/${ticketId}`,
    data: {
      ticket: {
        comment: {
          body: 'Клиент авторизован',
        },
      },
    },
  })

  return {
    status: 200,
    message: 'Successfully authorized',
  }
}

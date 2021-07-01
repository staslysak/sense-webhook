import {zendeskClient, smoochClient} from '../../clients'
import {getErrorResponse} from '../../utils'

export const extractData = (body) => {
  try {
    const {
      app: {_id: appId},
      appUser: {_id: appUserId},
      payload: {
        apple: {
          interactiveData: {
            data: {requestIdentifier, listPicker},
          },
        },
      },
    } = body

    const [ticketId] = requestIdentifier.split('-')
    const [reply] = listPicker.sections[0].items
    const [_, richLinkId] = reply.identifier.split('-')

    return {
      appId,
      appUserId,
      ticketId,
      reply: {
        ...reply,
        richLinkId,
      },
    }
  } catch {
    return {}
  }
}

export const handler = async ({appId, appUserId, ticketId, reply}) => {
  try {
    // @ts-ignore
    const {data} = await zendeskClient({
      url: `/api/v2/tickets/${ticketId}`,
      method: 'GET',
    }).catch(() => {})

    const comment = {
      body: reply?.title,
    }

    if (data?.ticket?.requester_id) {
      // @ts-ignore
      comment.author_id = data?.ticket?.requester_id
    }
    // requester_id
    await zendeskClient({
      method: 'PUT',
      url: `/api/v2/tickets/${ticketId}`,
      data: {
        ticket: {
          comment,
        },
      },
    })
  } catch (error) {
    return getErrorResponse(error, {
      status: 400,
      message: 'Item not found or ticket is closed',
    })
  }

  try {
    if (reply.richLinkId) {
      const {data} = await smoochClient(
        `/v1.1/apps/${appId}/templates/${reply.richLinkId}`,
      )

      await smoochClient({
        method: 'POST',
        url: `/v1/apps/${appId}/appusers/${appUserId}/messages/large`,
        data: data.template.message,
      })
    }

    return {
      status: 200,
      message: 'Success',
    }
  } catch (error) {
    return getErrorResponse(error, {
      status: 400,
    })
  }
}

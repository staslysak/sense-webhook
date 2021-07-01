import {Router} from 'express'

import config from '../config'
import {triggers} from '../triggers'
import {logginJSON, filterByKeys} from '../utils'
import {secretValidation} from '../middleware'

const router = Router()

function getTriggerFromBody(req, res, next) {
  const triggerV2 = req.body?.events?.[0]?.type
  const triggerV11 = req.body?.trigger

  res.trigger = triggerV11 || triggerV2 || null
  next()
}

const handleTrigger = (version) => async (req, res) => {
  try {
    const {handler, extractData} = triggers[version][res.trigger]

    logginJSON(req.body, {dir: 'IN', level: 'DEBUG'})

    const extractedData = await extractData(req.body)

    logginJSON(
      {
        version,
        trigger: res.trigger,
        extractedData: filterByKeys(extractedData, ['externalId']),
      },
      {dir: 'IN'},
    )

    const response = await handler(extractedData)

    logginJSON(response, {dir: 'OUT', asString: true})

    res.status(response.status ?? 200).json(response)
  } catch {
    const response = {
      status: 400,
      message: 'Invalid trigger',
    }

    logginJSON(response, {dir: 'OUT', asString: true})

    res.status(response.status).json(response)
  }
}

router
  .route('/v2')
  .post(
    secretValidation(config.secrets.webhookV2),
    getTriggerFromBody,
    handleTrigger('v2'),
  )

router
  .route('/v1.1')
  .post(
    secretValidation(config.secrets.webhookV1),
    getTriggerFromBody,
    handleTrigger('v1.1'),
  )

export default router

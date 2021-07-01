import {Router} from 'express'

import config from '../../config'
import {getErrorResponse, logginJSON, filterByKeys} from '../../utils'
import {handleAuth} from './apple-auth'
import {secretValidation} from '../../middleware'

const router = Router()

const handleAuthRoute = async (req, res) => {
  try {
    logginJSON(filterByKeys(req.body, ['userId']), {dir: 'IN'})

    const response = await handleAuth(req.body)

    logginJSON(response, {dir: 'OUT'})

    res.status(response.status).json(response)
  } catch (error) {
    const response = getErrorResponse(error, {status: 400})
    res.status(response.status).json(response)
  }
}

router
  .route('/auth')
  .post(secretValidation(config.secrets.appleAuth), handleAuthRoute)

export default router

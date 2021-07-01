import {logginJSON} from './utils'

export const secretValidation = (configSecret) => (req, res, next) => {
  const secret = req.headers['x-api-key']

  logginJSON({secret}, {dir: 'IN', level: 'DEBUG'})

  if (secret === configSecret) {
    next()
  } else {
    const response = {
      status: 403,
      message: 'Invalid secret',
    }

    logginJSON(response, {dir: 'OUT', asString: true})

    return res.status(response.status).json(response)
  }
}

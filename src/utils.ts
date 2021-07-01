import config from './config'

interface ErrorResponseDefaults {
  status?: string | number
  message?: string
}

export const getErrorResponse = (
  error: any,
  {status, message = 'error'}: ErrorResponseDefaults,
) => {
  return {
    status: error.response?.status ?? status,
    message:
      error.response?.data?.errors ??
      error.response?.data?.error ??
      error.message ??
      message,
  }
}

interface LogginJSONOptions {
  dir?: string
  level?: string
  asString?: Boolean
}

export const logginJSON = (
  json: object | string,
  {dir, level = 'INFO', asString = false}: LogginJSONOptions = {},
) => {
  if (config.LOG_LEVEL !== level) {
    return
  }

  const args = [
    config.LOG_LEVEL,
    asString
      ? Object.entries(json)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' ')
      : JSON.stringify(json, null, 2),
  ]

  if (dir) {
    args.splice(1, 0, dir)
  }

  console.log(config.APP_VERSION, ...args)
}

export const filterByKeys = (obj = {}, keys = []) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key)) {
      return acc
    } else {
      acc[key] = value
      return acc
    }
  }, {})
}

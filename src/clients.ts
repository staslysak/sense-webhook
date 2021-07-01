import axios from 'axios'
import config from './config'

export const smoochClient = axios.create({
  baseURL: config.smooch.uri,
  auth: {
    username: config.smooch.login,
    password: config.smooch.password,
  },
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const zendeskClient = axios.create({
  baseURL: config.zendesk.uri,
  auth: {
    username: config.zendesk.login,
    password: config.zendesk.password,
  },
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

import dotenv from 'dotenv'

dotenv.config()

const {
  VAULT_HOST,
  VAULT_USER,
  VAULT_PW,

  PORT = 3000,
  LOG_LEVEL = 'INFO',
  APP_VERSION,
  ZENDESK_URL,
  ZENDESK_LOGIN,
  ZENDESK_PASSWORD,
  SMOOCH_KEY_ID,
  SMOOCH_SECRET,
  SMOOCH_APP_ID,
  WEBHOOK_SECRET,
  WEBHOOK_SECRET_V2,
  ES_AUTH_EXCHANGE,
} = process.env

export default {
  VAULT_HOST,
  VAULT_USER,
  VAULT_PW,

  PORT,
  LOG_LEVEL,
  APP_VERSION,

  secrets: {
    appleAuth: ES_AUTH_EXCHANGE,
    webhookV1: WEBHOOK_SECRET,
    webhookV2: WEBHOOK_SECRET_V2,
  },
  zendesk: {
    uri: ZENDESK_URL,
    login: ZENDESK_LOGIN,
    password: ZENDESK_PASSWORD,
  },
  smooch: {
    uri: 'https://api.smooch.io',
    appId: SMOOCH_APP_ID,
    login: SMOOCH_KEY_ID,
    password: SMOOCH_SECRET,
  },
}

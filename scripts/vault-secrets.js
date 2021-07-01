const axios = require('axios')
const fs = require('fs')

const {
  VAULT_HOST,
  VAULT_USER,
  VAULT_PW,
  VAULT_PATH = 'apple-webhook',
} = process.env

const getErrorMessage = (error) => {
  return error.response?.data?.message ?? error.message
}

const getVaultSecrets = async () => {
  try {
    console.log(
      'VAULT CREDENTIALS:',
      JSON.stringify({VAULT_HOST, VAULT_USER, VAULT_PW, VAULT_PATH}, null, 2),
    )

    const {data: authData} = await axios({
      url: `https://${VAULT_HOST}/v1/auth/userpass/login/${VAULT_USER}`,
      method: 'POST',
      data: {
        password: VAULT_PW,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const {data} = await axios({
      url: `https://${VAULT_HOST}/v1/zendesk/data/${VAULT_PATH}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Vault-Token': authData.auth.client_token,
      },
    })

    const secrets = Object.entries(data.data.data)

    if (secrets.length === 0) {
      return console.log('VAULT SECRETS:', 'No Secrets')
    }

    const text = secrets
      .filter(([_, value]) => Boolean(value))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    fs.writeFile('./.env', text, (error) => {
      if (error) {
        return console.log('VAULT ERROR:', getErrorMessage(error))
      }

      console.log('VAULT SECRETS:', 'Secrets has been saved into ".env" file!')
    })
  } catch (error) {
    console.log('VAULT ERROR:', getErrorMessage(error))
  }
}

getVaultSecrets()

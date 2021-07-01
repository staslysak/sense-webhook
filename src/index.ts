import express from 'express'

import config from './config'
import {triggerRoutes, apiRoutes} from './routes'
import {logginJSON} from './utils'

logginJSON(config)

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', triggerRoutes)
app.use('/', apiRoutes)
app.use('*', (_, res) => res.sendStatus(403))

app.listen(config.PORT, () => console.log(`Server is running`))

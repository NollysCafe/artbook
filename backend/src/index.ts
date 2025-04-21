/// <reference path='./types/express.d.ts' />

import 'tsconfig-paths/register'
import App from './config/app'
import { config } from './config/env'
import { log } from './utils/logger'
import { Database } from './config/database'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'


// Create App instance
const app = new App()

// MIDDLEWARES
app.addMiddleware(bodyParser.json())
app.addMiddleware(bodyParser.urlencoded({ extended: true }))
app.addMiddleware(cookieParser())
app.addMiddleware(cors({ origin: config.frontendUrl, credentials: true }))
app.addMiddleware(helmet())
app.addMiddleware(morgan('dev'))

// ROUTES


// Start server
app.start(config.backendPort, async () => {
	const database = Database.getInstance()
	await database.connect()
	await database.test()

	log.success(`[Main] server running at http://localhost:${config.backendPort}`)
})

import express from 'express'
import { log } from '../utils/logger'
import { config } from './env'

import fs from 'fs'
import path from 'path'

import http from 'http'


/**
 * @class
 * @name App
 * @description Class for setting up an Express application
 * @example
 * const app = new App()
 * app.addMiddleware(express.json())
 * app.addRoute('/api', apiRouter)
 * app.start(3000)
 * @see {@link https://expressjs.com/|Express}
 */
export default class App {
	/**
	 * @private
	 * @type {express.Application}
	 * @description Express application instance
	 */
	private app: express.Application
	/**
	 * @private
	 * @type {http.Server}
	 * @description Optional server instance for handling HTTP requests
	 * @default undefined
	 */
	private server?: http.Server

	/**
	 * @constructor
	 */
	constructor() {
		this.app = express()
		this.setupPublicDirectory()
		this.setupMiddlewaresDirectory()
		this.setupRoutesDirectory()
		this.setupModelsDirectory()
	}


	/* ================== SETUP ================== */

	/**
	 * @private
	 * @name setupPublicDirectory
	 * @description Sets up the public directory for serving static files
	 * @example
	 * this.setupPublicDirectory()
	 */
	private setupPublicDirectory() {
		const publicPath = path.resolve(__dirname, '../public')
		if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath)
		this.app.use(express.static(publicPath))
		log.success('[App] Public directory set up')
	}

	/**
	 * @private
	 * @name setupMiddlewaresDirectory
	 * @description Sets up the middlewares directory for custom middleware functions
	 * @example
	 * this.setupMiddlewaresDirectory()
	 */
	private setupMiddlewaresDirectory() {
		const middlewaresPath = path.resolve(__dirname, '../middlewares')
		if (!fs.existsSync(middlewaresPath)) fs.mkdirSync(middlewaresPath)
		log.success('[App] Middlewares directory set up')
	}

	/**
	 * @private
	 * @name setupRoutesDirectory
	 * @description Sets up the routes directory for Express routers
	 * @example
	 * this.setupRoutesDirectory
	 */
	private setupRoutesDirectory() {
		const routesPath = path.resolve(__dirname, '../routes')
		if (!fs.existsSync(routesPath)) fs.mkdirSync(routesPath)
		log.success('[App] Routes directory set up')
	}

	/**
	 * @private
	 * @name setupModelsDirectory
	 * @description Sets up the models directory for database models
	 * @example
	 * this.setupModelsDirectory()
	 */
	private setupModelsDirectory() {
		const modelsPath = path.resolve(__dirname, '../models')
		if (!fs.existsSync(modelsPath)) fs.mkdirSync(modelsPath)
		log.success('[App] Models directory set up')
	}

	/**
	 * @private
	 * @name setupErrorHandlers
	 * @description Sets up error handlers for 404 and 500 errors
	 * @example
	 * this.setupErrorHandlers()
	 */
	private setupErrorHandlers() {
		this.app.use((_: express.Request, response: express.Response) => {
			response.status(404).send('Not found')
		})
		this.app.use((error: any, _: express.Request, response: express.Response, __: express.NextFunction) => {
			log.error('❌ Internal error handler:', error)
			response.status(error.status || 500).json({
				error: error.message || 'Unexpected server error',
				stack: config.env === 'development' ? error.stack : undefined,
			})
		})
		log.success('[App] Error handlers set up')
	}


	/* ================== API ================== */

	/**
	 * @public
	 * @name set
	 * @description Sets a key-value pair in the Express application
	 * @param {string} key - The key to set
	 * @param {any} value - The value to set
	 * @example
	 * import path from 'path'
	 * app.set('publicPath', path.resolve(__dirname, '../public'))
	 */
	public set(key: string, value: any) {
		this.app.set(key, value)
		log.success(`[App] ${key} set`)
	}

	/**
	 * @public
	 * @name addMiddleware
	 * @description Adds a middleware function to the Express application
	 * @param {express.RequestHandler} middleware - The middleware function
	 * @example
	 * import bodyParser from 'body-parser'
	 * app.addMiddleware(bodyParser.json())
	 * import cors from 'cors'
	 * app.addMiddleware(cors())
	 * app.addMiddleware((request, response, next) => { log.success('Middleware function') })
	 */
	public addMiddleware(middleware: express.RequestHandler) {
		this.app.use(middleware)
		log.success(`[App] Middleware "${middleware.name || 'unknown'}" added`)
	}

	/**
	 * @public
	 * @name addRoute
	 * @description Adds a route to the Express application
	 * @param {string} route - The route to add
	 * @param {express.Router} router - The router to add
	 * @example
	 * import api from './api'
	 * app.addRoute('/api', api)
	 */
	public addRoute(route: string, router: express.Router) {
		this.app.use(route, router)
		log.success(`[App] Route "${route}" added`)
	}


	/* ================== SERVER ================== */

	/**
	 * @public
	 * @name start
	 * @description Starts the server on the specified port
	 * @param {number} port - The port to start the server on
	 * @param {Function} callback - The callback function to call after starting the server
	 * @example
	 * app.start(3000)
	 * app.start(3000, (value) => { log.success(value) })
	 * @see {@link https://nodejs.org/api/http.html#http_http_createserver_options_requestlistener|Node.js HTTP}
	 */
	public start(port: number, callback?: (value: any) => void) {
		if (!this.server) {
			this.server = this.app.listen(port, () => { if (callback) callback({ status: 'started' }) })
			this.setupErrorHandlers()
		} else {
			log.error('[App] Server is already running')
		}
	}

	/**
	 * @public
	 * @name stop
	 * @description Stops the server
	 * @param {Function} callback - The callback function to call after stopping the server
	 * @example
	 * app.stop()
	 * app.stop((value) => { log.success(value) })
	 */
	public stop(callback?: (value: any) => void) {
		if (this.server) {
			this.server.close(() => { if (callback) callback({ status: 'stopped' }) })
			this.server = undefined
		} else {
			log.error('[App] Server is not running')
		}
	}
}

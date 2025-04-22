import express from 'express'
import fs from 'fs'
import path from 'path'
import { log } from './logger'

export const loadRoutesFrom = (directory: string): { path: string, router: express.Router }[] => {
	const routes: { path: string, router: express.Router }[] = []

	const files = fs.readdirSync(directory).filter(file => file.endsWith('.ts') || file.endsWith('.js'))

	for (const file of files) {
		const routePath = path.resolve(directory, file)
		const route = require(routePath)

		if (!route?.default || typeof route.default !== 'function') {
			log.error(`[Routes] ❌ ${file} does not export a default Router`)
			continue
		}

		routes.push({
			path: route.path || `/${file.replace(/\.(ts|js)$/, '')}`,
			router: route.default
		})
		log.success(`[Routes] ✅ Loaded ${file}`)
	}

	return routes
}

import express from 'express'
import { Database } from '../config/database'
import { config } from '../config/env'
import fs from 'fs'
import path from 'path'

const router = express.Router()

router.get('/health', async (_request: express.Request, response: express.Response) => {
	let databaseOK = false

	try {
		await Database.getInstance().test()
		databaseOK = true
	} catch {
		databaseOK = false
	}

	response.json({
		status: 'ok',
		env: config.env,
		database: databaseOK ? 'connected' : 'unreachable',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	})
})

router.get('/version', async (_request: express.Request, response: express.Response) => {
	const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))
	const gitHeadPath = path.resolve(__dirname, '../../../.git/HEAD')
	let commit = null

	if (fs.existsSync(gitHeadPath)) {
		const ref = fs.readFileSync(gitHeadPath, 'utf-8').trim()
		const refPath = ref.startsWith('ref:') ? path.resolve(__dirname, '../../../.git', ref.replace('ref: ', '')) : null
		if (refPath && fs.existsSync(refPath)) {
			commit = fs.readFileSync(refPath, 'utf-8').trim()
		} else if (!ref.startsWith('ref:')) {
			commit = ref
		}
	}

	response.json({
		version: packageJson.version,
		commit: commit,
	})
})

export default router

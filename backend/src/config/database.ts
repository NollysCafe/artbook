import { Pool } from 'pg'
import { config } from './env'
import { log } from '../utils/logger'

export class Database {
	private static instance: Database
	private pool: Pool

	private constructor() {
		this.pool = new Pool({
			host: config.database.host,
			port: config.database.port,
			database: config.database.name,
			user: config.database.user,
			password: config.database.password,
			ssl: false,
			max: 10,
			idleTimeoutMillis: 30_000,
			connectionTimeoutMillis: 10_000,
		})

		this._bindEvents()
	}

	private _bindEvents() {
		this.pool.on('error', (error) => log.error('[Database] 💥 PostgreSQL error:', error))
	}

	/**
	 * @returns Singleton instance of the Database
	 */
	public static getInstance(): Database {
		if (!Database.instance) Database.instance = new Database()
		return Database.instance
	}

	/**
	 * @returns Internal Pool instance for direct access
	 */
	public getPool(): Pool {
		return this.pool
	}

	/**
	 * Initializes the DB connection and ensures extensions
	 */
	public async connect() {
		try {
			const client = await this.pool.connect()

			await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
			log.success('[Database] 📡 Connected to PostgreSQL 🎉')

			client.release()
		} catch (error: any) {
			log.error('[Database] ❌ Failed to connect:', error)
			process.exit(1)
		}
	}

	/**
	 * Simple test to check connection health
	 */
	public async test() {
		try {
			await this.pool.query('SELECT NOW()')
			log.success('[Database] ✅ PostgreSQL connection is alive!')
		} catch (error) {
			log.error('[Database] ❌ PostgreSQL test failed:', error)
			process.exit(1)
		}
	}
}

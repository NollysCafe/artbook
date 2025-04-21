import { Database } from '../config/database'
import { log } from '../utils/logger'

type ID = string | number

export abstract class AbstractModel<T extends Record<string, any>> {
	protected abstract table: string
	protected abstract schema: Record<keyof T, string>
	protected pool = Database.getInstance().getPool()
	protected softDeletes = true
	protected hasTimestamps = true

	constructor() {
		this.autoMigrate().catch((error: any) => log.error(`[Model] Failed auto-migrating "${this.table}":`, error))
	}


	/* ========== AUTO MIGRATION ========== */
	private async autoMigrate() {
		try {
			await this.pool.query('BEGIN')

			const fields = Object.entries(this.schema).map(([key, type]) => `"${key}" ${type}`)
			await this.pool.query(`CREATE TABLE IF NOT EXISTS "${this.table}" (${fields.join(', ')})`)
			log.success(`[Model] 🆕 Table "${this.table}" ensured`)

			const existingColumns = await this.pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [this.table])

			const existingNames = existingColumns.rows.map((row) => row.column_name)
			const missingColumns = Object.entries(this.schema).filter(([key]) => !existingNames.includes(key)).map(([key, type]) => ({ key, type }))

			for (const { key, type } of missingColumns) {
				await this.pool.query(`ALTER TABLE "${this.table}" ADD COLUMN "${key}" ${type}`)
				log.success(`[Model] ➕ Column "${key}" added to "${this.table}"`)
			}

			await this.pool.query('COMMIT')
		} catch (error: any) {
			await this.pool.query('ROLLBACK')
			log.error(`[Model] Failed auto-migrating "${this.table}":`, error)
		}
	}


	/* ========== INSERT ========== */
	async create(data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<T> {
		const keys = Object.keys(data)
		const values = Object.values(data)
		const placeholders = keys.map((_, i) => `$${i + 1}`)

		const result = await this.pool.query(
			`INSERT INTO ${this.table} (${keys.join(', ')})
				VALUES (${placeholders.join(', ')})
			 RETURNING *`,
			values
		)

		return result.rows[0]
	}


	/* ========== FIND BY ID ========== */
	async findById(id: ID, includeDeleted?: boolean): Promise<T | null> {
		const query = `SELECT * FROM ${this.table} WHERE id = $1` +
			(this.softDeletes && !includeDeleted ? ' AND deleted_at IS NULL' : '') +
			' LIMIT 1'

		const { rows } = await this.pool.query(query, [id])
		return rows[0] ?? null
	}


	/* ========== FIND ALL ========== */
	async all(includeDeleted = false): Promise<T[]> {
		const query = `SELECT * FROM ${this.table}` +
			(this.softDeletes && !includeDeleted ? ' WHERE deleted_at IS NULL' : '')
		const { rows } = await this.pool.query(query)
		return rows
	}


	/* ========== UPDATE ========== */
	async update(data: Partial<T> & { id: ID }): Promise<T | null> {
		const keys = Object.keys(data).filter(k => !['id', 'created_at', 'updated_at', 'deleted_at'].includes(k))
		if (keys.length === 0) return null

		const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
		const values = keys.map(k => data[k as keyof T])
		values.push(data.id as any)

		const query = `UPDATE ${this.table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`
		const { rows } = await this.pool.query(query, values)
		return rows[0] ?? null
	}


	/* ========== DELETE ========== */
	async delete(id: ID): Promise<boolean> {
		if (this.softDeletes) {
			await this.pool.query(`UPDATE ${this.table} SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id])
		} else {
			await this.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
		}
		return true
	}

	async restore(id: ID): Promise<boolean> {
		if (!this.softDeletes) return false
		await this.pool.query(`UPDATE ${this.table} SET deleted_at = NULL WHERE id = $1`, [id])
		return true
	}


	/* ========== FIND BY ========== */
	async findBy(conditions: Partial<T>, includeDeleted = false): Promise<T[]> {
		const { clause, values } = this.buildWhereClause(conditions)
		const query = `SELECT * FROM ${this.table} WHERE ${clause}` +
			(this.softDeletes && !includeDeleted ? ' AND deleted_at IS NULL' : '')
		const { rows } = await this.pool.query(query, values)
		return rows
	}


	/* ========== COUNT ========== */
	async count(conditions: Partial<T> = {}, includeDeleted = false): Promise<number> {
		const { clause, values } = this.buildWhereClause(conditions)
		const where = clause ? `WHERE ${clause}` : ''
		const query = `SELECT COUNT(*) FROM ${this.table} ${where}` +
			(this.softDeletes && !includeDeleted ? (clause ? ' AND' : ' WHERE') + ' deleted_at IS NULL' : '')

		const { rows } = await this.pool.query(query, values)
		return parseInt(rows[0]?.count ?? '0', 10)
	}


	/* ========== RAW QUERY ========== */
	async raw<R = any>(sql: string, values?: any[]): Promise<R[]> {
		const { rows } = await this.pool.query(sql, values)
		return rows
	}


	/* ========== HELPERS ========== */
	private buildWhereClause(conditions: Partial<T>): { clause: string; values: any[] } {
		const keys = Object.keys(conditions)
		const values = Object.values(conditions)
		const clause = keys.map((k, i) => `${k} = $${i + 1}`).join(' AND ')
		return { clause, values }
	}
}

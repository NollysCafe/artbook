import 'dotenv/config'

export const config = {
	// Environment
	env: process.env.NODE_ENV || 'development',
	backendPort: Number(process.env.BACKEND_PORT!),
	frontendUrl: process.env.FRONTEND_URL!,

	// PostgreSQL Database
	database: {
		type: process.env.DATABASE_TYPE!,
		host: process.env.DATABASE_HOST!,
		port: Number(process.env.DATABASE_PORT!),
		name: process.env.DATABASE_NAME!,
		user: process.env.DATABASE_USER!,
		password: process.env.DATABASE_PASSWORD!,
	},

	// Google Auth
	google: {
		clientId: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
	},

	// Express Session
	session: {
		secret: process.env.SESSION_SECRET!,
	},
}

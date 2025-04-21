/// <reference types='node' />
/// <reference types='express' />

import 'express'

declare global {
	namespace Express {
		interface User {
			id: string
			email: string
			name: string
		}

		interface Viewer {
			token: string
			name: string
			lastname: string
			profession: string
		}

		interface Request {
			user?: User
			session: {
				viewer?: Viewer
			}
		}
	}
}

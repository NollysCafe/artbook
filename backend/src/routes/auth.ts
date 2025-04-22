import express from 'express'
import passport from 'passport'
import { config } from '../config/env'

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/callback', passport.authenticate('google', { failureRedirect: `${config.frontendUrl}/login?error=auth`, session: true }), (_request: express.Request, response: express.Response) => {
	response.redirect(`${config.frontendUrl}/dashboard`)
})

router.post('/logout', (request: express.Request, response: express.Response) => {
	request.logout(() => {
		response.json({ status: 'logged out' })
	})
})

router.get('/me', (request: express.Request, response: express.Response) => {
	if (request.isAuthenticated && request.isAuthenticated() && request.user) {
		response.json({ authenticated: true, user: request.user })
	} else {
		response.status(401).json({ authenticated: false })
	}
})

export default router

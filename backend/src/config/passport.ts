import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from './env'
import { log } from '../utils/logger'

passport.serializeUser((user: Express.User, done) => {
	done(null, user)
})

passport.deserializeUser((user: Express.User, done) => {
	done(null, user)
})

passport.use(
	new GoogleStrategy({
		clientID: config.google.clientId,
		clientSecret: config.google.clientSecret,
		callbackURL: config.google.callbackUrl,
	}, async (_accessToken, _refreshToken, profile, done) => {
		const user = {
			id: profile.id,
			email: profile.emails?.[0].value || '',
			name: profile.displayName,
			avatar: profile.photos?.[0].value || ''
		}
		log.success('[Auth] 🎉 Google login successful:', user)
		done(null, user)
	})
)

export default passport

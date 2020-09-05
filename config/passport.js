const passport = require('passport')
const User = require('../app/models/user')
const auth = require('../app/middleware/auth')
const JwtStrategy = require('passport-jwt').Strategy


const jwtExtractor = (req) => {
  let token = null
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim()
  } else if (req.body.token) {
    token = req.body.token.trim()
  } else if (req.query.token) {
    token = req.query.token.trim()
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token)
  }
  return token
}

const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET
}

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.data._id, (err, user) => {
    if (err) {
      return done(err, false)
    }
    return !user ? done(null, false) : done(null, user)
  })
})

passport.use(jwtLogin)

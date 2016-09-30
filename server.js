
const express = require("express");
const app = express();
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const bodyParser = require("body-parser")
const routes = require('./routes/') // same as ./routes/index.js
const { connect } = require('./db/database')

const port = process.env.PORT || 3000




app.set('view engine', 'pug')

app.locals.user = {email: 'mmeadow33@gmail.com'}
app.locals.errors = {}
app.locals.body = {}
//////middleware//////////


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'loginkey',
}))

app.use((req, res, next) => {
  //Since you are not using passport yet you will need to use session
  app.locals.email = req.session.email
  next()
})

app.use(routes)
/////////set up server/////////////
connect()
  .then(() => {
    app.listen(port, () =>
      console.log(`Listening on port: 3000`)
    )
  })
  .catch(console.error)

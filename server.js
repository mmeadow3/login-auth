
const express = require("express");
const app = express();
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const bodyParser = require("body-parser")
const routes = require('./routes/') // same as ./routes/index.js
const { connect } = require('./db/database')

app.set('view engine', 'pug')
app.locals.body = {} // i.e. value=(body && body.name) vs. value=body.name
//////middleware//////////


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use(session({
  store: new RedisStore(),
  secret: 'secretpassword'
}))

app.use((req, res, next) => {
  app.locals.email = req.session.email
  next()
})
app.use(routes)
/////////set up server/////////////
connect()
  .then(() => {
    app.listen(3000, () =>
      console.log(`Listening on port: 3000`)
    )
  })
  .catch(console.error)

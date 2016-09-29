
const express = require("express");
const app = express();
// const session = require('express-session')
// const RedisStore = require('connect-redis')(session)

const bodyParser = require("body-parser")
const routes = require('./routes/') // same as ./routes/index.js
const { connect } = require('./db/database')

const port = process.env.PORT || 3000
app.set('view engine', 'pug')
app.locals.body = {} // i.e. value=(body && body.name) vs. value=body.name
//////middleware//////////


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// routes
// app.use(session({
//   store: new RedisStore({
//     url: process.env.REDIS_URL || 'redis://localhost:6379',
//   }),
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.SESSION_SECRET || 'loginkey',
// }))



app.use((req, res, next) => {
  app.locals.email = req.user && req.user.email
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

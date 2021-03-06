'use strict'

const { Router } = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const User = require("../models/user")

const router = Router()



router.get('/', (req, res) =>
  res.render('index')
)

.get('/login', (req, res) =>
  res.render('login')
)

router.post('/login', ({ session, body: { email, password } }, res, err) => {
  User.findOne({ email })
    .then(user => {
      if (user) {
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, matches) => {
            if (err) {
              reject(err)
            } else {
              resolve(matches)
            }
          })
        })
      } else {
        res.render('login', { msg: 'Email does not exist in our system' })
      }
    })
    .then((matches) => {
      if (matches) {
        session.email = email
        res.redirect('/')
      } else {
        res.render('login', { msg: 'Password does not match' })
      }
    })
    .catch(err)
})

router.get('/register', (req, res) =>
  res.render('register')
)
router.post('/register', ({ body: { email, password, confirmation } }, res, err) => {
  if (password === confirmation) {
    User.findOne({ email })
      .then(user => {
        if (user) {
          res.render('register', { msg: 'Email is already registered' })
        } else {
          return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
              if (err) {
                reject(err)
              } else {
                resolve(hash)
              }
            })
          })
        }
      })
      .then(hash => User.create({ email, password: hash }))
      .then(() => res.redirect('/login'), { msg: 'User created' })
      .catch(err)
  } else {
    res.render('register', { msg: 'Password & password confirmation do not match' })
  }
})



router.get('/logout', (req, res) =>
  res.render('logout')
)

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err
    res.redirect('/login')
  })
})

module.exports.index = (res, req) => {
  if (req.session.email) {
    res.render('/logout', { page: 'logout'})
  } else {
    res.redirect('/login')
  }
}

module.exports.destroy = (req, res) => {
  req.session.destroy(err => {
    if (err) throw err
    res.redirect('/login')
  })
}

module.exports = router

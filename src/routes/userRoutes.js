const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User  = require('../models/User')

const router = Router()

const SALT_BCRYPT = 10

// signup
router.post('/users/signup', async (req, res) => {
  const { name, email, password } = req.body

  try {
    // verify email already exists
    const userByEmail = await User.findOne({
      email
    })
    if(userByEmail) {
      return res.status(400).json({ message: 'user already exists with email '})
    }

    // create user
    const salt = bcrypt.genSaltSync(SALT_BCRYPT)
    const hash = bcrypt.hashSync(password, salt)
    const passwordHashed = hash
    const user = await User.create({ name, email, password: passwordHashed })

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    }

    res.json(userResponse)
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: 'server error'
    })
  }
})

// login
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body
  try {

    // verify user
    const user = await User.findOne({ email })
    if(!user) {
      return res.status(401).json({ message: 'invalid credentials' })
    }
    const isSamePassword = bcrypt.compareSync(password, user.password)
    if(!isSamePassword) {
      return res.status(401).json({ message: 'invalid credentials' })
    }

    // create token
    const payload = { id: user._id }
    const secretKeyJWT = process.env.SECRET_KEY_JWT
    const expiresInJWT = process.env.EXPIRES_IN_JWT
    const token = jwt.sign(payload, secretKeyJWT, { expiresIn: expiresInJWT })

    res.json({
      token
    })
  } catch(e) {
    console.log(err)
    res.status(500).json({
      message: 'server error'
    })
  }
})

// get users
router.get('/users', async (req, res) => {
  try {
    const users = await User
      .find({ isAdmin: false })
      // .populate('Order')

    const usersResponse = users.map(({
      _id, name, email, cart, notifications, orders
    }) => ({
      id: _id, name, email, cart, notifications, orders
    }))
    res.json(usersResponse)
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: 'server error'
    })
  }
})

// delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById({ _id: id })
    if(!user) {
      return res.status(400).json({ message: 'user not found'})
    }
    await User.deleteOne({
      _id: id
    })
    res.status(204).send()
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: 'server error'
    })
  }
})


// update user
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, password } = req.body
    const user = await User.findById({ _id: id })
    if(!user) {
      return res.status(400).json({ message: 'user not found'})
    }

    // generate password hash
    const salt = bcrypt.genSaltSync(SALT_BCRYPT)
    const hash = bcrypt.hashSync(password, salt)
    const passwordHashed = hash

    await User.updateOne({
      _id: id
    }, { 
      name, 
      email, 
      password: passwordHashed 
    })
    res.status(204).send()
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: 'server error'
    })
  }
})


module.exports = router
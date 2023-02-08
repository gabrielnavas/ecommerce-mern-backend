import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = Schema({
  name: {
    type: String,
    require: [true, 'is required']
  }, 
  email: {
    type: String,
    require: [true, 'is required'],
    unique: true,
    index: true,
    validator: {
      validator: email => {
        return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      },
      message: props => `${props.value} is not valid email`
    },
  },
  password: {
    type: String,
    required: [true, 'is required']
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Object,
    default: {
      total: 0.0,
      count: 0
    }
  },
  notifications: {
    type: Array,
    default: []
  },
  orders: [{
    type: Schema.Types.ObjectId, ref: 'Order'
  }]
}, { minimaze: false })  

const User = mongoose.model('User', UserSchema)

export { User }
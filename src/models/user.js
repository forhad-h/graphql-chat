import mongoose from 'mongoose'
import { hash } from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: email => User.doesNotExist({ email }),
        message: ({ value }) => `Email ${value} already have taken.` // TODO: security
      }
    },
    username: {
      type: String,
      validate: {
        validator: username => User.doesNotExist({ username }),
        message: ({ value }) => `Username ${value} already have taken.` // TODO: security
      }
    },
    name: String,
    password: String
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await hash(this.password, 12)
      next()
    } catch (err) {
      next(err)
    }
  }
  next()
})

userSchema.statics.doesNotExist = async function (options) {
  return (await this.where(options).countDocuments()) === 0
}

const User = mongoose.model('User', userSchema)
export default User

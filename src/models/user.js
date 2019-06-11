import mongoose, { Schema } from 'mongoose'
import { hash, compare } from 'bcryptjs'

const { ObjectId } = Schema.Types

const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: email => User.doesNotExist({ email }),
        message: ({ value }) => `Email already have taken.`
      }
    },
    username: {
      type: String,
      validate: {
        validator: username => User.doesNotExist({ username }),
        message: ({ value }) => `Username already have taken.`
      }
    },
    chats: [
      {
        type: ObjectId,
        ref: 'Chat'
      }
    ],
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

userSchema.methods.matchesPassword = async function (password) {
  return compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
export default User

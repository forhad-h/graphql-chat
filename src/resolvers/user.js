import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-core'
import Joi from '@hapi/joi'

import { signUp, signIn } from '../schemas'
import { User } from '../models'
import { attemptSignIn, signOut } from '../auth'

export default {
  Query: {
    me: async (root, args, { req }, info) => {
      // TODO: projection

      const me = await User.findById(req.session.userId)
      return me
    },
    users: async (root, args, { req }, info) => {
      // TODO: projection, pagination
      const users = await User.find().exec()
      return users
    },
    user: async (root, { id }, { req }, info) => {
      // TODO:projection, sanitization
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`)
      }

      const user = await User.findById(id).exec()
      return user
    }
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      // TODO: not auth

      // validation
      await Joi.validate(args, signUp, { abortEarly: false })

      const user = await User.create(args)
      req.session.userId = user.id
      return user
    },
    signIn: async (root, args, { req }, info) => {
      const { userId } = req.session

      if (userId) {
        const user = await User.findById(userId)
        return user
      }
      // validation
      await Joi.validate(args, signIn, { abortEarly: false })
      const user = await attemptSignIn(args.email, args.password)
      req.session.userId = user.id
      return user
    },
    signOut: async (root, args, { req, res }, info) => {
      const signedOut = await signOut(req, res)
      return signedOut
    }
  }
}

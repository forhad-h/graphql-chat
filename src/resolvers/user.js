import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-core'
import Joi from '@hapi/joi'

import { signUp } from '../schemas'
import { User } from '../models'

export default {
  Query: {
    users: async (root, args, context, info) => {
      // TODO: auth, projection, pagination
      const users = await User.find().exec()
      return users
    },
    user: async (root, { id }, context, info) => {
      // TODO: auth, projection, sanitization
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`)
      }

      const user = await User.findById(id).exec()
      return user
    }
  },
  Mutation: {
    signUp: async (root, args, context, info) => {
      // TODO: not auth

      // validation
      await Joi.validate(args, signUp, { abortEarly: false })

      const user = await User.create(args)
      return user
    }
  }
}

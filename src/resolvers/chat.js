import Joi from '@hapi/joi'

import { Chat, User, Message } from '../models'
import { startChat } from '../schemas'
import { UserInputError } from 'apollo-server-core'

export default {
  Mutation: {
    startChat: async (root, args, { req }, info) => {
      const { userId } = req.session
      const { title, userIds } = args

      await Joi.validate(args, startChat(userId), { abortEarly: false })

      const idsFound = await User.where('_id')
        .in(userIds)
        .countDocuments()

      if (idsFound !== userIds.length) {
        throw new UserInputError('One or more User IDs are invalid')
      }

      userIds.push(userId)
      const chat = await Chat.create({ title, users: userIds })

      await User.updateMany(
        { _id: { $in: userIds } },
        {
          $push: { chats: chat }
        }
      ).exec()

      return chat
    }
  },
  Chat: {
    messages: async (chat, args, context, info) => {
      // TODO: pagination, projection
      const messages = await Message.find({ chat: chat.id }).exec()
      return messages
    },
    users: async (chat, args, context, info) => {
      return (await chat.populate('users').execPopulate()).users
    },
    lastMessage: async (chat, args, context, info) => {
      return (await chat.populate('lastMessage').execPopulate()).users
    }
  }
}

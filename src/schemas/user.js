import Joi from '@hapi/joi'

const email = Joi.string()
  .email()
  .required()
  .label('Email')

const username = Joi.string()
  .alphanum()
  .min(4)
  .max(30)
  .required()
  .label('Username')

const name = Joi.string()
  .max(254)
  .required()
  .label('Name')

const password = Joi.string()
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
  .label('Password')
  .required()
  .options({
    language: {
      string: {
        regex: {
          base:
            'Must have one lowercase character, one uppercase character, one number, one special character, and length at least 8'
        }
      }
    }
  })

export const signUp = Joi.object().keys({
  email,
  username,
  name,
  password
})

export const signIn = Joi.object().keys({
  email,
  password
})

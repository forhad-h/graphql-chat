import Joi from '@hapi/joi'

export default Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .label('Email'),
  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required()
    .label('Username'),
  name: Joi.string()
    .max(254)
    .required()
    .label('Name'),
  password: Joi.string()
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
})

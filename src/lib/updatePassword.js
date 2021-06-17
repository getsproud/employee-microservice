import bcrypt from 'bcryptjs'
import Employee from '../models/employee'
import passwordValidator from './passwordValidator'

const salt = bcrypt.genSaltSync(10)

const updatePassword = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'employee',
    i18n: 'EMPLOYEE_CREATION_FAILURE',
    data: {},
    code: 500,
    stack: null,
    error: null
  }

  const validPassword = passwordValidator(query.password)

  if (validPassword.length > 0) {
    message.code = 400
    message.i18n = 'INVALID_PASSWORD'
    message.error = validPassword

    return reject(message)
  }

  return (async () => {
    let hash

    try {
      hash = await bcrypt.hash(query.password, salt)
      query.password = hash
    } catch (e) {
      message.code = 500
      message.i18n = 'HASHING_FAILED'
      message.error = e.message
      message.stack = e.stack

      return reject(message)
    }

    try {
      await Employee.findOneAndUpdate({ _id: query._id }, { password: hash }, { new: true })

      message.i18n = 'PASSWORD_UPDATE_SUCCESS'
      message.code = 204

      return resolve(message)
    } catch (e) {
      message.i18n = 'PASSWORD_UPDATE_FAILURE'
      message.stack = e.stack
      message.error = e.message

      return reject(message)
    }
  })()
})

export default updatePassword

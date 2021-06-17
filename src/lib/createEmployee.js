import bcrypt from 'bcryptjs'
import passwordValidator from './passwordValidator'

import Employee from '../models/employee'
import ServiceClient from '../services/client'

const client = new ServiceClient('company')

const salt = bcrypt.genSaltSync(10)

const createEmployee = call => new Promise((resolve, reject) => {
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
    let company

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
      const args = { _id: query.company }

      company = await client.send({ type: 'findBy', query: args })
      query.internalEmail = `${Math.random().toString(36).substr(2, 9)}--${company.data.domain}@sproud.io`
    } catch (e) {
      message.i18n = 'EMPLOYEE_CREATION_FAILED'
      message.stack = e.stack
      message.error = e.message

      return reject(message)
    }

    query._id = undefined
    query.identifier = query.identifier.toLowerCase()

    try {
      const employee = await Employee.create(query)

      message.i18n = 'EMPLOYEE_CREATION_SUCCESS'
      message.code = 204
      message.data = {
        _id: employee._id
      }

      return resolve(message)
    } catch (e) {
      message.i18n = 'EMPLOYEE_CREATION_FAILED'
      message.stack = e.stack
      message.error = e.message

      return reject(message)
    }
  })()
})

export default createEmployee

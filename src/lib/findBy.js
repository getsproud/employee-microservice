import Employee from '../models/employee'

const findBy = call => new Promise((resolve, reject) => {
  const { query, password } = call

  const message = {
    domain: 'employee',
    i18n: 'EMPLOYEE_ERROR',
    data: {},
    code: 500,
    stack: null,
    error: null
  }

  Employee.findOne(query).select(`${password ? '+' : '-'}password`).exec()
    .then(employee => {
      message.data = employee

      if (!employee) {
        message.i18n = 'EMPLOYEE_NOT_FOUND'
        message.code = 404

        return reject(message)
      }

      message.i18n = 'EMPLOYEE_FOUND'
      message.code = 200

      return resolve(message)
    })
    .catch(err => {
      message.stack = err.stack
      message.error = err.message

      return reject(message)
    })
})

export default findBy

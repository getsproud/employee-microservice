import Employee from '../models/employee'

const updateEmployee = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'employee',
    i18n: 'EMPLOYEE_UPDATE_FAILURE',
    data: {},
    code: 500,
    stack: null,
    error: null
  }

  // delete password just for safety reason
  query.password = undefined
  delete query.password

  Employee.findOneAndUpdate({ _id: query._id }, query, { new: true }).then(employee => {
    if (!employee) {
      message.i18n = 'EMPLOYEE_NOT_FOUND'
      message.code = 404

      return reject(message)
    }

    message.i18n = 'EMPLOYEE_UPDATE_SUCCESS'
    message.code = 200
    message.data = employee

    return resolve(message)
  }).catch(e => {
    message.stack = e.stack
    message.error = e.message

    return reject(message)
  })
})

export default updateEmployee

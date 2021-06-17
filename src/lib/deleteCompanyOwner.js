import Employee from '../models/employee'

const deleteCompanyOwner = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'employee',
    i18n: 'EMPLOYEE_ERROR',
    data: null,
    code: 500,
    stack: null,
    error: null
  }

  Employee.findOne({ _id: query._id, company: query.company }).exec().then(employee => {
    if (!employee) {
      message.code = 404
      message.i18n = 'EMPLOYEE_NOT_FOUND'

      return reject(message)
    }

    if (employee.roles.indexOf('owner') === -1) {
      message.code = 403
      message.i18n = 'EMPLOYEE_DELETION_DECLINED'

      return reject(message)
    }

    return Employee.deleteOne({ _id: query._id }).then(() => {
      message.code = 204
      message.i18n = 'EMPLOYEE_DELETION_SUCCESS'

      return resolve(message)
    })
  }).catch(err => {
    message.code = 500
    message.i18n = 'EMPLOYEE_DELETION_FAILURE'
    message.error = err.message
    message.stack = err.stack
  })
})

export default deleteCompanyOwner

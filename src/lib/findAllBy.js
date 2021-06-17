import Employee from '../models/employee'

const findAllBy = call => new Promise((resolve, reject) => {
  const {
    query, password, options, useResolve
  } = call

  const message = {
    domain: 'employee',
    i18n: 'EMPLOYEES_ERROR',
    data: [],
    code: 500,
    stack: null,
    error: null
  }

  const opts = {
    page: options.page || 1,
    limit: options.limit || 12,
    pagination: options.pagination || true
  }

  opts.select = `${password ? '+' : '-'}password`

  Employee.paginate(query, opts)
    .then(employees => {
      message.data = employees

      if (!employees.docs || !employees.docs.length) {
        message.i18n = 'EMPLOYEES_NOT_FOUND'
        message.code = 404

        return !useResolve ? reject(message) : resolve(message)
      }

      message.i18n = 'EMPLOYEES_FOUND'
      message.code = 200

      return resolve(message)
    })
    .catch(err => {
      message.stack = err.stack
      message.error = err.message

      return reject(message)
    })
})

export default findAllBy

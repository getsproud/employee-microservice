import { Responder } from 'cote'
import { connect } from 'mongoose'

import findBy from './lib/findBy'
import findAllBy from './lib/findAllBy'
import createEmployee from './lib/createEmployee'
import deleteEmployee from './lib/deleteEmployee'
import updateEmployee from './lib/updateEmployee'
import deleteCompanyOwner from './lib/deleteCompanyOwner'
import updatePassword from './lib/updatePassword'

const PORT = 50051

const connectRetry = t => {
  let tries = t

  return connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .catch(e => {
      if (tries < 5) {
        tries += 1
        setTimeout(() => connectRetry(tries), 5000)
      }

      throw new Error(e)
    })
}

connectRetry(0)

try {
  const responder = new Responder({
    name: 'Employee Service', port: PORT, key: 'employee'
  })

  responder.on('findBy', findBy)
  responder.on('findAllBy', findAllBy)
  responder.on('createEmployee', createEmployee)
  responder.on('deleteEmployee', deleteEmployee)
  responder.on('updateEmployee', updateEmployee)
  responder.on('deleteCompanyOwner', deleteCompanyOwner)
  responder.on('updatePassword', updatePassword)

  responder.on('liveness', () => new Promise(resolve => resolve(200)))
  responder.on('readiness', () => new Promise(resolve => resolve(200)))

  // eslint-disable-next-line
  console.log(`🤩 Employee Microservice bound to port ${PORT}`)
} catch (e) {
  // eslint-disable-next-line
  console.error(`${e.message}`)
  throw new Error(e)
}

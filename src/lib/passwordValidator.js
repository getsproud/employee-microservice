const PasswordValidator = require('password-validator')

const schema = new PasswordValidator()

schema
  .is().min(8)
  .is().max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .symbols()
  .has()
  .digits()
  .has()
  .not()
  .spaces()

const validate = password => schema.validate(password, { list: true })

module.exports = validate

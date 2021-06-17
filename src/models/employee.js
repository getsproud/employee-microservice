import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const schema = new Schema({
  identifier: {
    type: Schema.Types.String,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: Schema.Types.String,
    required: true
  },
  firstname: Schema.Types.String,
  lastname: Schema.Types.String,
  internalEmail: Schema.Types.String,
  gender: {
    type: Schema.Types.String,
    enum: ['male', 'female', 'other']
  },
  position: Schema.Types.String,
  roles: {
    type: [Schema.Types.String],
    enum: ['hr', 'finance', 'admin', 'owner', 'superadmin', 'employee', 'lead']
  },
  interests: [Schema.Types.ObjectId],
  department: Schema.Types.ObjectId,
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  activated: {
    type: Schema.Types.Boolean,
    default: false
  }
}, { timestamps: true })

schema.plugin(mongoosePaginate)
const Employee = model('employee', schema)

export default Employee

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB', result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const entriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (value) {
        return /^(?:\d{2,3})-\d{5,}$/.test(value)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Format: XX-XXXXXX or XXX-XXXXX`,
    },
  },
})

entriesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Entries', entriesSchema)

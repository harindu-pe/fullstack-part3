const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://harindupe:${password}@fullstackopen.mpojk.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const entriesSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entries = mongoose.model('Entries', entriesSchema)

if (process.argv.length === 3) {
  Entries.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((note) => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const entries = new Entries({
    name: name,
    number: number,
  })

  entries.save().then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

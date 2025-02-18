require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
const Entries = require('./models/entry')

// morgan
morgan.token('data', function (req, res) {
  console.log(req, res)
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.get('/info', (req, res, next) => {
  console.log(req)
  const serverTime = new Date()

  Entries.find({})
    .then((persons) => {
      const html = `Phonebook has info for ${persons.length} people <br/><br/> ${serverTime}`
      res.send(html)
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (req, res, next) => {
  console.log(req)
  Entries.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Entries.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const entry = {
    name: body.name,
    number: body.number || false,
  }

  Entries.findByIdAndUpdate(req.params.id, entry, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }

  const entry = new Entries({
    name: body.name,
    number: body.number || false,
  })

  entry
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Entries.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result)
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// error handling
const errorHandler = (error, req, res, next) => {
  console.log(req)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// connecting app to port
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

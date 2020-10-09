require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const  Person = require('./models/person')
const  personSchemaJson = require('./models/personSchemaJson')
// const { response } = require('express')
const uniqueValidator = require('mongoose-unique-validator')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', function(req, res) { if(req.body.name){return JSON.stringify(req.body)}})
app.use(morgan(':method :url :status length: :req[content-length] :response-time ms :body'))

// app.get('/', (res) => {
//   res.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById (req.params.id)
    .then(person => {
      if (person) {res.json(person)}
      else {res.status(404).end()}
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/info', (req, res) => {
  Person.find({}).then(people => {
    const bookLength = people.length
    let time = new Date()
    res.send(`
      <p>Phonebook has info for ${bookLength} persons</p>
      <p>${time}</p>
      `)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req,res, next) => {
  const body = req.body
  // const updatedPerson = req.body.id
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    }) }
  else {
    const person = {
      name: body.name,
      number: body.number
    }
    Person.findByIdAndUpdate( req.body.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const personSchema = new mongoose.Schema(personSchemaJson)
  personSchema.plugin(uniqueValidator)
  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => {
      console.log(error.message)
      response.status(400).json({
        error: error.message
      }
      )
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
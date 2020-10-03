const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')
app.use(express.json())
app.use(cors())

morgan.token('body', function(req, res) { if(req.body.name){return JSON.stringify(req.body)}});
app.use(morgan(':method :url :status length: :req[content-length] :response-time ms :body'));

let persons = 
[
{
    name: "Arto Hellas",
    number: "9393939",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "123",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "asdasdsad",
    number: "2342345234",
    id: 4
  }
]
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })  

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/api/info', (req, res) => {

    bookLength=persons.length
    console.log(bookLength)

    let time = new Date()
    res.send(`
        <p>Phonebook has info for ${bookLength} persons</p>
        <p>${time}</p>
    
    `)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    person = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })

  const generateId = () => {
    return Math.floor(Math.random() * 1000000000000)
  }

  app.post('/api/persons', (request, response) => {
    
    const body = request.body
    const name = body.name
    const isPersonAlready = persons.some(x => x.name === name)
    console.log('Already:', isPersonAlready)

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
      } else if (isPersonAlready === true){
        return response.status(400).json({ 
         error: 'name must be unique'   
        })
    }
    
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(newPerson)
    
    response.json(newPerson)

  })
  

  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
// mongo "mongodb+srv://cluster0.5olyg.mongodb.net/<dbname>" --username admin-antti
// pw: 
// mongodb+srv://admin-antti:${password}@cluster0.5olyg.mongodb.net/phonebook?retryWrites=true&w=majority

const password = process.argv[2]

const url =
  `mongodb+srv://admin-antti:${password}@cluster0.5olyg.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

// const addPerson = new Person({
//   name: 'Wilkku Tipsilä',
//   number: '040 433 2345',
// })

// addPerson.save().then(response => {
//   console.log('number saved!')
//   mongoose.connection.close()
// })

Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
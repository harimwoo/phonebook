const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :response-time ms - :body'))




app.get('/', (req, res) => {
    res.send('<h1>BYEBYE World</h1>')
})

app.get('/info', (req, res) => {
    const num = `Phonebook has info for ${persons.length} people`
    const date = new Date()
    res.send(`${num} <br/> ${date}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
     res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0 
            ? Math.max(...persons.map(n => n.id)) 
            : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const notRepeat = (persons.find(person => body.name === person.name)) == null
 
    if(!body || !body.name || !body.number){
        return res.status(400).json({
            error: 'entry missing'
        })
    }

    if(!notRepeat){
        return res.status(400).json({
            error: 'entry must be unique'
        })
    }

    const person = {
        "name": body.name,
        "number": body.number,
        "id": generateId()
    }
    
    persons = persons.concat(person)

    res.json(person)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON ${PORT} `)
})

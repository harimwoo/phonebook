import { useState, useEffect } from 'react'
import {PersonForms, Filter, Persons, Notify} from './components/PersonForms'
import noteServices from './services/note'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [input, setInput] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    noteServices.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const handleDelete = (person) => {
    const temp = person.id
    window.confirm(`delete ${person.name}?`)
    axios.delete(`http://localhost:3001/persons/${temp}`)
      .then(() => {
        setPersons(persons.filter(person => person.id !== temp))
      })
    setAlertMessage(`${person.name} DELETED`)
    setInterval(() => setAlertMessage(''), 3000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notify alertMessage={alertMessage} />
      <Filter input={input} setInput={setInput}/>
      <h2>Add New</h2>
      <PersonForms persons={persons} setPersons={setPersons}
                   newName={newName} setNewName={setNewName} 
                   newNumber={newNumber} setNewNumber={setNewNumber}
                   setAlertMessage={setAlertMessage} />
      <h2>Numbers</h2>
      <Persons persons={persons} input={input} handleDelete={handleDelete}/>
    </div>
  )
}


export default App
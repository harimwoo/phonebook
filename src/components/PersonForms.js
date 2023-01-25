import noteServices from '../services/note'
import {useState} from 'react'
import axios from 'axios'

const PersonForms = ({persons, setPersons, newName, setNewName, newNumber, setNewNumber, setAlertMessage}) => {

    const addNew = (event) => {
      event.preventDefault()
      for(let i = 0; i < persons.length; i++){
        if(persons[i].name === newName){
          if(persons[i].number !== newNumber){
            window.confirm(`${newName} is already added to the phonebook, replace old number with a new one?`)
            const changedPerson = {...persons[i], number : newNumber}
            noteServices
              .update(persons[i].id, changedPerson)
              .then(returnedPerson => {
                setPersons(persons.map(p => p.id !== persons[i].id ? p : returnedPerson))
              })
            setAlertMessage(`${newName}'s number has been updated`)
            setInterval(() => setAlertMessage(''), 3000)
            setNewName('')
            setNewNumber('')
            return
          }
          else{
            window.alert(`${newName} is already on the phonebook`)
            setNewName('')
            setNewNumber('')
            return
          }
        }
      }
      const personObj = {name: newName, number: newNumber}
      noteServices
        .create(personObj)
        .then(returnedPerson => {
          setPersons(persons.concat(personObj))
          setAlertMessage(`${personObj.name} HAS BEEN ADDED`)
          setInterval(() => setAlertMessage(''), 3000)
          setNewName('')
          setNewNumber('')
        })
    }

    const handleNewName = (event) => {
      setNewName(event.target.value)
    }
    const handleNewNumber = (event) => {
      setNewNumber(event.target.value)
    }
    return(
      <form onSubmit={addNew}>
      <div>name: <input value={newName} onChange={handleNewName} /></div>
      <div>number: <input value={newNumber} onChange={handleNewNumber} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    )
  }

  const Filter = ({input, setInput}) => {
    return (
      <div>filter shown with <input value={input} onChange={(event)=> setInput(event.target.value)}/></div>)
  }
  
  const Persons = ({persons, input, handleDelete}) => {
    return (persons.map((person, i) => {
      const copy = person.name.toLowerCase()
      if(copy.includes(input)){
        return (
          <div key={i}>
            {person.name} {person.number}
            <br/>
            <button onClick={() => handleDelete(person)}>delete</button>
          </div>
        )
      }
    }))
  }


  const Notify = ({alertMessage}) => {
    if(alertMessage === ""){
      return null
    }
    return (
      <div className='alert'>{alertMessage}</div>
    )
  }


  export {PersonForms, Filter, Persons, Notify}
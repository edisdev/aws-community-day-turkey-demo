import { API } from 'aws-amplify'
import { useEffect, useState } from "react"
import styles from '../styles/Todos.module.css'

import { listTodos } from "../graphql/queries"
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations'

const TodoList = function ({ todoItems, updateTodoItem, deleteTodoItem }) {
  return todoItems.map(todo => {
    return <div
      key={todo.id}
      className={styles.TodoItem}
      data-done={todo.isDone}>
      <div className={styles.Area}>
        <button
          className={styles.CheckBox}
          onClick={() => updateTodoItem(todo)}></button>
        <span>{todo.name}</span>
      </div>
      <button
        className={styles.DeleteButton}
        onClick={() => deleteTodoItem(todo)}> x
      </button>
    </div>
  })
}


export default function Todos() {
  const [todoItems, setTodoItems] = useState([])
  const [newTodo, setNewTodo] = useState('')

  const updateTodoItem = async function (todo) {
    let updatedTodo = todoItems.find(t => t.id === todo.id)
    if (updatedTodo) {
      const index = todoItems.findIndex(t => t.id === todo.id)
      updatedTodo.isDone = !todo.isDone
      let result = await API.graphql({
        query: updateTodo,
        variables: {
          input: {
            id: updatedTodo.id,
            name: updatedTodo.name,
            isDone: updateTodo.isDone
          }
        }
      })
      if (!result.errors) {
        todoItems.splice(index, 1, updatedTodo)
        setTodoItems([...todoItems])
      }
    }
  }

  const deleteTodoItem = async function (todo) {
    let result = await API.graphql({
      query: deleteTodo,
      variables: {
        input: {
          id: todo.id
        }
      }
    })
    if (!result.errors) {
      let deletedIndex = todoItems.findIndex(t => t.id === todo.id)
      todoItems.splice(deletedIndex, 1)
      setTodoItems([...todoItems])
    }
  }

  const createNewTodo = async () => {
    let newItem = {
      name: newTodo,
      isDone: false
    }
    let result = await API.graphql({
      query: createTodo,
      variables: {
        input: newItem
      }
    })
    if (!result.errors) {
      todoItems.unshift({ ...result.data.createTodo })
      setTodoItems([...todoItems])
      setNewTodo('')
    }
  }

  const enterNewTodo = (e) => {
    if (e.key === "Enter" && newTodo) {
      createNewTodo()
    }
  }

  useEffect(async () => {
    let result = await API.graphql({
      query: listTodos
    })
    if (!result.errors) {
      setTodoItems(result.data.listTodos.items)
    }
  }, [])

  return <div className={styles.Todos}>
    <div className={styles.FormArea}>
      <input
        autoComplete="off"
        name="todo"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={(e) => enterNewTodo(e)}
      />
      <button
        onClick={createNewTodo}
        disabled={!newTodo}>
         + 
      </button>
    </div>
    <TodoList todoItems={todoItems} updateTodoItem={updateTodoItem} deleteTodoItem={deleteTodoItem} />
  </div>
}
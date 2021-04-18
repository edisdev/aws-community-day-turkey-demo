import { API } from 'aws-amplify'
import { useEffect, useState } from "react"
import styles from '../styles/Todos.module.css'

import { listTodos } from "../graphql/queries"
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations'
import { onCreateTodo, onUpdateTodo, onDeleteTodo } from '../graphql/subscriptions'
import Loading from './Loading'

const TodoList = function ({ todoItems, updateTodoItem, deleteTodoItem, updatingData, deletingData }) {
  return todoItems.map(todo => {
    let isDeleting = deletingData.isLoading && deletingData.id === todo.id 
    let isUpdating = updatingData.isLoading && updatingData.id === todo.id 
    return <div
      key={todo.id}
      className={styles.TodoItem}
      data-done={todo.isDone}>
      <div className={styles.Area}>
        <button
          className={styles.CheckBox}
          onClick={() => updateTodoItem(todo)}>
            {isUpdating ? <Loading/>: <div className={styles.CheckBox_Tick}></div> }
          </button>
        <span>{todo.name}</span>
      </div>
      <button
        className={styles.DeleteButton}
        onClick={() => deleteTodoItem(todo)}>
          {isDeleting ? <Loading/> : <span>x</span>}
      </button>
    </div>
  })
}


export default function Todos() {
  const [todoItems, setTodoItems] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [deletingData, setDeletingData] = useState({ id: null, isLoading: false })
  const [updatingData, setUpdatingData] = useState({ id: null, isLoading: false })
  const [isCreating, setCreating] = useState(false)


  const fetchTodos = async () => {
    let result = await API.graphql({
      query: listTodos
    })
    if (!result.errors) {
      setTodoItems(result.data.listTodos.items)
    }
  }


  function subscribe() {
    const createSub = API.graphql({
      query: onCreateTodo 
    })
    .subscribe({
      next: (data) => {
        fetchTodos()
      }
    })

    const updateSub = API.graphql({
      query: onUpdateTodo 
    })
    .subscribe({
      next: (data) => {
        fetchTodos()
      }
    })

    const deleteSub = API.graphql({
      query: onDeleteTodo 
    })
    .subscribe({
      next: (data) => {
        fetchTodos()
      }
    })

    const subscriptions = [createSub, updateSub, deleteSub]

    return () => subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  const updateTodoItem = async (todo) => {
    setUpdatingData({ id: todo.id, isLoading: true })
    let result = await API.graphql({
      query: updateTodo,
      variables: {
        input: {
          id: todo.id,
          name: todo.name,
          isDone: !todo.isDone
        }
      }
    })
    setUpdatingData({ id: null, isLoading: false })
  }

  const deleteTodoItem = async (todo) => {
    setDeletingData({ id: todo.id, isLoading: true })
    await API.graphql({
      query: deleteTodo,
      variables: {
        input: {
          id: todo.id
        }
      }
    })
    setDeletingData({ id: null, isLoading: false })
  }

  const createNewTodo = async () => {
    setCreating(true)
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
      setNewTodo('')
    }
    setCreating(false)
  }

  const enterNewTodo = (e) => {
    if (e.key === "Enter" && newTodo) {
      createNewTodo()
    }
  }

  useEffect(async () => {
    await fetchTodos()
    const unsubscribe = subscribe()
    return unsubscribe
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
        disabled={!newTodo || isCreating}>
          {isCreating ? <Loading/>: <span>+</span>}
      </button>
    </div>
    <TodoList
      todoItems={todoItems}
      updateTodoItem={updateTodoItem}
      deleteTodoItem={deleteTodoItem}
      updatingData={updatingData}
      deletingData={deletingData}/>
  </div>
}
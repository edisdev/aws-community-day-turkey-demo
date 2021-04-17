import { useState } from "react"
import styles from '../styles/Todos.module.css'
import todos from "../mocks/todos"

const TodoList = function ({ todoItems, updateTodo, deleteTodo }) {
  return todoItems.map(todo => {
    return <div
      key={todo.id}
      className={styles.TodoItem}
      data-done={todo.isDone}>
      <div className={styles.Area}>
        <button
          className={styles.CheckBox}
          onClick={() => updateTodo(todo)}></button>
        <span>{todo.name}</span>
      </div>
      <button
        className={styles.DeleteButton}
        onClick={() => deleteTodo(todo)}> x
      </button>
    </div>
  })
}


export default function Todos() {
  const [todoItems, setTodoItems] = useState(todos)
  const [newTodo, setNewTodo] = useState('')

  const updateTodo = function (todo) {
    let updatedTodo = todoItems.find(t => t.id === todo.id)
    if (updatedTodo) {
      const index = todoItems.findIndex(t => t.id === todo.id)
      updatedTodo.isDone = !todo.isDone
      todoItems.splice(index, 1, updatedTodo)
      setTodoItems([...todoItems])
    }
  }

  const deleteTodo = function (todo) {
    let deletedIndex = todoItems.findIndex(t => t.id === todo.id)
    todoItems.splice(deletedIndex, 1)
    setTodoItems([...todoItems])
  }

  const createTodo = () => {
    todoItems.unshift({
      id: `t_d_${todoItems.length + 1}`,
      name: newTodo,
      isDone: false
    })
    setTodoItems([...todoItems])
    setNewTodo('')
  }

  const enterNewTodo = (e) => {
    if (e.key === "Enter" && newTodo) {
      createTodo()
    }
  }

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
        onClick={createTodo}
        disabled={!newTodo}>
         + 
      </button>
    </div>
    <TodoList todoItems={todoItems} updateTodo={updateTodo} deleteTodo={deleteTodo} />
  </div>
}
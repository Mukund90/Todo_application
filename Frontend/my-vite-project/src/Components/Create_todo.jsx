import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const Create_todo = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editTodo, setEditTodo] = useState(null);

  const get_todos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/');
      setTodos(response.data.todos.map(todo => ({ ...todo, done: todo.done || false })));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    get_todos();
  }, []);

  const addTodo = async () => {
    if (title && description) {
      const newTodo = { title, description };
      try {
        await axios.post('http://localhost:3000/todos', newTodo);
        setTitle('');
        setDescription('');
        get_todos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    } else {
      alert('Please fill in both fields');
    }
  };

  const update_todos = async () => {
    if (title && description && editTodo) {
      const updatedTodo = { title, description };
      try {
        await axios.put(`http://localhost:3000/update/${editTodo._id}`, updatedTodo);
        setTitle('');
        setDescription('');
        setEditTodo(null);
        get_todos();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    } else {
      alert('Please fill in both fields');
    }
  };

  const delete_todos = (id) => {
    try {
      axios.delete(`http://localhost:3000/delete/${id}`)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        });
    } catch (err) {
      console.log('Error deleting todo:', err);
    }
  };

  const mark_as_done = (id) => {
    setTodos(prevTodos => prevTodos.map(todo =>
      todo._id === id ? { ...todo, done: true } : todo
    ));
  };

  return (
    <div className="todo-container">
      <h1>Simple Todos Application</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {editTodo ? (
        <button onClick={update_todos}>Update Todo</button>
      ) : (
        <button onClick={addTodo}>Add Todo</button>
      )}
      <ul className="todo-list">
        {todos.map((item) => (
          <div className="todo-item" key={item._id}>
            <li><strong>Title:</strong> {item.title}</li>
            <li><strong>Description:</strong> {item.description}</li>
            <button onClick={() => mark_as_done(item._id)} disabled={item.done}>
              {item.done ? 'Done' : 'Mark as Done'}
            </button>
            <button
              onClick={() => {
                setEditTodo(item);
                setTitle(item.title);
                setDescription(item.description);
              }}
            >
              Update Todo
            </button>
            <button onClick={() => delete_todos(item._id)}>
              Delete Todo
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Create_todo;

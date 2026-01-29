import { useEffect, useState } from "react";
import axios from "axios";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("TODO RESPONSE: ", res.data);
      setTodos(res.data);
    } catch (error) {
      alert("Not authorized or token expired");
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/todos",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle("");
      fetchTodos();
    } catch (error) {
      alert("Error creating todo");
    }
  };

  return (
    <div>
      <h2>My Todos</h2>

      <form onSubmit={createTodo}>
        <input
          placeholder="New todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>Add</button>
      </form>

      <ul>
        {Array.isArray(todos) && todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (!title.trim()) {
      setError("Please enter a task");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/tasks/${editId}`, { title: title.trim() });
      } else {
        await axios.post(`${API}/tasks`, { title: title.trim() });
      }
      
      setTitle("");
      setEditId(null);
      setError("");
      await fetchTasks();
    } catch (err) {
      setError("Failed to save task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API}/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setTitle("");
    setEditId(null);
    setError("");
  };

  return (
    <div className="container">
      <div className="todo-card">
        <div className="header">
          <h1>Task Manager</h1>
          <p className="subtitle">Organize your day</p>
        </div>

        <div className="input-section">
          <div className="input-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOrUpdateTask()}
              placeholder="What needs to be done?"
              disabled={loading}
              autoFocus
            />
            {editId && (
              <button className="btn-cancel" onClick={cancelEdit}>
                Cancel
              </button>
            )}
            <button 
              className={editId ? "btn-update" : "btn-add"} 
              onClick={addOrUpdateTask}
              disabled={loading}
            >
              {loading ? "..." : editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="stats">
          <span>📋 Total: {tasks.length}</span>
          <span>✅ Completed: 0</span>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No tasks yet</p>
            <small>Add your first task above</small>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <span className="task-text">{task.title}</span>
                <div className="task-actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => editTask(task)}
                    disabled={loading}
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => deleteTask(task.id)}
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
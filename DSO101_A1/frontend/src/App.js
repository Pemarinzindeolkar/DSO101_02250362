import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API}/api/todos`);
      const data = await res.json();
      setTodos(data);
    } catch { setError("Could not connect to backend."); }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(`${API}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      const data = await res.json();
      setTodos([data, ...todos]);
      setNewTitle("");
    } catch { setError("Failed to add todo."); }
  };

  const toggleComplete = async (todo) => {
    try {
      const res = await fetch(`${API}/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updated = await res.json();
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
    } catch { setError("Failed to update."); }
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;
    try {
      const res = await fetch(`${API}/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });
      const updated = await res.json();
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
      setEditingId(null);
    } catch { setError("Failed to edit."); }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}/api/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter(t => t.id !== id));
    } catch { setError("Failed to delete."); }
  };

  return (
    <div style={{minHeight:"100vh",background:"#0f0f0f",color:"#f0ede6",fontFamily:"sans-serif",padding:"40px 24px",maxWidth:"600px",margin:"0 auto"}}>
      <h1 style={{fontSize:"2.5rem",fontWeight:"800",marginBottom:"8px"}}>TODOS</h1>
      <p style={{color:"#666",marginBottom:"32px",fontSize:"0.8rem",letterSpacing:"2px"}}>DSO101 ASSIGNMENT I</p>
      {error && <div style={{background:"#2a0f0f",border:"1px solid #c0392b",borderRadius:"8px",padding:"12px",color:"#e74c3c",marginBottom:"16px"}}>{error}</div>}
      <div style={{display:"flex",gap:"10px",marginBottom:"32px"}}>
        <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} placeholder="What needs to be done?" style={{flex:1,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"8px",padding:"12px 16px",color:"#f0ede6",fontSize:"1rem",outline:"none"}} />
        <button onClick={addTodo} style={{background:"#e8ff47",color:"#0f0f0f",border:"none",borderRadius:"8px",padding:"12px 20px",fontWeight:"700",cursor:"pointer"}}>ADD</button>
      </div>
      {todos.length===0 && <p style={{textAlign:"center",color:"#444"}}>No tasks yet</p>}
      {todos.map(todo=>(
        <div key={todo.id} style={{background:"#1a1a1a",border:"1px solid #222",borderRadius:"10px",padding:"14px 18px",marginBottom:"8px",display:"flex",alignItems:"center",gap:"12px"}}>
          <input type="checkbox" checked={todo.completed} onChange={()=>toggleComplete(todo)} style={{width:"18px",height:"18px",cursor:"pointer"}} />
          {editingId===todo.id ? (
            <>
              <input value={editingTitle} onChange={e=>setEditingTitle(e.target.value)} autoFocus style={{flex:1,background:"#0f0f0f",border:"1px solid #e8ff47",borderRadius:"6px",padding:"6px 10px",color:"#f0ede6",fontSize:"1rem",outline:"none"}} />
              <button onClick={()=>saveEdit(todo.id)} style={{background:"#e8ff47",border:"none",borderRadius:"6px",color:"#0f0f0f",padding:"6px 12px",cursor:"pointer",fontWeight:"700"}}>SAVE</button>
              <button onClick={()=>setEditingId(null)} style={{background:"transparent",border:"1px solid #333",borderRadius:"6px",color:"#888",padding:"6px 12px",cursor:"pointer"}}>CANCEL</button>
            </>
          ) : (
            <>
              <span style={{flex:1,textDecoration:todo.completed?"line-through":"none",color:todo.completed?"#444":"#f0ede6"}}>{todo.title}</span>
              <button onClick={()=>{setEditingId(todo.id);setEditingTitle(todo.title);}} style={{background:"transparent",border:"1px solid #333",borderRadius:"6px",color:"#888",padding:"6px 12px",cursor:"pointer"}}>EDIT</button>
              <button onClick={()=>deleteTodo(todo.id)} style={{background:"transparent",border:"1px solid #333",borderRadius:"6px",color:"#c0392b",padding:"6px 12px",cursor:"pointer"}}>DEL</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
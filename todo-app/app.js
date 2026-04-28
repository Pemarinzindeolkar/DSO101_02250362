const express = require('express');
const app = express();
app.use(express.json());

let todos = [{ id: 1, task: 'Learn CI/CD', done: false }];

app.get('/', (req, res) => res.json({ message: 'Todo API is running!' }));

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });
  const newTodo = { id: todos.length + 1, task, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Not found' });
  todo.done = req.body.done ?? todo.done;
  todo.task = req.body.task ?? todo.task;
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
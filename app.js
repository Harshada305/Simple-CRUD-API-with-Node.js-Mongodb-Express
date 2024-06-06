const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/crud-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected successfully');
});

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
});

const Todo = mongoose.model('Todo', todoSchema);

// Create a new todo
app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({ title, description });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get todo by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update todo by ID
app.put('/todos/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete todo by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

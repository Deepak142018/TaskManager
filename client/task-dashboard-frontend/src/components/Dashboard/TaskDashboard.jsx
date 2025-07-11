import { useEffect, useState } from 'react';
import axios from '../../API/axios';

export default function TaskDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [newTask, setNewTask] = useState({
    title: '', description: '', dueDate: '', category: '', priority: 'Medium'
  });
  const [newCategory, setNewCategory] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('/tasks');
    setTasks(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get('/categories');
    setCategories(res.data);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    await axios.post('/tasks', newTask);
    setNewTask({ title: '', description: '', dueDate: '', category: '', priority: 'Medium' });
    fetchTasks();
  };

  const handleAddCategory = async () => {
    await axios.post('/categories', { name: newCategory });
    setNewCategory('');
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    await axios.delete(`/categories/${id}`);
    fetchCategories();
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleToggle = async (task) => {
    await axios.put(`/tasks/${task._id}`, { ...task, completed: !task.completed });
    fetchTasks();
  };

  const isOverdue = (date) => date && new Date(date) < new Date() && !isNaN(new Date(date));

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus ? (filterStatus === 'completed' ? t.completed : !t.completed) : true) &&
    (filterCategory ? t.category?._id === filterCategory : true)
  );

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <h2>Welcome, {user.username}</h2>
      <button onClick={onLogout}>Logout</button>
      <button onClick={() => setDarkMode(!darkMode)}>🌙 Toggle Theme</button>

      {/* Filters */}
      <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <select onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="">All</option>
        <option value="completed">✅ Completed</option>
        <option value="pending">❌ Pending</option>
      </select>
      <select onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      {/* Add Task */}
      <form onSubmit={handleAddTask}>
        <input required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Title" />
        <input value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description" />
        <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">💧 Low</option>
        </select>
        <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}>
          <option value="">Choose Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Add Category */}
      <div>
        <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category" />
        <button onClick={handleAddCategory}>Add Category</button>
        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>{cat.name} <button onClick={() => handleDeleteCategory(cat._id)}>🗑️</button></li>
          ))}
        </ul>
      </div>

      {/* Task List */}
      <ul>
        {filtered.map((task) => (
          <li
            key={task._id}
            className={`task-card ${task.completed ? 'completed' : ''} ${isOverdue(task.dueDate) ? 'overdue' : ''}`}
          >
            <strong>{task.title}</strong> - {task.description} <br />
            📅 {task.dueDate?.slice(0, 10)} | 🏷️ {task.category?.name || 'None'}<br />
            🧷 Priority: {task.priority} <br />
            Status: {task.completed ? '✅' : '❌'} <br />
            <button onClick={() => handleToggle(task)}>Toggle</button>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

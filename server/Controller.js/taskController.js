import Task from '../Models/Task.js';

export const getTasks = async (req, res) => {
  const { status, category, q } = req.query;
  const filter = { userId: req.userId };
  if (status) filter.completed = status === 'completed';
  if (category) filter.category = category;
  if (q) filter.title = new RegExp(q, 'i');

  const tasks = await Task.find(filter).populate('category');
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description, dueDate, category } = req.body;
  const task = new Task({ title, description, dueDate, category, userId: req.userId });
  await task.save();
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(task);
};

export const toggleStatus = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  task.completed = !task.completed;
  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Task deleted' });
};

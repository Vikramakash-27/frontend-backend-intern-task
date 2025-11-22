const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// CREATE a task
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const task = new Task({
      user: req.user.id,   // ✅ field is `user`
      title,
      description,
    });

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort('-createdAt'); // ✅ same field
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// UPDATE task
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ✅ same field
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE task
// DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user.id,   // ✅ use `user`, not `userId`
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('TASK DELETE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

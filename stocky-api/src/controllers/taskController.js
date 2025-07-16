import Task from '../models/Task.js';

// Obtener todas las tareas del usuario autenticado
export async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas', error: err.message });
  }
}

// Crear nueva tarea
export async function createTask(req, res) {
  try {
    const { description, priority = 'media', color = '#3b82f6' } = req.body;
    if (!description) return res.status(400).json({ message: 'La descripción es requerida' });
    const task = await Task.create({ userId: req.user.id, description, priority, color });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear tarea', error: err.message });
  }
}

// Actualizar tarea
export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { description, completed, priority, color } = req.body;
    const update = {};
    if (description !== undefined) update.description = description;
    if (completed !== undefined) update.completed = completed;
    if (priority !== undefined) update.priority = priority;
    if (color !== undefined) update.color = color;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: update },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: err.message });
  }
}

// Eliminar tarea
export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: err.message });
  }
} 
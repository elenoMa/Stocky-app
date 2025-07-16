import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
import type { Task } from '../services/api';
import PageTransition from '../components/PageTransition';
import Loader from '../components/Loader';

const PRIORITIES = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

const DEFAULT_COLOR = '#3b82f6';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Para agregar tarea
  const [desc, setDesc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pendingDesc, setPendingDesc] = useState('');
  const [priority, setPriority] = useState('media');
  const [color, setColor] = useState(DEFAULT_COLOR);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Paso 1: Al hacer click en Agregar, abrir modal si hay descripción
  const handleShowModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;
    setPendingDesc(desc.trim());
    setPriority('media');
    setColor(DEFAULT_COLOR);
    setShowModal(true);
  };

  // Paso 2: Al confirmar en el modal, crear tarea
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingDesc) return;
    setLoading(true);
    try {
      const task = await createTask(pendingDesc, priority, color);
      setTasks([task, ...tasks]);
      setDesc('');
      setPendingDesc('');
      setPriority('media');
      setColor(DEFAULT_COLOR);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Error al crear tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === task._id ? updated : t));
    } catch (err: any) {
      setError(err.message || 'Error al actualizar tarea');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar tarea');
    }
  };

  if (loading) {
    return <PageTransition variant="slideLeft"><Loader message="Cargando tareas..." /></PageTransition>;
  }

  return (
    <PageTransition variant="slideLeft">
      <div className="max-w-2xl mx-auto py-8 px-2">
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <form onSubmit={handleShowModal} className="flex gap-2 mb-6">
            <input
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-800 bg-gray-50"
              placeholder="Nueva tarea..."
              disabled={loading}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
              Agregar
            </button>
          </form>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
          <ul className="space-y-3">
            {tasks.map(task => (
              <li key={task._id} className="flex items-center bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-100">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task)}
                  className="mr-4 h-5 w-5 accent-blue-600"
                />
                <span className={`flex-1 text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.description}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  (task.priority ?? 'media') === 'alta' ? 'bg-red-100 text-red-700' :
                  (task.priority ?? 'media') === 'media' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {(task.priority ?? 'media').charAt(0).toUpperCase() + (task.priority ?? 'media').slice(1)}
                </span>
                <span
                  className="ml-2 w-5 h-5 rounded-full border border-gray-300"
                  style={{ background: task.color || '#3b82f6' }}
                  title={task.color || '#3b82f6'}
                ></span>
                <button onClick={() => handleDelete(task._id)} className="ml-4 text-red-500 hover:text-red-700 text-xl" title="Eliminar tarea">🗑️</button>
              </li>
            ))}
          </ul>
          {tasks.length === 0 && !loading && <div className="text-center text-gray-500 mt-8">No tienes tareas pendientes.</div>}
        </div>

        {/* Modal para prioridad y color */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
                title="Cerrar"
              >×</button>
              <h2 className="text-xl font-bold mb-4">Prioridad y color</h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {PRIORITIES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-12 h-8 p-0 border-0 bg-transparent cursor-pointer"
                  />
                  <span className="ml-2 text-xs text-gray-500">{color}</span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Agregar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Tasks; 
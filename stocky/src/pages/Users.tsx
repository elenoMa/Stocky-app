import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatsCard from "../components/StatsCard";
import SearchBar from "../components/SearchBar";
import { fetchUsers, createUser, updateUser, deleteUser } from "../services/api";

function getUser() {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
}

const initialForm = { username: '', email: '', password: '', role: 'user' };

type FormState = typeof initialForm;

const Users: React.FC = () => {
  const user = getUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data.users || data);
    } catch (err: any) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h2 className="text-xl font-bold mb-4">Gestión de usuarios</h2>
          <div className="text-red-500">Acceso denegado. Solo para administradores.</div>
        </div>
      </DashboardLayout>
    );
  }

  // Filtrado por búsqueda
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers para el modal de creación
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    if (form.password.length < 3) {
      setFormError('La contraseña debe tener al menos 3 caracteres.');
      return;
    }
    setFormLoading(true);
    try {
      await createUser(form);
      setShowCreateModal(false);
      setForm(initialForm);
      await loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error al crear usuario');
    } finally {
      setFormLoading(false);
    }
  };

  // Editar usuario
  const openEditModal = (u: User) => {
    setEditUserId(u._id);
    setForm({ username: u.username, email: u.email, password: '', role: u.role });
    setFormError(null);
    setShowEditModal(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.username.trim() || !form.email.trim()) {
      setFormError('Usuario y email son obligatorios.');
      return;
    }
    if (form.password && form.password.length < 3) {
      setFormError('La contraseña debe tener al menos 3 caracteres.');
      return;
    }
    setFormLoading(true);
    try {
      const updateData: any = {
        username: form.username,
        email: form.email,
        role: form.role
      };
      if (form.password) updateData.password = form.password;
      if (editUserId) await updateUser(editUserId, updateData);
      setShowEditModal(false);
      setEditUserId(null);
      setForm(initialForm);
      await loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error al editar usuario');
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar usuario
  const openDeleteModal = (id: string) => {
    setDeleteUserId(id);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteUser(deleteUserId);
      setShowDeleteModal(false);
      setDeleteUserId(null);
      await loadUsers();
    } catch (err: any) {
      setDeleteError(err.message || 'Error al eliminar usuario');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header unificado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">👥</span>
              Usuarios
            </h1>
            <p className="text-gray-600 mt-1">Gestiona los usuarios de la aplicación</p>
          </div>
          <div className="flex gap-3 items-center mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex-1 min-w-[180px]">
              <SearchBar
                placeholder="Buscar usuario o email..."
                value={search}
                onChange={setSearch}
                icon="🔍"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors shadow-sm"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="text-xl">➕</span>
              Nuevo usuario
            </button>
          </div>
        </div>
        {/* KPI de total de usuarios */}
        <div className="mb-6 max-w-xs">
          <StatsCard icon="👥" title="Total Usuarios" value={filteredUsers.length} color="blue" />
        </div>
        <div className="bg-white rounded shadow p-4">
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <p>No hay usuarios que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Usuario</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Rol</th>
                    <th className="px-4 py-2 text-left">Creado</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <tr key={u._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2 font-medium">{u.username}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                          {u.role === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-ES', { year: '2-digit', month: 'short', day: '2-digit' }) : '-'}
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:underline mr-2" onClick={() => openEditModal(u)}>Editar</button>
                        <button className="text-red-600 hover:underline" onClick={() => openDeleteModal(u._id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Modal de creación de usuario */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-sm">
              <h3 className="text-lg font-bold mb-4">Crear nuevo usuario</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Usuario</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                    onClick={() => { setShowCreateModal(false); setForm(initialForm); setFormError(null); }}
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Creando...' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal de edición de usuario */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-sm">
              <h3 className="text-lg font-bold mb-4">Editar usuario</h3>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Usuario</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contraseña (opcional)</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Dejar en blanco para no cambiar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                    onClick={() => { setShowEditModal(false); setEditUserId(null); setForm(initialForm); setFormError(null); }}
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-sm text-center">
              <h3 className="text-lg font-bold mb-4 text-red-600">¿Eliminar usuario?</h3>
              <p className="mb-4">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
              {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                  onClick={() => { setShowDeleteModal(false); setDeleteUserId(null); setDeleteError(null); }}
                  disabled={deleteLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={handleDeleteUser}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users; 
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../services/api";
import type { Supplier } from "../types/supplier";
import SupplierFormModal from "../components/SupplierFormModal";
import PageTransition from '../components/PageTransition';
import Loader from '../components/Loader';

function getUser() {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

const Suppliers: React.FC = () => {
  const user = getUser();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSuppliers();
      setSuppliers(data.suppliers || data);
    } catch (err: any) {
      setError("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Filtrado por búsqueda
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
    (s.phone && s.phone.toLowerCase().includes(search.toLowerCase()))
  );

  // KPI de proveedores activos/total
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.active).length;

  const handleCreateSupplier = async (data: Omit<Supplier, '_id' | 'createdAt'>) => {
    setFormLoading(true);
    setFormError(null);
    try {
      await createSupplier(data);
      setShowCreateModal(false);
      await loadSuppliers();
    } catch (err: any) {
      setFormError(err.message || 'Error al crear proveedor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowCreateModal(true);
    setFormError(null);
  };

  const handleUpdateSupplier = async (data: Omit<Supplier, '_id' | 'createdAt'>) => {
    if (!editingSupplier) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await updateSupplier(editingSupplier._id, data);
      setShowCreateModal(false);
      setEditingSupplier(null);
      await loadSuppliers();
    } catch (err: any) {
      setFormError(err.message || 'Error al editar proveedor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setDeletingSupplier(supplier);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const confirmDeleteSupplier = async () => {
    if (!deletingSupplier) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteSupplier(deletingSupplier._id);
      setShowDeleteModal(false);
      setDeletingSupplier(null);
      await loadSuppliers();
    } catch (err: any) {
      setDeleteError(err.message || 'Error al eliminar proveedor');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <PageTransition variant="slideLeft"><Loader message="Cargando proveedores..." /></PageTransition>;
  }

  return (
    <PageTransition variant="slideLeft">
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* KPI de proveedores */}
          <div className="mb-0 flex gap-4 order-2 md:order-1">
            <div className="bg-white rounded-lg shadow border p-4 flex items-center gap-3">
              <span className="text-2xl">🏢</span>
              <div>
                <div className="text-lg font-bold text-gray-800">{activeSuppliers} / {totalSuppliers}</div>
                <div className="text-xs text-gray-500">Proveedores activos / total</div>
              </div>
            </div>
          </div>
          {/* Buscador y botón a la derecha */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-end w-full md:w-auto order-1 md:order-2">
            <div className="min-w-[180px]">
              <SearchBar
                placeholder="Buscar proveedor, email o teléfono..."
                value={search}
                onChange={setSearch}
                icon="🔍"
              />
            </div>
            {user && user.role === 'admin' && (
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors shadow-sm"
                onClick={() => setShowCreateModal(true)}
              >
                <span className="text-xl">➕</span>
                Nuevo proveedor
              </button>
            )}
          </div>
        </div>
        <div className="bg-white rounded shadow p-4">
          {error ? (
            <div className="text-red-500 text-center py-8">
              <p>❌ {error}</p>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <p>No hay proveedores que coincidan con la búsqueda.</p>
              {user && user.role === 'admin' && (
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2" disabled>
                  <span className="text-xl">➕</span> Nuevo proveedor
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Nombre</th>
                    <th className="px-4 py-2 text-left border-b">Email</th>
                    <th className="px-4 py-2 text-left border-b">Teléfono</th>
                    <th className="px-4 py-2 text-left border-b">Dirección</th>
                    <th className="px-4 py-2 text-left border-b">Contacto</th>
                    <th className="px-4 py-2 text-left border-b">Estado</th>
                    <th className="px-4 py-2 text-left border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((s, idx) => (
                    <tr key={s._id} className={"hover:bg-blue-50 transition-colors " + (idx % 2 === 0 ? "bg-white" : "bg-gray-50") + " border-b last:border-0"}>
                      <td className="px-4 py-2 font-medium flex items-center gap-2">
                        <span className="text-lg">🏭</span> {s.name}
                      </td>
                      <td className="px-4 py-2">{s.email || '—'}</td>
                      <td className="px-4 py-2">{s.phone || '—'}</td>
                      <td className="px-4 py-2">{s.address || '—'}</td>
                      <td className="px-4 py-2">{s.contactPerson || '—'}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${s.active ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-700 border border-gray-300'}`}>
                          {s.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {user && user.role === 'admin' ? (
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-900 text-sm flex items-center gap-1"
                              onClick={() => handleEditSupplier(s)}
                              disabled={formLoading || deleteLoading}
                            >
                              ✏️ <span className="underline">Editar</span>
                            </button>
                            <button className="text-red-600 hover:text-red-900 text-sm flex items-center gap-1"
                              onClick={() => handleDeleteSupplier(s)}
                              disabled={formLoading || deleteLoading}
                            >
                              🗑️ <span className="underline">Eliminar</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Modal de creación/edición de proveedor */}
        <SupplierFormModal
          show={showCreateModal}
          onClose={() => { setShowCreateModal(false); setEditingSupplier(null); setFormError(null); }}
          onSubmit={editingSupplier ? handleUpdateSupplier : handleCreateSupplier}
          supplier={editingSupplier}
          loading={formLoading}
          error={formError}
        />
        {/* Modal de confirmación de borrado */}
        {showDeleteModal && deletingSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🗑️</span> Eliminar proveedor
              </h2>
              <p className="mb-4">¿Seguro que deseas eliminar el proveedor <span className="font-semibold">{deletingSupplier.name}</span>? Esta acción no se puede deshacer.</p>
              {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                  onClick={confirmDeleteSupplier}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Suppliers; 
import React, { useState, useEffect } from 'react';
import type { Supplier } from '../types/supplier';

interface SupplierFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Supplier, '_id' | 'createdAt'>) => Promise<void>;
  supplier?: Supplier | null;
  loading?: boolean;
  error?: string | null;
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  contactPerson: '',
  notes: '',
  active: true,
};

const SupplierFormModal: React.FC<SupplierFormModalProps> = ({ show, onClose, onSubmit, supplier, loading = false, error }) => {
  const [form, setForm] = useState({ ...initialForm });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        contactPerson: supplier.contactPerson || '',
        notes: supplier.notes || '',
        active: supplier.active ?? true,
      });
    } else {
      setForm({ ...initialForm });
    }
    setFormError(null);
  }, [show, supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: newValue,
    }));
    setFormError(null);
  };

  const validate = () => {
    if (!form.name.trim()) {
      setFormError('El nombre es obligatorio');
      return false;
    }
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setFormError('El email no es válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-modal-in">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl" onClick={onClose} disabled={loading}>
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>🏭</span> {supplier ? 'Editar proveedor' : 'Nuevo proveedor'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Persona de contacto</label>
            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              rows={2}
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              id="active"
              disabled={loading}
            />
            <label htmlFor="active" className="text-sm">Activo</label>
          </div>
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded border" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Guardando...' : supplier ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes modal-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-in {
          animation: modal-in 0.25s cubic-bezier(.4,1.7,.7,1.1);
        }
      `}</style>
    </div>
  );
};

export default SupplierFormModal; 
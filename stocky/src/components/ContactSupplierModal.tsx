import React, { useState } from 'react';
import type { Supplier } from '../types/supplier';

interface ContactSupplierModalProps {
  show: boolean;
  onClose: () => void;
  suppliers: Supplier[];
}

const ContactSupplierModal: React.FC<ContactSupplierModalProps> = ({ show, onClose, suppliers }) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const supplier = suppliers.find(s => s._id === selectedId);
  const [copied, setCopied] = useState<string | null>(null);

  if (!show) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-modal-in">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl" onClick={onClose}>
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📞</span> Contactar Proveedor
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Selecciona un proveedor</label>
          <select
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            <option value="">-- Elegir proveedor --</option>
            {suppliers.filter(s => s.active).map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        {supplier && (
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Email:</span> {supplier.email || '—'}
              {supplier.email && (
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xl inline-flex items-center"
                  onClick={() => handleCopy(supplier.email!, 'email')}
                  title="Copiar email"
                >
                  {copied === 'email' ? '✅' : '📋'}
                </button>
              )}
              {supplier.email && (
                <a
                  href={`mailto:${supplier.email}`}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xl inline-flex items-center"
                  target="_blank" rel="noopener noreferrer"
                  title="Enviar correo"
                >
                  ✉️
                </a>
              )}
            </div>
            <div>
              <span className="font-semibold">Teléfono:</span> {supplier.phone || '—'}
              {supplier.phone && (
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xl inline-flex items-center"
                  onClick={() => handleCopy(supplier.phone!, 'phone')}
                  title="Copiar teléfono"
                >
                  {copied === 'phone' ? '✅' : '📋'}
                </button>
              )}
            </div>
            <div>
              <span className="font-semibold">Persona de contacto:</span> {supplier.contactPerson || '—'}
            </div>
            <div>
              <span className="font-semibold">Notas:</span> {supplier.notes || '—'}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" className="px-4 py-2 rounded border" onClick={onClose}>
            Cerrar
          </button>
        </div>
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

export default ContactSupplierModal; 
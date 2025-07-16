import { useForm } from "react-hook-form";
import React from "react";
import type { ProductFormData } from '../types/product';

interface Product {
    id: string
    name: string
    category: string
    stock: number
    price: number
    minStock: number
    maxStock: number
    supplier: string
    sku: string
    description?: string
    lastUpdated: string
    status: 'active' | 'inactive' | 'low-stock'
}

interface Supplier {
    _id: string;
    name: string;
    active: boolean;
}

interface ProductFormModalProps {
    show: boolean;
    onClose: () => void;
    product?: Product | null;
    onSubmit: (data: ProductFormData) => void | Promise<void>;
    suppliers: Supplier[];
}

interface FormData {
    name: string;
    category: string;
    stock: number;
    price: number;
    minStock: number;
    maxStock: number;
    supplier: string;
    sku: string;
    description: string;
}

const ProductFormModal = ({ show, onClose, product, onSubmit, suppliers }: ProductFormModalProps) => {
    const { register, handleSubmit, reset, setValue } = useForm<FormData>();

    // Pre-llenar formulario si estamos editando
    React.useEffect(() => {
        if (product) {
            setValue('name', product.name);
            setValue('category', product.category);
            setValue('stock', product.stock);
            setValue('price', product.price);
            setValue('minStock', product.minStock);
            setValue('maxStock', product.maxStock);
            setValue('supplier', product.supplier);
            setValue('sku', product.sku);
            setValue('description', product.description || '');
        } else {
            reset();
        }
    }, [product, setValue, reset]);

    const handleFormSubmit = async (data: FormData) => {
        await onSubmit(data);
        reset();
        onClose();
    }

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-modal-in">
                <h2 className="text-xl font-bold mb-4">
                    {product ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                </h2>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del producto
                        </label>
                        <input
                            {...register('name', { required: 'El nombre es requerido' })}
                            placeholder="Ej: Yerba Mate Premium"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                        </label>
                        <select
                            {...register('category', { required: 'La categoría es requerida' })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Seleccionar categoría...</option>
                            <option value="Bebidas">Bebidas</option>
                            <option value="Alimentos">Alimentos</option>
                            <option value="Limpieza">Limpieza</option>
                            <option value="Electrónicos">Electrónicos</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock actual
                            </label>
                            <input
                                type="number"
                                {...register('stock', { required: 'El stock es requerido', min: 0 })}
                                placeholder="0"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price', { required: 'El precio es requerido', min: 0 })}
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock mínimo
                            </label>
                            <input
                                type="number"
                                {...register('minStock', { required: 'El stock mínimo es requerido', min: 0 })}
                                placeholder="0"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock máximo
                            </label>
                            <input
                                type="number"
                                {...register('maxStock', { required: 'El stock máximo es requerido', min: 0 })}
                                placeholder="0"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proveedor
                        </label>
                        <select
                            {...register('supplier')}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Sin proveedor</option>
                            {suppliers.filter(s => s.active).map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU
                        </label>
                        <input
                            {...register('sku', { required: 'El SKU es requerido' })}
                            placeholder="Ej: YER-001"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción (opcional)
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            placeholder="Describe el producto..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {product ? 'Actualizar' : 'Crear'}
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
    )
}

export default ProductFormModal;
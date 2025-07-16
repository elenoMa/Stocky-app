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

interface ProductFormModalProps {
    show: boolean;
    onClose: () => void;
    product?: Product | null;
    onSubmit: (data: ProductFormData) => void | Promise<void>;
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

const ProductFormModal = ({ show, onClose, product, onSubmit }: ProductFormModalProps) => {
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                        <input
                            {...register('supplier', { required: 'El proveedor es requerido' })}
                            placeholder="Ej: Proveedor A"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
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
        </div>
    )
}

export default ProductFormModal;
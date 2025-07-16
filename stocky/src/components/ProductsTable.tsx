import { useState } from 'react'
import ProductFormModal from './ProductFormModal'
import ProductStatusBadge from './ProductStatusBadge'

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

interface ProductsTableProps {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (id: string) => void
    categoryNameMap?: Record<string, string>
}

const ProductsTable = ({ products, onEdit, onDelete, categoryNameMap }: ProductsTableProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Proveedor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Última Actualización
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => {
                            const categoryName = categoryNameMap?.[product.category] || product.category;
                            return (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                            {product.description && (
                                                <div className="text-xs text-gray-400 mt-1">{product.description}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{categoryName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {product.stock} / {product.maxStock}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Mín: {product.minStock}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <ProductStatusBadge status={product.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product.supplier}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(product.lastUpdated)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductsTable
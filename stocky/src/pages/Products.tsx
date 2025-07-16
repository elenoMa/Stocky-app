import { useEffect, useState, useMemo } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories } from '../services/api'
import DashboardLayout from '../components/DashboardLayout '
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import ProductFormModal from '../components/ProductFormModal'
import ProductsFilterPanel from '../components/ProductsFilterPanel'
import ProductsTable from '../components/ProductsTable'
import ViewToggle from '../components/ViewToggle'
import type { Product, ProductFormData } from '../types/product'
import { calculateProductStats, filterAndSortProducts } from '../utils/productUtils'

const Products = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('todos')
    const [filterStatus, setFilterStatus] = useState<'todos' | 'active' | 'inactive' | 'low-stock'>('todos')
    const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'lastUpdated'>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<{ _id: string, name: string }[]>([])

    const loadProducts = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchProducts()
            setProducts(data.products || data)
        } catch (err: any) {
            setError('Error al cargar productos')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const loadCategories = async () => {
        try {
            const data = await fetchCategories()
            setCategories(data.categories || data)
        } catch {}
    }

    useEffect(() => {
        loadProducts()
        loadCategories()
    }, [])

    // Obtener nombres únicos de categorías presentes en productos
    const productCategoryNames = useMemo(() => {
        const names = new Set<string>()
        products.forEach(p => {
            // Si p.category es un id, buscar el nombre
            const found = categories.find(cat => cat._id === p.category)
            if (found) {
                names.add(found.name)
            } else {
                names.add(p.category)
            }
        })
        return Array.from(names)
    }, [products, categories])

    // Filtrar y ordenar productos usando utilidades
    const filteredProducts = useMemo(() => {
        return filterAndSortProducts(products, searchTerm, filterCategory, filterStatus, sortBy, sortOrder)
    }, [products, searchTerm, filterCategory, filterStatus, sortBy, sortOrder])

    // Calcular estadísticas usando utilidades
    const stats = useMemo(() => {
        return calculateProductStats(products)
    }, [products])

    // Crear un map de id a nombre para categorías
    const categoryNameMap = useMemo(() => {
        const map: Record<string, string> = {}
        categories.forEach(cat => { map[cat._id] = cat.name })
        return map
    }, [categories])

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            setLoading(true)
            setError(null)
            try {
                await deleteProduct(id)
                await loadProducts()
            } catch (err: any) {
                setError('Error al eliminar producto')
            } finally {
                setLoading(false)
            }
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setShowModal(true)
    }

    const handleSubmitProduct = async (data: ProductFormData) => {
        setLoading(true)
        setError(null)
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, data)
            } else {
                await createProduct(data)
            }
            await loadProducts()
            setShowModal(false)
            setEditingProduct(null)
        } catch (err: any) {
            setError('Error al guardar producto')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando productos...</div>
    }
    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
    }

    return (
        <DashboardLayout>
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">📦 Productos</h1>
                        <p className="text-gray-600 mt-1">Gestiona tu catálogo de productos</p>
                    </div>
                    <div className="flex gap-3">
                        <ViewToggle
                            currentView={viewMode}
                            onViewChange={(view) => setViewMode(view as 'grid' | 'list')}
                            options={[
                                { value: 'list', label: 'Vista Lista', icon: '📋' },
                                { value: 'grid', label: 'Vista Cuadrícula', icon: '🔲' }
                            ]}
                        />
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            ➕ Nuevo Producto
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                    <StatsCard
                        icon="📦"
                        title="Total Productos"
                        value={stats.totalProducts}
                        color="blue"
                    />
                    <StatsCard
                        icon="✅"
                        title="Activos"
                        value={stats.activeProducts}
                        color="green"
                    />
                    <StatsCard
                        icon="⚠️"
                        title="Stock Bajo"
                        value={stats.lowStockProducts}
                        color="red"
                    />
                    <StatsCard
                        icon="💰"
                        title="Valor Total"
                        value={`$${stats.totalValue.toFixed(2)}`}
                        color="purple"
                    />
                    <StatsCard
                        icon="📊"
                        title="Precio Promedio"
                        value={`$${stats.averagePrice.toFixed(2)}`}
                        color="yellow"
                    />
                    <StatsCard
                        icon="📈"
                        title="Stock Total"
                        value={stats.totalStock}
                        color="green"
                    />
                </div>

                {/* Filtros */}
                <ProductsFilterPanel
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterCategory={filterCategory}
                    onFilterCategoryChange={setFilterCategory}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    categories={productCategoryNames}
                />

                {/* Tabla o cuadrícula de productos */}
                {viewMode === 'list' ? (
                    <ProductsTable
                        products={filteredProducts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        categoryNameMap={categoryNameMap}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => {
                            const categoryName = categoryNameMap[product.category] || product.category
                            return (
                                <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between border hover:shadow-lg transition-shadow">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                                            <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">Categoría: {categoryName}</div>
                                        <div className="text-sm text-gray-600 mb-1">Proveedor: {product.supplier}</div>
                                        <div className="text-sm text-gray-600 mb-1">Stock: <span className="font-semibold">{product.stock}</span> / {product.maxStock} (Mín: {product.minStock})</div>
                                        <div className="text-sm text-gray-600 mb-1">Precio: <span className="font-semibold">${product.price.toFixed(2)}</span></div>
                                        <div className="text-sm text-gray-600 mb-1">Estado: <span className="capitalize">{product.status}</span></div>
                                        {product.description && (
                                            <div className="text-xs text-gray-400 mt-2">{product.description}</div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Estado vacío */}
                {filteredProducts.length === 0 && (
                    <EmptyState
                        icon="📦"
                        title="No se encontraron productos"
                        description="Intenta con otros filtros o crea un nuevo producto."
                        actionButton={{
                            text: "➕ Nuevo Producto",
                            onClick: () => setShowModal(true)
                        }}
                    />
                )}

                {/* Modal de producto */}
                <ProductFormModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                        setEditingProduct(null)
                    }}
                    product={editingProduct}
                    onSubmit={handleSubmitProduct}
                />
            </div>
        </DashboardLayout>
    )
}

export default Products
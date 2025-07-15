import { useEffect, useState, useMemo } from 'react'
import { fetchProducts } from '../services/api'
import DashboardLayout from '../components/DashboardLayout '
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import ProductFormModal from '../components/ProductFormModal'
import ProductsFilterPanel from '../components/ProductsFilterPanel'
import ProductsTable from '../components/ProductsTable'
import ViewToggle from '../components/ViewToggle'
import type { Product } from '../types/product'
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

    useEffect(() => {
        fetchProducts()
            .then(data => {
                // Ajusta esto según la estructura real de la respuesta de la API
                setProducts(data.products || data)
            })
            .catch(err => {
                console.error(err)
                setProducts([])
            })
            .finally(() => setLoading(false))
    }, [])

    // Obtener categorías únicas
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))]
        return uniqueCategories
    }, [products])

    // Filtrar y ordenar productos usando utilidades
    const filteredProducts = useMemo(() => {
        return filterAndSortProducts(products, searchTerm, filterCategory, filterStatus, sortBy, sortOrder)
    }, [products, searchTerm, filterCategory, filterStatus, sortBy, sortOrder])

    // Calcular estadísticas usando utilidades
    const stats = useMemo(() => {
        return calculateProductStats(products)
    }, [products])

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            setProducts(products.filter(p => p.id !== id))
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setShowModal(true)
    }

    const handleSubmitProduct = (data: any) => {
        if (editingProduct) {
            // Actualizar producto existente
            setProducts(products.map(p => 
                p.id === editingProduct.id 
                    ? { ...p, ...data }
                    : p
            ))
        } else {
            // Crear nuevo producto
            const newProduct: Product = {
                id: Date.now().toString(),
                ...data,
                status: 'active',
                lastUpdated: new Date().toISOString()
            }
            setProducts([...products, newProduct])
        }
        setEditingProduct(null)
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando productos...</div>
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
                    categories={categories}
                />

                {/* Tabla de productos */}
                <ProductsTable
                    products={filteredProducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

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
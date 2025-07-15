import { useState, useMemo } from 'react'
import DashboardLayout from '../components/DashboardLayout '
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import ProductFormModal from '../components/ProductFormModal'
import ProductsFilterPanel from '../components/ProductsFilterPanel'
import ProductsTable from '../components/ProductsTable'
import ViewToggle from '../components/ViewToggle'
import type { Product } from '../types/product'
import { calculateProductStats, filterAndSortProducts } from '../utils/productUtils'

const mockProducts: Product[] = [
    { 
        id: '1', 
        name: 'Yerba Mate Premium', 
        category: 'Bebidas', 
        stock: 20, 
        price: 5.5, 
        minStock: 10,
        maxStock: 100,
        supplier: 'Proveedor A',
        sku: 'YER-001',
        description: 'Yerba mate de alta calidad para mate tradicional',
        lastUpdated: '2024-01-15T10:30:00',
        status: 'active'
    },
    { 
        id: '2', 
        name: 'Café Colombiano', 
        category: 'Bebidas', 
        stock: 8, 
        price: 7.0, 
        minStock: 15,
        maxStock: 50,
        supplier: 'Proveedor B',
        sku: 'CAF-002',
        description: 'Café 100% colombiano molido',
        lastUpdated: '2024-01-14T14:20:00',
        status: 'low-stock'
    },
    { 
        id: '3', 
        name: 'Fideos Spaghetti', 
        category: 'Alimentos', 
        stock: 45, 
        price: 2.0, 
        minStock: 20,
        maxStock: 200,
        supplier: 'Proveedor C',
        sku: 'FID-003',
        description: 'Fideos spaghetti de trigo duro',
        lastUpdated: '2024-01-13T09:15:00',
        status: 'active'
    },
    { 
        id: '4', 
        name: 'Detergente Líquido', 
        category: 'Limpieza', 
        price: 3.5, 
        stock: 12, 
        minStock: 25,
        maxStock: 100,
        supplier: 'Proveedor D',
        sku: 'DET-004',
        description: 'Detergente líquido para ropa',
        lastUpdated: '2024-01-12T16:45:00',
        status: 'low-stock'
    },
    { 
        id: '5', 
        name: 'Papel Higiénico', 
        category: 'Limpieza', 
        stock: 80, 
        price: 1.8, 
        minStock: 30,
        maxStock: 150,
        supplier: 'Proveedor E',
        sku: 'PAP-005',
        description: 'Papel higiénico suave 3 capas',
        lastUpdated: '2024-01-11T11:30:00',
        status: 'active'
    },
    { 
        id: '6', 
        name: 'Aceite de Oliva', 
        category: 'Alimentos', 
        stock: 15, 
        price: 8.5, 
        minStock: 20,
        maxStock: 80,
        supplier: 'Proveedor F',
        sku: 'ACE-006',
        description: 'Aceite de oliva extra virgen',
        lastUpdated: '2024-01-10T08:00:00',
        status: 'low-stock'
    }
]

const Products = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('todos')
    const [filterStatus, setFilterStatus] = useState<'todos' | 'active' | 'inactive' | 'low-stock'>('todos')
    const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'lastUpdated'>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

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
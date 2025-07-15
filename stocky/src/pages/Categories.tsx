import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout '
import StatsCard from '../components/StatsCard'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import CategoryFormModal from '../components/CategoryFormModal'

interface Category {
    id: string
    name: string
    description: string
    productCount: number
    color: string
}

const mockCategories: Category[] = [
    { id: '1', name: 'Bebidas', description: 'Productos líquidos para consumo', productCount: 5, color: 'bg-blue-100' },
    { id: '2', name: 'Alimentos', description: 'Productos alimenticios básicos', productCount: 12, color: 'bg-green-100' },
    { id: '3', name: 'Limpieza', description: 'Productos de limpieza y aseo', productCount: 8, color: 'bg-yellow-100' },
    { id: '4', name: 'Electrónicos', description: 'Dispositivos y accesorios electrónicos', productCount: 3, color: 'bg-purple-100' },
]

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>(mockCategories)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            setCategories(categories.filter(cat => cat.id !== id))
        }
    }

    const handleSubmitCategory = (data: { name: string; description: string; color: string }) => {
        if (editingCategory) {
            // Actualizar categoría existente
            setCategories(categories.map(cat => 
                cat.id === editingCategory.id 
                    ? { ...cat, ...data }
                    : cat
            ))
        } else {
            // Crear nueva categoría
            const newCategory: Category = {
                id: Date.now().toString(),
                ...data,
                productCount: 0
            }
            setCategories([...categories, newCategory])
        }
        setEditingCategory(null)
    }

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">📂 Categorías</h1>
                        <p className="text-gray-600 mt-1">Gestiona las categorías de productos de tu inventario</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        ➕ Nueva Categoría
                    </button>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        icon="📂"
                        title="Total Categorías"
                        value={categories.length}
                        color="blue"
                    />
                    <StatsCard
                        icon="📦"
                        title="Total Productos"
                        value={categories.reduce((sum, cat) => sum + cat.productCount, 0)}
                        color="green"
                    />
                    <StatsCard
                        icon="📊"
                        title="Promedio"
                        value={Math.round(categories.reduce((sum, cat) => sum + cat.productCount, 0) / categories.length)}
                        color="yellow"
                    />
                    <StatsCard
                        icon="🔥"
                        title="Más Productos"
                        value={categories.reduce((max, cat) => cat.productCount > max ? cat.productCount : max, 0)}
                        color="purple"
                    />
                </div>

                {/* Barra de búsqueda y toggle de vista */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="🔍 Buscar categorías..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${viewMode === 'cards' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            onClick={() => setViewMode('cards')}
                        >
                            🗂️ Vista Tarjetas
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            onClick={() => setViewMode('table')}
                        >
                            📋 Vista Tabla
                        </button>
                    </div>
                </div>

                {/* Vista de tarjetas */}
                {viewMode === 'cards' && filteredCategories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                        {filteredCategories.map(category => (
                            <div key={category.id} className="bg-white rounded-lg shadow border p-6 flex flex-col justify-between">
                                <div className="flex items-center mb-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold mr-3 ${category.color}`}>📁</div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">{category.name}</div>
                                        <div className="text-xs text-gray-500">{category.description}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {category.productCount} productos
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingCategory(category)
                                                setShowModal(true)
                                            }}
                                            className="text-blue-600 hover:text-blue-900 text-sm"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-900 text-sm"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Vista de tabla */}
                {viewMode === 'table' && filteredCategories.length > 0 && (
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Productos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-4 h-4 rounded-full ${category.color} mr-3`}></div>
                                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{category.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {category.productCount} productos
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(category)
                                                    setShowModal(true)
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredCategories.length === 0 && (
                    <EmptyState
                        icon="📂"
                        title="No se encontraron categorías"
                        description="Intenta con otros términos de búsqueda o crea una nueva categoría."
                        actionButton={{
                            text: "➕ Nueva Categoría",
                            onClick: () => setShowModal(true)
                        }}
                    />
                )}
            </div>

            <CategoryFormModal
                show={showModal}
                onClose={() => {
                    setShowModal(false)
                    setEditingCategory(null)
                }}
                category={editingCategory}
                onSubmit={handleSubmitCategory}
            />
        </DashboardLayout>
    )
}

export default Categories
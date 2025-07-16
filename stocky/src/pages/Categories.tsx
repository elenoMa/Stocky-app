import { useEffect, useState, useMemo } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import StatsCard from '../components/StatsCard'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import CategoryFormModal from '../components/CategoryFormModal'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import PageTransition from '../components/PageTransition'
import Loader from '../components/Loader'

interface Category {
    _id: string
    name: string
    description?: string
    color?: string
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
}

function getUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

const Categories = () => {
    const user = getUser();
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
    const [error, setError] = useState<string | null>(null)

    const loadCategories = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchCategories()
            setCategories(data.categories || data)
        } catch (err: any) {
            setError('Error al cargar categorías')
            setCategories([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.color?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            setLoading(true)
            setError(null)
            try {
                await deleteCategory(id)
                await loadCategories()
            } catch (err: any) {
                setError('Error al eliminar categoría')
            } finally {
                setLoading(false)
            }
        }
    }

    const handleSubmitCategory = async (data: { name: string; description: string; color: string }) => {
        setLoading(true)
        setError(null)
        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, data)
            } else {
                await createCategory(data)
            }
            await loadCategories()
            setShowModal(false)
            setEditingCategory(null)
        } catch (err: any) {
            setError('Error al guardar categoría')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <PageTransition variant="slideLeft"><Loader message="Cargando categorías..." /></PageTransition>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
    }

    return (
        <PageTransition variant="slideLeft">
            <div>
                <div className="flex justify-between items-center mb-6">

                    {user && user.role === 'admin' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            ➕ Nueva Categoría
                        </button>
                    )}
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
                        value={categories.reduce((sum, cat) => sum + (cat.isActive ? 1 : 0), 0)}
                        color="green"
                    />
                    <StatsCard
                        icon="📊"
                        title="Promedio"
                        value={Math.round(categories.reduce((sum, cat) => sum + (cat.isActive ? 1 : 0), 0) / categories.length)}
                        color="yellow"
                    />
                    <StatsCard
                        icon="🔥"
                        title="Más Productos"
                        value={categories.reduce((max, cat) => cat.isActive ? 1 : 0 > max ? 1 : max, 0)}
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
                            <div key={category._id} className="bg-white rounded-lg shadow border p-6 flex flex-col justify-between">
                                <div className="flex items-center mb-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold mr-3 ${category.color}`}>📁</div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">{category.name}</div>
                                        {category.description && <div className="text-xs text-gray-500">{category.description}</div>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {category.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                    {user && user.role === 'admin' && (
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
                                                onClick={() => handleDelete(category._id)}
                                                className="text-red-600 hover:text-red-900 text-sm"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    )}
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
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
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
                                                {category.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {user && user.role === 'admin' && (
                                                <>
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
                                                        onClick={() => handleDelete(category._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </>
                                            )}
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
                        actionButton={user && user.role === 'admin' ? {
                            text: "➕ Nueva Categoría",
                            onClick: () => setShowModal(true)
                        } : undefined}
                    />
                )}
            </div>

            <CategoryFormModal
                show={showModal && user && user.role === 'admin'}
                onClose={() => {
                    setShowModal(false)
                    setEditingCategory(null)
                }}
                category={
                    editingCategory
                        ? {
                            id: editingCategory._id,
                            name: editingCategory.name,
                            description: editingCategory.description ?? '',
                            productCount: 0, // valor por defecto
                            color: editingCategory.color ?? ''
                        }
                        : null
                }
                onSubmit={handleSubmitCategory}
            />
        </PageTransition>
    )
}

export default Categories
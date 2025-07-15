import SearchBar from './SearchBar'

interface ProductsFilterPanelProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    filterCategory: string
    onFilterCategoryChange: (value: string) => void
    filterStatus: 'todos' | 'active' | 'inactive' | 'low-stock'
    onFilterStatusChange: (value: 'todos' | 'active' | 'inactive' | 'low-stock') => void
    sortBy: 'name' | 'stock' | 'price' | 'lastUpdated'
    onSortByChange: (value: 'name' | 'stock' | 'price' | 'lastUpdated') => void
    sortOrder: 'asc' | 'desc'
    onSortOrderChange: (value: 'asc' | 'desc') => void
    categories: string[]
}

const ProductsFilterPanel = ({
    searchTerm,
    onSearchChange,
    filterCategory,
    onFilterCategoryChange,
    filterStatus,
    onFilterStatusChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    categories
}: ProductsFilterPanelProps) => {
    return (
        <div className="bg-white rounded-lg shadow border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <SearchBar
                    placeholder="🔍 Buscar productos..."
                    value={searchTerm}
                    onChange={onSearchChange}
                />
                <select
                    value={filterCategory}
                    onChange={(e) => onFilterCategoryChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="todos">📂 Todas las categorías</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => onFilterStatusChange(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="todos">📊 Todos los estados</option>
                    <option value="active">✅ Activos</option>
                    <option value="inactive">⏸️ Inactivos</option>
                    <option value="low-stock">⚠️ Stock bajo</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="name">📝 Nombre</option>
                    <option value="stock">📦 Stock</option>
                    <option value="price">💰 Precio</option>
                    <option value="lastUpdated">🕒 Última actualización</option>
                </select>
                <button
                    onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                    {sortOrder === 'asc' ? '⬆️ Ascendente' : '⬇️ Descendente'}
                </button>
            </div>
        </div>
    )
}

export default ProductsFilterPanel 
import SearchBar from './SearchBar'

interface FilterPanelProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    filterType: 'todos' | 'entrada' | 'salida'
    onFilterTypeChange: (value: 'todos' | 'entrada' | 'salida') => void
    filterCategory: string
    onFilterCategoryChange: (value: string) => void
    filterDate: string
    onFilterDateChange: (value: string) => void
    categories: string[]
}

const FilterPanel = ({
    searchTerm,
    onSearchChange,
    filterType,
    onFilterTypeChange,
    filterCategory,
    onFilterCategoryChange,
    filterDate,
    onFilterDateChange,
    categories
}: FilterPanelProps) => {
    return (
        <div className="bg-white rounded-lg shadow border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SearchBar
                    placeholder="🔍 Buscar movimientos..."
                    value={searchTerm}
                    onChange={onSearchChange}
                />
                <select
                    value={filterType}
                    onChange={(e) => onFilterTypeChange(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="todos">📊 Todos los tipos</option>
                    <option value="entrada">📥 Solo entradas</option>
                    <option value="salida">📤 Solo salidas</option>
                </select>
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
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => onFilterDateChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
        </div>
    )
}

export default FilterPanel 
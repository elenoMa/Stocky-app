import { useEffect, useState, useMemo } from 'react'
import { fetchMovements } from '../services/api'
import DashboardLayout from '../components/DashboardLayout '
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import FilterPanel from '../components/FilterPanel'
import MovementsTable from '../components/MovementsTable'
import QuickMovementModal from '../components/QuickMovementModal'
import ViewToggle from '../components/ViewToggle'
import type { Movement, QuickMovementData } from '../types/movement'
import { calculateMovementStats, filterMovements } from '../utils/movementUtils'

const Movements = () => {
    const [movements, setMovements] = useState<Movement[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'todos' | 'entrada' | 'salida'>('todos')
    const [filterCategory, setFilterCategory] = useState('todos')
    const [filterDate, setFilterDate] = useState('')
    const [showQuickMovement, setShowQuickMovement] = useState(false)
    const [viewMode, setViewMode] = useState<'recent' | 'all'>('recent')

    useEffect(() => {
        fetchMovements()
            .then(data => setMovements(data.movements || data))
            .catch(err => {
                console.error(err)
                setMovements([])
            })
            .finally(() => setLoading(false))
    }, [])

    // Obtener categorías únicas
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(movements.map(m => m.category))]
        return uniqueCategories
    }, [movements])

    // Filtrar movimientos usando utilidades
    const filteredMovements = useMemo(() => {
        return filterMovements(movements, searchTerm, filterType, filterCategory, filterDate, viewMode)
    }, [movements, searchTerm, filterType, filterCategory, filterDate, viewMode])

    // Calcular estadísticas usando utilidades
    const stats = useMemo(() => {
        return calculateMovementStats(movements)
    }, [movements])

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando movimientos...</div>
    }

    const handleQuickMovementSubmit = (data: QuickMovementData) => {
        // Aquí se procesaría la creación del movimiento
        console.log('Nuevo movimiento:', data)
        // En una implementación real, se agregaría el movimiento a la lista
    }

    return (
        <DashboardLayout>
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">📦 Movimientos</h1>
                        <p className="text-gray-600 mt-1">Gestiona y monitorea todos los movimientos de inventario</p>
                    </div>
                                    <div className="flex gap-3">
                    <ViewToggle 
                        currentView={viewMode} 
                        onViewChange={(view) => setViewMode(view as 'recent' | 'all')} 
                        options={[
                            { value: 'recent', label: 'Recientes', icon: '🕒' },
                            { value: 'all', label: 'Todos', icon: '📋' }
                        ]}
                    />
                    <button
                        onClick={() => setShowQuickMovement(true)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        ➕ Movimiento Rápido
                    </button>
                </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                    <StatsCard
                        icon="📊"
                        title="Total Movimientos"
                        value={stats.totalMovements}
                        color="blue"
                    />
                    <StatsCard
                        icon="📥"
                        title="Entradas"
                        value={stats.entradas}
                        color="green"
                    />
                    <StatsCard
                        icon="📤"
                        title="Salidas"
                        value={stats.salidas}
                        color="red"
                    />
                    <StatsCard
                        icon="📦"
                        title="Cant. Entradas"
                        value={stats.totalEntradas}
                        color="green"
                    />
                    <StatsCard
                        icon="📦"
                        title="Cant. Salidas"
                        value={stats.totalSalidas}
                        color="red"
                    />
                    <StatsCard
                        icon="💰"
                        title="Valor Total"
                        value={`$${stats.valorTotal.toFixed(2)}`}
                        color="purple"
                    />
                </div>

                {/* Filtros */}
                <FilterPanel
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    filterCategory={filterCategory}
                    onFilterCategoryChange={setFilterCategory}
                    filterDate={filterDate}
                    onFilterDateChange={setFilterDate}
                    categories={categories}
                />

                {/* Tabla de movimientos */}
                <MovementsTable movements={filteredMovements} />

                {/* Estado vacío */}
                {filteredMovements.length === 0 && (
                    <EmptyState
                        icon="📦"
                        title="No se encontraron movimientos"
                        description="Intenta con otros filtros o crea un nuevo movimiento."
                        actionButton={{
                            text: "➕ Nuevo Movimiento",
                            onClick: () => setShowQuickMovement(true)
                        }}
                    />
                )}

                <QuickMovementModal
                    show={showQuickMovement}
                    onClose={() => setShowQuickMovement(false)}
                    onSubmit={handleQuickMovementSubmit}
                />
            </div>
        </DashboardLayout>
    )
}

export default Movements
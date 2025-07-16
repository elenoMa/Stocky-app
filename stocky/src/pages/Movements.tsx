import { useEffect, useState, useMemo } from 'react'
import { fetchMovements, fetchRecentMovements, createMovement, fetchCategories, fetchMovementsTotal } from '../services/api'
import DashboardLayout from '../components/DashboardLayout'
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import FilterPanel from '../components/FilterPanel'
import MovementsTable from '../components/MovementsTable'
import QuickMovementModal from '../components/QuickMovementModal'
import ViewToggle from '../components/ViewToggle'
import type { Movement, QuickMovementData } from '../types/movement'
import { calculateMovementStats, filterMovements } from '../utils/movementUtils'
import PageTransition from '../components/PageTransition'
import Loader from '../components/Loader'

const Movements = () => {
    const [movements, setMovements] = useState<Movement[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'todos' | 'entrada' | 'salida'>('todos')
    const [filterCategory, setFilterCategory] = useState('todos')
    const [filterDate, setFilterDate] = useState('')
    const [showQuickMovement, setShowQuickMovement] = useState(false)
    const [viewMode, setViewMode] = useState<'recent' | 'all'>('recent')
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<{ _id: string, name: string }[]>([])

    const loadMovements = async (mode: 'recent' | 'all' = viewMode) => {
        setLoading(true)
        setError(null)
        try {
            let data
            if (mode === 'recent') {
                data = await fetchRecentMovements()
            } else {
                data = await fetchMovements()
            }
            setMovements(data.movements || data)
        } catch (err: any) {
            setError('Error al cargar movimientos')
            setMovements([])
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
        loadMovements(viewMode)
        loadCategories()
    }, [viewMode])

    // Filtrar movimientos usando utilidades
    const filteredMovements = useMemo(() => {
        return filterMovements(movements, searchTerm, filterType, filterCategory, filterDate, 'all')
    }, [movements, searchTerm, filterType, filterCategory, filterDate])

    // Calcular estadísticas usando utilidades
    const stats = useMemo(() => {
        return calculateMovementStats(movements)
    }, [movements])

    // Crear un map de id a nombre para categorías
    const categoryNameMap = useMemo(() => {
        const map: Record<string, string> = {}
        categories.forEach(cat => { map[cat._id] = cat.name })
        return map
    }, [categories])

    // Obtener nombres únicos de categorías presentes en movimientos
    const movementCategoryNames = useMemo(() => {
        const names = new Set<string>()
        movements.forEach(m => {
            const found = categories.find(cat => cat._id === m.category)
            if (found) {
                names.add(found.name)
            } else {
                names.add(m.category)
            }
        })
        return Array.from(names)
    }, [movements, categories])

    if (loading) {
        return <PageTransition variant="slideLeft"><Loader message="Cargando movimientos..." /></PageTransition>
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
    }

    const handleQuickMovementSubmit = async (data: QuickMovementData) => {
        setLoading(true)
        setError(null)
        try {
            await createMovement(data)
            await loadMovements(viewMode)
            setShowQuickMovement(false)
        } catch (err: any) {
            setError('Error al crear movimiento')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageTransition variant="slideLeft">
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
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
                    categories={categories.map(cat => cat.name)}
                />

                {/* Tabla de movimientos */}
                <MovementsTable movements={filteredMovements} categoryNameMap={categoryNameMap} />

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
        </PageTransition>
    )
}

export default Movements
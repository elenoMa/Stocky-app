import { useState, useMemo } from 'react'
import DashboardLayout from '../components/DashboardLayout '
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import FilterPanel from '../components/FilterPanel'
import MovementsTable from '../components/MovementsTable'
import QuickMovementModal from '../components/QuickMovementModal'
import ViewToggle from '../components/ViewToggle'
import type { Movement, QuickMovementData } from '../types/movement'
import { calculateMovementStats, filterMovements } from '../utils/movementUtils'

const mockMovements: Movement[] = [
    {
        id: '1',
        productName: 'Yerba',
        category: 'Bebidas',
        type: 'entrada',
        quantity: 50,
        previousStock: 20,
        newStock: 70,
        reason: 'Compra proveedor',
        date: '2024-01-15T10:30:00',
        user: 'Mariano',
        cost: 275.00,
        notes: 'Lote #2024-001'
    },
    {
        id: '2',
        productName: 'Café',
        category: 'Bebidas',
        type: 'salida',
        quantity: 5,
        previousStock: 15,
        newStock: 10,
        reason: 'Venta',
        date: '2024-01-15T14:20:00',
        user: 'Ana',
        notes: 'Cliente: Restaurante Central'
    },
    {
        id: '3',
        productName: 'Fideos',
        category: 'Alimentos',
        type: 'entrada',
        quantity: 100,
        previousStock: 30,
        newStock: 130,
        reason: 'Compra proveedor',
        date: '2024-01-14T09:15:00',
        user: 'Mariano',
        cost: 200.00,
        notes: 'Promoción especial'
    },
    {
        id: '4',
        productName: 'Detergente',
        category: 'Limpieza',
        type: 'salida',
        quantity: 8,
        previousStock: 25,
        newStock: 17,
        reason: 'Uso interno',
        date: '2024-01-14T16:45:00',
        user: 'Carlos',
        notes: 'Limpieza oficina'
    },
    {
        id: '5',
        productName: 'Yerba',
        category: 'Bebidas',
        type: 'salida',
        quantity: 10,
        previousStock: 70,
        newStock: 60,
        reason: 'Venta',
        date: '2024-01-13T11:30:00',
        user: 'Ana',
        notes: 'Cliente: Cafetería Express'
    },
    {
        id: '6',
        productName: 'Papel Higiénico',
        category: 'Limpieza',
        type: 'entrada',
        quantity: 200,
        previousStock: 50,
        newStock: 250,
        reason: 'Compra proveedor',
        date: '2024-01-13T08:00:00',
        user: 'Mariano',
        cost: 400.00,
        notes: 'Stock de seguridad'
    }
]

const Movements = () => {
    const [movements] = useState<Movement[]>(mockMovements)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'todos' | 'entrada' | 'salida'>('todos')
    const [filterCategory, setFilterCategory] = useState('todos')
    const [filterDate, setFilterDate] = useState('')
    const [showQuickMovement, setShowQuickMovement] = useState(false)
    const [viewMode, setViewMode] = useState<'recent' | 'all'>('recent')

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
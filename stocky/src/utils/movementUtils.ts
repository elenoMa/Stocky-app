import type { Movement, MovementStats } from '../types/movement'

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const getMovementColor = (type: 'entrada' | 'salida') => {
    return type === 'entrada' ? 'text-green-600' : 'text-red-600'
}

export const calculateMovementStats = (movements: Movement[]): MovementStats => {
    const totalMovements = movements.length
    const entradas = movements.filter(m => m.type === 'entrada').length
    const salidas = movements.filter(m => m.type === 'salida').length
    const totalEntradas = movements
        .filter(m => m.type === 'entrada')
        .reduce((sum, m) => sum + m.quantity, 0)
    const totalSalidas = movements
        .filter(m => m.type === 'salida')
        .reduce((sum, m) => sum + m.quantity, 0)
    const valorTotal = movements
        .filter(m => m.cost)
        .reduce((sum, m) => sum + (m.cost || 0), 0)

    return {
        totalMovements,
        entradas,
        salidas,
        totalEntradas,
        totalSalidas,
        valorTotal
    }
}

export const filterMovements = (
    movements: Movement[],
    searchTerm: string,
    filterType: 'todos' | 'entrada' | 'salida',
    filterCategory: string,
    filterDate: string,
    viewMode: 'recent' | 'all'
) => {
    let filtered = movements

    // Filtrar por búsqueda
    if (searchTerm) {
        filtered = filtered.filter(movement =>
            movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    // Filtrar por tipo
    if (filterType !== 'todos') {
        filtered = filtered.filter(movement => movement.type === filterType)
    }

    // Filtrar por categoría
    if (filterCategory !== 'todos') {
        filtered = filtered.filter(movement => movement.category === filterCategory)
    }

    // Filtrar por fecha
    if (filterDate) {
        filtered = filtered.filter(movement => 
            movement.date.startsWith(filterDate)
        )
    }

    // Filtrar por vista (recientes vs todos)
    if (viewMode === 'recent') {
        filtered = filtered.slice(0, 10) // Solo últimos 10
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
} 
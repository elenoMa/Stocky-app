export interface Movement {
    id: string
    productName: string
    category: string
    type: 'entrada' | 'salida'
    quantity: number
    previousStock: number
    newStock: number
    reason: string
    date: string
    user: string
    cost?: number
    notes?: string
}

export interface MovementStats {
    totalMovements: number
    entradas: number
    salidas: number
    totalEntradas: number
    totalSalidas: number
    valorTotal: number
}

export interface QuickMovementData {
    productId: string
    type: 'entrada' | 'salida'
    quantity: number
    reason: string
    user: string
    cost?: number
    notes?: string
} 
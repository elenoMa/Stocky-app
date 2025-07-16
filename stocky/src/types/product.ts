export interface Product {
    id: string
    name: string
    category: string
    stock: number
    price: number
    minStock: number
    maxStock: number
    supplier: string | { _id: string, name: string, active?: boolean } | null
    sku: string
    description?: string
    lastUpdated: string
    status: 'active' | 'inactive' | 'low-stock'
}

export interface ProductStats {
    totalProducts: number
    activeProducts: number
    lowStockProducts: number
    totalValue: number
    averagePrice: number
    totalStock: number
}

export interface ProductFormData {
    name: string
    category: string
    stock: number
    price: number
    minStock: number
    maxStock: number
    supplier: string
    sku: string
    description: string
} 
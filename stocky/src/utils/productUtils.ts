import type { Product, ProductStats } from '../types/product'

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

export const calculateProductStats = (products: Product[]): ProductStats => {
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.status === 'active').length
    const lowStockProducts = products.filter(p => p.status === 'low-stock').length
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0)
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

    return {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalValue,
        averagePrice,
        totalStock
    }
}

export const filterAndSortProducts = (
    products: Product[],
    searchTerm: string,
    filterCategory: string,
    filterStatus: 'todos' | 'active' | 'inactive' | 'low-stock',
    sortBy: 'name' | 'stock' | 'price' | 'lastUpdated',
    sortOrder: 'asc' | 'desc'
) => {
    let filtered = products

    // Filtrar por búsqueda
    if (searchTerm) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    // Filtrar por categoría
    if (filterCategory !== 'todos') {
        filtered = filtered.filter(product => product.category === filterCategory)
    }

    // Filtrar por estado
    if (filterStatus !== 'todos') {
        filtered = filtered.filter(product => product.status === filterStatus)
    }

    // Ordenar
    filtered.sort((a, b) => {
        let aValue = a[sortBy]
        let bValue = b[sortBy]
        
        if (sortBy === 'lastUpdated') {
            aValue = new Date(a.lastUpdated).getTime()
            bValue = new Date(b.lastUpdated).getTime()
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

    return filtered
} 
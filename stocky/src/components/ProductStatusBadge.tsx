interface ProductStatusBadgeProps {
    status: 'active' | 'inactive' | 'low-stock'
}

const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-100'
            case 'inactive': return 'text-gray-600 bg-gray-100'
            case 'low-stock': return 'text-red-600 bg-red-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return '✅'
            case 'inactive': return '⏸️'
            case 'low-stock': return '⚠️'
            default: return '❓'
        }
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status)} {status}
        </span>
    )
}

export default ProductStatusBadge 
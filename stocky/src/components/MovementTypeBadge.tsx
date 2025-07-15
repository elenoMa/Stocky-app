interface MovementTypeBadgeProps {
    type: 'entrada' | 'salida'
}

const MovementTypeBadge = ({ type }: MovementTypeBadgeProps) => {
    const getMovementIcon = (type: 'entrada' | 'salida') => {
        return type === 'entrada' ? '📥' : '📤'
    }

    const getMovementColor = (type: 'entrada' | 'salida') => {
        return type === 'entrada' ? 'text-green-600' : 'text-red-600'
    }

    const getMovementBgColor = (type: 'entrada' | 'salida') => {
        return type === 'entrada' ? 'bg-green-100' : 'bg-red-100'
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementBgColor(type)} ${getMovementColor(type)}`}>
            {getMovementIcon(type)} {type}
        </span>
    )
}

export default MovementTypeBadge 
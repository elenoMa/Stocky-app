interface EmptyStateProps {
    icon: string
    title: string
    description: string
    actionButton?: {
        text: string
        onClick: () => void
    }
}

const EmptyState = ({ icon, title, description, actionButton }: EmptyStateProps) => {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4">{description}</p>
            {actionButton && (
                <button
                    onClick={actionButton.onClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {actionButton.text}
                </button>
            )}
        </div>
    )
}

export default EmptyState 
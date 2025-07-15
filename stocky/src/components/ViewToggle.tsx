interface ViewToggleProps {
    currentView: string
    onViewChange: (view: string) => void
    options: {
        value: string
        label: string
        icon: string
    }[]
}

const ViewToggle = ({ currentView, onViewChange, options }: ViewToggleProps) => {
    return (
        <div className="flex gap-2">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onViewChange(option.value)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentView === option.value 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {option.icon} {option.label}
                </button>
            ))}
        </div>
    )
}

export default ViewToggle 
interface SearchBarProps {
    placeholder: string
    value: string
    onChange: (value: string) => void
    icon?: string
}

const SearchBar = ({ placeholder, value, onChange, icon = "🔍" }: SearchBarProps) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
        </div>
    )
}

export default SearchBar 
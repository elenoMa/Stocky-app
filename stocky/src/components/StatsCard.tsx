interface StatsCardProps {
    icon: string
    title: string
    value: string | number
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'pink'
}

const StatsCard = ({ icon, title, value, color }: StatsCardProps) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        red: 'bg-red-100 text-red-600',
        pink: 'bg-pink-100 text-pink-600'
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
                <div className={`p-2 ${colorClasses[color]} rounded-lg`}>
                    <span className="text-xl">{icon}</span>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    )
}

export default StatsCard 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Bebidas', value: 40 },
    { name: 'Alimentos', value: 30 },
    { name: 'Limpieza', value: 20 },
    { name: 'Otros', value: 10 },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']

export default function StockCharts() {
    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-bold mb-2">📊 Stock por Categoría</h2>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

interface Movement {
    product: string
    type: 'Entrada' | 'Salida'
    quantity: number
    date: string
}

const movements: Movement[] = [
    { product: 'Fideos', type: 'Entrada', quantity: 20, date: '2025-07-12' },
    { product: 'Café', type: 'Salida', quantity: -2, date: '2025-07-11' },
    { product: 'Yerba', type: 'Entrada', quantity: 10, date: '2025-07-10' },
]

export default function RecentMovementsTable() {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">📜 Últimos Movimientos</h2>
            <table className="w-full text-left border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Producto</th>
                        <th className="p-2 border">Tipo</th>
                        <th className="p-2 border">Cantidad</th>
                        <th className="p-2 border">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {movements.map((m, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="p-2 border">{m.product}</td>
                            <td className="p-2 border">{m.type}</td>
                            <td
                                className={`p-2 border ${m.quantity < 0 ? 'text-red-600' : 'text-green-600'
                                    }`}
                            >
                                {m.quantity}
                            </td>
                            <td className="p-2 border">{m.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

interface StockAlert {
    name: string;
    stock: number;
    minStock: number;
}

interface StockAlertsPanelProps {
    alerts: StockAlert[];
}

const StockAlertsPanel = ({ alerts }: StockAlertsPanelProps) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Alertas de Stock</h2>
            <ul className="space-y-2">
                {alerts.length === 0 && <li className="text-gray-500">No hay productos en bajo stock.</li>}
                {alerts.map((p) => (
                    <li
                        key={p.name}
                        className={`flex items-center justify-between p-2 rounded-md border border-gray-200 
                            ${p.stock <= p.minStock ? "bg-red-100" : "bg-yellow-100"}`}
                    >
                        <span>{p.name}</span>
                        <span>{p.stock} u.</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default StockAlertsPanel;
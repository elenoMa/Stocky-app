interface StockAlert {
    name: string;
    stock: number;
    minStock: number;
}

const alertProducts: StockAlert[] = [
    {
        name: "Producto 1",
        stock: 10,
        minStock: 10,
    },
    {
        name: "Producto 2",
        stock: 5,
        minStock: 10,
    },
    {
        name: "Producto 3",
        stock: 5,
        minStock: 10,
    },
    {
        name: "Producto 4",
        stock: 11,
        minStock: 10,
    },

]

const StockAlertsPanel = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Alertas de Stock</h2>
            <ul className="space-y-2">
                {alertProducts.map((p) => (
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
        </div >
    )
}

export default StockAlertsPanel;
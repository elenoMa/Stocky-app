import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend, CartesianGrid, Label, Sector } from 'recharts'
import { useMemo, useState } from 'react'
import type { Movement } from '../types/movement'
import type { Product } from '../types/product'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#3B82F6', '#F59E42', '#A3E635', '#F472B6']

type Category = { _id: string; name: string; color?: string }

interface StockChartsProps {
    products: Product[]
    categories: Category[]
    movements?: Movement[]
}

function getPercent(value: number, total: number) {
    if (!total || isNaN(value) || isNaN(total)) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
}

export default function StockCharts({ products = [], categories = [], movements = [] }: StockChartsProps) {
    // Estado del filtro
    const [filterStatus, setFilterStatus] = useState<'todos' | 'active' | 'inactive' | 'low-stock'>('todos');

    // Filtrar productos según el estado seleccionado
    const filteredProducts = useMemo(() => {
        if (filterStatus === 'todos') return products;
        if (filterStatus === 'low-stock') {
            return products.filter(p => p.stock <= p.minStock);
        }
        return products.filter(p => p.status === filterStatus);
    }, [products, filterStatus]);

    // Map category id to name
    const categoryNameMap = useMemo(() => (categories as Category[]).reduce((acc: Record<string, string>, cat) => {
        acc[cat._id] = cat.name;
        return acc;
    }, {}), [categories]);
    // Mapear nombre de categoría a color personalizado si existe
    const categoryColorMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const cat of categories) {
            if (cat.name && cat.color) {
                map[cat.name] = cat.color;
            }
        }
        return map;
    }, [categories]);
    // Agrupar stock, valor y cantidad de productos por categoría, y detectar alertas
    const summary = useMemo(() => {
        const map: Record<string, { stock: number; productCount: number; totalValue: number; lowStock: boolean; highStock: boolean }> = {};
        for (const product of filteredProducts) {
            const catName = categoryNameMap[product.category] || product.category || 'Sin categoría';
            if (!map[catName]) map[catName] = { stock: 0, productCount: 0, totalValue: 0, lowStock: false, highStock: false };
            map[catName].stock += product.stock;
            map[catName].productCount += 1;
            map[catName].totalValue += product.stock * product.price;
            if (product.stock <= product.minStock) map[catName].lowStock = true;
            if (product.stock >= product.maxStock) map[catName].highStock = true;
        }
        return map;
    }, [filteredProducts, categoryNameMap]);
    const totalStock = useMemo(() => Object.values(summary).reduce((sum, cat) => sum + cat.stock, 0), [summary]);
    // Convertir a array para la gráfica
    const data = useMemo(() => Object.entries(summary)
        .filter(([_, v]) => v.stock > 0 && !isNaN(v.stock))
        .map(([name, v]) => ({
            name,
            value: isNaN(v.stock) ? 0 : v.stock,
            productCount: v.productCount,
            totalValue: v.totalValue,
            lowStock: v.lowStock,
            highStock: v.highStock
        })), [summary, totalStock]);

    // Identificar la categoría con mayor y menor stock
    const maxStock = data.length > 0 ? Math.max(...data.map((d: any) => d.value)) : null;
    const minStock = data.length > 0 ? Math.min(...data.map((d: any) => d.value)) : null;
    const maxCategory = data.find((d: any) => d.value === maxStock)?.name;
    const minCategory = data.find((d: any) => d.value === minStock)?.name;

    // Mueve aquí la función CustomTooltip
    function CustomTooltip({ active, payload }: any) {
        if (active && payload && payload.length) {
            const { name, value, percent, productCount, totalValue, lowStock, highStock } = payload[0].payload;
            // Iconos para mayor/menor stock
            let extraIcon = '';
            if (name === maxCategory) extraIcon = ' ⭐';
            if (name === minCategory) extraIcon = ' 🥉';
            return (
                <div className="bg-white p-2 rounded shadow text-sm min-w-[180px]">
                    <div className="font-bold mb-1">
                        {name} {extraIcon} {lowStock ? <span className="text-yellow-600">⚠️ Bajo</span> : highStock ? <span className="text-green-600">🟢 Alto</span> : null}
                    </div>
                    <div><b>Stock:</b> {value}</div>
                    <div><b>Porcentaje:</b> {(percent * 100).toFixed(1)}%</div>
                    <div><b>Productos:</b> {productCount}</div>
                    <div><b>Valor total:</b> ${totalValue.toLocaleString()}</div>
                    {lowStock && <div className="text-yellow-600 mt-1">⚠️ Alerta: Stock bajo en al menos un producto</div>}
                    {highStock && <div className="text-green-600 mt-1">🟢 Alerta: Stock alto en al menos un producto</div>}
                </div>
            );
        }
        return null;
    }

    // --- Tendencia temporal ---
    // Agrupar movimientos por fecha y categoría (últimos 30 días)
    const trendData = useMemo(() => {
        if (!movements.length) return [];
        // Obtener fechas únicas (últimos 30 días)
        const now = new Date();
        const days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (29 - i));
            return d.toISOString().slice(0, 10);
        });
        // Map: { [date]: { [category]: stock } }
        const byDate: Record<string, Record<string, number>> = {};
        for (const day of days) byDate[day] = {};
        // Agrupar movimientos por fecha y categoría (normalizando nombres)
        movements.forEach(mov => {
            const date = mov.date.slice(0, 10);
            // Buscar la categoría normalizada en el map
            const cat = Object.values(categoryNameMap).find(
                name => normalize(name) === normalize(mov.category)
            ) || mov.category;
            if (byDate[date]) {
                byDate[date][cat] = (byDate[date][cat] || 0) + mov.quantity;
            }
        });
        // Para cada fecha, sumar el stock por categoría
        return days.map(date => {
            const entry: Record<string, any> = { date };
            for (const cat of Object.values(categoryNameMap)) {
                entry[cat] = byDate[date]?.[cat] || 0;
            }
            return entry;
        });
    }, [movements, categoryNameMap]);

    // Label externo personalizado para el gráfico de torta
    function renderCustomizedLabel(props: any) {
        const {
            cx, cy, midAngle, innerRadius, outerRadius, percent, name, lowStock, highStock
        } = props;
        const RADIAN = Math.PI / 180;
        // Posición fuera del gráfico
        const radius = outerRadius + 24;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        // Icono de alerta
        let icon = '';
        if (lowStock) icon = '⚠️';
        else if (highStock) icon = '🟢';
        // Icono para mayor/menor stock
        if (name === maxCategory) icon += ' ⭐';
        if (name === minCategory) icon += ' 🥉';
        // Usar percent de Recharts (ya es decimal entre 0 y 1)
        const percentLabel = percent && !isNaN(percent) ? `${(percent * 100).toFixed(1)}%` : '0%';
        return (
            <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={13} fontWeight={name === maxCategory ? 700 : name === minCategory ? 600 : 400}>
                {name} ({percentLabel}) {icon}
            </text>
        );
    }

    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                <h2 className="text-lg font-bold">📊 Stock por Categoría</h2>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    <option value="low-stock">Stock bajo</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        labelLine
                        label={renderCustomizedLabel}
                        cornerRadius={8}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={categoryColorMap[entry.name] || COLORS[index % COLORS.length]}
                                stroke={entry.name === maxCategory ? '#FFD700' : entry.name === minCategory ? '#A0AEC0' : '#fff'}
                                strokeWidth={entry.name === maxCategory || entry.name === minCategory ? 4 : 1}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            {trendData.length > 0 && data.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-md font-semibold mb-2">📈 Tendencia de Stock por Categoría (últimos 30 días)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Legend />
                            {Object.values(categoryNameMap).map((cat, idx) => (
                                <Line key={cat} type="monotone" dataKey={cat} stroke={COLORS[idx % COLORS.length]} dot={false} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}

// Función para normalizar nombres (sin tildes, minúsculas)
function normalize(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/[0-\u036f]/g, '');
}

import { useState, useMemo, useEffect } from 'react'
import DashboardLayout from "../components/DashboardLayout "
import SummaryCards from "../components/SummaryCards";
import StockAlertsPanel from "../components/StockAlertsPanel";
import QuickStockOutForm from "../components/QuickStockOutForm";
import StockCharts from "../components/StockCharts";
import RecentMovementsTable from "../components/RecentMovementsTable";
import StatsCard from '../components/StatsCard'
import { fetchProducts, fetchMovements, fetchCategories, fetchMovementsStats } from '../services/api'
import { calculateProductStats } from '../utils/productUtils'
import { calculateMovementStats } from '../utils/movementUtils'
import ProductFormModal from '../components/ProductFormModal';
import QuickMovementModal from '../components/QuickMovementModal';
import { createProduct, createMovement, createCategory } from '../services/api';
import type { ProductFormData } from '../types/product';
import type { QuickMovementData } from '../types/movement';
import CategoryFormModal from '../components/CategoryFormModal';

// Datos mock más realistas
const mockDashboardData = {
    summary: {
        totalProducts: 156,
        lowStockProducts: 8,
        totalCategories: 12,
        totalValue: 45250.75,
        monthlyMovements: 89,
        activeSuppliers: 15
    },
    recentMovements: [
        { id: '1', product: 'Yerba Taragüí', type: 'entrada', quantity: 50, date: '2024-01-15T10:30:00', user: 'Mariano' },
        { id: '2', product: 'Café La Virginia', type: 'salida', quantity: 5, date: '2024-01-15T14:20:00', user: 'Ana' },
        { id: '3', product: 'Fideos Lucchetti', type: 'entrada', quantity: 100, date: '2024-01-14T09:15:00', user: 'Mariano' },
        { id: '4', product: 'Detergente Ala', type: 'salida', quantity: 8, date: '2024-01-14T16:45:00', user: 'Carlos' },
        { id: '5', product: 'Papel Higiénico', type: 'entrada', quantity: 200, date: '2024-01-13T08:00:00', user: 'Mariano' }
    ],
    lowStockAlerts: [
        { id: '1', product: 'Café La Virginia', currentStock: 3, minStock: 10, category: 'Bebidas' },
        { id: '2', product: 'Detergente Ala', currentStock: 5, minStock: 15, category: 'Limpieza' },
        { id: '3', product: 'Aceite de Oliva', currentStock: 2, minStock: 8, category: 'Alimentos' },
        { id: '4', product: 'Papel Higiénico', currentStock: 12, minStock: 20, category: 'Limpieza' }
    ],
    topProducts: [
        { name: 'Yerba Taragüí', sales: 45, stock: 70, category: 'Bebidas' },
        { name: 'Café La Virginia', sales: 38, stock: 3, category: 'Bebidas' },
        { name: 'Fideos Lucchetti', sales: 32, stock: 130, category: 'Alimentos' },
        { name: 'Detergente Ala', sales: 28, stock: 5, category: 'Limpieza' },
        { name: 'Aceite de Oliva', sales: 25, stock: 2, category: 'Alimentos' }
    ],
    notifications: [
        { id: '1', type: 'warning', message: 'Café La Virginia con stock crítico', time: '2 min' },
        { id: '2', type: 'info', message: 'Nuevo proveedor registrado: Distribuidora Norte', time: '15 min' },
        { id: '3', type: 'success', message: 'Backup automático completado', time: '1 hora' },
        { id: '4', type: 'error', message: 'Error en sincronización con proveedor', time: '2 horas' }
    ],
    quickActions: [
        { id: '1', title: 'Nuevo Producto', icon: '➕', color: 'blue', action: 'add-product' },
        { id: '2', title: 'Movimiento Rápido', icon: '📦', color: 'green', action: 'quick-movement' },
        { id: '3', title: 'Generar Reporte', icon: '📊', color: 'purple', action: 'generate-report' },
        { id: '4', title: 'Contactar Proveedor', icon: '📞', color: 'orange', action: 'contact-supplier' }
    ],
    performanceMetrics: {
        stockTurnover: 4.2,
        averageOrderValue: 1250.50,
        supplierPerformance: 92,
        inventoryAccuracy: 98.5
    },
    upcomingTasks: [
        { id: '1', title: 'Revisar inventario físico', date: '2024-01-16', priority: 'high' },
        { id: '2', title: 'Renovar contrato con proveedor', date: '2024-01-18', priority: 'medium' },
        { id: '3', title: 'Actualizar precios', date: '2024-01-20', priority: 'low' }
    ]
}

const Dashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week')
    const [showNotifications, setShowNotifications] = useState(false)
    const [products, setProducts] = useState([])
    const [movements, setMovements] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showProductModal, setShowProductModal] = useState(false);
    const [showQuickMovementModal, setShowQuickMovementModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [performanceMetrics, setPerformanceMetrics] = useState({
        stockTurnover: 0,
        averageOrderValue: 0,
        supplierPerformance: null,
        inventoryAccuracy: null
    });
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showStockAlertsModal, setShowStockAlertsModal] = useState(false);

    // Hoist loadData so it can be used by modals and useEffect
    const loadData = async () => {
        setLoading(true)
        setError(null)
        try {
            const productsData = await fetchProducts()
            const movementsData = await fetchMovements()
            const categoriesData = await fetchCategories()
            const movementStats = await fetchMovementsStats();
            // Forzar conversión de campos numéricos
            const products = (productsData.products || productsData).map((p: any) => ({
                ...p,
                stock: Number(p.stock),
                price: Number(p.price),
                minStock: Number(p.minStock),
                maxStock: Number(p.maxStock),
                status: p.status || 'active'
            }))
            setProducts(products)
            setMovements(movementsData.movements || movementsData)
            setCategories(categoriesData.categories || categoriesData)
            // Calcular métricas de rendimiento reales
            const stockTurnover = products.length > 0 ? parseFloat((movementStats.totalMovements / products.length).toFixed(2)) : 0;
            const averageOrderValue = products.length > 0 ? parseFloat((products.reduce((sum: number, p: any) => sum + p.price, 0) / products.length).toFixed(2)) : 0;
            setPerformanceMetrics({
                stockTurnover,
                averageOrderValue,
                supplierPerformance: null, // No disponible
                inventoryAccuracy: null // No disponible
            });
        } catch (err: any) {
            setError('Error al cargar datos del dashboard')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadData()
    }, [])

    const productStats = calculateProductStats(products)
    const movementStats = calculateMovementStats(movements)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getMovementIcon = (type: string) => {
        return type === 'entrada' ? '📥' : '📤'
    }

    const getMovementColor = (type: string) => {
        return type === 'entrada' ? 'text-green-600' : 'text-red-600'
    }

    const getNotificationIcon = (type: string) => {
        const icons = {
            warning: '⚠️',
            info: 'ℹ️',
            success: '✅',
            error: '❌'
        }
        return icons[type as keyof typeof icons] || 'ℹ️'
    }

    const getNotificationColor = (type: string) => {
        const colors = {
            warning: 'bg-yellow-50 border-yellow-200',
            info: 'bg-blue-50 border-blue-200',
            success: 'bg-green-50 border-green-200',
            error: 'bg-red-50 border-red-200'
        }
        return colors[type as keyof typeof colors] || 'bg-gray-50 border-gray-200'
    }

    const getPriorityColor = (priority: string) => {
        const colors = {
            high: 'text-red-600 bg-red-100',
            medium: 'text-yellow-600 bg-yellow-100',
            low: 'text-green-600 bg-green-100'
        }
        return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-100'
    }

    const handleQuickAction = (action: string) => {
        if (action === 'add-product') {
            setShowProductModal(true);
        } else if (action === 'quick-movement') {
            setShowQuickMovementModal(true);
        } else {
            // Placeholder for other actions
            console.log('Acción rápida:', action)
        }
    }

    // Product creation handler
    const handleProductSubmit = async (data: ProductFormData) => {
        setModalLoading(true);
        setModalError(null);
        try {
            // Convertir campos numéricos a number
            const payload = {
                ...data,
                stock: Number(data.stock),
                price: Number(data.price),
                minStock: Number(data.minStock),
                maxStock: Number(data.maxStock)
            };
            await createProduct(payload);
            await loadData();
            setShowProductModal(false);
        } catch (err: any) {
            let msg = 'Error al crear producto';
            if (err instanceof Error && err.message) {
                try {
                    // Intentar extraer mensaje del backend
                    const json = JSON.parse(err.message);
                    if (json && json.message) msg = json.message;
                } catch {
                    // Si no es JSON, usar el mensaje tal cual
                    msg = err.message;
                }
            }
            setModalError(msg);
        } finally {
            setModalLoading(false);
        }
    }

    // Movement creation handler
    const handleQuickMovementSubmit = async (data: QuickMovementData) => {
        setModalLoading(true);
        setModalError(null);
        try {
            await createMovement(data);
            await loadData();
            setShowQuickMovementModal(false);
        } catch (err: any) {
            setModalError('Error al crear movimiento');
        } finally {
            setModalLoading(false);
        }
    }

    // Category creation handler
    const handleCategorySubmit = async (data: { name: string; description: string; color: string }) => {
        try {
            await createCategory(data);
            await loadData();
            setShowCategoryModal(false);
        } catch (err) {
            alert('Error al crear la categoría');
        }
    };

    // Calcular productos en bajo stock
    const lowStockAlerts = useMemo(() =>
        products.filter((p: any) => p.stock <= p.minStock).map((p: any) => ({
            name: p.name,
            stock: p.stock,
            minStock: p.minStock
        })),
        [products]
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando dashboard...</div>
    }
    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
    }

    return (
        <DashboardLayout>
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">🏠 Dashboard</h1>
                        <p className="text-gray-600 mt-1">Vista general de tu inventario y actividad reciente</p>
                    </div>
                </div>

                {/* Panel de notificaciones */}
                {showNotifications && (
                    <div className="mb-6 bg-white rounded-lg shadow border p-4">
                        <h3 className="text-lg font-semibold mb-3">🔔 Notificaciones</h3>
                        <div className="space-y-2">
                            {mockDashboardData.notifications.map((notification) => (
                                <div key={notification.id} className={`p-3 rounded-lg border ${getNotificationColor(notification.type)}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span>{getNotificationIcon(notification.type)}</span>
                                            <span className="text-sm">{notification.message}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{notification.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tarjetas de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-8 mb-8">
                    <StatsCard
                        icon="📦"
                        title="Total Productos"
                        value={productStats.totalProducts}
                        color="blue"
                    />
                    <StatsCard
                        icon="⚠️"
                        title="Bajo Stock"
                        value={productStats.lowStockProducts}
                        color="red"
                        onClick={() => setShowStockAlertsModal(true)}
                    />
                    <StatsCard
                        icon="📁"
                        title="Categorías"
                        value={categories.length}
                        color="green"
                    />
                    <StatsCard
                        icon="💰"
                        title="Valor Total"
                        value={`$${productStats.totalValue.toLocaleString()}`}
                        color="purple"
                    />
                    <StatsCard
                        icon="📊"
                        title="Movimientos"
                        value={movementStats.totalMovements}
                        color="yellow"
                    />
                    <StatsCard
                        icon="🏢"
                        title="Proveedores"
                        value={mockDashboardData.summary.activeSuppliers}
                        color="pink"
                    />
                </div>

                {/* Acciones rápidas */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">⚡ Acciones Rápidas</h3>
                    <div className="grid grid-cols-3 grid-rows-2 gap-6">
                        {/* Columna izquierda: Nuevo Producto (arriba), Nueva Categoría (abajo) */}
                        <button
                            onClick={() => handleQuickAction('add-product')}
                            className="p-8 bg-white rounded-lg shadow border hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center min-h-[120px] row-start-1 col-start-1"
                        >
                            <div className="text-5xl mb-4">➕</div>
                            <div className="text-lg font-medium text-gray-700">Nuevo Producto</div>
                        </button>
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="p-8 bg-white rounded-lg shadow border hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center min-h-[120px] row-start-2 col-start-1"
                        >
                            <div className="text-5xl mb-4">📂</div>
                            <div className="text-lg font-medium text-gray-700">Nueva Categoría</div>
                        </button>
                        {/* Centro: Descontar Stock Rápido (ocupa dos filas) */}
                        <div className="p-8 bg-white rounded-lg shadow border flex flex-col items-center justify-center row-span-2 col-start-2 min-h-[260px]">
                            <div className="text-5xl mb-4">🔻</div>
                            <div className="text-lg font-medium text-gray-700 mb-4">Descontar Stock Rápido</div>
                            <div className="w-full max-w-xs">
                                <QuickStockOutForm />
                            </div>
                        </div>
                        {/* Columna derecha: Generar Reporte (arriba), Contactar Proveedor (abajo) */}
                        <button
                            onClick={() => alert('Funcionalidad a implementar. Próxima mejora.')}
                            className="p-8 bg-white rounded-lg shadow border hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center min-h-[120px] row-start-1 col-start-3"
                        >
                            <div className="text-5xl mb-4">📊</div>
                            <div className="text-lg font-medium text-gray-700">Generar Reporte</div>
                        </button>
                        <button
                            onClick={() => alert('Funcionalidad a implementar. Próxima mejora.')}
                            className="p-8 bg-white rounded-lg shadow border hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center min-h-[120px] row-start-2 col-start-3"
                        >
                            <div className="text-5xl mb-4">📞</div>
                            <div className="text-lg font-medium text-gray-700">Contactar Proveedor</div>
                        </button>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    {/* Gráficos */}
                    <div className="lg:col-span-2">
                        <StockCharts products={products} categories={categories} movements={movements} />
                    </div>

                    {/* Métricas de rendimiento */}
                    <div className="bg-white rounded-lg shadow border p-4">
                        <h3 className="text-lg font-semibold mb-4">📈 Métricas de Rendimiento</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600">Rotación de Stock</span>
                                    <span className="text-sm font-semibold">{performanceMetrics.stockTurnover}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(Number(performanceMetrics.stockTurnover) * 20, 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600">Valor Promedio</span>
                                    <span className="text-sm font-semibold">${performanceMetrics.averageOrderValue}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(Number(performanceMetrics.averageOrderValue) / 20, 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600">Rendimiento Proveedores</span>
                                    <span className="text-sm font-semibold text-gray-400">No disponible</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-200 h-2 rounded-full" style={{ width: `0%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600">Precisión Inventario</span>
                                    <span className="text-sm font-semibold text-gray-400">No disponible</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-200 h-2 rounded-full" style={{ width: `0%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tareas pendientes */}
                    <div className="bg-white rounded-lg shadow border p-4">
                        <h3 className="text-lg font-semibold mb-4">📋 Tareas Pendientes</h3>
                        <div className="space-y-3">
                            {mockDashboardData.upcomingTasks.map((task) => (
                                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{task.title}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">{new Date(task.date).toLocaleDateString('es-ES')}</div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver todas las tareas →
                        </button>
                    </div>
                </div>

                {/* Sección inferior */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Movimientos recientes */}
                    <div className="bg-white rounded-lg shadow border">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">📜 Movimientos Recientes</h2>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                {mockDashboardData.recentMovements.map((movement) => (
                                    <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{getMovementIcon(movement.type)}</span>
                                            <div>
                                                <p className="font-medium text-gray-900">{movement.product}</p>
                                                <p className="text-sm text-gray-500">{movement.user} • {formatDate(movement.date)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${getMovementColor(movement.type)}`}>
                                                {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">{movement.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Ver todos los movimientos →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Productos más vendidos */}
                    <div className="bg-white rounded-lg shadow border">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">🔥 Productos Más Vendidos</h2>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                {mockDashboardData.topProducts.map((product, index) => (
                                    <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{product.sales} ventas</p>
                                            <p className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-gray-500'}`}>
                                                Stock: {product.stock}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Ver todos los productos →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals for quick actions */}
                <ProductFormModal
                    show={showProductModal}
                    onClose={() => { setShowProductModal(false); setModalError(null); }}
                    product={null}
                    onSubmit={handleProductSubmit}
                />
                <QuickMovementModal
                    show={showQuickMovementModal}
                    onClose={() => { setShowQuickMovementModal(false); setModalError(null); }}
                    onSubmit={handleQuickMovementSubmit}
                />
                <CategoryFormModal
                    show={showCategoryModal}
                    onClose={() => setShowCategoryModal(false)}
                    category={null}
                    onSubmit={handleCategorySubmit}
                />
                {/* Optional: show error/loading for modals */}
                {modalLoading && <div className="fixed inset-0 flex items-center justify-center z-50"><div className="bg-white p-4 rounded shadow">Guardando...</div></div>}
                {modalError && <div className="fixed inset-0 flex items-center justify-center z-50"><div className="bg-red-100 text-red-700 p-4 rounded shadow">{modalError}</div></div>}

                {/* Modal de alertas de stock */}
                {showStockAlertsModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                                onClick={() => setShowStockAlertsModal(false)}
                            >
                                ×
                            </button>
                            <StockAlertsPanel alerts={lowStockAlerts} />
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;
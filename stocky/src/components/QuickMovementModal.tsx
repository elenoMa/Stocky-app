import type { QuickMovementData } from '../types/movement'

interface QuickMovementModalProps {
    show: boolean
    onClose: () => void
    onSubmit: (data: QuickMovementData) => void
}

const QuickMovementModal = ({ show, onClose, onSubmit }: QuickMovementModalProps) => {
    if (!show) return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = {
            type: formData.get('type') as 'entrada' | 'salida',
            product: formData.get('product') as string,
            quantity: parseInt(formData.get('quantity') as string),
            reason: formData.get('reason') as string,
            notes: formData.get('notes') as string || undefined
        }
        onSubmit(data)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">⚡ Movimiento Rápido</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de movimiento
                        </label>
                        <select 
                            name="type"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="entrada">📥 Entrada</option>
                            <option value="salida">📤 Salida</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Producto
                        </label>
                        <select 
                            name="product"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar producto...</option>
                            <option value="yerba">Yerba</option>
                            <option value="cafe">Café</option>
                            <option value="fideos">Fideos</option>
                            <option value="detergente">Detergente</option>
                            <option value="papel-higienico">Papel Higiénico</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad
                        </label>
                        <input
                            name="quantity"
                            type="number"
                            min="1"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo
                        </label>
                        <select 
                            name="reason"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar motivo...</option>
                            <option value="venta">Venta</option>
                            <option value="compra">Compra proveedor</option>
                            <option value="uso-interno">Uso interno</option>
                            <option value="ajuste">Ajuste de inventario</option>
                            <option value="devolucion">Devolución</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas (opcional)
                        </label>
                        <textarea
                            name="notes"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            placeholder="Información adicional..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Crear Movimiento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default QuickMovementModal 
interface Category {
    id: string
    name: string
    description: string
    productCount: number
    color: string
}

interface CategoryFormModalProps {
    show: boolean
    onClose: () => void
    category?: Category | null
    onSubmit: (data: { name: string; description: string; color: string }) => void
}

const CategoryFormModal = ({ show, onClose, category, onSubmit }: CategoryFormModalProps) => {
    if (!show) return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            color: formData.get('color') as string
        }
        onSubmit(data)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-modal-in">
                <h2 className="text-xl font-bold mb-4">
                    {category ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la categoría
                        </label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={category?.name || ''}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Bebidas, Alimentos..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            defaultValue={category?.description || ''}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Describe brevemente esta categoría..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color de identificación
                        </label>
                        <select 
                            name="color"
                            defaultValue={category?.color || 'bg-blue-100'}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="bg-blue-100">Azul</option>
                            <option value="bg-green-100">Verde</option>
                            <option value="bg-yellow-100">Amarillo</option>
                            <option value="bg-red-100">Rojo</option>
                            <option value="bg-purple-100">Púrpura</option>
                            <option value="bg-pink-100">Rosa</option>
                        </select>
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {category ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes modal-in {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-modal-in {
                    animation: modal-in 0.25s cubic-bezier(.4,1.7,.7,1.1);
                }
            `}</style>
        </div>
    )
}

export default CategoryFormModal 
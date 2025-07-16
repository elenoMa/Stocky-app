import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormData {
    code: string;
    quantity: number;
    type: 'entrada' | 'salida';
}

interface QuickStockOutFormProps {
    onSubmit: (data: { code: string; quantity: number; type: 'entrada' | 'salida' }) => void | Promise<void>;
}

const QuickStockOutForm = ({ onSubmit }: QuickStockOutFormProps) => {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const [type, setType] = useState<'entrada' | 'salida'>('salida');
    const handleFormSubmit = async (data: Omit<FormData, 'type'>) => {
        const payload = { ...data, type };
        await onSubmit(payload);
        reset();
    }
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Movimiento Rápido de Stock</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
                <div className="flex gap-2 mb-2">
                    <button
                        type="button"
                        className={`flex-1 p-2 rounded ${type === 'entrada' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setType('entrada')}
                    >
                        ➕ Entrada
                    </button>
                    <button
                        type="button"
                        className={`flex-1 p-2 rounded ${type === 'salida' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setType('salida')}
                    >
                        ➖ Salida
                    </button>
                </div>
                <input
                    {...register("code", { required: "El código es requerido" })}
                    type="text"
                    placeholder="Código de Producto"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    {...register('quantity', { required: true, min: 1 })}
                    placeholder="Cantidad"
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    className={`w-full p-2 rounded ${type === 'entrada' ? 'bg-green-600' : 'bg-red-600'} text-white`}
                >
                    {type === 'entrada' ? 'Agregar Stock' : 'Descontar Stock'}
                </button>
            </form>
        </div>
    )
}

export default QuickStockOutForm;
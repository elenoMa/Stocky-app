import { useForm } from "react-hook-form";

interface FromData {
    code: string;
    quantity: number;
}

const QuickStockOutForm = () => {
    const { register, handleSubmit } = useForm<FromData>();
    const onSubmit = (data: FromData) => {
        console.log(data);
    }
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Descontar Stock Rápido</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <input
                    {...register("code", { required: "El código es requerido" })}
                    type="text"
                    placeholder="Código de Producto"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    {...register('quantity')}
                    placeholder="Cantidad"
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >Descontar Stock</button>
            </form>
        </div>
    )
}

export default QuickStockOutForm;
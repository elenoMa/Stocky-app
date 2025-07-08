import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex justify-between item-center bg-blue-600 text-white px-6 py-4 shadow">
            <div className="flex gap-4 items-center">
                <Link to="/dashboard" className="text-xl font-bold">Stocky App</Link>
                <NavLink to="/dashboard" className="hover:underline">Dashboard</NavLink>
                <NavLink to="/porducts" className="hover:underline">Productos</NavLink>
                <NavLink to="/dashboard" className="hover:underline">Movimientos</NavLink>
                <NavLink to="/dashboard" className="hover:underline">Categorías</NavLink>
            </div>
            <div className="flex gap-4 items-center">
                <span>👤 Mariano Eleno</span>
                <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-700 ">❌ Cerrar sesión</button>
            </div>
        </nav>
    );
}
export default Navbar;
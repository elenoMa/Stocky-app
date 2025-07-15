const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
}

const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return res.json();
}


const fetchMovements = async () => {
    const res = await fetch(`${API_URL}/movements`);
    if (!res.ok) throw new Error("Error al obtener los movimientos");
    return res.json();
}

export { fetchProducts, fetchCategories, fetchMovements };
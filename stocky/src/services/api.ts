import type { Product, ProductFormData } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function buildHeaders(contentType = true) {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`, {
        headers: buildHeaders()
    });
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
}

const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`, {
        headers: buildHeaders()
    });
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return res.json();
}


const fetchMovements = async () => {
    const res = await fetch(`${API_URL}/movements?limit=1000`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener los movimientos");
    return res.json();
}

const fetchRecentMovements = async () => {
    const res = await fetch(`${API_URL}/movements/recent`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener movimientos recientes');
    return res.json();
}

const fetchMovementsTotal = async () => {
    const res = await fetch(`${API_URL}/movements?limit=1`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener el total de movimientos");
    const data = await res.json();
    // El total viene en data.pagination.total
    return data.pagination?.total || 0;
}

const createProduct = async (product: ProductFormData) => {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(product)
    });
    if (!res.ok) {
        throw new Error('Failed to create product');
    }
    return res.json();
}

const updateProduct = async (id: string, product: Partial<ProductFormData>) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(product)
    });
    if (!res.ok) {
        throw new Error('Failed to update product');
    }
    return res.json();
}

const deleteProduct = async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(false)
    });
    if (!res.ok) {
        throw new Error('Failed to delete product');
    }
    return res.json();
}

const createMovement = async (movement: any) => {
    const res = await fetch(`${API_URL}/movements`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(movement)
    });
    if (!res.ok) {
        throw new Error('Failed to create movement');
    }
    return res.json();
}

const fetchMovementsStats = async () => {
    const res = await fetch(`${API_URL}/movements/stats`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener estadísticas de movimientos");
    return res.json();
}

const createCategory = async (category: { name: string; description?: string; color?: string }) => {
    const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return res.json();
}

const updateCategory = async (id: string, category: { name: string; description?: string; color?: string }) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Error al actualizar categoría');
    return res.json();
}

const deleteCategory = async (id: string) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(false)
    });
    if (!res.ok) throw new Error('Error al eliminar categoría');
    return res.json();
}

export { fetchProducts, fetchCategories, fetchMovements, fetchRecentMovements, createProduct, updateProduct, deleteProduct, createMovement, fetchMovementsTotal, fetchMovementsStats, createCategory, updateCategory, deleteCategory };
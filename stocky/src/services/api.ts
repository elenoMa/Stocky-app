import type { Product, ProductFormData } from '../types/product';
import type { Supplier } from '../types/supplier';
import { isTokenExpired } from '../utils/tokenUtils';

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

// Wrapper para manejar refresh automático
async function fetchWithAuth(input: RequestInfo, init?: RequestInit, retry = true): Promise<Response> {
  let token = getToken();
  let headers = (init?.headers as Record<string, string>) || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(input, { ...init, headers });
    if (res.status !== 401 || !retry) return res;
    // Intentar refresh
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!refreshRes.ok) {
      // refresh falló, sesión expirada
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
    const data = await refreshRes.json();
    token = data.token;
    if (localStorage.getItem('token')) {
      localStorage.setItem('token', token || '');
    } else {
      sessionStorage.setItem('token', token || '');
    }
    // Reintentar petición original con nuevo token
    headers['Authorization'] = `Bearer ${token}`;
    return fetch(input, { ...init, headers });
  } catch (err) {
    throw err;
  }
}

const fetchProducts = async () => {
    const res = await fetchWithAuth(`${API_URL}/products`, {
        headers: buildHeaders()
    });
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
}

const fetchCategories = async () => {
    const res = await fetchWithAuth(`${API_URL}/categories`, {
        headers: buildHeaders()
    });
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return res.json();
}

const fetchMovements = async () => {
    const res = await fetchWithAuth(`${API_URL}/movements?limit=1000`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener los movimientos");
    return res.json();
}

const fetchRecentMovements = async () => {
    const res = await fetchWithAuth(`${API_URL}/movements/recent`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener movimientos recientes');
    return res.json();
}

const fetchMovementsTotal = async () => {
    const res = await fetchWithAuth(`${API_URL}/movements?limit=1`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener el total de movimientos");
    const data = await res.json();
    // El total viene en data.pagination.total
    return data.pagination?.total || 0;
}

const createProduct = async (product: ProductFormData) => {
    const res = await fetchWithAuth(`${API_URL}/products`, {
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
    const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
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
    const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(false)
    });
    if (!res.ok) {
        throw new Error('Failed to delete product');
    }
    return res.json();
}

const createMovement = async (movement: any) => {
    const res = await fetchWithAuth(`${API_URL}/movements`, {
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
    const res = await fetchWithAuth(`${API_URL}/movements/stats`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener estadísticas de movimientos");
    return res.json();
}

const createCategory = async (category: { name: string; description?: string; color?: string }) => {
    const res = await fetchWithAuth(`${API_URL}/categories`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return res.json();
}

const updateCategory = async (id: string, category: { name: string; description?: string; color?: string }) => {
    const res = await fetchWithAuth(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Error al actualizar categoría');
    return res.json();
}

const deleteCategory = async (id: string) => {
    const res = await fetchWithAuth(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(false)
    });
    if (!res.ok) throw new Error('Error al eliminar categoría');
    return res.json();
}

const fetchUsers = async () => {
    const res = await fetchWithAuth(`${API_URL}/users`, {
        headers: buildHeaders()
    });
    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return res.json();
}

const createUser = async (user: { username: string; email: string; password: string; role: string }) => {
    const res = await fetchWithAuth(`${API_URL}/users`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(user)
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al crear usuario');
    }
    return res.json();
}

const updateUser = async (id: string, user: { username?: string; email?: string; password?: string; role?: string }) => {
    const res = await fetchWithAuth(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(user)
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al editar usuario');
    }
    return res.json();
}

const deleteUser = async (id: string) => {
    const res = await fetchWithAuth(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(false)
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al eliminar usuario');
    }
    return res.json();
}

const fetchSuppliers = async () => {
    const res = await fetchWithAuth(`${API_URL}/suppliers`, {
        headers: buildHeaders()
    });
    if (!res.ok) {
        throw new Error('Failed to fetch suppliers');
    }
    return res.json();
}

const createSupplier = async (supplier: Partial<Supplier>) => {
    const res = await fetchWithAuth(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(supplier)
    });
    if (!res.ok) {
        throw new Error('Error al crear proveedor');
    }
    return res.json();
}

const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
    const res = await fetchWithAuth(`${API_URL}/suppliers/${id}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(supplier)
    });
    if (!res.ok) {
        throw new Error('Error al actualizar proveedor');
    }
    return res.json();
}

const deleteSupplier = async (id: string) => {
    const res = await fetchWithAuth(`${API_URL}/suppliers/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(false)
    });
    if (!res.ok) {
        throw new Error('Error al eliminar proveedor');
    }
    return res.json();
}

const fetchTopSellingProducts = async (limit = 5) => {
    const res = await fetchWithAuth(`${API_URL}/movements/top-selling?limit=${limit}`, {
        headers: buildHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener productos más vendidos');
    return res.json();
}

// --- TAREAS ---
export type Task = {
  _id: string;
  description: string;
  completed: boolean;
  priority: 'alta' | 'media' | 'baja';
  color: string;
  createdAt: string;
};

const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetchWithAuth(`${API_URL}/tasks`, { headers: buildHeaders() });
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
};

const createTask = async (description: string, priority = 'media', color = '#3b82f6'): Promise<Task> => {
  const res = await fetchWithAuth(`${API_URL}/tasks`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ description, priority, color })
  });
  if (!res.ok) throw new Error('Error al crear tarea');
  return res.json();
};

const updateTask = async (id: string, updates: Partial<Pick<Task, 'description' | 'completed'>>): Promise<Task> => {
  const res = await fetchWithAuth(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Error al actualizar tarea');
  return res.json();
};

const deleteTask = async (id: string): Promise<void> => {
  const res = await fetchWithAuth(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(false)
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
};

export { fetchProducts, fetchCategories, fetchMovements, fetchRecentMovements, createProduct, updateProduct, deleteProduct, createMovement, fetchMovementsTotal, fetchMovementsStats, createCategory, updateCategory, deleteCategory, fetchUsers, createUser, updateUser, deleteUser, fetchSuppliers, createSupplier, updateSupplier, deleteSupplier, fetchTopSellingProducts, fetchTasks, createTask, updateTask, deleteTask };
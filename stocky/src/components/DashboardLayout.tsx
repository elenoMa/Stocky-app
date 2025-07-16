import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import boxyLogo from '../assets/boxy.svg'

interface DashboardLayoutProps {
    children: ReactNode;
}

function getUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const user = getUser();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        const timeout = setTimeout(() => setIsAnimating(false), 400);
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { name: 'Productos', href: '/products', icon: '📦' },
        { name: 'Movimientos', href: '/movements', icon: '📊' },
        { name: 'Categorías', href: '/categories', icon: '📁' },
        { name: 'Proveedores', href: '/suppliers', icon: '🏭' },
        { name: 'Tareas', href: '/tasks', icon: '📋' },
    ]

    const isActive = (path: string) => {
        return location.pathname === path
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar para móvil */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl transition-colors duration-300">
                    <div className="flex flex-col items-center py-8 border-b border-gray-200">
                        <img src={boxyLogo} alt="Stocky logo" className={`h-20 w-20 mb-2 transition-transform duration-300 ${isAnimating ? 'animate-zoom' : ''}`} />
                        <span className="text-3xl font-bold text-gray-900">Stocky</span>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </NavLink>
                        ))}
                        {user && user.role === 'admin' && (
                            <NavLink
                                to="/users"
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isActive('/users')
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-3 text-lg">👥</span>
                                Usuarios
                            </NavLink>
                        )}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-700">{user ? user.username.slice(0,2).toUpperCase() : '??'}</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user ? user.username : 'Usuario'}</p>
                                <p className="text-xs text-gray-500">{user ? (user.role === 'admin' ? 'Administrador' : 'Usuario') : ''}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            ❌ Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar para desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm transition-colors duration-300">
                    <div className="flex flex-col items-center py-8 border-b border-gray-200">
                        <img src={boxyLogo} alt="Stocky logo" className={`h-20 w-20 mb-2 transition-transform duration-300 ${isAnimating ? 'animate-zoom' : ''}`} />
                        <span className="text-3xl font-bold text-gray-900">Stocky</span>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </NavLink>
                        ))}
                        {user && user.role === 'admin' && (
                            <NavLink
                                to="/users"
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isActive('/users')
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-3 text-lg">👥</span>
                                Usuarios
                            </NavLink>
                        )}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-700">{user ? user.username.slice(0,2).toUpperCase() : '??'}</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user ? user.username : 'Usuario'}</p>
                                <p className="text-xs text-gray-500">{user ? (user.role === 'admin' ? 'Administrador' : 'Usuario') : ''}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            ❌ Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="lg:pl-64">
                {/* Header móvil */}
                <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden transition-colors duration-300">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Abrir sidebar</span>
                        ☰
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
                        Stocky
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">{user ? user.username.slice(0,2).toUpperCase() : '??'}</span>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <main className="py-6">
                    <div className="px-8">
                        {children ?? <div style={{ minHeight: 200 }}></div>}
                    </div>
                </main>
            </div>

            <style>{`
                @keyframes zoom {
                    0% { transform: scale(1); }
                    40% { transform: scale(1.18); }
                    100% { transform: scale(1); }
                }
                .animate-zoom {
                    animation: zoom 0.4s cubic-bezier(.4,1.7,.7,1.1);
                }
            `}</style>
        </div>
    )
}

export default DashboardLayout
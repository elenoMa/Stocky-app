import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import boxyGray200Logo from '../assets/boxy-gray200.svg'

interface LoginForm {
    username: string
    password: string
    rememberMe: boolean
}

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<LoginForm>({
        username: '',
        password: '',
        rememberMe: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<Partial<LoginForm>>({})
    const [apiError, setApiError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
        if (apiError) setApiError(null)
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginForm> = {}
        if (!formData.username) {
            newErrors.username = 'El usuario es requerido'
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida'
        } else if (formData.password.length < 3) {
            newErrors.password = 'La contraseña debe tener al menos 3 caracteres'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsLoading(true)
        setApiError(null)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            })
            const data = await res.json()
            if (!res.ok) {
                setApiError(data.message || 'Error en login')
                setIsLoading(false)
                return
            }
            // Guardar token y usuario
            if (formData.rememberMe) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
            } else {
                sessionStorage.setItem('token', data.token)
                sessionStorage.setItem('user', JSON.stringify(data.user))
            }
            navigate('/dashboard')
        } catch (error) {
            setApiError('Error de red o del servidor')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDemoLogin = () => {
        setFormData({
            username: 'admin',
            password: 'admin123',
            rememberMe: false
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Logo y título */}
                <div className="text-center">
                    <div className="mx-auto h-32 w-32 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                        <img src={boxyGray200Logo} alt="Stocky logo" className="h-24 w-24 mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Bienvenido a Stocky
                    </h2>
                    <p className="text-gray-600">
                        Sistema de Inventariado Inteligente
                    </p>
                </div>

                {/* Formulario de login */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Usuario */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                👤 Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Tu usuario"
                                disabled={isLoading}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                🔒 Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Recordarme y Olvidé contraseña */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                    Recordarme
                                </label>
                            </div>
                            {/* <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                disabled={isLoading}
                            >
                                ¿Olvidaste tu contraseña?
                            </button> */}
                        </div>

                        {/* Error de API */}
                        {apiError && (
                            <div className="bg-red-100 text-red-700 p-2 rounded text-center text-sm">
                                {apiError}
                            </div>
                        )}

                        {/* Botón de login */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                '🚀 Iniciar Sesión'
                            )}
                        </button>

                    </form>

                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        © 2024 Stocky. Sistema de inventariado para pequeñas empresas.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
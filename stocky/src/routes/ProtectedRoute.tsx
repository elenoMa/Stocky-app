import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Simular verificación asíncrona (puedes reemplazar por una real si tienes refresh de token)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setTimeout(() => {
      setIsAuth(!!token);
      setChecking(false);
    }, 400); // 400ms de "carga"
  }, []);

  if (checking) {
    return <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
      <span className="text-blue-600 font-medium">Verificando acceso...</span>
    </div>;
  }
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
} 
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/tokenUtils';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setIsAuth(false);
        setChecking(false);
        return;
      }
      if (isTokenExpired(token || '')) {
        // Intentar refrescar el token
        try {
          const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            token = data.token;
            // Guardar el nuevo token donde estaba el anterior
            if (localStorage.getItem('token')) {
              localStorage.setItem('token', token || '');
            } else {
              sessionStorage.setItem('token', token || '');
            }
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        } catch {
          setIsAuth(false);
        }
        setChecking(false);
        return;
      }
      setIsAuth(true);
      setChecking(false);
    };
    checkAuth();
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
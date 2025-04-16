import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthContextType, AuthState, LoginData, SignUpData, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auth:user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      return { user, isAuthenticated: true };
    }
    return { user: null, isAuthenticated: false };
  });

  const login = useCallback(async (data: LoginData) => {
    // Simulación de validación
    if (!data.email || !data.password) {
      throw new Error('Todos los campos son requeridos');
    }
    
    // Simulación de autenticación exitosa
    const user: User = { email: data.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true });
  }, []);

  const signup = useCallback(async (data: SignUpData) => {
    // Validación básica
    if (!data.email || !data.password || !data.confirmPassword) {
      throw new Error('Todos los campos son requeridos');
    }
    
    if (data.password !== data.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    // Simulación de registro exitoso
    const user: User = { email: data.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);  // добавляем token
  
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          setIsAuthenticated(true);
          setUser({ id: decoded.id, email: decoded.sub });
          setToken(storedToken);  // сохраняем токен в стейт
        } catch (e) {
          console.error('Ошибка декодирования токена', e);
          logout();
        }
      }
    }, []);
  
    const login = (newToken) => {
      try {
        const decoded = jwtDecode(newToken);
        localStorage.setItem('token', newToken);
        setIsAuthenticated(true);
        setUser({ id: decoded.id, email: decoded.sub });
        setToken(newToken);  // обновляем токен в стейте
      } catch (e) {
        console.error('Невозможно декодировать токен при входе', e);
      }
    };
  
    const logout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);  // очищаем токен
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, user, token }}>
        {children}
      </AuthContext.Provider>
    );
  }
  

// 🛠️ Вот этого как раз не хватало
export function useAuth() {
  return useContext(AuthContext);
}

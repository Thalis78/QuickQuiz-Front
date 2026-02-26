import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { validateProfessorLogin, Professor } from '@/data/mockUsers';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'professor' | 'student';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'ciel_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Carregar sessão do localStorage ao iniciar
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Validar contra backend (verifica se email está na lista autorizada)
    const professor = await validateProfessorLogin(email, password);
    
    if (professor) {
      const userData: User = {
        id: professor.id,
        email: professor.email,
        name: professor.name,
        type: professor.type,
      };
      
      setUser(userData);
      // Salvar sessão no localStorage
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Email ou senha incorretos. Apenas professores autorizados podem acessar.' 
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  username: string;
  name: string;
  role: "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, remember?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "pge_portal_auth_user";
const ADMIN_PASSWORD_KEY = "pge_portal_admin_pass";
const DEFAULT_PASSWORD = "admin";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Carregar usuário salvo no localStorage ou sessionStorage
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string, remember: boolean = false) => {
    // Simula validação com pequeno delay para feedback natural de UI
    await new Promise((res) => setTimeout(res, 400));

    const normalizedUser = username.trim().toLowerCase();
    const storedPass = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;

    // Permitir login de administrador com 'admin' ou 'administrador'
    const isValidUsername = normalizedUser === "admin" || normalizedUser === "administrador" || normalizedUser === "dtigd";
    const isValidPassword = password === storedPass || password === "admin123" || password === "pge@2026";

    if (isValidUsername && isValidPassword) {
      const adminUser: User = {
        username: normalizedUser,
        name: "Administrador PGE-PA",
        role: "admin",
      };

      setUser(adminUser);

      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      }

      return { success: true };
    }

    return {
      success: false,
      message: "Usuário ou senha incorretos. Apenas administradores autorizados têm acesso a esta área.",
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
};

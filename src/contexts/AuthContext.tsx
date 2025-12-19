import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for local authentication
const DEMO_USERS: { username: string; password: string; user: User }[] = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      fullName: 'System Administrator',
      role: 'admin',
      email: 'admin@microfinance.com',
      phone: '9876543210',
      createdAt: new Date(),
    },
  },
  {
    username: 'staff1',
    password: 'staff123',
    user: {
      id: '2',
      username: 'staff1',
      fullName: 'Ravi Kumar',
      role: 'staff',
      email: 'ravi@microfinance.com',
      phone: '9876543211',
      createdAt: new Date(),
    },
  },
  {
    username: 'agent1',
    password: 'agent123',
    user: {
      id: '3',
      username: 'agent1',
      fullName: 'Suresh Patel',
      role: 'agent',
      email: 'suresh@microfinance.com',
      phone: '9876543212',
      createdAt: new Date(),
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('microfinance_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('microfinance_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (found) {
      setUser(found.user);
      localStorage.setItem('microfinance_user', JSON.stringify(found.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('microfinance_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

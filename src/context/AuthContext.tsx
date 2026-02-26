// =============================================================================
// Global Mirror HQ - Authentication Context
// =============================================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, LoginCredentials, AuthState } from '@/types';

// -- Demo Users (In production, use backend API) -------------------------------
const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@globalmirrorhq.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'editor',
    email: 'editor@globalmirrorhq.com',
    role: 'editor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
];

// Demo passwords (in production, these are hashed on backend)
const DEMO_PASSWORDS: Record<string, string> = {
  'admin': 'admin123',
  'editor': 'editor123',
};

// -- Context Interface ---------------------------------------------------------
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -- Provider Component --------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('gmhq_user');
    const storedToken = localStorage.getItem('gmhq_token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('gmhq_user');
        localStorage.removeItem('gmhq_token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = DEMO_USERS.find(u => u.username === credentials.username);
    const correctPassword = DEMO_PASSWORDS[credentials.username];
    
    if (user && correctPassword === credentials.password) {
      const token = `gmhq_token_${Date.now()}`;
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      
      localStorage.setItem('gmhq_user', JSON.stringify(updatedUser));
      localStorage.setItem('gmhq_token', token);
      
      setState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('gmhq_user');
    localStorage.removeItem('gmhq_token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Permission check
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!state.user) return false;
    if (state.user.role === 'admin') return true;
    return state.user.role === requiredRole;
  };

  // Update user
  const updateUser = (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('gmhq_user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasPermission,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// -- Hook ----------------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

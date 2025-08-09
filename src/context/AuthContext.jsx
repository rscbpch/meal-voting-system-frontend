import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = AuthService.isAuthenticated();
            const userData = AuthService.getStoredUser();
            
            setIsAuthenticated(authenticated);
            setUser(userData);
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await AuthService.login(email, password);
            setIsAuthenticated(true);
            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const register = async (email, password) => {
        try {
            const response = await AuthService.register(email, password);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
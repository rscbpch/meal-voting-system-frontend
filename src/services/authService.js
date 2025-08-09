const API_BASE_URL = 'http://localhost:3000/api/auth';

class AuthService {
    async register(email, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                if (res .status === 409) {
                    throw new Error('Email already in use. Please use a different email or try loggin in.');
                }
                throw new Error('Registation failed.');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        throw new Error('Please enter a valid email address.');
                    }

                    const schoolDomain = '@student.cadt.edu.kh';
                    if (!email.toLowerCase().endsWith(schoolDomain.toLowerCase())) {
                        throw new Error('Incorrect email. Please use your school email address.');
                    }
                }
                throw new Error('Incorrect email or password. Please check your credentials and try again.');
            }

            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                return data;
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const token = localStorage.getItem('authToken');

            if (token) {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            localStorage.removeItem('token'); 
            
            console.log('User logged out successfully');
        }
    }

    async verifyEmail(token) {
        try {
            console.log('AuthService: Attempting to verify token:', token);
            
            const response = await fetch(`${API_BASE_URL}/verify-email?token=${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('AuthService: Response status:', response.status);
            
            const data = await response.json();
            console.log('AuthService: Response data:', data);

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Verification failed');
            }

            return data;
        } catch (error) {
            console.error('AuthService: Email verification error:', error);
            throw error;
        }
    }

    async resendVerification(email) {
        try {
            const res = await fetch(`${API_BASE_URL}/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to resend verification email');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    getStoredUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    getStoredToken() {
        return localStorage.getItem('authToken');
    }

    isAuthenticated() {
        const token = this.getStoredToken();
        const user = this.getStoredUser();
        return !!(token && user);
    }
}

export default new AuthService();
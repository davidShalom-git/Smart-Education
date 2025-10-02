// store/Auth.js
import { create } from "zustand";

export const useAuth = create((set, get) => ({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    isInitialized: false,

    register: async (username, email, password) => {
        try {
            console.log('🔵 Starting registration...');
            set({ isLoading: true });
            
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration Failed');
            }

            const data = await response.json();
            
            if (data.token && data.user) {
                console.log('🔵 Registration successful, storing token and user');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                set({
                    user: data.user,
                    token: data.token,
                    isAuthenticated: true,
                    isLoading: false
                });
                
                return { success: true, message: 'Registration successful' };
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            console.error("🔴 Error during Registration", error);
            set({ isLoading: false });
            return { success: false, message: error.message };
        }
    },

    login: async (email, password) => {
        try {
            console.log('🔵 Starting login...');
            set({ isLoading: true });

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login Failed');
            }

            const data = await response.json();
            
            if (data.token && data.user) {
                console.log('🔵 Login successful, storing token and user');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                set({
                    user: data.user,
                    token: data.token,
                    isAuthenticated: true,
                    isLoading: false
                });
                
                return { success: true, message: 'Login successful' };
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            console.error("🔴 Error during Login", error);
            set({ isLoading: false });
            return { success: false, message: error.message };
        }
    },

    initAuth: async () => {
        const state = get();
        console.log('🟡 initAuth called, current state:', { 
            isInitialized: state.isInitialized, 
            isAuthenticated: state.isAuthenticated,
            hasToken: !!state.token 
        });
        
        if (state.isInitialized) {
            console.log('🟡 Auth already initialized, skipping');
            return;
        }

        try {
            console.log('🟡 Starting auth initialization...');
            set({ isLoading: true });
            
            // Check what's in localStorage BEFORE any operations
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            console.log('🟡 Found in localStorage:', { 
                hasToken: !!token, 
                hasUser: !!storedUser,
                tokenLength: token?.length || 0 
            });
            
            if (token && storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    console.log('🟢 Setting auth state from localStorage');
                    
                    set({
                        token,
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true
                    });
                    
                    console.log('🟢 Auth initialized successfully from localStorage');
                    
                    // DON'T verify token immediately on init - this might be causing the issue
                    // get().verifyTokenInBackground();
                    
                } catch (parseError) {
                    console.error('🔴 Error parsing stored user:', parseError);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({ 
                        isLoading: false,
                        isAuthenticated: false,
                        user: null,
                        token: null,
                        isInitialized: true
                    });
                }
            } else {
                console.log('🟡 No token/user in localStorage, setting unauthenticated state');
                set({ 
                    isLoading: false,
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    isInitialized: true
                });
            }
        } catch (error) {
            console.error('🔴 Error initializing auth:', error);
            set({ 
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                isInitialized: true
            });
        }
    },

    verifyTokenInBackground: async () => {
        try {
            const token = get().token;
            console.log('🔵 Background token verification started');
            
            if (!token) {
                console.log('🟡 No token for background verification');
                return;
            }

            const response = await fetch('/api/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn('🟠 Background token verification failed, clearing auth');
                get().clearAuth();
            } else {
                console.log('🟢 Background token verification successful');
                const data = await response.json();
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    set({ user: data.user });
                }
            }

        } catch (error) {
            console.error("🔴 Error during background token verification:", error);
        }
    },

    checkAuth: async () => {
        try {
            console.log('🔵 checkAuth called');
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.log('🟡 No token found in checkAuth');
                set({ 
                    isAuthenticated: false, 
                    user: null,
                    token: null,
                    isLoading: false
                });
                return false;
            }

            set({ isLoading: true });

            const response = await fetch('/api/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('🟢 Token verification successful in checkAuth');
                const data = await response.json();
                const storedUser = localStorage.getItem('user');
                
                set({
                    user: data.user || (storedUser ? JSON.parse(storedUser) : null),
                    token: token,
                    isAuthenticated: true,
                    isLoading: false
                });
                return true;
            } else {
                console.warn('🟠 Token verification failed in checkAuth, clearing auth');
                get().clearAuth();
                return false;
            }

        } catch (error) {
            console.error("🔴 Error during auth check", error);
            set({ isLoading: false });
            return get().isAuthenticated;
        }
    },

    clearAuth: () => {
        console.log('🔴 clearAuth called - CLEARING LOCALSTORAGE');
        console.trace('clearAuth call stack'); // This will show you exactly where clearAuth is being called from
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: get().isInitialized
        });
    },

    logout: () => {
        console.log('🔵 logout called');
        get().clearAuth();
    },

    getAuthHeaders: () => {
        const token = get().token || localStorage.getItem('token');
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }
}));
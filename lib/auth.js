// lib/auth.js
export function login(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  export function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
  
  export function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('user');
  }
  
  export function getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
  
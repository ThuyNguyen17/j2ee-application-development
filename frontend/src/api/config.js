const getBaseUrl = () => {
    const hostname = window.location.hostname;
    
    // Local development - direct connection to backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
    }
    
    // For ngrok or other deployed domains - use relative path
    // Vite proxy will forward /api to localhost:8080
    return '';  // Empty string = relative path
};

export const BASE_URL = getBaseUrl();
export const API_BASE_URL = BASE_URL ? `${BASE_URL}/api/v1` : '/api/v1';

// Debug logging
console.log('Hostname:', window.location.hostname);
console.log('BASE_URL:', BASE_URL);
console.log('API_BASE_URL:', API_BASE_URL);

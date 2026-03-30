const getBaseUrl = () => {
    // If we're on localhost, use localhost:8080
    // If we're on an IP (like 192.168.x.x), use that IP:8080
    const hostname = window.location.hostname;
    
    // Check if hostname is an IP address
    const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
    }
    
    if (isIp) {
        return `http://${hostname}:8080`;
    }

    // Default to localhost if unsure, or you could return window.location.origin
    return 'http://localhost:8080';
};

export const BASE_URL = getBaseUrl();
export const API_BASE_URL = `${BASE_URL}/api/v1`;

const localApiBase = 'http://localhost:3001/api';

export const API_BASE = import.meta.env.VITE_API_BASE ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? localApiBase
    : '/api');

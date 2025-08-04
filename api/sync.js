// Kaczor Addons API Client
(function() {
    'use strict';
    
    const API_BASE = 'https://krystianasaaa.github.io/margonem-addons/api/';
    
    class KaczorAPI {
        constructor() {
            this.baseUrl = API_BASE;
            this.cache = new Map();
            this.cacheTimeout = 5 * 60 * 1000; // 5 minut
        }
        
        async fetchWithCache(url, options = {}) {
            const cacheKey = url + JSON.stringify(options);
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
            
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        ...options.headers
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
                
                return data;
            } catch (error) {
                console.error('🚫 API Error:', error);
                
                if (cached) {
                    console.log('📂 Używam cache jako fallback');
                    return cached.data;
                }
                
                throw error;
            }
        }
        
        async getUsers() {
            try {
                const data = await this.fetchWithCache(`${this.baseUrl}users.json`);
                return {
                    users: data.users || [],
                    lastUpdated: data.lastUpdated,
                    version: data.version
                };
            } catch (error) {
                console.error('❌ Błąd pobierania użytkowników:', error);
                return null;
            }
        }
        
        async getLogs() {
            try {
                const data = await this.fetchWithCache(`${this.baseUrl}logs.json`);
                return {
                    logs: data.logs || [],
                    lastUpdated: data.lastUpdated
                };
            } catch (error) {
                console.error('❌ Błąd pobierania logów:', error);
                return null;
            }
        }
        
        async getConfig() {
            try {
                const data = await this.fetchWithCache(`${this.baseUrl}config.json`);
                return data;
            } catch (error) {
                console.error('❌ Błąd pobierania konfiguracji:', error);
                return null;
            }
        }
        
        clearCache() {
            this.cache.clear();
            console.log('🧹 Cache wyczyszczony');
        }
    }
    
    // Globalna instancja API
    window.KaczorAPI = new KaczorAPI();
    
})();

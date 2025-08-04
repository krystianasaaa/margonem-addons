// GitHub Auto-updater dla Kaczor Addons - POPRAWIONA WERSJA
(function() {
    'use strict';
    
    const GITHUB_REPO = 'krystianasaaa/margonem-addons';
    
    class GitHubUpdater {
        constructor() {
            this.apiUrl = `https://api.github.com/repos/${GITHUB_REPO}`;
            this.updateHeaders(); // Inicjalizuj nagłówki
        }
        
        // POPRAWKA: Dynamiczne aktualizowanie nagłówków
        updateHeaders() {
            const token = localStorage.getItem('github_token') || '';
            this.headers = {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            };
        }
        
        // POPRAWKA: Sprawdź czy token jest prawidłowy
        hasValidToken() {
            const token = localStorage.getItem('github_token');
            return token && token !== 'YOUR_GITHUB_TOKEN' && token.length > 10;
        }
        
        async updateUsers(users, adminId) {
            if (!this.hasValidToken()) {
                console.log('❌ Brak prawidłowego tokenu GitHub');
                return false;
            }
            
            this.updateHeaders(); // Odśwież nagłówki przed żądaniem
            
            const userData = {
                users: users,
                lastUpdated: new Date().toISOString(),
                version: "1.0.0",
                admin: adminId,
                totalUsers: users.length
            };
            
            try {
                // POPRAWKA: Lepsze obsługa błędów i 404
                let sha = null;
                
                try {
                    const fileResponse = await fetch(`${this.apiUrl}/contents/api/users.json`, {
                        headers: this.headers
                    });
                    
                    if (fileResponse.ok) {
                        const fileData = await fileResponse.json();
                        sha = fileData.sha;
                        console.log('📄 Znaleziono istniejący plik users.json');
                    } else if (fileResponse.status === 404) {
                        console.log('📄 Plik users.json nie istnieje - zostanie utworzony');
                        sha = null; // Nowy plik
                    } else {
                        throw new Error(`HTTP ${fileResponse.status}: ${fileResponse.statusText}`);
                    }
                } catch (error) {
                    console.log('⚠️ Błąd pobierania pliku users.json:', error.message);
                    sha = null; // Spróbuj utworzyć nowy plik
                }
                
                // Przygotuj dane do wysłania
                const requestBody = {
                    message: `🔄 Aktualizacja listy użytkowników przez admin ${adminId} (${new Date().toLocaleString('pl-PL')})`,
                    content: btoa(unescape(encodeURIComponent(JSON.stringify(userData, null, 2)))),
                    branch: 'main'
                };
                
                // Dodaj SHA tylko jeśli plik już istnieje
                if (sha) {
                    requestBody.sha = sha;
                }
                
                const updateResponse = await fetch(`${this.apiUrl}/contents/api/users.json`, {
                    method: 'PUT',
                    headers: this.headers,
                    body: JSON.stringify(requestBody)
                });
                
                if (updateResponse.ok) {
                    const result = await updateResponse.json();
                    console.log('✅ Lista użytkowników zaktualizowana na GitHub');
                    console.log(`📊 Commit SHA: ${result.commit.sha}`);
                    return true;
                } else {
                    const errorData = await updateResponse.json();
                    console.error('❌ Błąd GitHub API:', errorData);
                    throw new Error(`GitHub API error: ${updateResponse.status} - ${errorData.message || 'Unknown error'}`);
                }
                
            } catch (error) {
                console.error('❌ Błąd aktualizacji GitHub:', error);
                return false;
            }
        }
        
        async updateLogs(logs) {
            if (!this.hasValidToken()) {
                console.log('❌ Brak prawidłowego tokenu GitHub dla logów');
                return false;
            }
            
            this.updateHeaders(); // Odśwież nagłówki
            
            const logData = {
                logs: logs.slice(-100), // Zachowaj ostatnie 100 logów
                lastUpdated: new Date().toISOString(),
                maxLogs: 100,
                totalLogs: logs.length
            };
            
            try {
                let sha = null;
                
                try {
                    const fileResponse = await fetch(`${this.apiUrl}/contents/api/logs.json`, {
                        headers: this.headers
                    });
                    
                    if (fileResponse.ok) {
                        const fileData = await fileResponse.json();
                        sha = fileData.sha;
                    } else if (fileResponse.status === 404) {
                        console.log('📄 Plik logs.json nie istnieje - zostanie utworzony');
                        sha = null;
                    } else {
                        throw new Error(`HTTP ${fileResponse.status}`);
                    }
                } catch (error) {
                    console.log('⚠️ Błąd pobierania logs.json:', error.message);
                    sha = null;
                }
                
                const requestBody = {
                    message: `📋 Aktualizacja logów aktywności (${new Date().toLocaleString('pl-PL')})`,
                    content: btoa(unescape(encodeURIComponent(JSON.stringify(logData, null, 2)))),
                    branch: 'main'
                };
                
                if (sha) {
                    requestBody.sha = sha;
                }
                
                const updateResponse = await fetch(`${this.apiUrl}/contents/api/logs.json`, {
                    method: 'PUT',
                    headers: this.headers,
                    body: JSON.stringify(requestBody)
                });
                
                if (updateResponse.ok) {
                    console.log('✅ Logi zaktualizowane na GitHub');
                    return true;
                } else {
                    const errorData = await updateResponse.json();
                    console.error('❌ Błąd aktualizacji logów:', errorData);
                    return false;
                }
                
            } catch (error) {
                console.error('❌ Błąd aktualizacji logów GitHub:', error);
                return false;
            }
        }
        
        // POPRAWKA: Lepsze ustawianie tokenu
        setToken(token) {
            if (!token || token.trim() === '') {
                console.log('❌ Podano pusty token');
                return false;
            }
            
            localStorage.setItem('github_token', token.trim());
            this.updateHeaders();
            console.log('🔑 Token GitHub zaktualizowany');
            return true;
        }
        
        // NOWA METODA: Testowanie połączenia z GitHub
        async testConnection() {
            if (!this.hasValidToken()) {
                return { success: false, message: 'Brak tokenu' };
            }
            
            this.updateHeaders();
            
            try {
                const response = await fetch(`${this.apiUrl}`, {
                    headers: this.headers
                });
                
                if (response.ok) {
                    const repoData = await response.json();
                    return { 
                        success: true, 
                        message: `Połączenie OK! Repo: ${repoData.full_name}`,
                        repoInfo: {
                            name: repoData.name,
                            private: repoData.private,
                            updated: repoData.updated_at
                        }
                    };
                } else {
                    const errorData = await response.json();
                    return { 
                        success: false, 
                        message: `Błąd ${response.status}: ${errorData.message}` 
                    };
                }
            } catch (error) {
                return { 
                    success: false, 
                    message: `Błąd połączenia: ${error.message}` 
                };
            }
        }
        
        // NOWA METODA: Sprawdź czy API folder istnieje
        async checkApiFolder() {
            if (!this.hasValidToken()) return false;
            
            this.updateHeaders();
            
            try {
                const response = await fetch(`${this.apiUrl}/contents/api`, {
                    headers: this.headers
                });
                
                return response.ok;
            } catch (error) {
                console.log('⚠️ Folder /api/ może nie istnieć');
                return false;
            }
        }
        
        // NOWA METODA: Utwórz podstawowe pliki API jeśli nie istnieją
        async initializeApiFiles() {
            console.log('🔧 Inicjalizowanie plików API...');
            
            const defaultUsers = {
                users: ["5906841"], // Tylko admin na start
                lastUpdated: new Date().toISOString(),
                version: "1.0.0",
                admin: "system"
            };
            
            const defaultLogs = {
                logs: [{
                    time: new Date().toLocaleString('pl-PL'),
                    message: "🚀 Inicjalizacja systemu logów",
                    admin: "system"
                }],
                lastUpdated: new Date().toISOString(),
                maxLogs: 100
            };
            
            try {
                // Sprawdź i utwórz users.json
                const usersCheck = await fetch(`${this.apiUrl}/contents/api/users.json`, {
                    headers: this.headers
                });
                
                if (usersCheck.status === 404) {
                    await fetch(`${this.apiUrl}/contents/api/users.json`, {
                        method: 'PUT',
                        headers: this.headers,
                        body: JSON.stringify({
                            message: '🚀 Inicjalizacja users.json',
                            content: btoa(unescape(encodeURIComponent(JSON.stringify(defaultUsers, null, 2)))),
                            branch: 'main'
                        })
                    });
                    console.log('✅ Utworzono users.json');
                }
                
                // Sprawdź i utwórz logs.json
                const logsCheck = await fetch(`${this.apiUrl}/contents/api/logs.json`, {
                    headers: this.headers
                });
                
                if (logsCheck.status === 404) {
                    await fetch(`${this.apiUrl}/contents/api/logs.json`, {
                        method: 'PUT',
                        headers: this.headers,
                        body: JSON.stringify({
                            message: '🚀 Inicjalizacja logs.json',
                            content: btoa(unescape(encodeURIComponent(JSON.stringify(defaultLogs, null, 2)))),
                            branch: 'main'
                        })
                    });
                    console.log('✅ Utworzono logs.json');
                }
                
                return true;
            } catch (error) {
                console.error('❌ Błąd inicjalizacji plików API:', error);
                return false;
            }
        }
    }
    
    // Utwórz instancję i udostępnij globalnie
    window.GitHubUpdater = new GitHubUpdater();
    
    console.log('🔧 GitHubUpdater załadowany i gotowy');
    console.log('💡 Użyj: window.GitHubUpdater.testConnection() aby przetestować połączenie');
    
})();

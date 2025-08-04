// GitHub Auto-updater dla Kaczor Addons
(function() {
    'use strict';
    
    const GITHUB_REPO = 'krystianasaaa/margonem-addons';
    // UWAGA: Token trzeba będzie dodać - instrukcje poniżej
    const GITHUB_TOKEN = localStorage.getItem('github_token') || 'YOUR_GITHUB_TOKEN';
    
    class GitHubUpdater {
        constructor() {
            this.apiUrl = `https://api.github.com/repos/${GITHUB_REPO}`;
            this.headers = {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            };
        }
        
        async updateUsers(users, adminId) {
            const userData = {
                users: users,
                lastUpdated: new Date().toISOString(),
                version: "1.0.0",
                admin: adminId
            };
            
            try {
                const fileResponse = await fetch(`${this.apiUrl}/contents/api/users.json`, {
                    headers: this.headers
                });
                const fileData = await fileResponse.json();
                
                const updateResponse = await fetch(`${this.apiUrl}/contents/api/users.json`, {
                    method: 'PUT',
                    headers: this.headers,
                    body: JSON.stringify({
                        message: `🔄 Aktualizacja listy użytkowników przez admin ${adminId}`,
                        content: btoa(JSON.stringify(userData, null, 2)),
                        sha: fileData.sha,
                        branch: 'main'
                    })
                });
                
                if (updateResponse.ok) {
                    console.log('✅ Lista użytkowników zaktualizowana na GitHub');
                    return true;
                } else {
                    throw new Error('Błąd aktualizacji');
                }
                
            } catch (error) {
                console.error('❌ Błąd aktualizacji GitHub:', error);
                return false;
            }
        }
        
        async updateLogs(logs) {
            const logData = {
                logs: logs.slice(-100),
                lastUpdated: new Date().toISOString(),
                maxLogs: 100
            };
            
            try {
                const fileResponse = await fetch(`${this.apiUrl}/contents/api/logs.json`, {
                    headers: this.headers
                });
                const fileData = await fileResponse.json();
                
                const updateResponse = await fetch(`${this.apiUrl}/contents/api/logs.json`, {
                    method: 'PUT',
                    headers: this.headers,
                    body: JSON.stringify({
                        message: '📋 Aktualizacja logów aktywności',
                        content: btoa(JSON.stringify(logData, null, 2)),
                        sha: fileData.sha,
                        branch: 'main'
                    })
                });
                
                return updateResponse.ok;
                
            } catch (error) {
                console.error('❌ Błąd aktualizacji logów GitHub:', error);
                return false;
            }
        }
        
        // Funkcja do ustawienia tokenu przez panel admin
        setToken(token) {
            localStorage.setItem('github_token', token);
            this.headers['Authorization'] = `token ${token}`;
            console.log('🔑 Token GitHub zaktualizowany');
        }
    }
    
    window.GitHubUpdater = new GitHubUpdater();
    
})();

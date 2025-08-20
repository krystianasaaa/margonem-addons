import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
import os
import re

class DreamGuildsUpdater:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.dream_ladder_url = "https://www.margonem.pl/ladder/guilds,Dream"
        
    def log(self, message):
        """Logowanie z timestampem"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")
        
    def get_dream_guilds(self):
        """Pobiera listę klanów ze świata Dream"""
        self.log("🔍 Pobieranie klanów ze świata Dream...")
        
        try:
            response = self.session.get(self.dream_ladder_url, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            guilds = []
            table = soup.find('table')
            
            if not table:
                self.log("❌ Nie znaleziono tabeli rankingu!")
                return []
            
            rows = table.find_all('tr')[1:]  # Pomiń nagłówek
            self.log(f"📊 Analizuję {len(rows)} wierszy...")
            
            for i, row in enumerate(rows, 1):
                cells = row.find_all('td')
                
                if len(cells) < 2:
                    continue
                
                # Druga kolumna = nazwa klanu
                name_cell = cells[1]
                guild_link = name_cell.find('a', href=re.compile(r'/guilds/view'))
                
                if guild_link:
                    guild_name = guild_link.get_text().strip()
                    href = guild_link.get('href')
                    
                    guilds.append({
                        'name': guild_name,
                        'url': f"https://www.margonem.pl{href}",
                        'rank': i
                    })
                    self.log(f"  {i:2d}. {guild_name}")
                else:
                    # Fallback - tylko nazwa bez linku
                    guild_name = name_cell.get_text().strip()
                    if guild_name and guild_name != "Klan":
                        # Spróbuj stworzyć URL
                        encoded_name = guild_name.replace(' ', '%20')
                        url = f"https://www.margonem.pl/guilds/view,{encoded_name},Dream"
                        
                        guilds.append({
                            'name': guild_name,
                            'url': url,
                            'rank': i
                        })
                        self.log(f"  {i:2d}. {guild_name} (bez linku)")
            
            self.log(f"✅ Znaleziono {len(guilds)} klanów")
            return guilds
            
        except Exception as e:
            self.log(f"❌ Błąd pobierania listy klanów: {e}")
            return []
    
    def scrape_guild_members(self, guild):
        """Scrappuje członków konkretnego klanu"""
        self.log(f"📊 Scrappuję: {guild['name']}")
        
        try:
            response = self.session.get(guild['url'], timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            members = []
            table = soup.find('table')
            
            if not table:
                self.log(f"⚠️  Brak tabeli: {guild['name']}")
                return []
            
            # Znajdź kolumnę z nickami
            nick_column = 1  # Domyślnie druga kolumna
            
            header_row = table.find('tr')
            if header_row:
                headers = header_row.find_all(['th', 'td'])
                for i, header in enumerate(headers):
                    header_text = header.get_text().strip().lower()
                    if 'nick' in header_text or 'nazwa' in header_text:
                        nick_column = i
                        break
            
            # Pobierz członków
            rows = table.find_all('tr')[1:]  # Pomiń nagłówek
            
            for row in rows:
                cells = row.find_all('td')
                
                if len(cells) > nick_column:
                    nick_cell = cells[nick_column]
                    
                    # Sprawdź czy jest link
                    link = nick_cell.find('a')
                    player_name = link.get_text().strip() if link else nick_cell.get_text().strip()
                    
                    # Walidacja nicku
                    if (player_name and 
                        1 < len(player_name) < 30 and
                        not player_name.isdigit() and
                        '#' not in player_name and
                        player_name.lower() not in ['nick', 'nazwa'] and
                        player_name not in members):
                        
                        members.append(player_name)
            
            self.log(f"  ✓ {len(members)} członków")
            return members
            
        except Exception as e:
            self.log(f"❌ Błąd scrappowania {guild['name']}: {e}")
            return []
    
    def update_guilds_json(self):
        """Główna funkcja - aktualizuje guilds.json"""
        self.log("🚀 Rozpoczynam aktualizację guilds.json")
        
        # Pobierz listę klanów
        guilds = self.get_dream_guilds()
        
        if not guilds:
            self.log("❌ Brak klanów do przetworzenia!")
            return False
        
        # Scrappuj wszystkich członków
        player_guild_mapping = {}
        successful_guilds = 0
        
        for i, guild in enumerate(guilds, 1):
            self.log(f"\n[{i:2d}/{len(guilds)}] {guild['name']}")
            
            members = self.scrape_guild_members(guild)
            
            if members:
                successful_guilds += 1
                # Dodaj mapowanie nick -> klan (małe litery dla nicków)
                for member in members:
                    player_guild_mapping[member.lower()] = guild['name']
            
            # Przerwa między requestami - szanujmy serwer
            if i < len(guilds):
                time.sleep(3)
        
        if not player_guild_mapping:
            self.log("❌ Nie udało się pobrać żadnych danych!")
            return False
        
        # Zapisz do guilds.json (w tym samym folderze)
        with open('guilds.json', 'w', encoding='utf-8') as f:
            json.dump(player_guild_mapping, f, ensure_ascii=False, indent=2, sort_keys=True)
        
        # Podsumowanie
        self.log(f"\n🎉 Aktualizacja zakończona!")
        self.log(f"📊 Klany: {successful_guilds}/{len(guilds)}")
        self.log(f"👥 Graczy: {len(player_guild_mapping)}")
        self.log(f"💾 Zapisano: guilds.json")
        
        return True

def main():
    """Uruchom aktualizację"""
    updater = DreamGuildsUpdater()
    success = updater.update_guilds_json()
    
    if not success:
        exit(1)

if __name__ == "__main__":
    main()

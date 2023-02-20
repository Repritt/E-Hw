Tento projekt je složený ze 3 částí:
1 - Backend: npm run start
    Základ je Node JS
    Pracuje na portu 8000
    Je nastavený CORS na 5173 na frontend

    Příjmá informace skrze post od scraping agenta:
        Data uloží do mapy podle ID zápasu
    
    Připojení je skrze Socket.IO:
        posílá kompletní data každou sekundu jako JSON 

    Maže zápasy, které nebyly updatované déle než 3 minuty

2 - Scraping agent: python3 scrapint_agent
    Funguje skrze Selenium
    Zaloguje se údaji na stránku (kvůli max odds)
    pak cyklus:
        stáhne všechny stránky turnajů z: "https://www.oddsportal.com/tennis/"
        projíždí stránku po stránce a scrapuje všechny nedohrané zápasy
        Všechny záznamy posílá na backend

3 - Vite-React frontend: npm run dev
    Připojí se k backendu skrze socket
    Dostává data v JSONu, které parsuje a posílá do pole
    Data vykresluje do tabulky
        Zeleně vyznačené řádky s Payoutem vyšším než 98%
        Data jsou: 
            PlayerHome
            PlayerAway
            OddsHome
            OddsAway
            Payout
            PlayTime - čas, kdy se má hrát zápas / u probíhajícího zápasu píše, kolikatá to je set
            UpdateTime - čas, kdy se záznam naposledy aktualizoval na server
            URL s odkazem na oddsPortal daného zápasu
        Data se aktualizují s každou sekundu z backendu
import requests
import pandas as pd
from datetime import datetime

# === CONFIG ===
API_KEY = "e30c5b8f17c5972899cb2908082342cb"  # Your OddsAPI key
SPORT = "baseball_mlb"
REGION = "us"
MARKETS = "h2h,spreads,totals"
BOOKS = ['draftkings', 'fanduel', 'betmgm', 'pointsbetus', 'williamhill_us', 'caesars']

# === FETCH GAME ODDS ===
url = f"https://api.the-odds-api.com/v4/sports/{SPORT}/odds"
params = {
    "apiKey": API_KEY,
    "regions": REGION,
    "markets": MARKETS,
    "oddsFormat": "american",
    "dateFormat": "iso"
}

response = requests.get(url, params=params)
games = response.json()

# === BUILD TABLE ===
rows = []
for game in games:
    try:
        time = datetime.fromisoformat(game['commence_time'].replace("Z", "+00:00")).strftime('%Y-%m-%d %I:%M %p')
        match = f"{game['away_team']} @ {game['home_team']}"
        row = {"Match": match, "Time": time}

        for book in game['bookmakers']:
            if book['key'] in BOOKS:
                for market in book['markets']:
                    if market['key'] == 'h2h':
                        a, b = market['outcomes']
                        row[f"{book['key']}_ml"] = f"{a['name']} {a['price']}, {b['name']} {b['price']}"
                    elif market['key'] == 'spreads':
                        a, b = market['outcomes']
                        row[f"{book['key']}_spread"] = f"{a['name']} {a['point']} ({a['price']}), {b['name']} {b['point']} ({b['price']})"
                    elif market['key'] == 'totals':
                        a, b = market['outcomes']
                        row[f"{book['key']}_total"] = f"O{a['point']} ({a['price']}), U{b['point']} ({b['price']})"
        rows.append(row)
    except Exception as e:
        continue

# === EXPORT TO HTML ===
df = pd.DataFrame(rows)
df.fillna("-", inplace=True)

df.to_html("mlb_odds_today.html", index=False, escape=False)
print("Saved as mlb_odds_today.html")

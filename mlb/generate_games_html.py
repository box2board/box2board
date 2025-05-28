import os
import requests
from datetime import datetime, timezone
from datetime import datetime
from pathlib import Path

API_KEY = os.environ.get('ODDS_API_KEY')
SPORT = 'baseball_mlb'
REGION = 'us'
MARKET = 'h2h'
ODDS_API_URL = f'https://api.the-odds-api.com/v4/sports/{SPORT}/odds'

params = {
    'regions': REGION,
    'markets': MARKET,
    'apiKey': API_KEY
}

response = requests.get(ODDS_API_URL, params=params)
if response.status_code != 200:
    raise Exception(f"Failed to fetch odds: {response.status_code} - {response.text}")

games = response.json()

html_lines = [
    '<section class="scoreboard">',
    '<h2>Live MLB Odds</h2>',
    '<ul>'
]
from datetime import datetime, timezone  # Ensure this is already at the top of your file

for game in games:
    teams = game.get('teams', [])
    
    # ✅ Skip if teams are incomplete
    if len(teams) < 2:
        continue

    # ✅ Skip games that already started
    game_time = datetime.fromisoformat(game['commence_time'].replace('Z', '+00:00'))
    if game_time < datetime.now(timezone.utc):
        continue

    home_team = game.get('home_team', '')
    commence_time = game_time.strftime('%I:%M %p')

    bookmakers = game.get('bookmakers', [])
    if not bookmakers:
        continue

    best_book = bookmakers[0]
    outcomes = best_book['markets'][0]['outcomes']
    team_odds = {outcome['name']: outcome['price'] for outcome in outcomes}

    team_1 = teams[0]
    team_2 = teams[1]

    odds_text = f"{team_1} ({team_odds.get(team_1, '?')}) vs {team_2} ({team_odds.get(team_2, '?')})"
    html_lines.append(f"<li><strong>{commence_time}:</strong> {odds_text}</li>")

html_lines.append('</ul>')
html_lines.append('</section>')

with open("mlb/index.html", "w") as f:
    f.write("\n".join(html_lines))

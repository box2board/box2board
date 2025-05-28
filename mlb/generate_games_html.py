import os
import requests
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

for game in games:
    teams = game.get('teams', [])
    home_team = game.get('home_team', '')
    commence_time = datetime.fromisoformat(game['commence_time'].replace('Z', '')).strftime('%I:%M %p ET')

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

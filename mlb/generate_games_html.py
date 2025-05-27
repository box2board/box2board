import os
import requests
from datetime import datetime

# Step 1: Get the API key from environment variables
api_key = os.getenv("ODDS_API_KEY")

# Step 2: Construct the request URL
url = f"https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey={api_key}&regions=us&markets=h2h"

# Step 3: Make the request
response = requests.get(url)

# Step 4: Check for successful response
if response.status_code != 200:
    raise Exception(f"Failed to fetch odds: {response.status_code} - {response.text}")

data = response.json()

# Step 5: Generate HTML output
html_output = "<h2>Today’s MLB Odds</h2>\n"
html_output += f"<p>Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>\n"
html_output += "<ul>\n"

for game in data:
    teams = f"{game['home_team']} vs {game['away_team']}"
    html_output += f"<li><strong>{teams}</strong><br>"

    for bookmaker in game.get("bookmakers", []):
        html_output += f"<em>{bookmaker['title']}</em><br>"
        for market in bookmaker.get("markets", []):
            for outcome in market.get("outcomes", []):
                html_output += f"{outcome['name']}: {outcome['price']}<br>"
        html_output += "<br>"

    html_output += "</li>\n"

html_output += "</ul>"

# Step 6: Save to HTML file for site use
with open("mlb/mlb_odds.html", "w", encoding="utf-8") as f:
    f.write(html_output)

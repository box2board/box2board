import requests
from datetime import datetime, timedelta
from collections import defaultdict

# Settings
OU_LINE = 8.5
today = datetime.now()
dates = [(today - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, 6)]
team_data = defaultdict(lambda: {"ou": [], "first_inning": []})

def fetch_games(date_str):
    url = f"https://statsapi.mlb.com/api/v1/schedule?sportId=1&date={date_str}&expand=schedule.linescore"
    r = requests.get(url)
    if r.ok:
        return r.json().get("dates", [])[0].get("games", []) if r.json().get("dates") else []
    return []

for date in dates:
    games = fetch_games(date)
    for game in games:
        try:
            home = game["teams"]["home"]
            away = game["teams"]["away"]
            linescore = game.get("linescore", {}).get("innings", [])

            home_score = home["score"]
            away_score = away["score"]
            total = home_score + away_score
            result = "O" if total > OU_LINE else "U"

            for team in [home["team"]["name"], away["team"]["name"]]:
                team_data[team]["ou"].insert(0, result)

            if linescore:
                away_1st = linescore[0].get("away", 0)
                home_1st = linescore[0].get("home", 0)
                team_data[away["team"]["name"]]["first_inning"].insert(0, away_1st > 0)
                team_data[home["team"]["name"]]["first_inning"].insert(0, home_1st > 0)
        except:
            continue

# Create HTML
lines = ['<section id="streaks-auto">', '<h2>Streaks (Automated)</h2>']
for team, stats in sorted(team_data.items()):
    ou_5 = stats["ou"][:5]
    ou_3 = ou_5[:3]
    ou_1 = ou_5[:1]

    fi_5 = stats["first_inning"][:5]
    fi_3 = fi_5[:3]
    fi_1 = fi_5[:1]

    lines.append(f"<h3>{team}</h3>")
    lines.append("<strong>Over/Under:</strong>")
    lines.append(f"<p>Last 5: {', '.join(ou_5)}</p>")
    lines.append(f"<p>Last 3: {', '.join(ou_3)}</p>")
    lines.append(f"<p>Last Game: {ou_1[0] if ou_1 else 'N/A'}</p>")
    lines.append("<strong>1st Inning Scoring:</strong>")
    lines.append(f"<p>Last 5: {', '.join(['Y' if x else 'N' for x in fi_5])}</p>")
    lines.append(f"<p>Last 3: {', '.join(['Y' if x else 'N' for x in fi_3])}</p>")
    lines.append(f"<p>Last Game: {'Y' if fi_1[0] else 'N' if fi_1 else 'N/A'}</p>")
lines.append('</section>')

with open("streaks.html", "w") as f:
    f.write("\n".join(lines))

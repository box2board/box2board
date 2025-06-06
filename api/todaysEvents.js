export default async function handler(req, res) {
  const API_KEY = process.env.BALL_DONT_LIE_KEY;  // ✅ Uses Vercel secret

  const today = new Date().toISOString().split('T')[0];
  const leagues = ['mlb', 'nba', 'nfl', 'nhl', 'pga'];
  const allGames = [];

  for (const league of leagues) {
    try {
      const endpoint = `https://api.balldontlie.io/${league}/v1/games?date=${today}`;
      const response = await fetch(endpoint, {
        headers: {
          Authorization: API_KEY
        }
      });

      const data = await response.json();
      if (Array.isArray(data.data)) {
        data.data.forEach(game => {
          allGames.push({
            league: league.toUpperCase(),
            away: game.away_team?.name || 'TBD',
            home: game.home_team?.name || 'TBD',
            time: game.start_time || 'TBD'
          });
        });
      }
    } catch (err) {
      console.warn(`No games returned for ${league.toUpperCase()}`);
    }
  }

  res.status(200).json(allGames);
}

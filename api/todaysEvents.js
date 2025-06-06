export default async function handler(req, res) {
  const API_KEY = process.env.BALL_DONT_LIE_KEY;
  const today = new Date().toISOString().split('T')[0];
  const leagues = ['mlb']; // Start with MLB
  const allGames = [];

  for (const league of leagues) {
    try {
      const endpoint = `https://api.balldontlie.io/${league}/v1/games?dates[]=${today}&per_page=100`;
      const response = await fetch(endpoint, {
        headers: {
          Authorization: API_KEY
        }
      });

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        data.data.forEach(game => {
          allGames.push({
            league: league.toUpperCase(),
            matchup: `${game.away_team_name} at ${game.home_team_name}`,
            time: new Date(game.date).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'America/New_York'
            })
          });
        });
      }
    } catch (err) {
      console.error(`Error fetching games for ${league.toUpperCase()}:`, err);
    }
  }

  res.status(200).json(allGames);
}

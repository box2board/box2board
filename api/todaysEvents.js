export default async function handler(req, res) {
  const API_KEY = process.env.ODDS_API_KEY;

  const sports = ['baseball_mlb', 'basketball_nba', 'icehockey_nhl', 'americanfootball_nfl', 'golf_pga'];
  const region = 'us'; // Use 'us' for U.S. markets

  const allEvents = [];

  for (const sport of sports) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/${sport}/events?apiKey=${API_KEY}&regions=${region}`;
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(event => {
          allEvents.push({
            league: sport.toUpperCase(),
            teams: event.teams?.join(' vs ') || 'TBD vs TBD',
            commence_time: new Date(event.commence_time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'America/New_York',
              timeZoneName: 'short'
            })
          });
        });
      }
    } catch (error) {
      console.error(`Error loading ${sport}:`, error);
    }
  }

  res.status(200).json(allEvents);
}

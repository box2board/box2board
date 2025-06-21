export default async function handler(req, res) {
  try {
    const response = await fetch('https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategory=homeRuns&season=2025&limit=20');
    const data = await response.json();

    const hitters = data?.leagueLeaders?.[0]?.leaders?.map((player) => ({
      name: player.player.fullName,
      team: player.team?.abbreviation || '',
      homeRuns: player.value
    })) || [];

    res.status(200).json(hitters);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch home run leaders' });
  }
}

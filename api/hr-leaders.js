export default async function handler(req, res) {
  try {
    const response = await fetch(`https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=homeRuns&season=2025&limit=20&sportId=1`);
    const data = await response.json();

    const topHitters = data.leagueLeaders[0].leaders.map(player => ({
      name: `${player.player.fullName}`,
      team: player.team?.abbreviation || '',
      homeRuns: player.value
    }));

    res.status(200).json({ hitters: topHitters });
  } catch (error) {
    console.error("Error fetching HR leaders:", error);
    res.status(500).json({ error: "Failed to load HR leaders." });
  }
}

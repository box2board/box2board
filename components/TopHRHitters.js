import { useEffect, useState } from 'react';

export default function TopHRHitters() {
  const [hitters, setHitters] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/top-hr-hitters')
      .then(res => res.json())
      .then(data => setHitters(data))
      .catch(() => setError(true));
  }, []);

  return (
    <section className="home-run-section">
      <h2>Home Run Watch</h2>
      <p><em>Who’s due, who’s locked in.</em></p>
      <h3>Today's Top 20 Home Run Hitters</h3>
      {error ? (
        <p>Error loading hitters.</p>
      ) : hitters.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {hitters.map((hitter, index) => (
            <li key={index}>
              {index + 1}. {hitter.name} ({hitter.team}) – {hitter.homeRuns} HRs
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

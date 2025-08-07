import React from 'react';
import { Link } from 'react-router-dom';
import { FiMap, FiAlertTriangle, FiNavigation, FiClock, FiMapPin } from 'react-icons/fi';
import './HomePage.css';

const HomePage = () => {
  // Mock data for recent runs - in a real app, this would come from an API
  const recentRuns = [
    { id: 1, date: '2023-06-15', distance: '5.2 km', duration: '28:45' },
    { id: 2, date: '2023-06-12', distance: '3.8 km', duration: '22:10' },
    { id: 3, date: '2023-06-10', distance: '7.1 km', duration: '38:22' },
  ];

  // Mock data for nearby dangers - in a real app, this would come from an API
  const nearbyDangers = [
    { id: 1, type: 'wildlife', distance: '0.8 km', time: '5 min ago' },
    { id: 2, type: 'construction', distance: '1.2 km', time: '12 min ago' },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Run Safe in Nairobi</h1>
          <p>Stay aware of dangers on your running routes and help keep others safe</p>
          
          <div className="quick-actions">
            <Link to="/live-run" className="quick-action primary">
              <FiMap className="action-icon" />
              <span>Start Run</span>
            </Link>
            <Link to="/report-danger" className="quick-action secondary">
              <FiAlertTriangle className="action-icon" />
              <span>Report Danger</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="home-grid">
        <section className="recent-runs card">
          <h2>Recent Runs</h2>
          {recentRuns.length > 0 ? (
            <ul className="run-list">
              {recentRuns.map(run => (
                <li key={run.id} className="run-item">
                  <div className="run-date">{run.date}</div>
                  <div className="run-details">
                    <span><FiMapPin className="icon" /> {run.distance}</span>
                    <span><FiClock className="icon" /> {run.duration}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No recent runs yet. Start your first run!</p>
          )}
          <Link to="/live-run" className="view-all">View All Runs →</Link>
        </section>

        <section className="nearby-dangers card">
          <h2>Nearby Reports</h2>
          {nearbyDangers.length > 0 ? (
            <ul className="danger-list">
              {nearbyDangers.map(danger => (
                <li key={danger.id} className={`danger-item ${danger.type}`}>
                  <div className="danger-type">
                    {danger.type === 'wildlife' && '🐘'}
                    {danger.type === 'construction' && '🚧'}
                    {danger.type === 'theft' && '👤'}
                    {danger.type === 'accident' && '🚨'}
                    {danger.type === 'flooding' && '🌊'}
                    {danger.type === 'dark' && '🌙'}
                    {danger.type === 'roadblock' && '⛔'}
                    {danger.type === 'other' && '❓'}
                  </div>
                  <div className="danger-details">
                    <span className="danger-distance">{danger.distance} away</span>
                    <span className="danger-time">{danger.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No nearby danger reports. Stay vigilant!</p>
          )}
          <Link to="/report-danger" className="view-all">Report Danger →</Link>
        </section>

        <section className="safety-tips card">
          <h2>Safety Tips</h2>
          <ul className="tips-list">
            <li>Always let someone know your planned route and expected return time</li>
            <li>Stay in well-lit areas when running at night</li>
            <li>Carry identification and emergency contact information</li>
            <li>Be aware of your surroundings and trust your instincts</li>
            <li>Use the emergency button if you feel unsafe</li>
          </ul>
        </section>

        <section className="quick-links card">
          <h2>Quick Links</h2>
          <div className="link-grid">
            <Link to="/route-planner" className="quick-link">
              <FiNavigation className="link-icon" />
              <span>Plan a Safe Route</span>
            </Link>
            <Link to="/safety-guide" className="quick-link">
              <FiAlertTriangle className="link-icon" />
              <span>Safety Guide</span>
            </Link>
            <Link to="/emergency-contacts" className="quick-link">
              <FiMapPin className="link-icon" />
              <span>Emergency Contacts</span>
            </Link>
            <Link to="/settings" className="quick-link">
              <FiClock className="link-icon" />
              <span>Settings</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

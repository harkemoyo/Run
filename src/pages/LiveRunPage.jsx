import React from 'react';
import { useGeolocation } from '../App';
import '../styles/LiveRunPage.css';

const LiveRunPage = () => {
  const { position, speed, status, error } = useGeolocation();
  
  // Convert m/s to km/h and format to 1 decimal place
  const speedKmh = speed ? (speed * 3.6).toFixed(1) : '0.0';
  
  return (
    <div className="live-run-container">
      <h1>Live Run</h1>
      
      {error ? (
        <div className="error-message">
          <p>Error: {error}</p>
          <p>Please enable location services to track your run.</p>
        </div>
      ) : (
        <div className="run-stats">
          <div className="stat-box">
            <h3>Status</h3>
            <p className="status">{status}</p>
          </div>
          <div className="stat-box">
            <h3>Speed</h3>
            <p className="speed">{speedKmh} km/h</p>
          </div>
          {position && (
            <div className="stat-box">
              <h3>Position</h3>
              <p>Lat: {position[0].toFixed(6)}</p>
              <p>Lng: {position[1].toFixed(6)}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="map-container">
        {/* Map will be rendered here */}
        <p className="map-placeholder">Map View</p>
      </div>
      
      <div className="controls">
        <button className="start-button">Start Run</button>
        <button className="stop-button" disabled>End Run</button>
      </div>
    </div>
  );
};

export default LiveRunPage;

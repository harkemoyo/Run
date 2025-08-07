import React, { useState } from 'react';
import { useGeolocation } from '../App';
import '../styles/RoutePlannerPage.css';

const RoutePlannerPage = () => {
  const { position } = useGeolocation();
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [distance, setDistance] = useState(null);
  const [routePlanned, setRoutePlanned] = useState(false);

  const handlePlanRoute = (e) => {
    e.preventDefault();
    // In a real app, you would calculate the route here
    // For now, we'll just simulate a route
    setDistance('5.2 km');
    setRoutePlanned(true);
  };

  const handleUseCurrentLocation = () => {
    if (position) {
      setStartPoint(`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`);
    } else {
      alert('Unable to get current location. Please enable location services.');
    }
  };

  return (
    <div className="route-planner-container">
      <h1>Route Planner</h1>
      
      <div className="route-form-container">
        <form onSubmit={handlePlanRoute} className="route-form">
          <div className="form-group">
            <label htmlFor="startPoint">Start Point:</label>
            <div className="input-with-button">
              <input
                type="text"
                id="startPoint"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="Enter starting location"
                required
              />
              <button 
                type="button" 
                className="current-location-button"
                onClick={handleUseCurrentLocation}
                title="Use current location"
              >
                📍
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="endPoint">End Point:</label>
            <input
              type="text"
              id="endPoint"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              placeholder="Enter destination"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="plan-route-button">
              Plan Route
            </button>
          </div>
        </form>
      </div>

      {routePlanned && (
        <div className="route-details">
          <h2>Route Details</h2>
          <div className="route-stats">
            <div className="stat">
              <span className="stat-label">Distance:</span>
              <span className="stat-value">{distance}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Estimated Time:</span>
              <span className="stat-value">~30 min</span>
            </div>
            <div className="stat">
              <span className="stat-label">Difficulty:</span>
              <span className="stat-value">Moderate</span>
            </div>
          </div>
          
          <div className="map-placeholder">
            <p>Map View - Route from {startPoint} to {endPoint}</p>
            {/* In a real app, you would render a map here with the route */}
          </div>
          
          <div className="route-actions">
            <button className="start-navigation-button">Start Navigation</button>
            <button className="save-route-button">Save Route</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlannerPage;

import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

// Fix for default marker icons
const defaultIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const HomeScreen = ({ userLocation }) => {
  // Mock last known location if none available
  const lastLocation = userLocation || [-1.2921, 36.8219]; // Default to Nairobi coordinates

  return (
    <div className="home-screen">
      <header className="app-header">
        <h1>RunSafe</h1>
        <p className="welcome-text">Stay safe on your run</p>
      </header>

      <main className="home-content">
        <div className="map-preview">
          <MapContainer
            center={lastLocation}
            zoom={14}
            zoomControl={false}
            dragging={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            touchZoom={false}
            style={{ height: '200px', width: '100%', borderRadius: '12px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={lastLocation} icon={defaultIcon} />
          </MapContainer>
          <div className="map-overlay">
            <span className="map-overlay-text">Last known location</span>
          </div>
        </div>

        <Link to="/run" className="start-run-button">
          Start Run
        </Link>

        <div className="quick-actions">
          <Link to="/report" className="action-button danger">
            <span className="icon">⚠️</span>
            <span>Report Danger</span>
          </Link>
          <Link to="/routes" className="action-button">
            <span className="icon">🗺️</span>
            <span>Safe Routes</span>
          </Link>
        </div>

        <div className="stats-preview">
          <div className="stat-card">
            <span className="stat-value">5</span>
            <span className="stat-label">Runs This Week</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">12.5km</span>
            <span className="stat-label">Total Distance</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;

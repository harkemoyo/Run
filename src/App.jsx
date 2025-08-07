import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import './styles/StatusIndicator.css';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LiveRunPage from './pages/LiveRunPage';
import ReportDangerPage from './pages/ReportDangerPage';
import RoutePlannerPage from './pages/RoutePlannerPage';
import NotFoundPage from './pages/NotFoundPage';

// Custom hook for geolocation
export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [status, setStatus] = useState('Stopped');
  const watchId = useRef(null);

  // Clear geolocation watcher on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const success = useCallback((pos) => {
    const { latitude, longitude, speed: currentSpeed = 0 } = pos.coords;
    setPosition([latitude, longitude]);
    setSpeed(currentSpeed);
    
    // Determine status based on speed (m/s)
    if (currentSpeed === 0) setStatus('Stopped');
    else if (currentSpeed < 1.4) setStatus('Walking');
    else if (currentSpeed < 2.8) setStatus('Jogging');
    else setStatus('Running');
    
    setError(null);
  }, []);

  const errorCallback = useCallback((err) => {
    setError(err.message);
    console.error(`ERROR(${err.code}): ${err.message}`);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 10000,  // 10 seconds
      timeout: 5000       // 5 seconds
    };

    // Clear any existing watch
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    // Set up new watch
    watchId.current = navigator.geolocation.watchPosition(
      success,
      errorCallback,
      options
    );

  }, [success, errorCallback]);

  return { position, error, speed: (speed * 3.6).toFixed(1), status };
};

// Component to update map view when position changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Component to render danger zones
const DangerZones = ({ position, onDangerProximity }) => {
  // Simulated danger zones in Nairobi
  const dangerZones = [
    { id: 1, position: [-1.286389, 36.817223], radius: 100, type: 'Wildlife', message: 'Elephant sighting reported' },
    { id: 2, position: [-1.283333, 36.816667], radius: 80, type: 'Theft', message: 'Recent theft incidents' },
    { id: 3, position: [-1.29, 36.82], radius: 120, type: 'Construction', message: 'Road construction in progress' },
  ];

  // Check if user is near any danger zone
  useEffect(() => {
    if (!position) return;

    const checkDangerZones = () => {
      dangerZones.forEach(zone => {
        const distance = calculateDistance(position[0], position[1], zone.position[0], zone.position[1]);
        if (distance <= zone.radius) {
          onDangerProximity({
            type: zone.type,
            message: zone.message,
            distance: Math.round(distance),
            position: zone.position
          });
        }
      });
    };

    const interval = setInterval(checkDangerZones, 5000);
    return () => clearInterval(interval);
  }, [position, dangerZones, onDangerProximity]);

  return (
    <>
      {dangerZones.map(zone => (
        <Circle
          key={zone.id}
          center={zone.position}
          radius={zone.radius}
          pathOptions={{
            fillColor: zone.type === 'Wildlife' ? '#ff4444' : 
                      zone.type === 'Theft' ? '#ff8c00' : '#ffcc00',
            fillOpacity: 0.2,
            color: zone.type === 'Wildlife' ? '#ff0000' : 
                   zone.type === 'Theft' ? '#cc7000' : '#cc9900',
            weight: 2
          }}
        >
          <Popup>
            <div className="popup-content">
              <h4>{zone.type} Alert</h4>
              <p>{zone.message}</p>
              <small>Radius: {zone.radius}m</small>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
};

// Helper function to calculate distance between two coordinates in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

function App() {
  const { position, error, speed, status } = useGeolocation();
  const [dangerAlert, setDangerAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  // Toggle status panel visibility
  const toggleStatus = () => {
    setIsStatusExpanded(!isStatusExpanded);
  };

  // Handle danger proximity alerts
  const handleDangerProximity = useCallback((alert) => {
    setDangerAlert(alert);
    setShowAlert(true);
    
    // Auto-hide alert after 10 seconds
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get status color based on activity
  const getStatusColor = () => {
    switch (status) {
      case 'Running': return '#e74c3c';  // Red
      case 'Jogging': return '#f39c12';  // Orange
      case 'Walking': return '#27ae60';   // Green
      default: return '#7f8c8d';         // Gray
    }
  };

  if (error) {
    return (
      <div className="loading-screen">
        <h2>Error: {error}</h2>
        <p>Please enable location services and refresh the page.</p>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h3>Getting your location...</h3>
        <p>Please allow location access to continue.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="live-run" element={<LiveRunPage />} />
          <Route path="report-danger" element={<ReportDangerPage />} />
          <Route path="route-planner" element={<RoutePlannerPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>

      {/* Collapsible Status Indicator */}
      <div className={`status-container ${isStatusExpanded ? 'expanded' : ''}`}>
        <button className="status-toggle" onClick={toggleStatus}>
          <span className="status-icon" style={{ backgroundColor: getStatusColor() }}></span>
        </button>
        
        {isStatusExpanded && (
          <div className="status-content">
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className="status-value" style={{ color: getStatusColor() }}>
                {status}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Speed:</span>
              <span className="status-value">{speed} km/h</span>
            </div>
            <div className="status-item">
              <span className="status-label">Location:</span>
              <span className="status-value">
                {position && `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Danger Alert */}
      {showAlert && dangerAlert && (
        <div className="danger-alert">
          <h3>{dangerAlert.type} Alert!</h3>
          <p>{dangerAlert.message}</p>
          <p>Distance: {dangerAlert.distance}m away</p>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100vh', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView center={position} zoom={15} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User Location Marker */}
        <Marker position={position}>
          <Popup>Your current location</Popup>
        </Marker>
        
        {/* Danger Zones */}
        <DangerZones position={position} onDangerProximity={handleDangerProximity} />
      </MapContainer>
    </div>
  );
}

export default App;
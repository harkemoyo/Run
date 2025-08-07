import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import './LiveRunScreen.css';

// Custom icons
const runnerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMkVDQzdCIiBkPSJNMjU2IDhDMTE5IDggOCAxMTkgOCAyNTZzMTExIDI0OCAyNDggMjQ4IDI0OC0xMTEgMjQ4LTI0OFMzOTMgOCAyNTYgOHptMCA0MjRjLTk3LjIgMC0xNzYtNzguOC0xNzYtMTc2UzE1OC44IDgwIDI1NiA4MHMxNzYgNzguOCAxNzYgMTc2LTc4LjggMTc2LTE3NiAxNzZ6Ii8+PGNpcmNsZSBjeD0iyNTYiIGN5PSIxNzYiIHI9IjQwIiBmaWxsPSIjMkVDQzdCIi8+PGNpcmNsZSBjeD0iMjU2IiBjeT0iMTc2IiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiMyRUNEN0IiIGQ9Ik0yNTYgMjcyYy0yNi41IDAtNTEuOSA5LjItNzEuNiAyNS45LTUuMSA0LjMtNS44IDExLjktMS41IDE3cyExMS45IDUuOCAxNyAxLjVjMTMuOC0xMS41IDMxLjktMTguNCA1MS4xLTE4LjRzMzcuMyA2LjkgNTEuMSAxOC40YzIuMSAxLjggNC43IDIuNiA3LjIgMi42IDMuNCAwIDYuNi0xLjQgOC44LTRjNC4zLTUuMSAzLjYtMTIuNy0xLjUtMTctMTkuNy0xNi43LTQ1LjEtMjUuOS03MS42LTI1Ljl6Ii8+PC9zdmc+',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const DangerZones = ({ position, onDangerProximity }) => {
  // Simulated danger zones in Nairobi
  const dangerZones = [
    { 
      id: 1, 
      position: [-1.286389, 36.817223], 
      radius: 100, 
      type: 'Wildlife', 
      message: 'Elephant sighting reported',
      timestamp: '10 min ago',
      severity: 'high'
    },
    { 
      id: 2, 
      position: [-1.283333, 36.816667], 
      radius: 80, 
      type: 'Theft', 
      message: 'Recent theft incidents',
      timestamp: '25 min ago',
      severity: 'medium'
    },
    { 
      id: 3, 
      position: [-1.29, 36.82], 
      radius: 120, 
      type: 'Construction', 
      message: 'Road construction in progress',
      timestamp: '1 hour ago',
      severity: 'low'
    },
  ];

  // Check if user is near any danger zone
  useEffect(() => {
    if (!position) return;

    const checkDangerZones = () => {
      dangerZones.forEach(zone => {
        const distance = calculateDistance(position[0], position[1], zone.position[0], zone.position[1]);
        if (distance <= zone.radius) {
          onDangerProximity({
            ...zone,
            distance: Math.round(distance)
          });
        }
      });
    };

    const interval = setInterval(checkDangerZones, 5000);
    checkDangerZones(); // Initial check
    
    return () => clearInterval(interval);
  }, [position, dangerZones, onDangerProximity]);

  return (
    <>
      {dangerZones.map(zone => {
        const color = zone.severity === 'high' ? '#e74c3c' : 
                     zone.severity === 'medium' ? '#f39c12' : '#f1c40f';
        
        return (
          <Circle
            key={zone.id}
            center={zone.position}
            radius={zone.radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.2,
              color: color,
              weight: 2
            }}
          >
            <Popup>
              <div className="danger-popup">
                <div className="danger-popup-header" style={{ borderLeft: `4px solid ${color}` }}>
                  <h4>{zone.type} Alert</h4>
                  <span className="danger-timestamp">{zone.timestamp}</span>
                </div>
                <p>{zone.message}</p>
                <div className="danger-popup-footer">
                  <span className="danger-severity" style={{ backgroundColor: `${color}20`, color }}>
                    {zone.severity} risk
                  </span>
                  <span className="danger-distance">
                    {calculateDistance(position[0], position[1], zone.position[0], zone.position[1]).toFixed(0)}m away
                  </span>
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </>
  );
};

const RunStats = ({ distance, pace, time, calories }) => {
  return (
    <div className="run-stats">
      <div className="stat">
        <div className="stat-value">{distance || '0.0'}</div>
        <div className="stat-label">KM</div>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <div className="stat-value">{pace || '0:00'}</div>
        <div className="stat-label">/KM</div>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <div className="stat-value">{time || '0:00'}</div>
        <div className="stat-label">TIME</div>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <div className="stat-value">{calories || '0'}</div>
        <div className="stat-label">KCAL</div>
      </div>
    </div>
  );
};

const LiveRunScreen = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [dangerAlert, setDangerAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [runStats, setRunStats] = useState({
    distance: 0.0,
    pace: '0:00',
    time: '0:00',
    calories: 0
  });

  // Simulate run stats updates
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setRunStats(prev => ({
        distance: (parseFloat(prev.distance) + 0.01).toFixed(2),
        pace: '5:42',
        time: '12:34',
        calories: Math.floor(prev.calories + 0.5)
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error("Error getting location:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleDangerProximity = useCallback((alert) => {
    setDangerAlert(alert);
    setShowAlert(true);
    
    // Vibrate if available
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Auto-hide alert after 10 seconds
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const endRun = () => {
    if (window.confirm('Are you sure you want to end your run?')) {
      navigate('/');
    }
  };

  if (!position) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h3>Getting your location...</h3>
        <p>Please ensure location services are enabled.</p>
      </div>
    );
  }

  return (
    <div className="live-run-screen">
      {/* Map View */}
      <div className="map-container">
        <MapContainer
          center={position}
          zoom={16}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User Position */}
          <Marker position={position} icon={runnerIcon}>
            <Popup>Your current position</Popup>
          </Marker>
          
          {/* Danger Zones */}
          <DangerZones position={position} onDangerProximity={handleDangerProximity} />
        </MapContainer>
      </div>

      {/* Danger Alert */}
      {showAlert && dangerAlert && (
        <div className="danger-alert" style={{ borderLeft: `4px solid ${dangerAlert.severity === 'high' ? '#e74c3c' : dangerAlert.severity === 'medium' ? '#f39c12' : '#f1c40f' }` }}>
          <div className="danger-alert-content">
            <div className="danger-alert-header">
              <h4>{dangerAlert.type} Alert</h4>
              <button 
                className="close-alert" 
                onClick={() => setShowAlert(false)}
                aria-label="Close alert"
              >
                &times;
              </button>
            </div>
            <p>{dangerAlert.message} ({dangerAlert.distance}m away)</p>
          </div>
        </div>
      )}

      {/* Run Stats */}
      <div className="run-stats-container">
        <RunStats {...runStats} />
      </div>

      {/* Controls */}
      <div className="run-controls">
        <button 
          className={`control-button ${isPaused ? 'resume' : 'pause'}`}
          onClick={togglePause}
          aria-label={isPaused ? 'Resume run' : 'Pause run'}
        >
          {isPaused ? '▶' : '❚❚'}
        </button>
        <button 
          className="control-button end-run"
          onClick={endRun}
          aria-label="End run"
        >
          Stop
        </button>
      </div>

      {/* Emergency Button */}
      <button 
        className="emergency-button"
        onClick={() => {
          // In a real app, this would trigger an emergency alert
          alert('Emergency alert sent to your emergency contacts!');
        }}
      >
        🆘 Emergency
      </button>
    </div>
  );
};

// Helper function to calculate distance between two coordinates in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
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
}

export default LiveRunScreen;

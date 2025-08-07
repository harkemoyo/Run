import React, { useState } from 'react';
import { useGeolocation } from '../App';
import '../styles/ReportDangerPage.css';

const ReportDangerPage = () => {
  const { position } = useGeolocation();
  const [dangerType, setDangerType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Danger reported:', { dangerType, description, position });
    setSubmitted(true);
    // Reset form after submission
    setDangerType('');
    setDescription('');
  };

  if (submitted) {
    return (
      <div className="report-container">
        <h1>Thank You!</h1>
        <p>Your report has been submitted successfully.</p>
        <button onClick={() => setSubmitted(false)}>Report Another Issue</button>
      </div>
    );
  }

  return (
    <div className="report-container">
      <h1>Report Dangerous Area</h1>
      
      {position ? (
        <div className="location-info">
          <p>Your current location will be included in the report.</p>
          <p className="coordinates">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      ) : (
        <div className="location-warning">
          <p>Unable to get your current location. Please enable location services.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="danger-form">
        <div className="form-group">
          <label htmlFor="dangerType">Type of Danger:</label>
          <select
            id="dangerType"
            value={dangerType}
            onChange={(e) => setDangerType(e.target.value)}
            required
          >
            <option value="">Select a danger type</option>
            <option value="construction">Construction Zone</option>
            <option value="accident">Accident/Incident</option>
            <option value="poor_lighting">Poor Lighting</option>
            <option value="suspicious">Suspicious Activity</option>
            <option value="wildlife">Wildlife Hazard</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details about the danger..."
            rows="4"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportDangerPage;

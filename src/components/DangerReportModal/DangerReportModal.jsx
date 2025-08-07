import React, { useState, useEffect, useRef } from 'react';
import './DangerReportModal.css';

const DangerReportModal = ({ isOpen, onClose, onReport, currentLocation }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const noteTextareaRef = useRef(null);
  
  // Common danger types with icons
  const dangerTags = [
    { id: 'wildlife', label: '🐘 Wildlife', icon: '🐘' },
    { id: 'theft', label: '👤 Suspicious', icon: '👤' },
    { id: 'construction', label: '🚧 Construction', icon: '🚧' },
    { id: 'accident', label: '🚨 Accident', icon: '🚨' },
    { id: 'flooding', label: '🌊 Flooding', icon: '🌊' },
    { id: 'dark', label: '🌙 Poor Lighting', icon: '🌙' },
    { id: 'roadblock', label: '⛔ Roadblock', icon: '⛔' },
    { id: 'other', label: '❓ Other', icon: '❓' },
  ];

  // Initialize speech recognition if available
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNote(prevNote => prevNote ? `${prevNote} ${transcript}` : transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        alert('Error starting voice input. Please try again or use text input.');
        setIsRecording(false);
      }
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedTags.length === 0) {
      alert('Please select at least one danger type');
      return;
    }
    
    const report = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      location: currentLocation,
      tags: selectedTags,
      note: note.trim(),
      status: 'reported'
    };
    
    onReport(report);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setSelectedTags([]);
    setNote('');
    setIsRecording(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="danger-report-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Danger</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>What did you see? <span className="required">*</span></h3>
            <div className="danger-tags">
              {dangerTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-button ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => toggleTag(tag.id)}
                >
                  <span className="tag-icon">{tag.icon}</span>
                  <span className="tag-label">{tag.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <div className="input-header">
              <h3>Add details (optional)</h3>
              <button 
                type="button"
                className={`voice-button ${isRecording ? 'recording' : ''}`}
                onClick={toggleVoiceInput}
                disabled={!('webkitSpeechRecognition' in window) || isRecording}
                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? '🛑' : '🎤'}
              </button>
            </div>
            <div className="input-wrapper">
              <textarea
                ref={noteTextareaRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe what you saw, when, and any other details..."
                rows="3"
                maxLength={200}
              />
              <div className="character-count">{note.length}/200</div>
            </div>
          </div>
          
          <div className="location-info">
            <span className="location-icon">📍</span>
            <span className="location-coords">
              {currentLocation 
                ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
                : 'Getting location...'}
            </span>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="button secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button primary"
              disabled={selectedTags.length === 0}
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DangerReportModal;

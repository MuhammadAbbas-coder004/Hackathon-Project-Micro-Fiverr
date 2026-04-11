import { useState, useEffect, useCallback } from 'react';
import socket from '../utils/socket';

export const useLocationTracking = (bookingId, userId, role) => {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setLocation(newLocation);
        
        // Send to backend via Socket
        socket.emit("update_location", {
          bookingId,
          freelancerId: userId, // Assuming role is freelancer
          lat: latitude,
          lng: longitude
        });
        
        console.log("📍 Location sent:", newLocation);
      },
      (err) => {
        setError(err.message);
        setIsSharing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    setWatchId(id);
    setIsSharing(true);
    setError(null);
  }, [bookingId, userId]);

  const stopSharing = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
  }, [watchId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    isSharing,
    location,
    error,
    startSharing,
    stopSharing
  };
};

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
const LocationPicker = ({ onLocationChange }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        return;
      }
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ type: 'Point', coordinates: [longitude, latitude] });
            onLocationChange({
              type: 'Point',
              coordinates: [longitude, latitude],
            });
            setError(null);
          },
          (err) => {
            setError(`Error getting location: ${err.message}`);
          },
          {
            enableHighAccuracy: false, // Use low-accuracy mode
            timeout: 5000, // Set a timeout value in milliseconds
            maximumAge: 0, // Don't use cached position
          }
        );
      } catch (error) {
        setError(`Error : ${error.message}`);
      }
    };
    fetchLocation();
  }, [onLocationChange]);

  return (
    <div className='flex items-center gap-2'>
      <MapPin className='h-4 w-4 text-gray-500' />
      {location ? (
        <span className='text-sm text-gray-500'>
          Latitude: {location.coordinates[1]}, Longitude:{' '}
          {location.coordinates[0]}
        </span>
      ) : (
        <span className='text-sm text-gray-500'>
          {error ? error : 'Getting Your Location....'}
        </span>
      )}
    </div>
  );
};

export default LocationPicker;

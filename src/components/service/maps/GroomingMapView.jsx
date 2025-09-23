// src/components/service/maps/GroomingMapView.jsx

import React from 'react';
import BaseServiceMapView from '../../common/BaseServiceMapView';
import ServiceMapErrorBoundary from '../../common/ServiceMapErrorBoundary';
import { SERVICE_CONFIGS } from '../../../config/serviceMapConfig';

const GroomingMapView = ({ 
  userLocation, 
  markers = [], 
  filters = {},
  onMarkerClick,
  className = ''
}) => {
  // Get grooming-specific configuration
  const groomingConfig = SERVICE_CONFIGS.grooming;

  // Process filters for grooming service
  const processedFilters = {
    services: filters.services || [],
    petTypes: filters.petTypes || [],
    priceRanges: filters.priceRanges || [],
    ...filters
  };

  // Custom marker click handler for grooming
  const handleMarkerClick = (markerData) => {
    console.log('Grooming marker clicked:', markerData);
    
    // Call parent handler if provided
    if (onMarkerClick) {
      onMarkerClick(markerData);
    }
  };

  return (
    <ServiceMapErrorBoundary
      userLocation={userLocation}
      markers={markers}
      serviceType="grooming"
      serviceConfig={groomingConfig}
      onError={(error, errorInfo) => {
        console.error('GroomingMapView Error:', error);
        // Could send to monitoring service
      }}
    >
      <BaseServiceMapView
        userLocation={userLocation}
        rawMarkers={markers}
        serviceType="grooming"
        filters={processedFilters}
        onMarkerClick={handleMarkerClick}
        className={`grooming-map ${className}`}
        customConfig={{
          // Override default config if needed
          markerIcon: '🐕',
          accentColor: '#FF6B6B',
          backgroundColor: '#FFF5F5',
        }}
      />
    </ServiceMapErrorBoundary>
  );
};

export default GroomingMapView;
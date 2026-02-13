import { useEffect } from 'react';

const useCurrentLocation = () => {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('위도:', position.coords.latitude);
        console.log('경도:', position.coords.longitude);
      },
      (error) => {
        console.error('위치 오류:', error);
      },
      {
        enableHighAccuracy: true,   // 정확도 우선
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);
};

export default useCurrentLocation;

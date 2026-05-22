import { useState, useEffect } from 'react';

const DEVICES = [
  { name: "Rover Mikrotik", ip: "10.42.0.99" },
  { name: "Base Mikrotik", ip: "10.42.0.100" },
  { name: "Jetson Orin", ip: "10.42.0.253" },
  { name: "Imou Camera", ip: "10.42.0.69" },
  { name: "Xavier", ip: "10.42.0.51" },
];

export function useNetworkStatus() {
  const [devices, setDevices] = useState(
    DEVICES.map(d => ({ ...d, online: null })) // null = still checking
  );

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/network-status');
        const data = await res.json();
        setDevices(data);
      } catch (e) {
        console.error('Ping server unreachable', e);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return { devices };
}
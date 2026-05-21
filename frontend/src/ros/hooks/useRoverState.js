import { useState, useEffect } from 'react';

export function useRoverState() {
  const [state, setState] = useState({
    network: [],
    odometry: null,
    gnss: null,
    config: null,
    arm_pwm: null,
    drive_pwm: null,
    arm_state: null,
    connected: false,
  });

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        // Updated port to match standard FastAPI default (8000), adjust if needed!
        const res = await fetch('http://localhost:8000/api/v1/telemetry/state');
        if (res.ok) {
          const data = await res.json();
          setState({ ...data, connected: true });
        }
      } catch (e) {
        console.warn('Initial HTTP state fetch failed, waiting for WebSocket...', e);
      }
    };

    fetchInitialState();

    const wsUrl = 'ws://localhost:8000/api/v1/telemetry/ws';
    let socket = new WebSocket(wsUrl);
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      socket.onopen = () => {
        console.log('[WebSocket] Connected telemetry.');
        setState(prev => ({ ...prev, connected: true }));
      };

      socket.onmessage = (event) => {
        try {
          const freshData = JSON.parse(event.data);
          // Overwrite the state with the live structured payload from FastAPI
          setState({
            ...freshData,
            connected: true
          });
        } catch (err) {
          console.error('[WebSocket] Data parsing error:', err);
        }
      };

      socket.onclose = (e) => {
        console.warn(`[WebSocket] Stream closed (${e.reason}). Attempting reconnect in 2s...`);
        setState(prev => ({ ...prev, connected: false }));
        
        // Auto-reconnect safety loop if the backend restarts or drops out
        reconnectTimeout = setTimeout(() => {
          socket = new WebSocket(wsUrl);
          connectWebSocket();
        }, 2000);
      };

      socket.onerror = (err) => {
        console.error('[WebSocket] Socket encountered an error:', err);
        socket.close();
      };
    };

    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
  }, []);

  return state;
}
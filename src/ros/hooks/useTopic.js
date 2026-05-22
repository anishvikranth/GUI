import { useEffect, useState, useRef } from 'react';
import * as ROSLIB from 'roslib';
import ros from '../rosClient';

export function useTopic(name, messageType, options = {}) {
  const { throttleMs = 0, enabled = true } = options;

  const [msg, setMsg]             = useState(null);
  const [connected, setConnected] = useState(false);
  const lastCallTime              = useRef(0);

  // track ros connection state
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onClose   = () => setConnected(false);
    const onError   = () => setConnected(false);

    ros.on('connection', onConnect);
    ros.on('close',      onClose);
    ros.on('error',      onError);

    setConnected(ros.isConnected);

    return () => {
      ros.off('connection', onConnect);
      ros.off('close',      onClose);
      ros.off('error',      onError);
    };
  }, []);

  // subscribe / unsubscribe
  useEffect(() => {
    if (!enabled || !connected) return;

    const topic = new ROSLIB.Topic({ ros, name, messageType });

    topic.subscribe((message) => {
      if (throttleMs > 0) {
        const now = Date.now();
        if (now - lastCallTime.current < throttleMs) return;
        lastCallTime.current = now;
      }
      setMsg(message);
    });

    return () => {
      topic.unsubscribe();
    };
  }, [name, messageType, enabled, connected, throttleMs]);

  return { msg, connected };
}
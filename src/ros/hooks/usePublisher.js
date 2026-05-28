import { useEffect, useState, useRef } from 'react';
import * as ROSLIB from 'roslib';
import ros from '../rosClient';  

export function usePublisher(name, messageType, options = {}) {
  const { enabled = true } = options;
  const [connected, setConnected] = useState(false);  //checks the websocket connection
  const topicRef = useRef(null);  //to store the ROS publisher object
  // now we will track ros connection state
  useEffect(() => {                       //to trach the websocket connection lifecycle
    const onConnect = () => setConnected(true);
    const onClose = () => setConnected(false);
    const onError = () => setConnected(false);

    ros.on('connection', onConnect);
    ros.on('close', onClose);
    ros.on('error', onError);

    setConnected(ros.isConnected);   //Initial sync

    return () => {
      ros.off('connection', onConnect);
      ros.off('close', onClose);
      ros.off('error', onError);   //removes the listeners when the component is unmounted
    };
  }, []);

  // create publisher
  useEffect(() => {
    if (!enabled || !connected)
      return;

    topicRef.current = new ROSLIB.Topic({  //ROS topic publisher
      ros,
      name,
      messageType,
    });

    return () => {
      topicRef.current = null;
    };
  }, [name, messageType, enabled, connected]);

  // publish function
  const publish = (data) => {
    //console.log("Publishing:",data); 
    if (!topicRef.current)
      return;
    const msg = data; //convert JS msg to ROS msg
    topicRef.current.publish(msg);
  };

  return {
    publish,
    connected,
  };
}

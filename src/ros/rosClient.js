import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
  url: import.meta.env.VITE_ROSBRIDGE_URL
});

ros.on('connection', () => {
  console.log('Connected to rosbridge');
});

ros.on('error', (error) => {
  console.error('Rosbridge error:', error);
});

ros.on('close', () => {
  console.warn('Rosbridge connection closed');
});

export default ros;
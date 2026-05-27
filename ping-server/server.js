import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));

const DEVICES = [
  { name: "Rover Mikrotik", ip: "10.42.0.99" },
  { name: "Base Mikrotik", ip: "10.42.0.100" },
  { name: "Jetson Orin", ip: "10.42.0.253" },
  { name: "Imou Camera", ip: "10.42.0.69" },
  { name: "Xavier", ip: "10.42.0.51" },
];

function ping(ip) {
  return new Promise((resolve) => {
    exec(`ping -c 1 -W 1 ${ip}`, (error) => resolve(!error));
  });
}

app.get('/network-status', async (req, res) => {
  const results = await Promise.all(
    DEVICES.map(async (d) => ({ ...d, online: await ping(d.ip) }))
  );
  res.json(results);
});

app.listen(3001, () => console.log('Ping server running on port 3001'));
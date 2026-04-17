require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Real-time Anomaly Engine
const realtimeEngine = require('./services/realtimeEngine');
realtimeEngine.init(io);

// Root status route
app.get('/', (req, res) => {
  res.send('AI Data Doctor Backend is running. Visit port 3000 for the dashboard.');
});

// Main API Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Data Doctor Backend is running' });
});

server.listen(PORT, () => {
  console.log(`🚀 [SURGEON-PRO] Real-time engine live on http://localhost:${PORT}`);
});

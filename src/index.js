require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const incidentsRoute = require('./routes/incidents');
app.use('/api/incidents', incidentsRoute);
// Настройка CORS для REST API
app.use(cors({
  origin: '*', // ⚠️ можно указать точный адрес, например: 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Создание Socket.IO сервера
const io = new Server(server, {
  cors: {
    origin: '*', // ⚠️ сюда тоже можно указать адрес фронта
    methods: ['GET', 'POST']
  }
});

// Делаем io доступным в любом контроллере через app
app.set('io', io);

// Middleware
app.use(express.json({ limit: '10mb' }));

// Роуты

app.use('/api/sensor', require('./routes/sensorRoutes'));
app.use('/api/room', require('./routes/roomRoutes'));
app.use('/api/sensor-status', require('./routes/sensorStatusRoutes'));
app.use('/api/incident', require('./routes/incidentRoutes'));
app.use('/api/incidenttype', require('./routes/incidentTypeRoutes'));
app.use('/api/operator', require('./routes/operatorRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/operatorRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Socket.IO события
io.on('connection', (socket) => {
  console.log('Клиент подключен, socket id:', socket.id);

  socket.on('disconnect', () => {
    console.log('Клиент отключился, socket id:', socket.id);
  });
});

// Обработка ошибок (должна быть после всех маршрутов)
app.use(require('./middlewares/errorHandler'));

// Запуск сервера
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

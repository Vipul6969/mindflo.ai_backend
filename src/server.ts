import { createServer } from 'http';
import app from './app'; // Your Express app with all routes/middleware
import { Server } from 'socket.io';
import { registerSocketEvents } from './socket/socket'; // Adjust the import path as necessary

const port = parseInt(process.env.PORT || '3000', 10);

// Create HTTP server from Express app
const server = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, { cors: { origin: '*' } });

// Register your Socket.IO event handlers
registerSocketEvents(io);

// Start the server
server.listen(port, () => {
  console.log(`> Backend ready on http://localhost:${port}`);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static HTML files in the current directory
app.use(express.static(path.join(__dirname)));

// Route for the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Single global room for the MVP (broadcasts to all connected users)
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newNote', (data) => {
        io.emit('newNote', data);
    });

    socket.on('newCheckpoint', (data) => {
        io.emit('newCheckpoint', data);
    });

    socket.on('newNudge', (data) => {
        io.emit('newNudge', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
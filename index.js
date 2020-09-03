const cors = require('cors');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
    addUsers,
    removeUsers,
    getUser,
    getUserInRooms
} = require ('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());

const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { user, error } = addUsers({ id: socket.id, name, room });

        if (error) callback(error);

        if (!user) null;

        socket.emit('message', { user: 'admin', text: `${capitalizeString(user.name)} welcome to the room ${user.room}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${capitalizeString(user.name)} has joined to the room` })

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUserInRooms(user.room) })

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUserInRooms(user.room) });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUsers(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${capitalizeString(user.name)} has left the room` })
        }
    });
});

app.use(router);

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
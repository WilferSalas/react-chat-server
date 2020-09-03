const users = [];

const addUsers = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const userExists = users.find((user) => user.room === room && user.name === name);

    if (userExists) {
        return { error: 'Username is already in use'}
    }

    const user = {id, name, room}

    users.push(user);

    return { user };
}

const removeUsers = (id) => {
    const idExists = users.findIndex((user) => user.id === id);

    if (idExists !== -1) {
        return users.splice(idExists, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUserInRooms = (room) => users.filter((user) => user.room === room);

module.exports = { addUsers, removeUsers, getUser, getUserInRooms };
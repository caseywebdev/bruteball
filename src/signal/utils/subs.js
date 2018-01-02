const sockets = require('../utils/sockets');

const SUBS = {};

exports.add = (socket, event) => {
  (socket.events || (socket.events = {}))[event] = true;
  (SUBS[event] || (SUBS[event] = {}))[socket.id] = true;
};

exports.remove = (socket, event) => {
  const {events} = socket;

  if (!events) return;

  if (!event) {
    for (let e in events) remove(socket, e);
    return;
  }

  delete events[event];
  delete SUBS[event][socket.id];
};

exports.trigger = (event, data) => {
  const {all} = sockets;
  for (let id in SUBS[event]) all[id].send(event, data);
};

const _ = require('underscore');
const Live = require('live-socket');
const ws = require('uws');

const close = require('../listeners/close');
const open = require('../listeners/open');
const pave = require('../listeners/pave');
const signal = require('../listeners/signal');
const sub = require('../listeners/sub');
const unsub = require('../listeners/unsub');

const LISTENERS = _.map({
  close,
  open,
  pave,
  signal,
  sub,
  unsub
}, (cb, name) =>
  socket =>
    socket.on(name, (params, done = _.noop) =>
      Promise
        .resolve({socket, params})
        .then(cb)
        .then(_.partial(done, null), done)
    )
);

console.log('Starting WebSocket server...');
const wss = new ws.Server({port: 80});

wss.on('connection', socket => {
  _.invoke(LISTENERS, 'call', null, socket = new Live({socket}));
  socket.trigger('open');
});

module.exports = async () => {};

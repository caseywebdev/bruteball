// const _ = require('underscore');
const live = require('../utils/live');
const Peer = require('../../shared/peer');

const peers = {};

const getPeer = id =>
  peers[id] ||
  (peers[id] = new Peer())
    .on('signal', data => live.send('signal', {id, data}))
    .on('close', () => { delete peers[id]; });

live.on('signal', ({id, data}) => getPeer(id).signal(data));

// const messagePeers = message => {
//   _.each(PEERS, peer => peer.send('u', message));
// };

module.exports = {peers};

// setInterval(() => _.invoke(peers, 'send', 'u', Date.now()), 1000);

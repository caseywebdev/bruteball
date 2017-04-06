import config from '../config';
import Live from 'live-socket';
import ws from 'uws';

const {key, name, signal: {url}} = config;

console.log(`Connecting to signal server at ${url}...`);
const live = new Live({WebSocket: ws, url});
live.on('open', () => {
  console.log('Connected to signal server, authorizing as a host...');
  live.send('pave', {
    query: ['auth!', {token: key, host: {name}}]
  }, er => {
    if (er) return console.error(`Auth failed! ${er.toString()}`);
    console.log('Successfully authorized as a host');
  });
});

export default live;

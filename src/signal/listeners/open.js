import sockets from '../utils/sockets';
import uuid from 'node-uuid';

export default ({socket}) => {
  sockets.all[socket.id = uuid.v4()] = socket;
  console.log(`${socket.id} connected`);
};

import sockets from '../utils/sockets';
import log from '../utils/log';

export default ({socket, params: {id, data}}) => {
  log.info(`${socket.id} signaled ${id}: ${data.type}`);
  const recipient = sockets.all[id];
  if (!recipient) {
    const er = new Error(`Recipient ${id} not found!`);
    log.error(er.message);
    throw er;
  }
  recipient.send('signal', {id: socket.id, data});
};

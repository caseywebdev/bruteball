import sockets from '../utils/sockets';

export default ({socket, params: {id, data}}) => {
  console.log(`${socket.id} signaled ${id}: ${data.type}`);
  const recipient = sockets.all[id];
  if (!recipient) {
    const er = new Error(`Recipient ${id} not found!`);
    console.error(er.message);
    throw er;
  }
  recipient.send('signal', {id: socket.id, data});
};

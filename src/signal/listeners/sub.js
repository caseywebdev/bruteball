const {add} = require('../utils/subs');

module.exports = ({socket, params: event}) => add(socket, event);

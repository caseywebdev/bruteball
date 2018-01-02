const {remove} = require('../utils/subs');

module.exports = ({socket, params: event}) => remove(socket, event);

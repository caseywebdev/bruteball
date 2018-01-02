const config = require('../config');
const Qs = require('qs');

const {url} = config.client;

module.exports = ({token}) => `
[Here's your sign in link.](${url}/verify?${Qs.stringify({token})})

If you're not trying to sign in to Bruteball, you can delete this message.
`.trim();

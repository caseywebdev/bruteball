// This hack is necessary for ReactRouter (which is only CJS/Globals compliant)
// to work.
window.React = require('react');

require('client/index');

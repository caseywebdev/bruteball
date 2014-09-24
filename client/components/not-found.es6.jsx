/** @jsx React.DOM */

import Cursors from 'cursors';
import {Link} from 'react-router';
import React from 'react';

export default React.createClass({
  mixins: [Cursors],

  render: function () {
    return (
      <div>
        Not Found!
        <Link to='index'>Go Home</Link>
      </div>
    );
  }
});

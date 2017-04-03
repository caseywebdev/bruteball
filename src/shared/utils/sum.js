import _ from 'underscore';

export default ns => _.reduce(ns, (sum, n) => sum + n, 0);

import _ from 'underscore';

export default function (ns) {
 return _.reduce(ns, function (sum, n) { return sum + n; }, 0);
}

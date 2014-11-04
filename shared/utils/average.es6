import _ from 'underscore';

export default function (ns) {
  if (!ns.length) return 0;
  return _.reduce(ns, function (sum, n) { return sum + n; }, 0) / ns.length;
}

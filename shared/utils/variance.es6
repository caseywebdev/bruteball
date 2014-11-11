import _ from 'underscore';
import average from 'shared/utils/average';

export default function (ns) {
  var mean = average(ns);
  return average(_.map(ns, function (n) { return Math.pow(mean - n, 2); }));
}

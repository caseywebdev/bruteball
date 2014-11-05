import _ from 'underscore';
import average from 'shared/utils/average';

export default function (ns) {
  var mean = average(ns);
  var variance = average(_.map(ns, function (n) {
    return Math.pow(mean - n, 2);
  }));
  return Math.sqrt(variance);
}

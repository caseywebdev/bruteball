var PRECISION = 100;

export default function (n, precision) {
  if (!precision) precision = PRECISION;
  return Math.round(n * precision) / precision;
}

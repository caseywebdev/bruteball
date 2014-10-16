var PRECISION = 10000;

export default function (n) {
  return Math.round(n * PRECISION) / PRECISION;
}

var PRECISION = 100;

export default function (n) {
  return Math.round(n * PRECISION) / PRECISION;
}

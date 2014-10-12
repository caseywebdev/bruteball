module.exports = function (socket, av, cb) {
  var ax = parseInt(av.x);
  var ay = parseInt(av.y);
  if (!socket.user || isNaN(ax) || isNaN(ay)) return cb();
  var d = Math.sqrt((ax * ax) + (ay * ay));
  socket.user.ax = d && ax / d;
  socket.user.ay = d && ay / d;
  cb();
};

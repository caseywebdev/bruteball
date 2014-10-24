export default function (socket, then, cb) {
  cb(null, {then: then, now: Date.now()});
}

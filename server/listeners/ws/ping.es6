export default function (__, then, cb) {
  cb(null, {then: then, now: Date.now()});
}

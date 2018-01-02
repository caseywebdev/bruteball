module.exports = (hash, size = 80) =>
  `https://gravatar.com/avatar/${hash}?d=blank&s=${size}`;

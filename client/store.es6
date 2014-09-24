import config from 'config';

var prefix = config.store.prefix;

export var get = function (key) {
  return JSON.parse(localStorage.getItem(prefix + key));
};

export var set = function (key, val) {
  localStorage.setItem(prefix + key, JSON.stringify(val));
};

export var remove = function (key) {
  localStorage.removeItem(prefix + key);
};

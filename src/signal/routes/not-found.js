const ROUTE_NOT_FOUND_ERROR = new Error('No matching route found');

module.exports = {
  '*': () => { throw ROUTE_NOT_FOUND_ERROR; }
};

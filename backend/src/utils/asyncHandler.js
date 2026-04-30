module.exports = function asyncHandler(handler) {
  return function asyncHandlerWrapper(req, res, next) {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
};
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function isValidObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

module.exports = { asyncHandler, isValidObjectId };

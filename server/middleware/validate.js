const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Collects express-validator errors and turns them into a single ApiError
// so every route gets the same clean 400 response shape.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new ApiError(400, message);
  }
  next();
};

module.exports = validate;

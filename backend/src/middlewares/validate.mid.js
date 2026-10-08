const ERROR_CODES = require("../constants/errorCodes");

const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next(); 
    } catch (error) {
      const customError = new Error(error.errors[0].message); 
      customError.statusCode = ERROR_CODES.BAD_REQUEST;
      next(customError);
    }
  };
};

module.exports = validateBody;

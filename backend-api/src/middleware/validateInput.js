const validateRequest = (schema, source = 'body') => (req, res, next) => {
  const dataToValidate = source === 'params' ? req.params : 
                         source === 'query' ? req.query : 
                         req.body;
  
  const { error } = schema.validate(dataToValidate);

  if (error) {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

// Keep backward compatibility
module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

module.exports.validateRequest = validateRequest;

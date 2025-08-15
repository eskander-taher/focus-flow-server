const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
  
  if (error) {
    const errorMessages = error.details.map(detail => {
      const field = detail.path.join('.');
      return `${field}: ${detail.message}`;
    });
    
    return res.status(400).json({ 
      error: {
        message: 'Validation failed',
        details: errorMessages,
        fields: error.details.map(detail => detail.path[0])
      }
    });
  }
  
  // Sanitize the validated data
  req.body = value;
  next();
};

export default validate;

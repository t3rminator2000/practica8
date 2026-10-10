const { AppError } = require('../errors');

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return next(new AppError(400, 'Ошибка валидации входных данных', details));
  }
  req.valid = req.valid || {};
  req.valid[source] = result.data;
  next();
};

module.exports = validate;
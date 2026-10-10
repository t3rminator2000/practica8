const { UniqueConstraintError, ForeignKeyConstraintError, ValidationError } = require('sequelize');
const { AppError } = require('../errors');

// Глобальный обработчик: 400, 404, 409, 500
module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ error: 'Запись с такими данными уже существует' });
  }
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(409).json({ error: 'Операция нарушает связи между записями' });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};
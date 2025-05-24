// src/middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || 'Внутренняя ошибка сервера',
  });
};

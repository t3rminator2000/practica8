const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./models');
const routes = require('./routes');
const openapi = require('./swagger');
const errorHandler = require('./middleware/errorHandler');
const { AppError } = require('./errors');

const app = express();

app.use(express.json({ limit: '100kb' }));
app.get('/', (req, res) => res.redirect('/api-docs'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api', routes);
app.use((req, res, next) => next(new AppError(404, 'Маршрут не найден')));
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}, Swagger: /api-docs`));
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Не удалось запустить сервер:', err);
    process.exit(1);
  });
}

module.exports = app;
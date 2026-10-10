# Практическая работа №8, вариант 1

REST API учёта рейтинга студентов. Стек: Node.js, Express, Sequelize, SQLite, zod, Swagger.

## Запуск

npm install
npm start

Сервер: http://localhost:3000
Swagger: http://localhost:3000/api-docs

## Что реализовано

- CRUD для Student, Group, Subject, Teacher, RatingPoint
- Валидация входных данных (zod), ошибки 400
- Глобальный обработчик ошибок: 400, 404, 409, 500
- Слои: routes, controllers, services, repositories, models
- GET /api/students/top-rating?groupId=1 - топ-10 студентов группы по рейтингу
- Бизнес-правило: если посещаемость меньше 50%, рейтинговые баллы обнуляются
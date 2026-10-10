const express = require('express');
const controllers = require('../controllers');
const schemas = require('../schemas');
const validate = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');

function crudRouter(controller, { create, update }) {
  const router = express.Router();
  router.get('/', asyncHandler(controller.list));
  router.post('/', validate(create), asyncHandler(controller.create));
  router.get('/:id', validate(schemas.idParams, 'params'), asyncHandler(controller.get));
  router.put(
    '/:id',
    validate(schemas.idParams, 'params'),
    validate(update),
    asyncHandler(controller.update)
  );
  router.delete('/:id', validate(schemas.idParams, 'params'), asyncHandler(controller.remove));
  return router;
}

// top-rating объявлен выше /:id, иначе слово top-rating примется за id
const students = express.Router();
students.get(
  '/top-rating',
  validate(schemas.topRatingQuery, 'query'),
  asyncHandler(controllers.student.topRating)
);
students.use(crudRouter(controllers.student, schemas.student));

const api = express.Router();
api.use('/groups', crudRouter(controllers.group, schemas.group));
api.use('/teachers', crudRouter(controllers.teacher, schemas.teacher));
api.use('/subjects', crudRouter(controllers.subject, schemas.subject));
api.use('/students', students);
api.use('/rating-points', crudRouter(controllers.ratingPoint, schemas.ratingPoint));

module.exports = api;
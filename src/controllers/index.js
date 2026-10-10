const createCrudController = require('./crudController');
const services = require('../services');

module.exports = {
  group: createCrudController(services.groupService),
  teacher: createCrudController(services.teacherService),
  subject: createCrudController(services.subjectService),
  student: {
    ...createCrudController(services.studentService),
    topRating: async (req, res) =>
      res.json(await services.studentService.topRating(req.valid.query.groupId)),
  },
  ratingPoint: createCrudController(services.ratingPointService),
};
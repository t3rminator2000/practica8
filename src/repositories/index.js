const { QueryTypes } = require('sequelize');
const { sequelize, Group, Teacher, Subject, Student, RatingPoint } = require('../models');

const createRepository = (Model) => ({
  findAll: () => Model.findAll({ order: [['id', 'ASC']] }),
  findById: (id) => Model.findByPk(id),
  create: (data) => Model.create(data),
  update: (instance, data) => instance.update(data),
  remove: (instance) => instance.destroy(),
});

module.exports = {
  group: createRepository(Group),
  teacher: createRepository(Teacher),
  subject: createRepository(Subject),
  student: {
    ...createRepository(Student),
    topByRating: (groupId, limit) =>
      sequelize.query(
        `SELECT s.id, s.fullName, s.attendancePercent,
                COALESCE(SUM(r.points), 0) AS totalPoints
           FROM Students s
           LEFT JOIN RatingPoints r ON r.studentId = s.id
          WHERE s.groupId = :groupId
          GROUP BY s.id
          ORDER BY totalPoints DESC, s.fullName ASC
          LIMIT :limit`,
        { replacements: { groupId, limit }, type: QueryTypes.SELECT }
      ),
  },
  ratingPoint: {
    ...createRepository(RatingPoint),
    resetByStudent: (studentId) => RatingPoint.update({ points: 0 }, { where: { studentId } }),
  },
};
const { AppError } = require('../errors');
const repositories = require('../repositories');
const createCrudService = require('./crudService');
const { ensureExists } = require('./helpers');

const MIN_ATTENDANCE = 50;
const TOP_LIMIT = 10;

const groupService = createCrudService(repositories.group, 'Группа');
const teacherService = createCrudService(repositories.teacher, 'Преподаватель');

const subjectService = createCrudService(repositories.subject, 'Предмет', {
  beforeSave: async (data) => {
    if (data.teacherId !== undefined) {
      await ensureExists(repositories.teacher, data.teacherId, 'Преподаватель');
    }
    return data;
  },
});

const baseStudentService = createCrudService(repositories.student, 'Студент', {
  beforeSave: async (data) => {
    if (data.groupId !== undefined) {
      await ensureExists(repositories.group, data.groupId, 'Группа');
    }
    return data;
  },
});

const studentService = {
  ...baseStudentService,

  // Бизнес-правило: посещаемость меньше 50% обнуляет рейтинговые баллы студента
  async update(id, data) {
    const student = await baseStudentService.update(id, data);
    if (student.attendancePercent < MIN_ATTENDANCE) {
      await repositories.ratingPoint.resetByStudent(student.id);
    }
    return student;
  },

  async topRating(groupId) {
    const group = await repositories.group.findById(groupId);
    if (!group) throw new AppError(404, `Группа: запись с id=${groupId} не найдена`);
    return repositories.student.topByRating(groupId, TOP_LIMIT);
  },
};

const ratingPointService = createCrudService(repositories.ratingPoint, 'Рейтинговые баллы', {
  // Бизнес-правило: при посещаемости меньше 50% баллы сохраняются как 0
  beforeSave: async (data, current) => {
    const studentId = data.studentId ?? current?.studentId;
    const subjectId = data.subjectId ?? current?.subjectId;
    const student = await ensureExists(repositories.student, studentId, 'Студент');
    await ensureExists(repositories.subject, subjectId, 'Предмет');

    const points = data.points ?? current?.points ?? 0;
    return { ...data, points: student.attendancePercent < MIN_ATTENDANCE ? 0 : points };
  },
});

module.exports = { groupService, teacherService, subjectService, studentService, ratingPointService };
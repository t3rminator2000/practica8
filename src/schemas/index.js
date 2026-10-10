const { z } = require('zod');

const id = z.coerce.number().int().positive();
const name = z.string().trim().min(1).max(150);
const fullName = z
  .string()
  .trim()
  .min(3)
  .max(150)
  .regex(/^[A-Za-zА-Яа-яЁё\s.'-]+$/, 'ФИО содержит недопустимые символы');
const email = z.string().trim().toLowerCase().email('Некорректный email').max(150);
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата в формате ГГГГ-ММ-ДД')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date();
  }, 'Некорректная дата или дата в будущем');

function makeSchemas(shape) {
  return {
    create: z.object(shape).strict(),
    update: z
      .object(shape)
      .partial()
      .strict()
      .refine((data) => Object.keys(data).length > 0, 'Передай хотя бы одно поле'),
  };
}

module.exports = {
  idParams: z.object({ id }),
  topRatingQuery: z.object({ groupId: id }),
  group: makeSchemas({ name: z.string().trim().min(1).max(50) }),
  teacher: makeSchemas({ fullName, email }),
  subject: makeSchemas({ name, teacherId: id }),
  student: makeSchemas({
    fullName,
    email,
    birthDate: isoDate,
    groupId: id,
    attendancePercent: z.number().min(0).max(100).optional(),
  }),
  ratingPoint: makeSchemas({
    studentId: id,
    subjectId: id,
    points: z.number().int().min(0).max(1000),
  }),
};
const json = (schema) => ({ 'application/json': { schema } });
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const errorResponse = (description) => ({ description, content: json(ref('Error')) });
const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
};

const entities = [
  {
    name: 'Group', tag: 'Группы', path: '/groups',
    props: { name: { type: 'string', maxLength: 50, example: '454' } },
    required: ['name'],
  },
  {
    name: 'Teacher', tag: 'Преподаватели', path: '/teachers',
    props: {
      fullName: { type: 'string', example: 'Петров Пётр Петрович' },
      email: { type: 'string', format: 'email', example: 'petrov@college.ru' },
    },
    required: ['fullName', 'email'],
  },
  {
    name: 'Subject', tag: 'Предметы', path: '/subjects',
    props: {
      name: { type: 'string', example: 'Разработка кода информационных ресурсов' },
      teacherId: { type: 'integer', example: 1 },
    },
    required: ['name', 'teacherId'],
  },
  {
    name: 'Student', tag: 'Студенты', path: '/students',
    props: {
      fullName: { type: 'string', example: 'Иванов Иван Иванович' },
      email: { type: 'string', format: 'email', example: 'ivanov@college.ru' },
      birthDate: { type: 'string', format: 'date', example: '2007-05-14' },
      groupId: { type: 'integer', example: 1 },
      attendancePercent: { type: 'number', minimum: 0, maximum: 100, example: 90 },
    },
    required: ['fullName', 'email', 'birthDate', 'groupId'],
  },
  {
    name: 'RatingPoint', tag: 'Рейтинговые баллы', path: '/rating-points',
    props: {
      studentId: { type: 'integer', example: 1 },
      subjectId: { type: 'integer', example: 1 },
      points: { type: 'integer', minimum: 0, example: 30 },
    },
    required: ['studentId', 'subjectId'],
    note: 'Если посещаемость студента меньше 50%, баллы сохраняются как 0.',
  },
];

const schemas = {
  Error: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      details: { type: 'array', items: { type: 'object' } },
    },
  },
  TopRatingItem: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      fullName: { type: 'string' },
      attendancePercent: { type: 'number' },
      totalPoints: { type: 'integer' },
    },
  },
};

const paths = {};

for (const e of entities) {
  schemas[e.name] = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      ...e.props,
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  };
  schemas[`${e.name}Input`] = {
    type: 'object', properties: e.props, required: e.required, additionalProperties: false,
  };
  schemas[`${e.name}Update`] = {
    type: 'object', properties: e.props, minProperties: 1, additionalProperties: false,
  };

  const base = `/api${e.path}`;
  const note = e.note ? ` ${e.note}` : '';

  paths[base] = {
    get: {
      tags: [e.tag],
      summary: `Список записей (${e.tag})`,
      responses: {
        200: { description: 'Список', content: json({ type: 'array', items: ref(e.name) }) },
        500: errorResponse('Внутренняя ошибка сервера'),
      },
    },
    post: {
      tags: [e.tag],
      summary: `Создать запись (${e.tag})`,
      description: `Создание записи.${note}`,
      requestBody: { required: true, content: json(ref(`${e.name}Input`)) },
      responses: {
        201: { description: 'Создано', content: json(ref(e.name)) },
        400: errorResponse('Ошибка валидации'),
        409: errorResponse('Дубликат или нарушение связей'),
        500: errorResponse('Внутренняя ошибка сервера'),
      },
    },
  };

  paths[`${base}/{id}`] = {
    get: {
      tags: [e.tag],
      summary: `Получить запись по id (${e.tag})`,
      parameters: [idParam],
      responses: {
        200: { description: 'Запись', content: json(ref(e.name)) },
        400: errorResponse('Некорректный id'),
        404: errorResponse('Запись не найдена'),
        500: errorResponse('Внутренняя ошибка сервера'),
      },
    },
    put: {
      tags: [e.tag],
      summary: `Обновить запись (${e.tag})`,
      description: `Обновление переданных полей.${note}`,
      parameters: [idParam],
      requestBody: { required: true, content: json(ref(`${e.name}Update`)) },
      responses: {
        200: { description: 'Обновлено', content: json(ref(e.name)) },
        400: errorResponse('Ошибка валидации'),
        404: errorResponse('Запись не найдена'),
        409: errorResponse('Дубликат или нарушение связей'),
        500: errorResponse('Внутренняя ошибка сервера'),
      },
    },
    delete: {
      tags: [e.tag],
      summary: `Удалить запись (${e.tag})`,
      parameters: [idParam],
      responses: {
        204: { description: 'Удалено' },
        400: errorResponse('Некорректный id'),
        404: errorResponse('Запись не найдена'),
        409: errorResponse('Есть связанные записи'),
        500: errorResponse('Внутренняя ошибка сервера'),
      },
    },
  };
}

paths['/api/students/top-rating'] = {
  get: {
    tags: ['Студенты'],
    summary: 'Топ-10 студентов группы по рейтингу',
    description: 'Сумма рейтинговых баллов по каждому студенту группы, по убыванию.',
    parameters: [
      { name: 'groupId', in: 'query', required: true, schema: { type: 'integer', minimum: 1 } },
    ],
    responses: {
      200: { description: 'Топ-10', content: json({ type: 'array', items: ref('TopRatingItem') }) },
      400: errorResponse('Некорректный groupId'),
      404: errorResponse('Группа не найдена'),
      500: errorResponse('Внутренняя ошибка сервера'),
    },
  },
};

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Практическая работа №8, вариант 1', version: '1.0.0' },
  servers: [{ url: '/' }],
  paths,
  components: { schemas },
};
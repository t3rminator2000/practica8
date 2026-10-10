const { AppError } = require('../errors');

function createCrudService(repository, label, { beforeSave } = {}) {
  async function get(id) {
    const item = await repository.findById(id);
    if (!item) throw new AppError(404, `${label}: запись с id=${id} не найдена`);
    return item;
  }

  return {
    list: () => repository.findAll(),
    get,
    async create(data) {
      const prepared = beforeSave ? await beforeSave(data) : data;
      return repository.create(prepared);
    },
    async update(id, data) {
      const item = await get(id);
      const prepared = beforeSave ? await beforeSave(data, item) : data;
      return repository.update(item, prepared);
    },
    async remove(id) {
      const item = await get(id);
      await repository.remove(item);
    },
  };
}

module.exports = createCrudService;
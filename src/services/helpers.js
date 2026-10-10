const { AppError } = require('../errors');

async function ensureExists(repository, id, label) {
  const item = await repository.findById(id);
  if (!item) throw new AppError(400, `${label} с id=${id} не существует`);
  return item;
}

module.exports = { ensureExists };
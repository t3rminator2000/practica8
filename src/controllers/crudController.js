function createCrudController(service) {
  return {
    list: async (req, res) => res.json(await service.list()),
    get: async (req, res) => res.json(await service.get(req.valid.params.id)),
    create: async (req, res) => res.status(201).json(await service.create(req.valid.body)),
    update: async (req, res) =>
      res.json(await service.update(req.valid.params.id, req.valid.body)),
    remove: async (req, res) => {
      await service.remove(req.valid.params.id);
      res.status(204).end();
    },
  };
}

module.exports = createCrudController;
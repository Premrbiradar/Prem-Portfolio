const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');

/**
 * Wires up the standard list/getOne/create/update/remove endpoints for a
 * controller built with crudFactory. GET is public, everything else requires
 * an authenticated admin.
 */
const buildCrudRouter = (controller) => {
  const router = express.Router();

  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  router.post('/', protect, requireAdmin, controller.create);
  router.put('/:id', protect, requireAdmin, controller.update);
  router.delete('/:id', protect, requireAdmin, controller.remove);

  return router;
};

module.exports = buildCrudRouter;

const Certification = require('../models/Certification');
const buildCrudController = require('./crudFactory');

module.exports = buildCrudController(Certification, { defaultSort: { order: 1, createdAt: -1 } });

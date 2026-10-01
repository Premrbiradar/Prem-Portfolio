const Experience = require('../models/Experience');
const buildCrudController = require('./crudFactory');

module.exports = buildCrudController(Experience, { defaultSort: { order: 1, createdAt: -1 } });

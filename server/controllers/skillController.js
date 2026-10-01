const Skill = require('../models/Skill');
const buildCrudController = require('./crudFactory');

module.exports = buildCrudController(Skill, { defaultSort: { category: 1, order: 1 } });

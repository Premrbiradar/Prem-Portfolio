const Education = require('../models/Education');
const buildCrudController = require('./crudFactory');

module.exports = buildCrudController(Education, { defaultSort: { order: 1, startYear: -1 } });

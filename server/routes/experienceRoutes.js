const buildCrudRouter = require('./crudRouteFactory');
const experienceController = require('../controllers/experienceController');

module.exports = buildCrudRouter(experienceController);

const buildCrudRouter = require('./crudRouteFactory');
const skillController = require('../controllers/skillController');

module.exports = buildCrudRouter(skillController);

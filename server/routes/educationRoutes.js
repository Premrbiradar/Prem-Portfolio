const buildCrudRouter = require('./crudRouteFactory');
const educationController = require('../controllers/educationController');

module.exports = buildCrudRouter(educationController);

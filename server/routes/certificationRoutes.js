const buildCrudRouter = require('./crudRouteFactory');
const certificationController = require('../controllers/certificationController');

module.exports = buildCrudRouter(certificationController);

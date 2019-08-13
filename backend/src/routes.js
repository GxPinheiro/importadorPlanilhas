const express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
const routes = express.Router();

const ChargesController = require('./controllers/ChargesController');
const UnitsController = require('./controllers/UnitsController');
// const UnitsController = require('./controllers/ColumnsController');

routes.post('/uploadCharges', upload.any(), ChargesController.sendCharges);

routes.post('/uploadCharges', upload.any(), ChargesController.sendCharges);
routes.post('/charges:delete', ChargesController.clearFiles);
routes.post('/uploadUnits', upload.any(), UnitsController.sendUnits);

module.exports = routes;

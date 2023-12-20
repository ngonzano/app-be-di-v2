
const izipayController = require('../controllers/izipayController')
const bodyParser = require("body-parser");

module.exports = (app) => {
   app.use(bodyParser.urlencoded({ extended: true }));
   app.use(bodyParser.json());
   app.post('/api/validatePayment', izipayController.validatePayment)
   app.post('/api/paymentForm', izipayController.paymentForm)
     
}
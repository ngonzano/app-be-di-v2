
const izipayController = require('../controllers/izipayController')

module.exports = (app) => {

   app.post('/api/validatePayment', izipayController.validatePayment)
   app.post('/api/paymentForm', izipayController.paymentForm)
     
}
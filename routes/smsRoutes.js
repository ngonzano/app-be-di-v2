const passport = require('passport')
const smsController = require('../controllers/smsController')

module.exports = (app) => {

   app.post('/api/sms/enviarsms', smsController.sms)
   app.post('/api/sms/enviarwp', smsController.whatsapp)
}

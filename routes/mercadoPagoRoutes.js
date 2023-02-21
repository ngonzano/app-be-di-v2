const MercadoPagoController = require('../controllers/mercadoPagoController')
const passport = require('passport')

module.exports = (app) => {
   //POST.
    app.post('/api/payments/createPay/:delivery/:codigo/:iduser', passport.authenticate('jwt', {session: false}), MercadoPagoController.createPaymentCreditCart)
    app.post('/api/payments/createPayMP', passport.authenticate('jwt', {session: false}), MercadoPagoController.createPaymentCreditCartMP)
}
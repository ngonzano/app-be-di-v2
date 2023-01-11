const EfectivoPagoController = require('../controllers/efectivoController')
const passport = require('passport')

module.exports = (app) => {
   //POST
    app.post('/api/payments/pagoContraEntrtega', passport.authenticate('jwt', {session: false}), EfectivoPagoController.createPagoContraEntrega)
}
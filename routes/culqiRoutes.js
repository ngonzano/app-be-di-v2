const culqiController = require('../controllers/culqiController')
const passport = require('passport')

module.exports = (app) => {
   
   app.post('/api/culqi/createtoken/:codigo/:iduser', passport.authenticate('jwt', {session: false}), culqiController.crearToken)
   app.post('/api/culqi/createop/:codigo/:iduser', passport.authenticate('jwt', {session: false}), culqiController.crearCargo)
   app.post('/api/culqi/createdevolucion/:codigo/:iduser', passport.authenticate('jwt', {session: false}), culqiController.crearDevolucion)
   app.post('/api/culqi/crearordenconculqi', passport.authenticate('jwt', {session: false}), culqiController.createOrden)

}


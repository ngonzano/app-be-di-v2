const yapeController = require('../controllers/yapeController')
const passport = require('passport')

module.exports = (app) => {
   //get
//    app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), AddressController.findByUser)
   

   //post
   
   app.post('/api/yape/createtoken/:codigo/:iduser', passport.authenticate('jwt', {session: false}), yapeController.crearTokenYape)
   app.post('/api/yape/createop/:codigo/:iduser', passport.authenticate('jwt', {session: false}), yapeController.crearPago)
   app.post('/api/yape/createdevolucion/:codigo/:iduser', passport.authenticate('jwt', {session: false}), yapeController.crearDevolucion)
   app.post('/api/yape/crearordenconyape', passport.authenticate('jwt', {session: false}), yapeController.createPagoYape)

   
   //put
//    app.put('/api/address/update/:id', passport.authenticate('jwt', {session:false}), AddressController.updateController)
   
}


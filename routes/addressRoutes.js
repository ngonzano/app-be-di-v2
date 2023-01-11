const AddressController = require('../controllers/addressController')
const passport = require('passport')

module.exports = (app) => {
    //GET
    app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), AddressController.findByUser)
    app.get('/api/address/buscarDireccionTienda/:idtienda', passport.authenticate('jwt', {session: false}), AddressController.buscarDireccionTiendaController)
    app.get('/api/address/buscarDireccionDelivery', passport.authenticate('jwt', {session: false}), AddressController.buscarDireccionDeliveryController)    

    //POST
    app.post('/api/address/create', passport.authenticate('jwt', {session: false}), AddressController.create)

    //PUT
    app.put('/api/address/update/:id', passport.authenticate('jwt', {session:false}), AddressController.updateController)
    app.put('/api/address/updaddrestienda/:id/:idtienda', passport.authenticate('jwt', {session:false}), AddressController.updAddressTiendaController)
    app.put('/api/address/updaddresdelivery/:id/:iddelivery', passport.authenticate('jwt', {session:false}), AddressController.updAddressDeliveryController)
}
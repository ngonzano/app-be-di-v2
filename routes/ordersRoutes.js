const OrdersController = require('../controllers/ordersController')
const passport = require('passport')

module.exports = (app) => {
    //GET
    app.get('/api/order/listarAnulados/:status/:idtienda', passport.authenticate('jwt', {session: false}), OrdersController.listaOrdenesAnuladasController)
    app.get('/api/order/findByStatus/:status/:idtienda', passport.authenticate('jwt', {session: false}), OrdersController.findByStatus)
    app.get('/api/order/buscarOrden/:idorder', passport.authenticate('jwt', {session: false}), OrdersController.buscarOrderController)
    app.get('/api/order/findByDeliveryAndStatus/:id_delivery/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByDeliveryAndStatus)
    app.get('/api/order/findByClientAndStatus/:id_client/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByClientAndStatus)
    
    app.get('/api/order/buscarorden/:id', passport.authenticate('jwt', {session:false}), OrdersController.buscarOrdenController)
    //POST
    app.post('/api/order/create', passport.authenticate('jwt', {session: false}), OrdersController.create)

    //PUT
    app.put('/api/order/updateToDispatched', passport.authenticate('jwt', {session: false}), OrdersController.updateToDispatched)
    app.put('/api/order/updateanularorden', passport.authenticate('jwt', {session: false}), OrdersController.updateAnularController)
    app.put('/api/order/updateToOnTheWay', passport.authenticate('jwt', {session: false}), OrdersController.updateToOnTheWay)
    app.put('/api/order/updateToDelivered', passport.authenticate('jwt', {session: false}), OrdersController.updateToDelivered)
    app.put('/api/order/updateLatLng', passport.authenticate('jwt', {session: false}), OrdersController.updateLatLng)
    
    app.put('/api/order/updestadodetorder/:idproduct/:idorder/:estado', passport.authenticate('jwt', {session: false}), OrdersController.updateEstadoDetalleOrdenController)
    
}
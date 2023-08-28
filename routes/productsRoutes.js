const ProductsController = require('../controllers/productsController')
const passport = require('passport')

module.exports = (app, upload) => {
    
    app.get('/api/products/listaProductoTienda/:id_user/:id_cantidad', passport.authenticate('jwt', {session:false}), ProductsController.listaProductoTiendaController)
    
    app.get('/api/products/findByCategory/:id_category/:id_user/:id_cantidad', passport.authenticate('jwt', {session:false}), ProductsController.findByCategory)
    app.get('/api/products/findByCategoryAndProductName/:id_category/:id_user/:product_name/:id_cantidad', passport.authenticate('jwt', {session:false}), ProductsController.findByCategoryAndProductName)

    app.get('/api/products/findByCategoryInvitado/:id_category/:id_user/:id_cantidad', ProductsController.findByCategory)
    app.get('/api/products/findByCategoryAndProductNameInvitado/:id_category/:id_user/:product_name/:id_cantidad', ProductsController.findByCategoryAndProductName)

    app.post('/api/products/create', passport.authenticate('jwt', {session:false}), upload.array('image',3), ProductsController.create)

    app.put('/api/products/updateproduct', passport.authenticate('jwt', {session:false}), upload.array('image',3), ProductsController.updateController)

    //Administrador
}
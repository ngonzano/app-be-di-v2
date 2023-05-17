const passport = require('passport')
const UsersController=require('../controllers/usersController')

module.exports = (app, upload) => {
    //traer datos
    app.get('/api/users/getAllTiendas/:idgiro',UsersController.getAllTiendas)
    app.get('/api/users/getAllGiros',UsersController.getAllGirosController)
    app.get('/api/users/getAllGirosCoordenadas',UsersController.getAllGirosCoordenadasController)
    app.get('/api/users/version',UsersController.versionAppController)
    app.get('/api/users/telefonoemp',UsersController.telefonoEmpController)
    app.get('/api/users/buscarTienda/:descripcion/:idgiro',passport.authenticate('jwt', {session:false}),  UsersController.buscarTiendaController)
    app.get('/api/users/getusuario/:email/:cumpleanio',UsersController.getUsuarioController)
    app.get('/api/users/findByID/:id', passport.authenticate('jwt', {session:false}), UsersController.findById)
    app.get('/api/users/buscarrepartidor/:id', passport.authenticate('jwt', {session:false}), UsersController.buscarRepartidorController)

    app.get('/api/users/buscarusuario/:id', UsersController.buscarUsuarioController)
    app.get('/api/users/buscartelefono/:phone', UsersController.buscarTelefonoController)
    app.get('/api/users/buscarcorreo/:correo', UsersController.buscarCorreoController)
    
    app.get('/api/users/findByOrder/:email', passport.authenticate('jwt', {session:false}), UsersController.findByOrderController)
    app.get('/api/users/findDeliveryMen/:id', passport.authenticate('jwt', {session:false}), UsersController.findByDeliveryMenController)
    app.get('/api/users/listartodostokens', passport.authenticate('jwt', {session:false}), UsersController.listarTodosTokensController)
    app.get('/api/users/getAdminsNotificationTokens/:iduser', passport.authenticate('jwt', {session:false}), UsersController.getAdminsNotificationTokens)
    app.get('/api/users/listartokentiendacliente', passport.authenticate('jwt', {session:false}), UsersController.listarTokenTiendaClienteController)

    //idorder=id
    app.get('/api/users/mostrardatos/:id/:iduser/:iddelivery/:idtienda', passport.authenticate('jwt', {session:false}), UsersController.mostrarEvidenciaController)

    app.get('/api/users/buscarconst/:codigo/:iduser', passport.authenticate('jwt', {session:false}), UsersController.buscarConstController)

    //guardar datos
    app.post('/api/users/create/:withlogin',upload.array('image',1), UsersController.registerWithImage)
    app.post('/api/users/asignarrepartidor', passport.authenticate('jwt', {session: false}), UsersController.asignarRolRepartidorController)
    app.post('/api/users/agregarnegocio', passport.authenticate('jwt', {session: false}), UsersController.agregarNegocioController)

    app.post('/api/users/createevidencia',upload.array('image',1), UsersController.createEvidenciaController)

    app.post('/api/users/login', UsersController.login)
    app.post('/api/users/logout', UsersController.logout)

    //PUT 
    app.put('/api/users/upduserpass', UsersController.updateUserPassController)
    app.put('/api/users/update',passport.authenticate('jwt', {session:false}), upload.array('image',1), UsersController.update)
    app.put('/api/users/updateNotificationToken',passport.authenticate('jwt', {session:false}), UsersController.updateNotificationToken)
    app.put('/api/users/updateestado/:id/:estado', passport.authenticate('jwt', {session:false}), UsersController.updateDeliveryController)
    
    app.put('/api/users/eliminarusuario/:id',passport.authenticate('jwt', {session:false}), upload.array('image',1), UsersController.eliminarUsuarioController)
    app.put('/api/users/actualizarcomentario/:idorder/:comentariousuario/:calificacion', passport.authenticate('jwt', {session:false}), UsersController.actualizarComentarioController)

}
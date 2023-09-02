const CategoriesController = require('../controllers/categoriesController')
const passport = require('passport')

module.exports = (app, upload) => {
    //GET
    app.get('/api/categories/getAll/:iduser', passport.authenticate('jwt', {session: false}), CategoriesController.getAll)
    app.get('/api/categories/getAllBuscar/:iduser/:productname', passport.authenticate('jwt', {session: false}), CategoriesController.getAllBuscarController)
    
    app.get('/api/categories/getAllStock/:iduser/:productname', passport.authenticate('jwt', {session: false}), CategoriesController.getAllStockController)
    app.get('/api/categories/getAllStockSinBuscar/:iduser', passport.authenticate('jwt', {session: false}), CategoriesController.getAllStockSinBuscarController)

    app.get('/api/categories/getAllInvitado/:iduser', CategoriesController.getAll)
    //POST
    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}),CategoriesController.create)//passport.authenticate('jwt', {session: false}), 
}
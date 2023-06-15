const Category = require('../models/category')
const { getAll } = require('../models/user')
const storage = require('../utils/cloud_storage')

module.exports = {
    async getAll(req, res, next){
        try {
            const idUser = req.params.iduser
            const data = await Category.getAll(idUser)
            return res.status(201).json(data)
        } catch (error) {
            //console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las categorias',
                error: error,
                success: false
            })
        }
    },
    async getAllStockController(req, res, next){
        try {
            const idUser = req.params.iduser
            const data = await Category.getAllStock(idUser)
            return res.status(201).json(data)
        } catch (error) {
            //console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las categorias',
                error: error,
                success: false
            })
        }
    },
    async create(req, res, next){
        try {
            const category = JSON.parse(req.body.category)
            // const category = req.body
            const files = req.files
            if (files.length>0) {
                const pathImage = `image_${Date.now()}` //nombre del archivo
                const url= await storage(files[0], pathImage)

                if (url != undefined && url != null) {
                    category.image=url
                }
            }
            const data = await Category.create(category)
            return res.status(201).json({
                message: 'Se creo la categoria.',
                success: true,
                data: data.id
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                message: 'Hubo un error al crear la categoria',
                success: false,
                error: error
            })
        }
    }
}
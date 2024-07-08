const Address = require('../models/address');

module.exports = {

    async findByUser(req, res, next){
        try {
            const id_user = req.params.id_user
            const data = await Address.findByUser(id_user)
            return res.status(201).json(data)
        } catch (error) {
            //console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al listar las direcciones',
                error: error,
                success: false
            })
        }
    },
    async buscarDireccionTiendaController(req, res, next){
        try {
            const idTienda = req.params.idtienda
            const data = await Address.buscarDireccionTienda(idTienda)
            return res.status(201).json(data)
        } catch (error) {
            //console.log(`Error buscarDireccionTiendaController ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al buscar la direcciones de tienda',
                error: error,
                success: false
            })
        }
    },
    async buscarDireccionDeliveryController(req, res, next){
        try {            
            const data = await Address.buscarDireccionDelivery()
            return res.status(201).json(data)
        } catch (error) {
            //console.log(`Error buscarDireccionDelivery ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al buscar la direcciones de tienda',
                error: error,
                success: false
            })
        }
    },
    async updateController(req, res, next) {
        try {
            let idadrees = req.params.id
            await Address.update(idadrees)

            return res.status(201).json({
                success : true,
                message : 'La direccion fue eliminada correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar la Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la ubicacion',
                error : error
            })
        }
    },
    async updAddressTiendaController(req, res, next) {
        try {
            let idadrees = req.params.id
            let idtienda = req.params.idtienda
            await Address.updAddressTienda(idadrees, idtienda)

            return res.status(201).json({
                success : true,
                message : 'La direccion fue actualizada correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar la direccion: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la ubicacion',
                error : error
            })
        }
    },
    async updAddressDeliveryController(req, res, next) {
        try {
            let idadrees = req.params.id
            let idDelivery = req.params.iddelivery
            await Address.updAddressDelivery(idadrees, idDelivery)

            return res.status(201).json({
                success : true,
                message : 'La direccion fue actualizada correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar la direccion: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la direccion',
                error : error
            })
        }
    },
    async create(req, res, next) {
        try {
            const address = req.body;
            // console.log(address);
            const data = await Address.create(address)
            return res.status(201).json({
                success : true,
                message : 'La direccion se creo correctamente.',
                data : data.id
            })

        } catch (error) {
            console.log(`Error en create: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error creado la direccion',
                error : error
            })
        }
    }
}
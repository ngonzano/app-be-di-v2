const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module.exports = {
    async findByStatus(req, res, next){
        try {
            const status = req.params.status
            const idTienda = req.params.idtienda
            const data = await Order.findByStatus(status, idTienda)
            //console.log(`Status ${JSON.stringify(data)}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al listar las ordenes por estado.',
                error: error,
                success: false
            })
        }
    },
    async listaOrdenesAnuladasController(req, res, next){
        try {
            const status = req.params.status
            const idTienda = req.params.idtienda
            const data = await Order.listaOrdenesAnuladas(status, idTienda)
            // //console.log(`Status ${JSON.stringify(data)}`)
            return res.status(201).json(data)
        } catch (error) {
            //console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al listar las ordenes por estado.',
                error: error,
                success: false
            })
        }
    },
    async findByDeliveryAndStatus(req, res, next){
        try {
            const id_delivery = req.params.id_delivery
            const status = req.params.status
            const iduser = req.params.iduser
            const data = await Order.findByDeliveryAndStatus(id_delivery, status,iduser)
            // //console.log(`Status delivery ${JSON.stringify(data)}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al listar las ordenes por estado.',
                error: error,
                success: false
            })
        }
    },
    async findByClientAndStatus(req, res, next){
        try {
            const id_client = req.params.id_client
            const status = req.params.status
            const data = await Order.findByClientAndStatus(id_client, status)
            // //console.log(`Status Cliente ${JSON.stringify(data)}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al listar las ordenes por estado.',
                error: error,
                success: false
            })
        }
    },
    async create(req, res, next) {
        try {
            let order = req.body
            const esEfectivo = order.status_pago
            let mediopago = 0

            if (!esEfectivo) {
                mediopago = 2
            } else {
                mediopago = 1
            }
            
            order.status='PAGADO'
            const data = await Order.create(order, mediopago)

            //recorrer todos los productos agregados a la orden
            for (const product of order.products) {
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success : true,
                message : 'La Orden se creo correctamente.',
                data : data.id
            })

        } catch (error) {
            //console.log(`Error en create Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error creado la Orden',
                error : error
            })
        }
    },
    async updateToDispatched(req, res, next) {
        try {
            let order = req.body
            order.status='DESPACHADO'
            await Order.update(order)
            
            return res.status(201).json({
                success : true,
                message : 'La Orden se actualizo correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar la Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la Orden',
                error : error
            })
        }
    },
    async updateAnularController(req, res, next) {
        try {
            let order = req.body
            order.status='ANULADO'
            await Order.update(order)
            
            return res.status(201).json({
                success : true,
                message : 'La Orden se ANULO correctamente.'
            })

        } catch (error) {
            //console.log(`Error en ANULAR la Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al ANULAR la Orden',
                error : error
            })
        }
    },
    async updateToOnTheWay(req, res, next) {
        try {
            let order = req.body
            order.status='EN CAMINO'
            await Order.update(order)
            return res.status(201).json({
                success : true,
                message : 'La Orden se actualizo correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar la Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la Orden',
                error : error
            })
        }
    },
    async updateToDelivered(req, res, next) {
        try {
            let order = req.body
            let statuspago = true

            order.status='ENTREGADO'
            
            await Order.updatePago(order, statuspago)
            return res.status(201).json({
                success : true,
                message : 'La Orden se actualizo correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar la Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la Orden',
                error : error
            })
        }
    },
    async updateLatLng(req, res, next) {
        try {
            let order = req.body
            await Order.updateLatLng(order)

            return res.status(201).json({
                success : true,
                message : 'La ubicacion se actualizo correctamente.'
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
    async buscarOrdenController(req,res, next){
        try {
            const id = await req.params.id
            const data= await Order.buscarOrden(id)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario por id.'
            })
        }
    },
    async versionAppController(req,res, next){
        try {
            const data= await Order.versionApp()
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener la version'
            })
        }
    },
    //Actualiza el estado de los productos cuando la orden ya esta creada
    async updateEstadoDetalleOrdenController(req, res, next) {
        try {
            const idProduct = await req.params.idproduct
            const idOrder = await req.params.idorder
            const estado = await req.params.estado
            await Order.updateEstadoOrderProducto(idProduct,idOrder,estado)

            return res.status(201).json({
                success : true,
                message : 'El producto se actualizo correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar el producto: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Error en actualizar el producto',
                error : error
            })
        }
    }
}
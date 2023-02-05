const Order = require('../models/order')
const OrderHasProduct = require('../models/order_has_products')
// const User = require('../models/user')

// mercadopago.configure({
//     sandbox: true,
//     access_token: 'TEST-7347063643268812-071419-4ce5f197e45cfbb0aca91422bfb619c7-1160865218'
// })

module.exports = {
    //generar pago para tarjeta de credito/debito
    async createPagoContraEntrega(req, res, next){
        try {
            let payment = req.body //requerir datos del pago viene en req.body viene del flutter
        
            let order = payment.order
            let intMedioPago = 0
            const delivery = req.body.delivery

            order.status='PAGADO'

            const medioPago = order.mediopago
            if (medioPago === 'efectivo') {
                intMedioPago = 1
            } else if (medioPago === 'pos'){
                intMedioPago = 3
            } else if (medioPago === 'yape'){
                intMedioPago = 4
            } else if (medioPago === 'plin'){
                intMedioPago = 5
            }
            // console.log(medioPago);
            // console.log(intMP);
            const orderData = await Order.create(order, intMedioPago) 
            await Order.createPagoDelivery(order, delivery)
            //recorrer todos los productos agregados a la orden
            for (const product of order.products) {
               await OrderHasProduct.create(orderData.id, product.id, product.quantity, product.comentario);
            }
            //console.log(`LA ORDEN SE CREO CORRECTAMENTE ${orderData.id}`);
               return res.status(201).json({
                   success : true,
                   message : 'La Orden se creo correctamente.',
                   data : orderData.id
               }
            )
        } catch (error) {
            console.log(`Error en create Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error creado la Orden',
                error : error
            })
        }                   
        
    }
}
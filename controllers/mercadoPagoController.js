const mercadopago = require('mercadopago')
const Order = require('../models/order')
const OrderHasProduct = require('../models/order_has_products')
const User = require('../models/user')



module.exports = {
    //generar pago para tarjeta de credito/debito
    async createPaymentCreditCart(req, res, next){
       
    //QA
        // mercadopago.configure({
        //     sandbox: true,
        //     access_token: 'TEST-4647891345690403-070800-d0bea39e4981caeb0be9329839d56e67-578676229'
        // })
            
        //PROD
        
        const codigo = await req.params.codigo
        const iduser = await req.params.iduser
        const datos = await User.buscarConst(codigo,iduser)

        // console.log(`${JSON.stringify(datos.accesstoken_mp)}`);
        
        mercadopago.configure({
            access_token: datos.accesstoken_mp
        })

        let payment = req.body //requerir datos del pago viene en req.body viene del flutter
       
        const payment_data = {
            description: payment.description,
            transaction_amount: payment.transaction_amount,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            token: payment.token,
            issuer_id: payment.issuer_id,
            payer: {
                email: payment.payer.email,
                identification: {
                    type: payment.payer.identification.type,
                    number: payment.payer.identification.number
                }
            },
            additional_info: {
                items: payment.additional_info.items,
                payer: {
                  first_name: payment.additional_info.payer.first_name,
                  last_name: payment.additional_info.payer.last_name,
                  phone: {
                    area_code: payment.additional_info.payer.phone.area_code,
                    number: payment.additional_info.payer.phone.number
                  },
                  address: {}
                },
                shipments: {
                  receiver_address: {
                    zip_code: payment.additional_info.shipments.receiver_address.zip_code,
                    state_name: payment.additional_info.shipments.receiver_address.state_name,
                    city_name: payment.additional_info.shipments.receiver_address.city_name,
                    street_name: payment.additional_info.shipments.receiver_address.state_name,
                    street_number: payment.additional_info.shipments.receiver_address.street_number
                  }
                }      
            }
            
        }
        // console.log(`PAYMENT DATA: ${JSON.stringify(payment_data)}`);
        
        const data = await mercadopago.payment.create(payment_data).catch((err) => {            
            console.log('Error al crear el pago...: ' + err)
            return res.status(501).json({//esta respuesta se manda a flutter
                message: 'Error al crear el pago',
                success: false,
                error: err
            })
        })
       
        let error_orden = true
        if (data.response === undefined) {
            error_orden = false
        }
        
        if (error_orden) {
            // console.log('Si hay datos correctos',data.response)
            if (data !== undefined) {
                const payment_type_id = module.exports.validatePaymentMethod(payment.payment_type_id)
                payment.id_payment_method = payment_type_id
                let order = payment.order
                order.status='PAGADO'
                order.idmp = data.response.id //id de mercado pago
                order.status_pago=true
                const delivery = req.params.delivery

                if (data.response.status === 'approved') {       
                               
                    const orderData = await Order.create(order, 2)
                    await Order.createPagoDelivery(order, delivery)
                    
                    //recorrer todos los productos agregados a la orden
                    for (const product of order.products) {
                        await OrderHasProduct.create(orderData.id, product.id, product.quantity);
                    }
                    console.log(`LA ORDEN SE CREO CORRECTAMENTE ${orderData.id} con número de id: ${data.response.id} `);
                    
                }else{
                    console.log(`LA ORDEN NO SE CREO CORRECTAMENTE ESTADO: ${data.response.status} `);
                }           
                return res.status(201).json(data.response)
            } else {
                //console.log(`LA ORDEN NO SE CREO CORRECTAMENTE ${data.response.status}`);
                return res.status(501).json({
                message: 'Error al crear el pago',
                success: false
            })
            }
        }else{
            console.log('Error al crear el pago en createPaymentCreditCart.');
            // return res.status(501).json({
            //     message: 'Error al crear el pago',
            //     success: false
            // })
        }
        
    },
    async createPaymentCreditCartMP(req, res, next){
        let payment = req.body //requerir datos del pago viene en req.body viene del flutter
        
            //console.log('Si hay datos correctos',payment)
            // //console.log('Si hay datos correctos',payment.order)
                let order = payment.order
                order.status='PAGADO'
                order.status_pago=true
                // if (data.response.status === 'approved') {                   
                    const orderData = await Order.create(order, 2)//2 es pago con tarjeta
                    //recorrer todos los productos agregados a la orden
                    for (const product of order.products) {
                        await OrderHasProduct.create(orderData.id, product.id, product.quantity);
                    }
                    //console.log(`LA ORDEN SE CREO CORRECTAMENTE ${orderData.id}`);
                    
                // }else{
                //     //console.log(`LA ORDEN NO SE CREO CORRECTAMENTE.`);
                // }           
                return res.status(201).json({
                    success: true,
                    message: 'Se creo el pedido satisfactoriamente.',
                    data: orderData.id
                })
    }, 
    validatePaymentMethod(status){
        if (status == 'credit_cart') {
            status = 1
        }
        if (status == 'bank_transfer') {
            status = 2
        }
        if (status == 'ticket') {
            status = 3
        }
        if (status == 'upon_delivery') {
            status = 4
        }
        return status
    },

}
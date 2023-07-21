const request = require('request');
const User = require('../models/user')
const Order = require('../models/order')
const OrderHasProduct = require('../models/order_has_products')
const Yape = require('../models/yape')

module.exports = {

    async crearToken(req, res, next){
    
    const codigo = await req.params.codigo
    const iduser = await req.params.iduser
    const payment = req.body
    // console.log(`payment: ${JSON.stringify(payment)}`)
    const datos = await User.buscarConst(codigo,iduser)

      const options = {
        method: 'POST',
        url: 'https://secure.culqi.com/v2/tokens',
        headers: {
            Authorization: datos.yape_token_key,
            'content-type': 'application/json'
        },
        body: {
          card_number: payment.card_number,
          cvv: payment.cvv,
          expiration_month: payment.expiration_month,
          expiration_year: payment.expiration_year,
          email: payment.email,
        //   metadata: {dni: payment.dni,Celular: payment.metadata.Celular}
        },
        json: true
      };
      
     
    request(options, function (error, response, body) {
        // console.log(response);
        if (error){
            //  console.log(body);  
            return res.status(501).json({
                message: body.user_message,
                success: false,
                object:body.object
            })
        }  else {
            // console.log(body);
            if (body.object==='error') {
                return res.status(501).json({
                    message: body.user_message,
                    success: false,
                    object:body.object
                })
            } else {
                return res.status(201).json(body)
            }
            
        }
        // console.log(body);  
       
      });
    
      },
    async crearCargo(req, res, next){
    
        const codigo = await req.params.codigo
        const iduser = await req.params.iduser
        const datos = await User.buscarConst(codigo,iduser)
        const payment = req.body
        // console.log(`payment: ${JSON.stringify(payment)}`)
        let options

        if (payment.installments === '0') {
            options = {
                method: 'POST',
                url: 'https://api.culqi.com/v2/charges',//misma url del pago con tarjeta?
                headers: {
                    Authorization: datos.yape_op_key,
                    'content-type': 'application/json'
                },
                body: {
                    amount: parseInt(payment.amount), // En céntimos
                    currency_code: payment.currency_code, // PEN o USD
                    email: payment.email,
                    source_id: payment.source_id,                    
                },        
                json: true
                };
        } else {
            options = {
                method: 'POST',
                url: 'https://api.culqi.com/v2/charges',//misma url del pago con tarjeta?
                headers: {
                    Authorization: datos.yape_op_key,
                    'content-type': 'application/json'
                },
                body: {
                    amount: parseInt(payment.amount), // En céntimos
                    currency_code: payment.currency_code, // PEN o USD
                    email: payment.email,
                    source_id: payment.source_id,
                    capture: true,
                    installments: payment.installments, 
                },        
                json: true
                };
        }       
        
    request(options, function (error, response, body) {
        if (error){
            //  console.log(body);  
            return res.status(501).json({
                message: body.merchant_message,
                success: false
            })
        }  else {
            console.log(body);  
            if (body.object==='error') {
                return res.status(501).json({
                    message: body.merchant_message,
                    success: false
                })
            } else {
                // const respuesta = { 
                //     id: body.id,
                //     creation_date:body.creation_date,
                //     outcome: body.outcome,
                //     fee_details: body.fee_details
                // }
                return res.status(201).json(body)
            }
            
        }
    
    });
    
      },
    async crearDevolucion(req, res, next){
    
        const codigo = await req.params.codigo
        const idTienda = await req.params.iduser
        const datos = await User.buscarConst(codigo,idTienda)
        const payment = req.body
        
        const options = {
        method: 'POST',
        url: 'https://api.culqi.com/v2/refunds',
        headers: {
            Authorization: datos.yape_op_key,
            'content-type': 'application/json'
        },
        body: {
            amount: payment.amount,        // En céntimos
            charge_id: payment.charge_id,  // chr_.... 
            reason: payment.reason,        // cadena
        },
        
        json: true
        };
    
        request(options, function (error, response, body) {
        
        if (error){
            //  console.log(body);  
            return res.status(501).json({
                message: body.user_message,
                success: false
            })
        }  else {
            // console.log(body);
            if (body.object==='error') {
                return res.status(501).json({
                    message: body.user_message,
                    success: false
                })
            } else {
                Yape.updateDevolucion(idTienda,payment.idorder,body.id)
                return res.status(201).json(body)
            }
            
        }
    
    });
    
      },
    async createOrden(req, res, next){
            try {
                let payment = req.body //requerir datos del pago viene en req.body viene del flutter
                let order = payment.order
    
                const delivery = req.body.delivery
    
                order.status='PAGADO'
    
                const orderData = await Order.createyape(order, 4) 
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
    
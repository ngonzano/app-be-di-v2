const request = require('request');
const User = require('../models/user')

module.exports = {

async crearTokenYape(req, res, next){

const codigo = await req.params.codigo
const iduser = await req.params.iduser
const datos = await User.buscarConst(codigo,iduser)
let payment = req.body

       
const options = {
    method: 'POST',
    url: 'https://secure.culqi.com/v2/tokens/yape',
    headers: {
      Authorization: datos.yape_token_key,
      'content-type': 'application/json'
    },
     // no se puede obtener un mensaje satisfactorio por "una tarjeta de real para procesar pagos de prueba."
    body: {
        otp: payment.otp,
        number_phone: payment.number_phone,
        amount: payment.amount,
        metadata: 
            {   
               dni: payment.metadata.dni,
               negocio: payment.metadata.negocio 
            }
    },
    json: true
  };
 
request(options, function (error, response, body) {
    // console.log(response);
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
            return res.status(201).json(body)
        }
        
    }
    // console.log(body);  
   
  });

  },

async crearPago(req, res, next){

    const codigo = await req.params.codigo
    const iduser = await req.params.iduser
    const datos = await User.buscarConst(codigo,iduser)
    let payment = req.body
    
    const options = {
    method: 'POST',
    url: 'https://api.culqi.com/v2/charges',//misma url del pago con tarjeta?
    headers: {
        Authorization: datos.yape_op_key,
        'content-type': 'application/json'
    },
    body: {
        amount: payment.amount, // En céntimos
        currency_code: payment.currency_code, // PEN o USD
        email: payment.email,
        source_id: payment.source_id
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
            return res.status(201).json(body)
        }
        
    }

});

}
}


//key para token pk_test_ef7365271437193b
//key para operaciones sk_test_1cc547bb20709546
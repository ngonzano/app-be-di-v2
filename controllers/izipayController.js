const axios = require("axios").default;
// const { HmacSHA256 } = require("crypto-js");
// const Hex = require("crypto-js/enc-hex");
const dotenv = require("dotenv");
// const { v4: uuid } = require("uuid");
const { genRandonString, getDateUTC, getSignature, getSignature2 } = require("../helpers/helpers");

const Order = require('../models/order')
// const bodyParser = require("body-parser");

// Variable de entorno
dotenv.config({ path: "./.env" });

let PASSWORD = "";
let KEY = "";

if(process.env.MODE === "TEST") {
  KEY = process.env.CLAVE_TEST;
  PASSWORD = process.env.TEST_PASSWORD;
}
else {
  KEY = process.env.CLAVE_PRODUCCION;
  PASSWORD = process.env.PROD_PASSWORD;
}

// const validatePaymentx = (req, res) => {
//   const { clientAnswer, hash, hashKey } = req.body;
//   const body = req.body;
//   let key = "";
//   if (hashKey === "sha256_hmac") {
//     // key => HMAC-SHA-256 OF YOUR BACK OFFICE
//     key = process.env.TEST_KEY_HMAC_SHA_256;
//   } else if (hashKey === "password") {
//     // key => testPassword OF YOUR BACK OFFICE
//     key = process.env.TEST_PASSWORD;
//   }

//   const answerHash = Hex.stringify(
//     HmacSHA256(JSON.stringify(clientAnswer), key)
//   );

//   if (hash === answerHash) res.status(200).json(body);
//   else res.status(500).json("No coincide el hash de pago");
// };

const validatePayment = (req, res) => {
  const body = req.body;

  if (!body) return res.status(400).send("LA PUBLICACIÓN está vacía");
  if (!body.vads_hash) return res.status(400).send("Hash no encontrado");
  if (!(body.signature === getSignature2(body, KEY ))) return res.status(404).send("Se produjo un error al calcular la firma.")
    
  console.log(`Orden ${body.vads_order_id} actualizado exitosamente`);

  const id = Order.createPagoIzipay(
    body.vads_cust_email,
    body.vads_trans_uuid,
    body.vads_effective_creation_date,
    body.vads_order_id,
    body.vads_card_brand,
    body.vads_card_number,
    body.vads_card_product_category
    )

  console.log(id);
  res.status(200).send(`Orden ${body.vads_order_id} actualizado exitosamente.`);
};

const paymentForm = (req, res) => {
  const {amount, email, currency, id_user, nombre, apellido, items, phone} = req.body;

  const params = new URLSearchParams();
  const obj = {
    vads_action_mode: "INTERACTIVE",
    vads_amount: amount*100,
    vads_ctx_mode: process.env.MODE,
    vads_currency: currency=="PEN"?604:840,
    vads_cust_email: email,
    vads_cust_first_name: nombre,
    vads_cust_last_name: apellido,
    vads_cust_phone: phone,
    vads_ext_info_cybersource_mdd_15: id_user,
    vads_ext_info_cybersource_mdd_16: 'NO',
    vads_ext_info_cybersource_mdd_22: '03',
    vads_ext_info_cybersource_mdd_24: 'BAJO',
    vads_ext_info_cybersource_mdd_29: items,
    vads_ext_info_cybersource_mdd_37: 'DELIVERY',
    vads_ext_info_cybersource_mdd_46: 'APP',
    vads_language:'es',
    vads_order_id: new Date().getTime(),
    vads_page_action: "PAYMENT",
    vads_payment_config: "SINGLE",
    vads_redirect_error_timeout:'0',
    vads_redirect_success_timeout:'0',
    vads_shop_name: 'Pidepe',
    vads_site_id: process.env.ID_TIENDA,
    vads_theme_config: 'SIMPLIFIED_DISPLAY=true',
    vads_trans_date: getDateUTC(),
    vads_trans_id: genRandonString(6),    
    vads_url_cancel:'https://webview.cancel/',//tambien volver a la tienda desencadena esto
    vads_url_error:'https://webview.error/',
    vads_url_refused: 'https://webview.refused/',
    vads_url_success: 'https://webview.success/',   
    vads_version: "V2",
  }
// console.log(obj);
  for (const property in obj) {
    params.append(property, obj[property])
  }

  const signature = getSignature(obj, KEY);
  params.append("signature", signature);
// console.log(params);
  axios.post("https://secure.micuentaweb.pe/vads-payment/entry.silentInit.a", params)
  .then(response => {
    res.status(200).json(response.data)
  })
  .catch(error => {
    res.status(400).json(error.message)
  })

}

// module.exports = { createPayment, validatePayment, paymentForm };
module.exports = { validatePayment, paymentForm };



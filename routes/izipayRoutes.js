
const izipayController = require('../controllers/izipayController')
const bodyParser = require("body-parser");

module.exports = (app) => {
   app.use(bodyParser.urlencoded({ extended: true }));
   app.use(bodyParser.json());

   app.post('/api/validatePayment', izipayController.validatePayment)
   app.post('/api/paymentForm', izipayController.paymentForm)  
   
   app.post('/api/cancelOrRefund/:id', izipayController.cancelOrRefund);
   app.post('/api/updateTrans/:id/:amount', izipayController.updateTrans);
}

// {
//    vads_amount: '1800',
//    vads_auth_mode: 'FULL',
//    vads_auth_number: '3fcdbd',
//    vads_auth_result: '00',
//    vads_capture_delay: '0',
//    vads_card_brand: 'VISA',
//    vads_card_number: '497011XXXXXX0210',
//    vads_payment_certificate: '9444275e9ffb09ebd29bd189b2712c2eecd39dae',
//    vads_ctx_mode: 'TEST',
//    vads_currency: '604',
//    vads_effective_amount: '1800',
//    vads_effective_currency: '604',
//    vads_site_id: '81137252',
//    vads_trans_date: '20231220223840',
//    vads_trans_id: 'xneDZL',
//    vads_trans_uuid: 'f511f312c9b24ed4a338a34effdc1570',
//    vads_validation_mode: '0',
//    vads_version: 'V2',
//    vads_warranty_result: 'NO',
//    vads_payment_src: 'EC',
//    vads_ext_trans_id: '908700',
//    vads_order_id: '1703111920193',
//    vads_cust_email: 'hldeliveryperu@gmail.com',
//    vads_cust_name: 'Nilton  Gonzano Rojas',
//    vads_cust_first_name: 'Nilton',
//    vads_cust_last_name: ' Gonzano Rojas',
//    vads_cust_phone: '946352516',
//    vads_sequence_number: '1',
//    vads_acquirer_network: 'PROCESOS_ISO',
//    vads_contract_used: '5589992',
//    vads_trans_status: 'AUTHORISED',
//    vads_expiry_month: '6',
//    vads_expiry_year: '2024',
//    vads_bank_code: '17807',
//    vads_bank_label: 'Banque Populaire Occitane',
//    vads_bank_product: 'L',
//    vads_pays_ip: 'US',
//    vads_payment_option_code: '0',
//    vads_presentation_date: '20231220223840',
//    vads_effective_creation_date: '20231220223840',
//    vads_occurrence_type: 'UNITAIRE',
//    vads_operation_type: 'DEBIT',
//    vads_risk_analysis_result: 'ACCEPT',
//    vads_result: '00',
//    vads_extra_result: '',
//    vads_card_country: 'PE',
//    vads_language: 'es',
//    vads_hash: '2f028c86a20a33c34e0a49917c88e17bb5ea6f507f197199179979817799cd33',
//    vads_url_check_src: 'PAY',
//    vads_action_mode: 'INTERACTIVE',
//    vads_payment_config: 'SINGLE',
//    vads_page_action: 'PAYMENT',
//    vads_shop_name: 'Pidepe',
//    vads_ext_info_cybersource_mdd_24: 'BAJO',
//    vads_ext_info_cybersource_mdd_46: 'APP',
//    vads_ext_info_cybersource_mdd_22: '03',
//    vads_ext_info_cybersource_mdd_16: 'NO',
//    vads_ext_info_cybersource_mdd_15: '25',
//    vads_ext_info_cybersource_mdd_37: 'DELIVERY',
//    vads_ext_info_cybersource_mdd_29: '1',
//    vads_card_product_category: 'DEBIT',
//    vads_card_nature: 'CONSUMER_CARD',
//    vads_archival_reference_id: 'PV1220908700',
//    vads_threeds_enrolled: '',
//    vads_threeds_auth_type: '',
//    vads_threeds_eci: '',
//    vads_threeds_xid: '',
//    vads_threeds_cavvAlgorithm: '',
//    vads_threeds_status: '',
//    vads_threeds_sign_valid: '',
//    vads_threeds_error_code: '15',
//    vads_threeds_exit_status: '15',
//    vads_threeds_user_interaction: '',
//    vads_threeds_cavv: '',
//    signature: 'SQo9/P9LSinFSdXJfW6LS61OY8dfzwJnoUNT1GTctxI='
//  }
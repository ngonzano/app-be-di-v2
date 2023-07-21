/*
const: constantes
let: variables
*/
const express = require('express')
const sessionx = require('express-session')
const http = require('http')
const app = express()
const server = http.createServer(app)
const logger= require('morgan')
const cors= require('cors')
const multer = require('multer')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const passport = require('passport')
const io = require('socket.io')(server)
const mercadopago = require('mercadopago')
/*sockets*/
const orderDeliverySocket = require('./sockets/orders_delivery_sockets')
const deliveryTiendaSocket = require('./sockets/delivery_tienda_sockets')
const driverSocket = require('./sockets/driver_sockets')

const users = require('./routes/usersRoutes')
const categories = require('./routes/categoriesRoutes')
const products = require('./routes/productsRoutes')
const address = require('./routes/addressRoutes')
const order = require('./routes/ordersRoutes')
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes')

const efectivo = require('./routes/efectivoRoutes')
const yapeController = require('./routes/yapeRoutes')
const culqiController = require('./routes/culqiRoutes')

/*MERCADO PAGO CONFIGURACION*/
//QA
// mercadopago.configure({
//     access_token:'TEST-4647891345690403-070800-d0bea39e4981caeb0be9329839d56e67-578676229'
// })

//PROD
// mercadopago.configure({
//     access_token:'APP_USR-1181137664744409-120823-00a328d8dbd81d6967dd857a28f2a421-1258945087'
// })

/*FIN MERCADO PAGO CONFIGURACION*/

/*iniciar firebase*/
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const upload = multer ({
    storage: multer.memoryStorage()
})


/*Rutas*/
const port = process.env.PORT || 3000
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.disable('x-powered-by')
app.set('port', port)

//LLamar al sockets
orderDeliverySocket(io);
deliveryTiendaSocket(io);
driverSocket(io);

/*
llamando a las rutas
*/
users(app, upload)
categories(app, upload)
address(app)
order(app)
products(app, upload)
mercadoPagoRoutes(app)
efectivo(app)
yapeController(app)
culqiController(app)

server.listen(port,'0.0.0.0', function(){
// server.listen(port,'192.168.18.18'||'localhost', function(){
    console.log('App '+process.pid+' iniciada...')
    console.log('Port '+port+' iniciada...')
})

app.get('/',(req, res) => {
    res.send('H&L DELIVERY | PidePE - ruta raiz del backend, solo se vera con TOKEN.')
})

app.get('/orders/delivery', (req, res) => {
    res.send('Socket IO');
  });
//error handler
app.use((err,req, res, next) => {
    //console.log(err)
    res.status(err.status || 500).send(err.stack)
})
app.use(sessionx({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
  

module.exports = {
    app: app,
    server: server
}

//200 - es una respuesta exitosa
//400 - significa que la url no existe
//500 - error interno del servidor
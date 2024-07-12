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
/*sockets*/
const orderDeliverySocket = require('./sockets/orders_delivery_sockets')
const deliveryTiendaSocket = require('./sockets/delivery_tienda_sockets')
const driverSocket = require('./sockets/driver_sockets')
const ordersUpdateSocket = require('./sockets/update_orders_sockets')
const productSocket = require('./sockets/product_sockets')
const chatSocket = require('./sockets/chat_sockets')

const users = require('./routes/usersRoutes')
const categories = require('./routes/categoriesRoutes')
const products = require('./routes/productsRoutes')
const address = require('./routes/addressRoutes')
const order = require('./routes/ordersRoutes')
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes')

const efectivo = require('./routes/efectivoRoutes')
const yapeController = require('./routes/yapeRoutes')
const culqiController = require('./routes/culqiRoutes')
const smsRoutes = require('./routes/smsRoutes')

const path = require('path');//izipay

const izipayRouter = require('./routes/izipayRoutes');


async function pidepe() {
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
app.use(sessionx({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())


require('./config/passport')(passport)
app.disable('x-powered-by')
app.set('port', port)



// app.use(express.static(path.join(__dirname, 'public')))
//LLamar al sockets
orderDeliverySocket(io);
deliveryTiendaSocket(io);
driverSocket(io);
ordersUpdateSocket(io);
productSocket(io);
chatSocket(io);

/*
llamando a las rutas
*/
izipayRouter(app)
users(app, upload)
categories(app, upload)
address(app)
order(app)
products(app, upload)
mercadoPagoRoutes(app)
efectivo(app)
yapeController(app)
culqiController(app)
smsRoutes(app)

// server.listen(port,'0.0.0.0', function(){
// server.listen(port,'192.168.18.6'||'localhost', function(){
server.listen(port,'35.224.226.64'||'localhost', function(){
    console.log('App '+process.pid+' iniciada...')
    console.log('Port '+port+' iniciada...')
})

app.get('/',(req, res) => {
    res.send('H&L DELIVERY | PidePE - raiz | gcloud |')
})

app.get('/orders/delivery', (req, res) => {
    res.send('Socket IO');
  });

// app.use((req, res, next) => {
//   res.setHeader('Content-Type', 'text/plain');
//   res.status(200).send('El backend esta activo.');
//   next();
// });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
  });

module.exports = {
    app: app,
    server: server
}
}

pidepe();



//200 - es una respuesta exitosa
//400 - significa que la url no existe
//500 - error interno del servidor
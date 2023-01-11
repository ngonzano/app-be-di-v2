module.exports = (io) => {
    const orderDeliveryNamespace = io.of('/delivery/tienda')
    orderDeliveryNamespace.on('connection', function(socket){
        //console.log('USUARIO CONECTADO AL NAMESPACE /delivery/tienda')
        socket.on('position', function(data) {
            //console.log(`Emitio: ${JSON.stringify(data)}`)
            orderDeliveryNamespace.emit(`position/${data.id_order}`, {lat: data.lat,lng: data.lng})
        })
        socket.on('disconnect', function(data) {
            //console.log('USUARIO DESCONECTADO')
        })
    })
}
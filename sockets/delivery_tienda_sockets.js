module.exports = (io) => {
    const deliveryTiendaNamespace = io.of('/delivery/tienda')
    deliveryTiendaNamespace.on('connection', function(socket){
        console.log(`USUARIO CONECTADO AL NAMESPACE /delivery/tienda - ${socket.id}`)
        socket.on('position2', function(data) {
            console.log(`Emitio: ${JSON.stringify(data)}`)
            deliveryTiendaNamespace.emit(`position2/${data.id_order}`, {lat: data.lat,lng: data.lng})
            console.log(`Emitido: position2/${data.id_order}`)
        });
        socket.on('disconnect', function(data) {
            console.log('USUARIO DESCONECTADO')
        });
    })
}
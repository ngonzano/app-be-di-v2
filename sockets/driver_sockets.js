module.exports = (io) => {
    const driverNamespace = io.of('/driver')
    driverNamespace.on('connection', function(socket){
        // console.log(`USUARIO CONECTADO AL NAMESPACE /delivery/tienda - ${socket.id}`)
        socket.on('position_driver', function(data) {
            // console.log(`Emitio: ${JSON.stringify(data)}`)
            driverNamespace.emit(`position_driver/${data.conection}`, {lat: data.lat,lng: data.lng})
        });
        socket.on('disconnect', function(data) {
            console.log('USUARIO DESCONECTADO')
        });
    })
}
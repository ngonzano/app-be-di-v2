module.exports = (io) => {

    const orderDeliveryNamespace = io.of('/orders/delivery');
    orderDeliveryNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /orders/delivery');
        socket.on('position', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            orderDeliveryNamespace.emit(`position/${data.id_order}`, { lat: data.lat, lng: data.lng  });
        });
        socket.on('disconnect', (data)  => {
            console.log('USUARIO DESCONECTADO');
        });
    });
}
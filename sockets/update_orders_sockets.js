module.exports = (io) => {

    const orderUpdateNamespace = io.of('/orders/update');
    orderUpdateNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /orders/delivery');
        socket.on('orders_update', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            orderUpdateNamespace.emit(`orders_update/${data.idTienda}`, { update: data.update });
        });
        socket.on('disconnect', (data)  => {
            console.log('USUARIO DESCONECTADO');
        });
    });
}
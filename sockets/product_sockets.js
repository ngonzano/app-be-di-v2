module.exports = (io) => {

    const orderUpdateNamespace = io.of('/product');
    orderUpdateNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /orders/delivery');
        socket.on('product', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            orderUpdateNamespace.emit(`product/${data.product}`, { product: data.update });
        });
        socket.on('disconnect', (data)  => {
            console.log('USUARIO DESCONECTADO');
        });
    });
}
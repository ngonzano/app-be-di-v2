module.exports = (io) => {

    const chatNamespace = io.of('/chat/historial');
    chatNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /chat/historial');
       
        socket.on('chat', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            chatNamespace.emit(`chat/${data.idClient}/${data.idSoporte}`, { chat: data.chat });
        });
        socket.on('disconnect', (data)  => {
            // console.log('USUARIO DESCONECTADO');
        });
    });

    const chatCountNamespace = io.of('/chat/count');
    chatCountNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /chat/count');
       
        socket.on('chat/count', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            chatCountNamespace.emit(`chat/count/${data.idSoporte}`, { count: data.count, idClient: data.idClient, message: data.message });
        });
        socket.on('disconnect', (data)  => {
            // console.log('USUARIO DESCONECTADO');
        });
    });

    const chatUpdListNamespace = io.of('/chat/list');
    chatUpdListNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /chat/count');
       
        socket.on('chat/list', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            chatUpdListNamespace.emit(`chat/list/${data.idSoporte}`, { dato: data.dato });
        });
        socket.on('disconnect', (data)  => {
            // console.log('USUARIO DESCONECTADO');
        });
    });

    const chatNegocioNamespace = io.of('/chat/historial/negocio');
    chatNegocioNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /chat/historial');
       
        socket.on('chat/negocio', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            chatNegocioNamespace.emit(`chat/negocio/${data.idClient}/${data.idSoporte}`, { chat: data.chat });
        });
        socket.on('disconnect', (data)  => {
            // console.log('USUARIO DESCONECTADO');
        });
    });

    const chatNegocioCountNamespace = io.of('/chat/count/negocio');
    chatNegocioCountNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /chat/count');
       
        socket.on('chat/count/negocio', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            chatNegocioCountNamespace.emit(`chat/count/negocio/${data.idSoporte}`, { count: data.count, idClient: data.idClient, message: data.message });
        });
        socket.on('disconnect', (data)  => {
            // console.log('USUARIO DESCONECTADO');
        });
    });

    const chatUpdListNegocioNamespace = io.of('/chat/list/negocio');
    chatUpdListNegocioNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /chat/count');
       
        socket.on('chat/list/negocio', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            chatUpdListNegocioNamespace.emit(`chat/list/negocio/${data.idSoporte}`, { dato: data.dato });
        });
        socket.on('disconnect', (data)  => {
            // console.log('USUARIO DESCONECTADO');
        });
    });


}
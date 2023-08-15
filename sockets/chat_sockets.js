module.exports = (io) => {

    const chatNamespace = io.of('/chat/historial');
    chatNamespace.on('connection', (socket) => {
        // console.log('USUARIO CONECTADO AL NAMESPACE /chat/historial');
       
        socket.on('chat', (data) => {
            // console.log(`EMITIO ${JSON.stringify(data)}`);
            chatNamespace.emit(`chat/${data.idClient}/${data.idSoporte}`, { chat: data.chat });
        });
        socket.on('disconnect', (data)  => {
            console.log('USUARIO DESCONECTADO');
        });
    });

}
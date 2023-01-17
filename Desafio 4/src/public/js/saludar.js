const socket = io()
socket.emit('mensaje', 'Hola desde el cliente de web socket')
socket.on("singlecast", (msj) =>{
    console.log("Mensaje recibido del servidor: " + msj)
})
socket.on("broadcast", (msj) =>{
    console.log("Mensaje de broadcast: " + msj)
})
socket.on("multicast", (msj) =>{
    console.log("Mensaje de multicast: " + msj)
})
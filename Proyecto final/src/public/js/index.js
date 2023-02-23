const socketClient = io()
let chatBox = document.getElementById('chat-box')
let user

Swal.fire({
    title: "Inicio de sesion",
    text: "Ingrese su correo electronico",
    input: "text",
    confirmButton: "Cool",
    allowOutsideClick: false,
    inputValidator: (value)=>{

    }
}).then((result)=>{
    if(result.value){
        user = result.value
    }
})

chatBox.addEventListener("keyup", (event)=>{
    if(event.key === "Enter"){
        if(chatBox.value.trim().length > 0){
            socketClient.emit("newMessage", {user: user, message: chatBox.value})
            chatBox.value = ""  
        }
    }
})

socketClient.on("messageLogs", dataMessage =>{
    let log = document.getElementById('message-logs')
    let messages = ""
    dataMessage.forEach(data => {
        messages = messages + `${data.user} : ${data.message} <br/>`
    })
    log.innerHTML = messages
})
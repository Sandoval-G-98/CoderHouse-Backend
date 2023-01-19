const socketClient = io()

socketClient.emit('newProduct', "newProduct")

const submitButton = document.getElementById('send-button')

submitButton.addEventListener("submit", (e)=>{

    e.preventDefault()

    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const price = document.getElementById("price").value
    const thumbnails = document.getElementById("thumbnails").value
    const status = document.getElementById("status").value
    const code = document.getElementById("code").value
    const stock = document.getElementById("stock").value
    const category = document.getElementById("category").value

    const newProduct = {
        "title": title,
        "description": description,
        "price": price,
        "thumbnails": thumbnails,
        "status": status,
        "code": code,
        "stock": stock,
        "category": category
    }

    console.log(newProduct)

    socketClient.emit('newProduct', newProduct)

})

const socketClient = io()

const submitButton = document.getElementById('send-button')

submitButton.addEventListener("click", (event)=> {

    event.preventDefault()

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
        "status": status == "True" ? true : false,
        "code": code,
        "stock": stock,
        "category": category
    }

    socketClient.emit('newProduct', newProduct)

})

socketClient.on("newProductsList", newProductsList =>{

    console.log(newProductsList)
    
    newProductsList.forEach(product => {

        const productList = document.getElementById("realTimeProductsList")

        const ul = document.createElement("ul")

        const liTitle = document.createElement("li")

        liTitle.innerHTML = product.title
        
        ul.appendChild(liTitle)

        const liDescription = document.createElement("li")

        liDescription.innerHTML = product.description
        
        ul.appendChild(liDescription)
        
        const liPrice = document.createElement("li")

        liPrice.innerHTML = product.price

        ul.appendChild(liPrice)

        const liThumbnails = document.createElement("li")

        liThumbnails.innerHTML = product.thumbnails

        ul.appendChild(liThumbnails)

        const liStatus = document.createElement("li")

        liStatus.innerHTML = product.status

        ul.appendChild(liStatus)

        const liCode = document.createElement("li")

        liCode.innerHTML = product.code

        ul.appendChild(liCode)
        
        const liStock = document.createElement("li")

        liStock.innerHTML = product.stock

        ul.appendChild(liStock)

        const liCategory = document.createElement("li")

        liCategory.innerHTML = product.category

        ul.appendChild(liCategory)

        productList.appendChild(ul)

    })


})

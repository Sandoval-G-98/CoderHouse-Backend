const express = require('express')
const {productsRouter} = require('./routes/productsRouter')
const {cartsRouter} = require('./routes/cartsRouter')
const {viewsRouter} = require('./routes/viewsRouter')
const {productManager} = require('./ProductManager')
const {engine} = require('express-handlebars')
const {Server} = require('socket.io')

const app = express()
const httpServer = app.listen(8080, () => console.log("Server up in port 8080"))
const socketServer = new Server(httpServer)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)
app.use("/", viewsRouter)

socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado")

    const newProductsList = productManager.getProducts()
    socket.emit("newProductsList", newProductsList)

    socket.on('newProduct', newProduct =>{

        const response = productManager.addProduct(newProduct)

        if(response == "Product added successfully") {
            console.log("entre a hacer el emit")
            const newProductsList = productManager.getProducts()
            socket.emit("newProductsList", newProductsList)
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
      })

})


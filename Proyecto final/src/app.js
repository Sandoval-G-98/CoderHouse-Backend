const express = require('express')
const mongoose = require('mongoose')
const {productsRouter} = require('./routes/productsRouter')
const {cartsRouter} = require('./routes/cartsRouter')
const {viewsRouter} = require('./routes/viewsRouter')
const {chatsRouter} = require('./routes/chatsRouter')
const {productManager} = require('../src/dao/ProductManager')
const {messageModel} = require('../src/dao/models/message.model');
const {engine} = require('express-handlebars')
const {Server} = require('socket.io')
const dotenv = require('dotenv');   
dotenv.config();
mongoose.set('strictQuery', true);
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
app.use("/api/chat", chatsRouter)
app.use("/", viewsRouter)

const DB_USER = process.env.REACT_APP_DB_USER_MONGO
const DB_PASSWORD = process.env.REACT_APP_DB_PASSWORD_MONGO
const DB_NAME = process.env.REACT_APP_DB_NAME_MONGO

socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado")

    let newProductsList = await productManager.getProducts()
    newProductsList = newProductsList.docs
    socket.emit("newProductsList", newProductsList)

    const messages = await messageModel.find({})
    socketServer.emit("messageLogs", messages)

    socket.on('newProduct', async (newProduct) =>{

        const response = await productManager.addProduct(newProduct)

        if(response == "Product added successfully") {
            newProductsList = await productManager.getProducts()
            newProductsList = newProductsList.docs
            socket.emit("newProductsList", newProductsList)
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })

    socket.on("newMessage", async message => {
        await messageModel.create(message)
        const messages = await messageModel.find({})
        socketServer.emit("messageLogs", messages)
    })
    
})


const environment = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://"+DB_USER+":"+DB_PASSWORD+"@codercluster.88fp6eg.mongodb.net/"+DB_NAME+"?retryWrites=true&w=majority")        
        console.log("Conectado a la base de datos")
    } catch (error) {
        console.log("Error en la conexion a la base de datos"+error)
    }
}

const isValidStartData = () =>{
    if (DB_PASS && DB_USER) return true
    return false
}

isValidStartData && environment()
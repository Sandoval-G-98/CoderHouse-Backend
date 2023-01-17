const express = require('express')
const {productsRouter} = require('./routes/productsRouter')
const {cartsRouter} = require('./routes/cartsRouter')
const {viewsRouter} = require('./routes/viewsRouter')
const {engine} = require('express-handlebars')
const {Server} = require('socket.io')

const app = express()
const httpServer = app.listen(8080, () => console.log("Servidor arriba en el 8080"))
const socketServer = new Server(httpServer)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/views')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)
app.use("/api/realtimeproducts", viewsRouter)

socketServer.on("connection", (socket) => {
    socket.on("mensaje", (msj) =>{
        console.log("Nuevo mensaje: " + msj)
    })
    socket.emit("singlecast", "Este es un mensaje del servidor")
    socket.broadcast.emit("broadcast", "ESTE ES UN MENSAJE DE BROADCAST")
    socketServer.emit("multicast", "ESTE ES UN MENSAJE DE multicast")
})

app.get("/", (req, res) => {
    const nombre = req.params.nombre
    res.render("saludar", {nombre})
})



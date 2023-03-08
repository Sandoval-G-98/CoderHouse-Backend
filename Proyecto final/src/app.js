const express = require('express')
const mongoose = require('mongoose')
const mongoStore = require('connect-mongo')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const {productsRouter} = require('./routes/productsRouter')
const {cartsRouter} = require('./routes/cartsRouter')
const {viewsRouter} = require('./routes/viewsRouter')
const {chatsRouter} = require('./routes/chatsRouter')
const {sessionsRouter} = require('./routes/sessionsRouter')
const {productManager} = require('../src/dao/ProductManager')
const {userManager} = require('../src/dao/UserManager')
const {messageModel} = require('../src/dao/models/message.model');
const {createHash} = require('./utils')
const {engine} = require('express-handlebars')
const passport = require('passport')
const {initializePassport} = require('./config/passport.config')
const {Server} = require('socket.io')
const dotenv = require('dotenv');   
mongoose.set('strictQuery', true);
const app = express()
const httpServer = app.listen(8080, () => console.log("Server up in port 8080"))
const socketServer = new Server(httpServer)
dotenv.config();
const DB_USER = process.env.REACT_APP_DB_USER_MONGO
const DB_PASSWORD = process.env.REACT_APP_DB_PASSWORD_MONGO
const DB_NAME = process.env.REACT_APP_DB_NAME_MONGO
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use(session({
    store:mongoStore.create({
        mongoUrl: "mongodb+srv://"+DB_USER+":"+DB_PASSWORD+"@codercluster.88fp6eg.mongodb.net/"+DB_NAME+"?retryWrites=true&w=majority",
        mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
        ttl:30000,
    }),
    secret:"s3cret",
    resave:false,
    saveUnitialized:false,
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next)=>{ 
    res.locals.session = req.session;
    next();
})

app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)
app.use("/api/chat", chatsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/", viewsRouter)

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


/// Se debe hacer una unica vez al ejecutar la aplicación, luego comentar esta funcion y su ejecución
/* async function createAdminUser() {
    await userManager.addUser("Coder", "House", "adminCoder@coder.com", 1, "adminCod3r123")
}
createAdminUser() */

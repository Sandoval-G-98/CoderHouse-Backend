const express = require('express')
const {productManager} = require('../ProductManager')
const viewsRouter = express.Router()

viewsRouter.get('/home', (req, res) => {

    const productsList = productManager.getProducts()

    res.render("home", {productsList})
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render("realTimeProducts")
})


module.exports = {
    viewsRouter,
}
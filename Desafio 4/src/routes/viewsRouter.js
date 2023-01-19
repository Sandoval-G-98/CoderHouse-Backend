const express = require('express')
const {productManager} = require('../ProductManager')
const viewsRouter = express.Router()

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render("realTimeProducts",)
})

module.exports = {
    viewsRouter,
}
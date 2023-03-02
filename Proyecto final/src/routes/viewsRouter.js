const express = require('express')
const {productManager} = require('../dao/ProductManager')
const {cartManager} = require('../dao/CartManager')
const viewsRouter = express.Router()

viewsRouter.get('/home', async (req, res) => {

    let productsList = await productManager.getProducts()
    let products = productsList.docs
    res.render("home", {products})
})

viewsRouter.get('/products', async (req, res) => {

    const page = req.query.page
    const sort = req.query.sort
    const limit = req.query.limit
    const query = req.query.query

    const productsList = await productManager.getProducts(limit, page, query, sort)
    
    res.render("products", {productsList})
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid

    const cart = await cartManager.getCartById(cartId)

    let products = []
    cart.forEach(prodsList => {
        
        prodsList.products.forEach( prod =>{
            products.push({
                title: prod.product.title,
                price: prod.product.price,
                quantity: prod.quantity,
                totalPrice: (prod.product.price * prod.quantity).toFixed(2)
            })
        })
    })

    res.render("cart", {cartProducts: products, cartId: cartId})
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render("realTimeProducts")
})

viewsRouter.get('/login', async (req, res) => { 
    res.render("login")
})
    
viewsRouter.get('/register', (req, res) => { 
    res.render("register")
})

viewsRouter.get('/profile', (req, res) => { 
    res.render("profile")
})


module.exports = {
    viewsRouter,
}
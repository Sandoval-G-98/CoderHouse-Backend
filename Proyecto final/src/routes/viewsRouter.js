const express = require('express')
const {productManager} = require('../dao/ProductManager')
const {cartManager} = require('../dao/CartManager')
const viewsRouter = express.Router()

viewsRouter.get('/home', auth, async (req, res) => {

    let productsList = await productManager.getProducts()
    let products = productsList.docs
    res.render("home", {products})
})

viewsRouter.get('/products', auth, async (req, res) => {

    const page = req.query.page
    const sort = req.query.sort
    const limit = req.query.limit
    const query = req.query.query
    const user = req.session.user

    const productsList = await productManager.getProducts(limit, page, query, sort)
    
    res.render("products", {productsList, user})
})

viewsRouter.get('/carts/:cid', auth, async (req, res) => {
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

viewsRouter.get('/profile', auth, (req, res) => { 
    const user = req.session.user
    res.render("profile", {user})
})

function auth(req, res, next) {
    if(req.session.user) {
        return next();
    }
    res.redirect('/login')
}

module.exports = {
    viewsRouter,
}
const express = require('express')
const cartsRouter = express.Router()
const {cartManager} = require('../dao/cartManager')

cartsRouter.post('/', async (req, res) => {

    const cartId = req.params.cid

    const response = await cartManager.createCart(cartId)

    if(response == "Something went wrong creating cart")
        res.status(500).send({"message":"Something went wrong creating cart"})
    else
        res.status(200).send({"message": "Cart created successfully", "cart": response})

})

cartsRouter.get('/', async (req, res) => {

    const response = await cartManager.getCarts()

    if(response == "Something went wrong getting carts")
        res.status(500).send({"message":"Something went wrong getting carts"})
    else
        res.status(200).send({"message": "Carts getting successfully", "carts": response})

})

cartsRouter.get('/:cid', async (req, res) => {

    const cartId = req.params.cid

    const response = await cartManager.getCartById(cartId)
    
    if(response == "Something went wrong getting cart")
        res.status(500).send({"message": response})
    else if(response == "Cart Not Found")
        res.status(404).send({"message": response})
    else
        res.status(200).send({"message": "Cart getting successfully", "cart": response})
})


cartsRouter.post('/:cid/products/:pid', async (req, res) => {

    const cartId = req.params.cid

    const productId = req.params.pid

    const response = await cartManager.addProductToCart(cartId, productId)

    if(response == "Product added successfully to the cart")
        res.status(200)
    else if(response == "Cart not found")
        res.status(404)
    else
        res.status(500)

    res.send({"message": response})
})

cartsRouter.put('/:cid', async (req, res) => {

    const products = req.body.products
    const cartId = req.params.cid

    const response = await cartManager.updateAllProductsCart(cartId, products)

    if(response == "Products updated successfully")
        res.status(200)
    else if(response == "Cart not found")
        res.status(404)
    else
        res.status(500)
    
    res.send({"message": response})
})

cartsRouter.put('/:cid/products/:pid', async (req, res) => {

    let response
    
    if(req.body.quantity && Object.keys(req.body).length==1) {

        const quantity = Number(req.body.quantity)
        const cartId = req.params.cid
        const productId = req.params.pid
        
        response = await cartManager.updateOneProductCart(cartId, productId, quantity)
    
        if(response == "Product updated successfully")
            res.status(200)
        else
            res.status(500)

    } else {
        response = "You must indicate just the param 'quantity' "
        res.status(400)
    }

    res.send({"message": response})
})

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {

    const cartId = req.params.cid
    const productId = req.params.pid

    const response = await cartManager.deleteProductFromCart(cartId, productId)

    if(response == "Product deleted successfully")
        res.status(200)
    else
        res.status(500)
    
    res.send({"message": response})
})

cartsRouter.delete('/:cid', async (req, res) => {

    const cartId = req.params.cid

    const response = await cartManager.deleteAllProductsFromCart(cartId)

    if(response == "Products deleted successfully")
        res.status(200)
    else
        res.status(500)
    
    res.send({"message": response})
})

module.exports = {
    cartsRouter,
}
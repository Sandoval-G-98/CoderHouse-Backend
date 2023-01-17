const express = require('express')
const cartsRouter = express.Router()
const {cartManager} = require('../cartManager')

cartsRouter.get('/:cid', (req, res) => {

    const cartId = req.params.cid

    const cartList = cartManager.getCartById(cartId)

    if(cartList == "Cart id Not found")
        res.status(400).send(cartList)
    else
        res.status(200).send(cartList)
})

cartsRouter.post('/:cid/product/:pid', (req, res) => {

    const cartId = Number(req.params.cid)
    const productId = Number(req.params.pid)

    const cartList = cartManager.addProductToCart(cartId, productId)

    res.status(200).send(cartList)
})
 
module.exports = {
    cartsRouter,
}
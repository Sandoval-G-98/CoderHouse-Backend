const express = require('express');
const productsRouter = express.Router();
const {productManager} = require('../ProductManager')

productsRouter.get('', (req, res) => {

    let limit = req.query.limit
    const productsList = productManager.getProducts()

    if(limit) {
        const newProductList = productsList.slice(0,limit)
        res.send(newProductList)
    }
    else
        res.send(productsList)
    res.status(200)
})

productsRouter.get('/:pid', (req, res) => {

    let productId = req.params.pid
    const product = productManager.getProductById(productId)

    console.log(product)

    if(product == "Id Not found")
        res.status(404).send(product)
    else
        res.status(200).send(product)
})

productsRouter.post('/', (req, res) => {

    const product = req.body

    const response = productManager.addProduct(product)

    if(response == "Product added successfully")
        res.status(201).send(response)
    else
        res.status(400).send(response[1])
})

productsRouter.put('/:pid', (req, res) => {

    const product = req.body
    const productId = req.params.pid

    const response = productManager.updateProduct(productId, product)

    if(response == "Product update succesfully")
        res.status(200).send(response)
    else
        res.status(400).send(response)
})

productsRouter.delete('/:pid', (req, res) => {

    const productId = req.params.pid

    const response = productManager.deleteProduct(productId)

    if(response == "Product delete succesfully")
        res.status(200).send(response)
    else
        res.status(400).send(response)
})


module.exports = {
    productsRouter,
}
const express = require('express');
const productsRouter = express.Router();
const {productManager} = require('../dao/ProductManager')

productsRouter.get('', async (req, res) => {

    let limit
    let page
    let query
    let sort
    
    if(req.query.limit)
        limit = req.query.limit
    if(req.query.page)
        page = req.query.page
    if(req.query.query)
        query = req.query.query
    if(req.query.sort)
        sort = req.query.sort

    let response = await productManager.getProducts(limit, page, query, sort)

    if(response)
        res.status(200).send(response)
    else
        res.status(500).send({"message": response})
})

productsRouter.get('/:pid', async (req, res) => {

    let productId = req.params.pid
    const product = await productManager.getProductById(productId)

    if(product == "Product id not found")
        res.status(404).send(product)
    else
        res.status(200).send(product)
})

productsRouter.post('/', async (req, res) => {

    const product = req.body

    const response = await productManager.addProduct(product)

    if(response == "Product added successfully")
        res.status(201).send(response)
    else
        res.status(400).send(response)
})

productsRouter.put('/:pid', async (req, res) => {

    const product = req.body
    const productId = req.params.pid

    const response = await productManager.updateProduct(productId, product)

    if(response == "Product update succesfully")
        res.status(200).send(response)
    else
        res.status(400).send(response)
})

productsRouter.delete('/:pid', async (req, res) => {

    const productId = req.params.pid

    const response = await productManager.deleteProduct(productId)

    if(response == "Product delete succesfully")
        res.status(200).send(response)
    else
        res.status(400).send(response)
})


module.exports = {
    productsRouter,
}
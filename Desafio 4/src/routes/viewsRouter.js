const express = require('express')
const viewsRouter = express.Router()

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

module.exports = {
    viewsRouter,
}
const mongoose = require('mongoose');

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products", 
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: [],
    },
    
})

cartSchema.pre('find', function(){
    this.populate('products.product')
})

const cartModel = mongoose.model(cartsCollection, cartSchema)

module.exports = {
    cartModel
}
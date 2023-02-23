const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const productsCollection = "products"

const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: String,
        price: Number,
        thumbnails: Array,
        stock: Number,
        category: String,
        status: Boolean,
    },
)

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productsCollection, productSchema)

module.exports = {
    productModel
}
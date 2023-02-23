/* const fs = require('fs') */
const {cartModel} = require('./models/cart.model');

class CartManager {

    async createCart() {

        try {
            const cart = {
                "products": []
            }

            const cartCreated = await cartModel.create(cart)

            return cartCreated

        } catch (err) {

            console.log("Something went wrong creating cart: " + err)

            return "Something went wrong creating cart"
        }

    }

    async addProductToCart(cartId, productId) {

        try {

            let cartUpdated = await cartModel.findById(cartId)

            let indexResult = cartUpdated.products.findIndex( product => product.product.toString() == productId)

            if(indexResult != -1)
                cartUpdated.products[indexResult].quantity++
            else
                cartUpdated.products.push({product: productId})

            cartUpdated = await cartModel.updateOne({_id: cartId}, cartUpdated)

            return "Product added successfully to the cart"

        } catch (e) {
            console.log("Something went wrong adding product to cart: "+e)

            return "Something went wrong adding product to cart"
        }
        
       /*  this.carts = this.getCarts()
            
        try {

            const cartToAddProductPosition = this.carts.findIndex(cart2 => cart2.id == cartId)

            if(cartToAddProductPosition != -1) {
                
                const productToUpdatePosition = this.carts[cartToAddProductPosition].products.findIndex(product => product.product == productId)

                if(productToUpdatePosition != -1) 
                    this.carts[cartToAddProductPosition].products[productToUpdatePosition].quantity++
                else {
                    const newProductToAdd = {
                        "product": productId,
                        "quantity": 1
                    }
                    this.carts[cartToAddProductPosition].products.push(newProductToAdd)
                }

            } else {

                const newCart = {
                    "id": cartId,
                    "products" : [
                        {
                            "product": productId,
                            "quantity": 1
                        }
                    ]
                }

                this.carts.push(newCart)
    
            }
            
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, '\t'))

            return "Product added to cart successfully"

        } catch(err) {
            throw new Error("Error adding product")
        } */
    
    
    }

    async getCartById(cartId) {

        try {

            let cart = await cartModel.find({_id: cartId})

            if(cart.length == 0)
                return "Cart Not Found"

            return cart

        } catch(err) {

            console.log("Something went wrong getting cart "+ cartId + ": " + err)

            return "Something went wrong getting cart"
        }


/*         this.carts = this.getCarts()

        try {
            var cart = this.carts.filter((cart) => {
                if (cart.id == cartId) {
                    return cart
                } 
            })
        } catch(err) {
            throw new Error("Error getting cart by id")
        }
        
        return cart.length > 0 ? cart : "Cart id Not found" */
    }

    async getCarts() {

        try {

            let carts = await cartModel.find({})

            return carts

        } catch (e) {
            
            console.log("Something went wrong getting carts: "+ err)

            return "Something went wrong getting carts"
        }

/*         try {
            var carts = fs.readFileSync(this.path, "utf-8")
            if(!carts)
                return []
            carts = JSON.parse(carts)
        } catch(err) {
            throw new Error("Error getting carts")
        }
        return carts */
    }

    async updateAllProductsCart(cartId, products) {
        try {

            let cart = await cartModel.findById(cartId)

            cart.products = products

            await cartModel.updateOne({_id: cartId}, cart)

            return "Products updated successfully"

        } catch(err) {

            console.log("Something went wrong updating products in cart: " + err)

            return "Something went wrong updating products in cart"
        }
    }

    async updateOneProductCart(cartId, productId, quantity) {

        try {

            let cart = await cartModel.findById(cartId)

            let product = cart.products.find(product => product.product == productId)

            let productIndex = cart.products.indexOf(product)

            cart.products[productIndex].quantity = quantity

            await cartModel.updateOne({_id: cartId}, cart)

            return "Product updated successfully"

        } catch(err) {

            console.log("Something went wrong updating product in cart: " + err)

            return "Something went wrong updating product in cart"
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {

            let cart = await cartModel.findById(cartId)

            let product = cart.products.find(product => product.product == productId)

            let productIndex = cart.products.indexOf(product)

            cart.products.splice(productIndex, 1)

            await cartModel.updateOne({_id: cartId}, cart) 

            return "Product deleted successfully"

        } catch(err) {

            console.log("Something went wrong deleting product: " + err)

            return "Something went wrong deleting product"
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {

            let cart = await cartModel.findById(cartId)

            cart.products = []

            await cartModel.updateOne({_id: cartId}, cart)

            return "Products deleted successfully"

        } catch(err) {

            console.log("Something went wrong deleting product: " + err)

            return "Something went wrong deleting products"
        }
    }

}

const cartManager = new CartManager()

module.exports = {
    cartManager
}
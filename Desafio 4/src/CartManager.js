const fs = require('fs')

class CartManager {

    constructor(path) {
        this.carts = []
        this.path = path
    }

    addProductToCart(cartId, productId) {
        
        this.carts = this.getCarts()
            
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
        }
    
    
    }

    getCartById(cartId) {

        this.carts = this.getCarts()

        try {
            var cart = this.carts.filter((cart) => {
                if (cart.id == cartId) {
                    return cart
                } 
            })
        } catch(err) {
            throw new Error("Error getting cart by id")
        }
        
        return cart.length > 0 ? cart : "Cart id Not found"
    }

    getCarts() {
        try {
            var carts = fs.readFileSync(this.path, "utf-8")
            if(!carts)
                return []
            carts = JSON.parse(carts)
        } catch(err) {
            throw new Error("Error getting carts")
        }
        return carts
    }

    #getLastId(carts) {
        try {
            if(carts.length == 0)
                return 0
            var lastElement = carts[(carts.length - 1)]
        } catch (err) {
            throw new Error("Error getting last cart id")
        }
        return lastElement.id + 1
    }

    #checkParamsAddCartCorrect(cart) {

        if (cart.id == "" || cart.id == null) {
            return [false, "Param 'id' is mandatoy"]
        }

        if (cart.products == "" || cart.products == null) {
            return [false, "Param 'products' is mandatoy"]
        }

        if (cart.products.id == "" || product.products.id == null) {
            return [false, "Param 'products.id' is mandatoy"]
        }

        return [true]
            
    }

}

const cartManager = new CartManager("./carts.json")

module.exports = {
    cartManager
}
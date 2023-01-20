const fs = require('fs')

class ProductManager{

    constructor(path) {
        this.products = []
        this.path = path
    }

    addProduct(product){

        this.products = this.getProducts()
        
        const checkParamResponse = this.#checkParamsAddProductCorrect(product)

        if(checkParamResponse[0]) {
            
            try {

                product.id = this.#getLastId(this.products)

                this.products.push(product)

                fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))

                return "Product added successfully"
                
            } catch(err) {
                console.log(err)
                throw new Error("Error adding product")
            }
        }

        return checkParamResponse

    }

    getProducts() {
        try {
            var products = fs.readFileSync(this.path, "utf-8")
            if(!products)
                return []
            products = JSON.parse(products)
        } catch(err) {
            console.log(err)
            throw new Error("Error getting products")
        }
        return products
    }

    getProductById(productId){
        this.products = this.getProducts()
        try {
            var product = this.products.filter((product) => {
                if (product.id == productId) {
                    return product
                } 
            })
        } catch(err) {
            throw new Error("Error getting product by id")
        }
        
        return product.length > 0 ? product : "Id Not found"
    }

    getProductByCode(productCode){
        this.products = this.getProducts()
        try {
            var product = this.products.filter((product) => {
                if (product.code == productCode) {
                    return product
                } 
            })
        } catch(err) {
            throw new Error("Error getting product by code")
        }
        return product.length > 0 ? product : "Code Not found"
    }

    updateProduct(productId, productUpdate){
        this.products = this.getProducts()
        try {
            const updateProductPosition = this.products.findIndex(prod => prod.id == productId)
            if(updateProductPosition != -1) {
                if(this.#isCodeRepeated(this.products, productUpdate)) {
                    var productCodeRepeated = this.getProductByCode(productUpdate.code)
                    if(productCodeRepeated[0].id != this.products[updateProductPosition].id) {
                        return "You cannot update a product with distinct id and code repeated in another product"
                    }
                }
                productUpdate = {id : this.products[updateProductPosition].id, ...productUpdate}
                this.products.splice(updateProductPosition, 1, productUpdate)
                fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
                return "Product update succesfully"
            } else { 
                return "Product doesn't exist to update"
            }
        
        } catch(err) {
            throw new Error("Error getting product by code")
        }
    }

    deleteProduct(productId){
        this.products = this.getProducts()
        try {
            const indexOfItemToRemove = this.products.findIndex(prod => prod.id == productId)
            if(indexOfItemToRemove != -1){
                this.products.splice(indexOfItemToRemove, 1)
                fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
                return "Product delete succesfully"
            } else {
                return "Product id doesn't exist to remove"
            }
            } catch(err) {
            throw new Error("Error getting product by code")
        }
    }

    #checkParamsAddProductCorrect(product) {

        if (product.title == "" || product.title == null) {
            return [false, "Param 'title' is mandatoy"]
        }

        if (product.description == "" || product.description == null) {
            return [false, "Param 'description' is mandatoy"]
        }

        if (product.price == "" || product.price == null) {
            return [false, "Param 'price' is mandatoy"]
        }
        
        if (product.stock == "" || product.stock == null) {
            return [false, "Param 'stock' is mandatoy"]
        }

        if (product.code == null) {
            return [false, "Param 'code' is mandatoy"]
        }

        if (product.status != true && product.status != false) {
            return [false, "Param 'status' is mandatoy"]
        }

        if (product.category == "" || product.category == null) {
            return [false, "Param 'category' is mandatoy"]
        }

        // Verificar codigo repetido
        if(this.#isCodeRepeated(this.products, product)){
            return [false, "Param 'code' is repeated"]
        }
        // Verificar codigo repetido
            
        return [true]
            
    }

    // method read and write file products

    #getLastId(products) {
        try {
            if(products.length == 0)
                return 0
            var lastElement = products[(products.length - 1)]
        } catch (err) {
            throw new Error("Error getting last product id")
        }
        return lastElement.id + 1
    }

    #isCodeRepeated(products, product) {
        try {
            var prod_result = products.filter((product_iter) => {
                if (product_iter.code == product.code) {
                    return product
                } 
            })
    
            if (prod_result.length > 0) {
                return true
            }
        } catch(err) {
            throw new Error("Error validating code repeated")
        }

        return false
    }

}

const productManager = new ProductManager("../products.json")

module.exports = {
    productManager
}

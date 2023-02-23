/* const fs = require('fs') */
const {productModel} = require('./models/product.model');

class ProductManager{

/*     constructor(path) {
        this.products = []
        this.path = path
    }
 */
    async addProduct(product){
        const checkParamResponse = await this.#checkParamsAddProductCorrect(product)
        if(checkParamResponse[0]) {
            await productModel.create(product)
            return "Product added successfully"
        }
        return checkParamResponse[1]
    /*
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

        return checkParamResponse */

    }

    async getProducts(limit, page, query, sort) {

        let parameterPaginate = {
            "limit": 10,
            "page": 1,
            "query": {},
            "sort": {
                "price": undefined
            }
        }

        if(limit && limit != "undefined")
            parameterPaginate.limit = limit
        if(page && page != "undefined")
            parameterPaginate.page = page
        if(query && query != "undefined")
            parameterPaginate.query = (query) ? JSON.parse(query) : {}
        if(sort && sort != "undefined")
            parameterPaginate.sort["price"] = sort

        let queryParameter  = parameterPaginate.query
        delete parameterPaginate.query 
        parameterPaginate.lean = true

        try {
            
            let productsPaginate = await productModel.paginate(queryParameter, parameterPaginate)
            
            productsPaginate.nextLink = productsPaginate.hasNextPage ? "http://localhost:8080/products?limit="+limit+"&page="+productsPaginate.nextPage+"&query="+query+"&sort="+sort : null
            
            productsPaginate.prevLink = productsPaginate.hasPrevPage ?"http://localhost:8080/products?limit="+limit+"&page="+productsPaginate.prevPage+"&query="+query+"&sort="+sort : null
            
            return productsPaginate;

        } catch (error) {
            console.log("Something went wrong getting products: "+error)
            return "Something went wrong getting products";
        }
        /* try {
            var products = fs.readFileSync(this.path, "utf-8")
            if(!products)
                return []
            products = JSON.parse(products)
        } catch(err) {
            console.log(err)
            throw new Error("Error getting products")
        }
        return products */
    }

    async getProductById(productId){
        try {
            let productFound = await productModel.findOne({_id: productId})
            if(!productFound) {
                return "Product id not found"
            } else {
                return productFound;
            }
        } catch (error) {
            console.log(error);
        }
/*         this.products = this.getProducts()
        try {
            var product = this.products.filter((product) => {
                if (product.id == productId) {
                    return product
                } 
            })
        } catch(err) {
            throw new Error("Error getting product by id")
        }
        */
    }

    async getProductByCode(productCode){
        let productFound = await productModel.findOne({code: productCode})
        return productFound
        /* try {
             if(!productFound) {
                throw new Error("Not found");
            } else {
                return productFound;
            }
        } catch (error) {
            console.log(error);
        } 
        this.products = this.getProducts()
        try {
            var product = this.products.filter((product) => {
                if (product.code == productCode) {
                    return product
                } 
            })
        } catch(err) {
            throw new Error("Error getting product by code")
        } */
    }

    async updateProduct(productId, productUpdate){
        try {
            let productFound = await productModel.findOne({_id: productId});
            if(!productFound)
                return "Product doesn't exist to update"
            else {
                if(this.#checkParamsAddProductCorrect(productUpdate)){ 
                    await productModel.updateOne({_id: productId}, productUpdate);
                    return "Product update succesfully"
                }
            }
        } catch (error) {
            throw new Error("Product not found");
        }
        /* this.products = this.getProducts()
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
        } */
    }

    async deleteProduct(productId){
        try {
            let productFound = await productModel.findOne({_id: productId});
            if(!productFound) throw new Error("Product not found")
            else {
                await productModel.deleteOne({_id: productId});
                return "Product delete succesfully"
            }
        } catch (error) {
            console.log(error);
        }
      /*   this.products = this.getProducts()
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
        } */
    }

    async #checkParamsAddProductCorrect(product) {

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
        let response = await this.#isCodeRepeated(product)
        if(response){
            return [false, "Param 'code' is repeated"]
        } 
        // Verificar codigo repetido
            
        return [true]
            
    }

    // method read and write file products

    async #isCodeRepeated(product) {
        try {
            let productFound = await productModel.find({ code: product.code})
            if(productFound.length > 0)
                return true
            /* var prod_result = products.filter((product_iter) => {
                if (product_iter.code == product.code) {
                    return product
                } 
            })
    
            if (prod_result.length > 0) {
                return true
            } */
        } catch(err) {
            throw new Error("Error validating code repeated")
        }

        return false
    }

}

const productManager = new ProductManager()

module.exports = {
    productManager
}

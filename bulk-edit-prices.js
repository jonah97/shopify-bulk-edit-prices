const request = require('request')
const dotenv = require('dotenv')

dotenv.config()

const options = {
    url: process.env.SHOPIFY_ACCESS_URL_PRODUCTS
}

let raisedAmount = 0

function getProducts() {
    return new Promise((resolve, reject) => {
        request.get(options, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let data = JSON.parse(body)

                let products = []

                class Product {
                    constructor(id) {
                        this.id = id
                        this.variants = []
                    }
                }

                class Variant {
                    constructor(id, price) {
                        this.id = id
                        this.price = price
                    }
                }

                for (let i = 0; i < data.products.length; i++) {
                    products[i] = new Product(data.products[i].id)

                    for (let j = 0; j < data.products[i].variants.length; j++) {
                        products[i].variants[j] = new Variant(
                            data.products[i].variants[j].id,
                            parseFloat(data.products[i].variants[j].price)
                        )
                    }
                }
                resolve(products)
            } else {
                reject(err)
            }
        })
    })
}

getProducts().catch((err) => {
    console.error(err)
}).then((products) => {

    for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < products[i].variants.length; j++) {
            products[i].variants[j].price += raisedAmount
        }
    }
    console.log(products)
    putProducts(products)
})

function putProducts(editedProducts) {

    let i = 0

    function req() {
        const options = {
            url: process.env.SHOPIFY_ACCESS_URL_UPDATE_PRODUCTS + editedProducts[i].id + '.json',
            body: JSON.stringify(editedProducts[i])
        }

        request.put(options, (err, response) => {
            if (!err && response.statusCode == 200) {
                console.log(`successfully updated ${editedProducts[i].id}`)
                i++
                if (i < editedProducts.length) {
                    req()
                }
                if (i == editedProducts.length) {
                    console.log('updated all Products')
                }
            } else {
                console.error(err)
            }
        })
    }
    req()
}
const request = require('request')
const dotenv = require('dotenv')

dotenv.config()

const options = {
    url: process.env.SHOPIFY_ACCESS_URL_PRODUCTS
}

let raisedAmount = 100

function getProducts() {
    return new Promise((resolve, reject) => {
        request.get(options, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let data = JSON.parse(body)

                let products = []

                class Product {
                    constructor(id, variants) {
                        this.id = id
                        this.variants = variants
                        this.prices = []
                    }
                }

                for (let i = 0; i < data.products.length; i++) {
                    products.push(new Product(data.products[i].id, data.products[i].variants.length))

                    for (let j = 0; j < data.products[i].variants.length; j++) {
                        products[i].prices.push(parseFloat(data.products[i].variants[j].price))
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
        for (let j = 0; j < products[i].prices.length; j++) {
            products[i].prices[j] += raisedAmount
        }
    }

    console.log(products)
})
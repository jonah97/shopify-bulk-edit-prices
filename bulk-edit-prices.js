const request = require('request')
const dotenv = require('dotenv')

dotenv.config()

const options = {
    url: process.env.SHOPIFY_ACCESS_URL_PRODUCTS
}

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
                products[i].prices.push(data.products[i].variants[j].price)
            }
        }

        console.log(products)
    }
})
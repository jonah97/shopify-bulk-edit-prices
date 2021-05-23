const request = require('request')
const dotenv = require('dotenv')

dotenv.config()

// -- VARIABLES

let collectionProducts = []
let stats = []

class Hit {
    constructor(product, price) {
        this.product = product
        this.price = price
    }
}


// -- get the Products from specified Collection
const optionsForCollections = {
    url: process.env.SHOPIFY_ACCESS_URL_GET_COLLECTION
}

request.get(optionsForCollections, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        let data = JSON.parse(body)

        data.products.forEach((value) => {
            collectionProducts.push(value.id)
        })
        console.log(collectionProducts)
    }
})

// -- get all Orders from the past 7 Days
let d = new Date;
d.setDate(d.getDate() - 7)
let param = d.toISOString()
param = param.slice(0, param.length - 5) + '-04:00'

const optionsForOrders = {
    url: process.env.SHOPIFY_ACCESS_URL_GET_ORDERS,
    qs: {
        financial_status: 'paid',
        created_at_min: param,
        limit: 250
    }
}

request.get(optionsForOrders, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        let data = JSON.parse(body)

        console.log(data.orders.length)

        checkForProductsFromCollection(data.orders)
    }
})

function checkForProductsFromCollection(orders) {
    for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < collectionProducts.length; j++) {
            if (orders[i].line_items.id == collectionProducts[j]) {
                stats.push(new Hit(orders[i].line_items.id, orders[i].line_items.price))
            }
        }
    }
    console.log(stats)
}
const db = require('../config/config')

const OrderHasProducts = {}
 
OrderHasProducts.create = (id_order,id_product, quantity) => {
    const sql = `
        UPDATE products SET cantidad = cantidad - $3
         WHERE ID = $2;

        INSERT INTO orders_has_products (id_order,id_product,quantity, CREATE_AT, UPDATE_AT)
        VALUES ($1,$2,$3,$4,$5)
    `;
    return db.none(sql, [
        id_order,
        id_product, 
        quantity,
        new Date(),
        new Date()
    ])
}

module.exports = OrderHasProducts
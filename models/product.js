const db = require('../config/config')

const Product = {}

Product.findByCategory = (id_category, id_user, cantidad) => {
    const sql =`
  SELECT P.ID, P.NAME, P.DESCRIPTION, 
         PRICE, IMAGE1, 
         IMAGE2, IMAGE3, 
         ID_CATEGORY,U.NAME as TIENDA,
         U.ID as ID_TIENDA,p.id_user as iduser,cantidad,c.name as nameCategoria
    FROM PRODUCTS AS P INNER JOIN CATEGORIES AS C ON P.ID_CATEGORY = C.ID
	                   INNER JOIN USERS U ON P.ID_USER = U.ID
   WHERE C.ID=$1
     AND U.ID=$2
     AND p.cantidad != $3
    `;
    return db.manyOrNone(sql, [id_category, id_user, cantidad]);
}
Product.findByCategoryAndProductName = (id_category, id_user, product_name, cantidad) => {
    const sql =`
    SELECT P.ID, P.NAME, P.DESCRIPTION, PRICE, IMAGE1, IMAGE2, IMAGE3, ID_CATEGORY,p.id_user as iduser,cantidad,c.name as nameCategoria
      FROM PRODUCTS AS P INNER JOIN CATEGORIES AS C ON P.ID_CATEGORY = C.ID
     WHERE C.ID=$1
       AND P.ID_USER= $2
       AND P.NAME ILIKE $3
       AND p.cantidad != $4
    `;
    return db.manyOrNone(sql, [id_category, id_user, `%${product_name}%`, cantidad]);
}
Product.create = (product) => {
    const sql=`
    INSERT INTO products(
        name, description, price, image1, image2, image3, id_category, create_at, update_at,id_user,cantidad, pricecompra)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING ID
    `;
    return db.oneOrNone(sql, [
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date(),
        new Date(),
        product.iduser,
        product.cantidad,
        product.preciocosto
    ])
}
Product.update = (product) => {
    const sql=`
    UPDATE PRODUCTS SET NAME=$2, DESCRIPTION = $3, PRICE=$4, IMAGE1= $5, IMAGE2= $6, IMAGE3= $7, ID_CATEGORY=$8, UPDATE_AT=$9
    WHERE ID=$1
    `;
    return db.none(sql, [
        product.id,
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date()
    ])
}
Product.updateproducto = (product) => {
    const sql=`
    UPDATE PRODUCTS SET NAME=$2, DESCRIPTION = $3, PRICE=$4, IMAGE1= $5, IMAGE2= $6, IMAGE3= $7, UPDATE_AT=$8,cantidad=$9
    WHERE ID=$1
    `;
    return db.none(sql, [
        product.id,
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        new Date(),
        product.cantidad
    ])
}

module.exports = Product
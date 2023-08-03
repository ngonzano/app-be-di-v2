const db = require('../config/config')

const Category= {}

Category.getAll = (idUser) => {
    const sql = `
    SELECT c.ID, UPPER(c.NAME) as NAME, c.DESCRIPTION,c.image 
      FROM CATEGORIES c 
     WHERE id_user=$1
     ORDER BY NAME
    `;
    return db.manyOrNone(sql, idUser);
}
Category.getAllBuscar = (idUser, productname) => {
    const sql = `
    SELECT c.ID, UPPER(c.NAME) as NAME, c.DESCRIPTION,c.image 
          FROM CATEGORIES c inner join products p on c.id = p.id_category
         WHERE c.id_user=$1
           and P.NAME ILIKE $2
         GROUP BY c.ID
         ORDER BY NAME
    `;
    return db.manyOrNone(sql, [idUser,`%${productname}%`]);
}
Category.getAllStock = (idUser, productname) => {
    const sql = `
    SELECT c.ID, UPPER(c.NAME) as NAME, c.DESCRIPTION,c.image 
          FROM CATEGORIES c inner join products p on c.id = p.id_category
         WHERE c.id_user=$1
           AND P.CANTIDAD <> 0
           and P.NAME ILIKE $2
         GROUP BY c.ID
         ORDER BY NAME
    `;
    return db.manyOrNone(sql, [idUser,`%${productname}%`]);
}
Category.getAllStockSinBuscar = (idUser) => {
    const sql = `
    SELECT c.ID, UPPER(c.NAME) as NAME, c.DESCRIPTION,c.image 
          FROM CATEGORIES c inner join products p on c.id = p.id_category
         WHERE c.id_user=$1
           AND P.CANTIDAD <> 0
         GROUP BY c.ID
         ORDER BY NAME
    `;
    return db.manyOrNone(sql, idUser);
}
Category.create = (category) => {
    const sql=`
        INSERT INTO CATEGORIES (NAME, DESCRIPTION, CREATE_AT, UPDATE_AT, id_user)
        VALUES ($1, $2, $3, $4, $5) RETURNING ID
    `;
    return db.oneOrNone(sql, [
        category.name,
        category.description,
        new Date(),
        new Date(),
        category.idtienda
    ])
}

module.exports=Category

// SELECT c.ID, UPPER(c.NAME) as NAME, c.DESCRIPTION,c.image 
//       FROM CATEGORIES c inner join products p on c.id = p.id_category
//      WHERE c.id_user=$1
//        AND P.CANTIDAD <> 0 
//      GROUP BY c.ID
//      ORDER BY NAME
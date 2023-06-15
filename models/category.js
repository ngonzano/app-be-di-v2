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
Category.getAllStock = (idUser) => {
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
        INSERT INTO CATEGORIES (NAME, DESCRIPTION, CREATE_AT, UPDATE_AT, id_user,image)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID
    `;
    return db.oneOrNone(sql, [
        category.name,
        category.description,
        new Date(),
        new Date(),
        category.idtienda,
        category.image
    ])
}

module.exports=Category

// SELECT c.ID, UPPER(c.NAME) as NAME, c.DESCRIPTION,c.image 
//       FROM CATEGORIES c inner join products p on c.id = p.id_category
//      WHERE c.id_user=$1
//        AND P.CANTIDAD <> 0 
//      GROUP BY c.ID
//      ORDER BY NAME
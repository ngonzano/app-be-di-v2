const db = require('../config/config')

const Category= {}

Category.getAll = (idUser) => {
    const sql = `
        SELECT ID, UPPER(NAME) as NAME, DESCRIPTION,image 
          FROM CATEGORIES
         WHERE id_user=$1
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
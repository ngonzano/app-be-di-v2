const db = require('../config/config')
const Yape = {}

// Yape.findByuUser = (id_user) => {
//     const sql = `
//         SELECT ID, ID_USER, ADDRESS, NEIGHBORHOOD, LAT, LNG, istienda, isdelivery
//           FROM ADDRESS
//          WHERE disponibilidad = true
//            AND ID_USER = $1
//     `;
//     return db.manyOrNone(sql, id_user)
// }
// //buscar direccion de la tienda
// Yape.buscarDireccionTienda = (idTienda) => {
//     const sql = `
//     SELECT id, id_user, address, neighborhood, lat, lng, create_at, update_at, disponibilidad, istienda
// 	  FROM public.address
//      WHERE id_user = $1
//        AND istienda = TRUE
//     `;
//     return db.oneOrNone(sql, idTienda)
// }
// Yape.buscarDireccionDelivery = () => {
//     const sql = `
//     SELECT id, id_user, address, neighborhood, lat, lng, create_at, update_at, disponibilidad, isdelivery
// 	  FROM public.address
//      WHERE isdelivery = true
//     `;
//     return db.manyOrNone(sql)
// }

Yape.updateDevolucion = (idTienda,idOrder, idyapedevolucion) => {
    const sql= `
    UPDATE ORDERS SET idyapedevolucion = $3
     WHERE ID = $2
       AND ID_TIENDA = $1
    `;
    return db.none(sql, [idTienda,idOrder, idyapedevolucion])
}
// Yape.updAddressTienda = (idadrees, idtienda) => {
//     const sql= `
//     UPDATE ADDRESS SET istienda = true
//      WHERE ID = $1
//        AND id_user = $2;

//     UPDATE ADDRESS SET istienda = false
//      WHERE ID != $1
//        AND id_user = $2;
//     `;
//     return db.none(sql, [idadrees, idtienda])
// }
// Yape. updAddressDelivery = (idadrees, iddelivery) => {
//     const sql= `
//     UPDATE ADDRESS SET isdelivery = true
//      WHERE ID = $1
//        AND id_user = $2;

//     UPDATE ADDRESS SET isdelivery = false
//      WHERE ID != $1
//        AND id_user = $2;
//     `;
//     return db.none(sql, [idadrees, iddelivery])
// }
// Yape.create = (address) => {
//     const sql = `
//         INSERT INTO ADDRESS (ID_USER, ADDRESS, NEIGHBORHOOD, LAT, LNG, CREATE_AT, UPDATE_AT)
//         VALUES ($1,$2,$3,$4,$5,$6,$7)
//         RETURNING ID
//     `;
//     return db.oneOrNone(sql, [
//         address.id_user,
//         address.address,
//         address.neighborhood,
//         address.lat,
//         address.lng,
//         new Date(),
//         new Date()
//     ])
// }

module.exports = Yape
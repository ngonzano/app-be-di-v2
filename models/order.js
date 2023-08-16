const db = require('../config/config')

const Order = {}
//lista de ordenes
Order.findByStatus = (status, idTienda) => {
    const sql = `
    SELECT O.ID, O.ID_CLIENT, O.ID_ADDRESS, O.ID_DELIVERY, O.STATUS, O.TIMESTAMP, O.lat,O.lng,
		   JSON_AGG(
			   JSON_BUILD_OBJECT(
			   		'id',p.id,
				   	'name',p.name,
				   	'description', p.description,
				   	'price', p.price,
				   	'image1', p.image1,
				   	'image2', p.image2,
				   	'image3', p.image3,
				   	'quantity', ohp.quantity,
                    'estado',ohp.estado,
                    'comentario',ohp.comentario
			   )
		   ) AS products,
           JSON_BUILD_OBJECT(
                    'id', U.ID,
                    'name',U.NAME,
                    'lastname',U.LASTNAME,
                    'image',U.IMAGE,
                    'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
                    'id', U2.ID,
                    'name',U2.NAME,
                    'lastname',U2.LASTNAME,
                    'image',U2.IMAGE,
                    'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
                    'id', A.ID,
                    'address',A.ADDRESS,
                    'neighborhood',A.NEIGHBORHOOD,
                    'lat',A.LAT,
                    'lng',A.LNG
            ) AS address,
			o.create_at,
			o.update_at,
            o.status_pago,
            o.id_tienda,
            (select name ||' '|| lastname from users where id = o.id_tienda) as nombreTienda,
            (select image from users where id = o.id_tienda) as imagentienda,
            idmp,idyape,
            id_mediopago as mediopago,
            (SELECT price_delivery FROM orders_has_delivery where id_order = O.ID) as price_delivery
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE STATUS=$1
        AND P.ID_USER=$2
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
      ORDER BY O.ID DESC
    `;
    return db.manyOrNone(sql, [status,idTienda]);
}
Order.buscarOrder = (idOrden) => {
    const sql = `
    SELECT O.ID, O.ID_CLIENT, O.ID_ADDRESS, O.ID_DELIVERY, O.STATUS, O.TIMESTAMP, O.lat,O.lng,
		   JSON_AGG(
			   JSON_BUILD_OBJECT(
			   		'id',p.id,
				   	'name',p.name,
				   	'description', p.description,
				   	'price', p.price,
				   	'image1', p.image1,
				   	'image2', p.image2,
				   	'image3', p.image3,
				   	'quantity', ohp.quantity,
                    'estado',ohp.estado,
                    'comentario',ohp.comentario
			   )
		   ) AS products,
           JSON_BUILD_OBJECT(
                    'id', U.ID,
                    'name',U.NAME,
                    'lastname',U.LASTNAME,
                    'image',U.IMAGE,
                    'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
                    'id', U2.ID,
                    'name',U2.NAME,
                    'lastname',U2.LASTNAME,
                    'image',U2.IMAGE,
                    'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
                    'id', A.ID,
                    'address',A.ADDRESS,
                    'neighborhood',A.NEIGHBORHOOD,
                    'lat',A.LAT,
                    'lng',A.LNG
            ) AS address,
			o.create_at,
			o.update_at,
            o.status_pago,
            o.id_tienda,
            (select name ||' '|| lastname from users where id = o.id_tienda) as nombreTienda,
            (select image from users where id = o.id_tienda) as imagentienda,
            idmp,idyape,
            id_mediopago as mediopago,
            (SELECT price_delivery FROM orders_has_delivery where id_order = O.ID) as price_delivery
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE o.id=$1
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
      ORDER BY O.ID DESC
    `;
    return db.oneOrNone(sql, idOrden);
}
Order.listaOrdenesAnuladas = (status, idTienda) => {
    const sql = `
    SELECT O.ID, O.ID_CLIENT, O.ID_ADDRESS, O.ID_DELIVERY, O.STATUS, O.TIMESTAMP, O.lat,O.lng,
		   JSON_AGG(
			   JSON_BUILD_OBJECT(
			   		'id',p.id,
				   	'name',p.name,
				   	'description', p.description,
				   	'price', p.price,
				   	'image1', p.image1,
				   	'image2', p.image2,
				   	'image3', p.image3,
				   	'quantity', ohp.quantity,
                    'estado',ohp.estado,
                    'comentario',ohp.comentario
			   )
		   ) AS products,
           JSON_BUILD_OBJECT(
           'id', U.ID,
           'name',U.NAME,
           'lastname',U.LASTNAME,
           'image',U.IMAGE,
           'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
           'id', U2.ID,
           'name',U2.NAME,
           'lastname',U2.LASTNAME,
           'image',U2.IMAGE,
           'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
            'id', A.ID,
            'address',A.ADDRESS,
            'neighborhood',A.NEIGHBORHOOD,
            'lat',A.LAT,
            'lng',A.LNG
            ) AS address,
			o.create_at,
			o.update_at,
            o.status_pago,
            o.id_tienda,
            (select name ||' '|| lastname from users where id = o.id_tienda) as nombreTienda,
            (select image from users where id = o.id_tienda) as imagentienda,
            idmp,idyape,
            id_mediopago as mediopago,
            (SELECT price_delivery FROM orders_has_delivery where id_order = O.ID) as price_delivery
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE STATUS=$1
        AND P.ID_USER=$2
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
      ORDER BY O.ID DESC
    `;
    return db.manyOrNone(sql, [status,idTienda]);
}
Order.findByDeliveryAndStatus = (id_delivery, status) => {
    const sql = `
    SELECT O.ID, O.ID_CLIENT, O.ID_ADDRESS, O.ID_DELIVERY, O.STATUS, O.TIMESTAMP, O.lat,O.lng,
		   JSON_AGG(
			   JSON_BUILD_OBJECT(
			   		'id',p.id,
				   	'name',p.name,
				   	'description', p.description,
				   	'price', p.price,
				   	'image1', p.image1,
				   	'image2', p.image2,
				   	'image3', p.image3,
				   	'quantity', ohp.quantity,
                    'estado',ohp.estado,
                    'comentario',ohp.comentario
			   )
		   ) AS products,
           JSON_BUILD_OBJECT(
           'id', U.ID,
           'name',U.NAME,
           'lastname',U.LASTNAME,
           'image',U.IMAGE,
           'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
           'id', U2.ID,
           'name',U2.NAME,
           'lastname',U2.LASTNAME,
           'image',U2.IMAGE,
           'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
            'id', A.ID,
            'address',A.ADDRESS,
            'neighborhood',A.NEIGHBORHOOD,
            'lat',A.LAT,
            'lng',A.LNG
            ) AS address,
            o.create_at,
			o.update_at,
            o.status_pago,
            o.id_tienda,
            (select name ||' '|| lastname from users where id = o.id_tienda) as nombreTienda,
            (select image from users where id = o.id_tienda) as imagentienda,
            idmp,idyape,
            id_mediopago as mediopago,
            (SELECT price_delivery FROM orders_has_delivery where id_order = O.ID) as price_delivery
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE O.ID_DELIVERY=$1
        AND STATUS=$2
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
      ORDER BY O.ID DESC
    `;
    return db.manyOrNone(sql, [id_delivery, status]);
}
Order.findByClientAndStatus = (id_client, status) => {
    const sql = `
    SELECT O.ID, O.ID_CLIENT, O.ID_ADDRESS, O.ID_DELIVERY, O.STATUS, O.TIMESTAMP, O.lat,O.lng,
		   JSON_AGG(
			   JSON_BUILD_OBJECT(
			   		'id',p.id,
				   	'name',p.name,
				   	'description', p.description,
				   	'price', p.price,
				   	'image1', p.image1,
				   	'image2', p.image2,
				   	'image3', p.image3,
				   	'quantity', ohp.quantity,
                    'estado',ohp.estado,
                    'comentario',ohp.comentario
			   )
		   ) AS products,
           JSON_BUILD_OBJECT(
                    'id', U.ID,
                    'name',U.NAME,
                    'lastname',U.LASTNAME,
                    'image',U.IMAGE,
                    'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
                    'id', U2.ID,
                    'name',U2.NAME,
                    'lastname',U2.LASTNAME,
                    'image',U2.IMAGE,
                    'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
                    'id', A.ID,
                    'address',A.ADDRESS,
                    'neighborhood',A.NEIGHBORHOOD,
                    'lat',A.LAT,
                    'lng',A.LNG
            ) AS address,
            o.create_at,
			o.update_at,
            o.status_pago,
            o.id_tienda,
            (select name ||' '|| lastname from users where id = o.id_tienda) as nombreTienda,
            (select image from users where id = o.id_tienda) as imagentienda,
            idmp,idyape,
            id_mediopago as mediopago,
            (SELECT price_delivery FROM orders_has_delivery where id_order = O.ID) as price_delivery
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE O.ID_CLIENT=$1
        AND STATUS=$2
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
      ORDER BY O.ID DESC
    `;
    return db.manyOrNone(sql, [id_client, status]);
}
//FIN lista de ordenes
Order.create = (order, medioPago) => {
    const sql = `
        INSERT INTO ORDERS (ID_CLIENT, ID_ADDRESS, STATUS, TIMESTAMP, CREATE_AT, UPDATE_AT,STATUS_PAGO, id_tienda, id_mediopago,idmp,comision)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING ID;
    `;
    return db.oneOrNone(sql, [
        order.id_client,
        order.id_address,
        order.status,
        Date.now(),
        new Date(),
        new Date(),
        order.status_pago,
        order.id_tienda,
        medioPago,
        order.idmp,
        order.comision
    ])
}
Order.createyape = (order, medioPago) => {
    const sql = `
        INSERT INTO ORDERS (ID_CLIENT, ID_ADDRESS, STATUS, TIMESTAMP, CREATE_AT, UPDATE_AT,STATUS_PAGO, id_tienda, id_mediopago,idmp,idyape,comision)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'0',$10,$11)
        RETURNING ID;
    `;
    return db.oneOrNone(sql, [
        order.id_client,
        order.id_address,
        order.status,
        Date.now(),
        new Date(),
        new Date(),
        order.status_pago,
        order.id_tienda,
        medioPago,
        order.idyape,
        order.comision
    ])
}
Order.createPagoDelivery = (order, delivery) => {
    const sql = `
        insert into orders_has_delivery (id_order, price_delivery, create_at, update_at)
        values (
                (select max(id)
                   from orders
                  where id_client = $1
                    and id_tienda = $4 ) ,$5,$2,$3) 
        RETURNING id_or_has_de;
    `;
    return db.oneOrNone(sql, [
        order.id_client,
        new Date(),
        new Date(),
        order.id_tienda,
        delivery
    ])
}
//Anular una orden
Order.updateAnular = (order) => {
    const sql= `
    UPDATE ORDERS SET STATUS= $2, UPDATE_AT =$3
     WHERE ID = $1
    `;
    return db.none(sql, [
        order.id,
        order.status,
        new Date()
    ])
}
Order.update = (order) => {
    const sql= `
    UPDATE ORDERS SET ID_CLIENT= $2, ID_ADDRESS=$3, ID_DELIVERY = $4, STATUS= $5, UPDATE_AT =$6
     WHERE ID = $1
    `;
    return db.none(sql, [
        order.id,
        order.id_client,
        order.id_address,
        order.id_delivery,
        order.status,
        new Date()
    ])
}
Order.updatePago = (order, statuspago) => {
    const sql= `
    UPDATE ORDERS SET ID_CLIENT= $2, ID_ADDRESS=$3, ID_DELIVERY = $4, STATUS= $5, UPDATE_AT =$6, STATUS_PAGO = $7
     WHERE ID = $1
    `;
    return db.none(sql, [
        order.id,
        order.id_client,
        order.id_address,
        order.id_delivery,
        order.status,
        new Date(),
        statuspago,   
    ])
}
Order.updateLatLng = (order) => {
    const sql= `
    UPDATE ORDERS SET lat= $2, lng=$3
     WHERE ID = $1
    `;
    return db.none(sql, [
        order.id,
        order.lat,
        order.lng
    ])
}
Order.buscarOrden = (id) => {
    const sql= `
    SELECT ID, id_client, id_delivery,id_address,lat,lng,status,timestamp,create_at,update_at,status_pago,id_tienda,total
      FROM ORDERS
     WHERE ID = $1
    `
    return db.oneOrNone(sql, id);
}
Order.versionApp = (id) => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'Version'
    `
    return db.oneOrNone(sql, id);
}
//Actualiza el estado de los productos cuando la orden ya esta creada
Order.updateEstadoOrderProducto = (id_product, id_order, estado) => {
    const sql= `
    UPDATE orders_has_products SET estado= $3
     where id_order = $2
       and id_product = $1
    `;
    return db.none(sql, [
        id_product,
        id_order,
        estado
    ])
}
module.exports = Order

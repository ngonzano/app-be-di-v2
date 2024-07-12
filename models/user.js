const db = require('../config/config')
const crypto = require('crypto')

const User = {}

User.getAllTiendas = (idgiro) => {
    const sql=`
    select u.id as id_tienda,
	   u.name,u.lastname,
	   u.image,
	   u.direc_fiscal,
	   g.descripcion as giro,
       u.llegaen,
       u.desde,
       u.hasta,
	   ( CASE WHEN 
		   (select Round(avg(calificacion),1)  from evidencia where idtienda = u.id) IS null then 9999
			else (select Round(avg(calificacion),1)  from evidencia where idtienda = u.id)
		 END
	   ) as promedio,
	   ( CASE WHEN 
		   (select lat from address where id_user = u.id and istienda = true) IS null then '0'
			else (select lat from address where id_user = u.id and istienda = true)
		 END
	   ) as lat,
	   ( CASE WHEN 
		   (select lng from address where id_user = u.id and istienda = true) IS null then '0'
			else (select lng from address where id_user = u.id and istienda = true)
		 END
	   ) as lng,
       u.rango_cliente_tienda,
       u.rango_repartidor_tienda
      from users as u inner join user_has_roles as ur on u.id = ur.id_user
	                  inner join giros as g on g.idgiro = u.idgiro 
     where ur.id_rol='2'
	   and u.idgiro = $1
       and u.estado = true
	 group by u.id,g.descripcion--,a.lat,a.lng
     order by promedio desc
    `
    return db.manyOrNone(sql,idgiro)
}
User.getAllGiros = () => {
    const sql=`
    select idgiro, descripcion,image
      from giros
     where estado = true
       and descripcion != 'Persona Natural'
     order by descripcion asc
    `
    return db.manyOrNone(sql)
}
User.getAllGirosCoordenadas = () => {
    const sql=`
    select g.idgiro,g.descripcion, g.image,
       JSON_AGG(
			   JSON_BUILD_OBJECT(
	   			'idtienda', u.id,
				'idgiro', g.idgiro,
		    	'lat', a.lat,
			    'lng', a.lng,
                'rango_cliente_tienda',u.rango_cliente_tienda
	   			)
	   ) as coordenadas
     from users u inner join giros g on u.idgiro = g.idgiro
                  inner join address a on u.id = a.id_user
    where u.idgiro <> 1
      and a.disponibilidad = true
      and u.estado = true
      and a.istienda = true
    group by g.idgiro, descripcion, g.image
    order by g.idgiro
    `
    return db.manyOrNone(sql)
}
User.buscarTienda= (descripcion,idgiro) => {
    const sql= `
    select u.id as id_tienda,
           u.name,u.lastname,
           u.image,
           u.direc_fiscal,
           g.descripcion as giro,
           u.llegaen,
           u.desde,
           u.hasta,
           ( CASE WHEN 
               (select Round(avg(calificacion),1)  from evidencia where idtienda = u.id) IS null then 9999
                else (select Round(avg(calificacion),1)  from evidencia where idtienda = u.id)
             END
           ) as promedio,
           ( CASE WHEN 
               (select lat from address where id_user = u.id and istienda = true) IS null then '0'
                else (select lat from address where id_user = u.id and istienda = true)
             END
           ) as lat,
           ( CASE WHEN 
               (select lng from address where id_user = u.id and istienda = true) IS null then '0'
                else (select lng from address where id_user = u.id and istienda = true)
             END
           ) as lng,
           u.rango_cliente_tienda,
           u.rango_repartidor_tienda
     from users as u inner join user_has_roles as ur on u.id = ur.id_user
                   inner join giros as g on g.idgiro = u.idgiro 
    where ur.id_rol='2'
      and u.idgiro = $2
      and u.estado = true
      and (upper(u.name ||' '||u.lastname) ilike upper($1) or upper(g.descripcion) ilike upper($1))
    group by u.id,g.descripcion
    order by promedio desc
    `
    return db.manyOrNone(sql, [`%${descripcion}%`,idgiro]);
}
User.getUsuario = (email, cumpleanio) => {
    const sql=`
    select count(*) from users
     where email = $1
       and cumpleanio = $2  
    `
    return db.oneOrNone(sql, [
        email, cumpleanio
    ])
}
User.getPagosIzipay = (email) => {
    const sql=`
    SELECT id
      FROM izipay
     where 0=0
       and vads_effective_creation_date is not null
       and vads_cust_email = $1
     ORDER BY vads_effective_creation_date desc
     LIMIT 1
    `
    return db.oneOrNone(sql, email)
}
User.create = (user, withlogin) => {
    //ENCRYPTAR
    // console.log(`user.password: ${user.password}`);
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex')
    user.password = myPasswordHashed
    //FIN ENCRYPTAR
    const sql= `
    insert into users (
        email,name,lastname,phone,image,password,session_token,create_at,update_at,cumpleanio,correo,withlogin
    )values(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id
    `
    return db.oneOrNone(sql, [
        user.email,user.name,user.lastname,user.phone,user.image,user.password,user.session_token,new Date(),new Date(), user.cumpleanio,user.correo,withlogin
    ])
}
User.asignarRolRepartidor = (user) => {

    const sql= `
    do $$
     begin 
    	if exists (select id_delivery from tienda_has_delivery where id_delivery=$2) then
    		update tienda_has_delivery set id_tienda = $1 
             where id_delivery=$2;

            update tienda_has_delivery set estado = $3 
             where id_tienda = $1 and id_delivery=$2;

    	else
    		insert into user_has_roles (id_user, id_rol, create_at, update_at) 
        	values ($2,3,$4,$5);

        	insert into tienda_has_delivery (id_tienda, id_delivery, estado, create_at, update_at)
        	values($1,$2,$3,$4,$5);
    	end if;

        update users set documento = $6
         where id = $2;
    end $$
    `
    return db.oneOrNone(sql, [
        user.idtienda,user.idrepartidor,user.estado,new Date(),new Date(),user.dni
    ])
}
User.agregarNegocio = (user) => {
    const sql= `
            insert into user_has_roles (id_user, id_rol,create_at,update_at)
            values ((select id from users where email = $6),2,$7,$8);

    		update users set llegaen = $1, desde=$2, hasta=$3, rango_cliente_tienda= $4, rango_repartidor_tienda=$4,
                             idgiro = (select idgiro from giros where descripcion =$5)
             where email=$6;
             
            insert into datos_constantes (codigo, id_user)
            values ($9,$10);         
             
    `
    return db.oneOrNone(sql, [
        user.llegaen,user.abre,user.cierra,user.rango,user.giro,user.documento,new Date(),new Date(),user.codigo,user.id_user
    ])
}
User.createEvidencia = (evidencia) => {

    const sql= `
    insert into evidencia (
        comentario,iddelivery,idusuario,idtienda,idorder,image1,create_at
    )values(
        $1,$2,$3,$4,$5,$6,$7) returning id
    `
    return db.oneOrNone(sql, [
        evidencia.comentario,evidencia.iddelivery,evidencia.idusuario,evidencia.idtienda,evidencia.idorder,evidencia.image1,new Date()
    ])
}
User.mostrarEvidencia = (idorder, iduser,iddelivery,idtienda) => {
    const sql=`
    select u.name as usuario, d.name as delivery,t.name as tienda,o.id as idorder, e.comentario,e.image1,comentariousuario,calificacion
      from evidencia e inner join users u on u.id = e.idusuario
                          inner join users d on d.id = e.iddelivery
						  inner join users t on t.id = e.idtienda
						  inner join orders o on o.id = e.idorder
	where e.idorder = $1
      and u.id = $2
      and d.id = $3
      and t.id = $4
    `
    return db.oneOrNone(sql, [
        idorder,iduser,iddelivery,idtienda
    ])
}
User.updateUserPass = (user) => {
    //ENCRYPTAR
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex')
    user.password = myPasswordHashed
    //FIN ENCRYPTAR
    const sql= `
    update users set password = $4, update_at = $3
     where email = $2
       and cumpleanio = $1
    `
    return db.none(sql, [
        user.cumpleanio, user.email, new Date(), user.password
    ])
}
User.update = (user) => {
    const sql = ` 
    UPDATE USERS SET NAME = $2, LASTNAME=$3, PHONE=$4, IMAGE= $5, UPDATE_AT=$6
    WHERE ID=$1 
    `;
    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ])
}
User.getAdminsNotificationTokens = (iduser) =>{
    const sql =`
    SELECT U.NOTIFICATION_TOKEN 
      FROM USERS AS U INNER JOIN USER_HAS_ROLES AS UHR ON UHR.ID_USER=U.ID
                      INNER JOIN ROLES AS R ON R.ID = UHR.ID_ROL
					  INNER JOIN products AS P ON P.id_user = U.id
     WHERE R.ID = 2
	   AND U.NOTIFICATION_TOKEN IS NOT NULL
	   AND P.id_user=$1
	 LIMIT 1
    `;
    return db.manyOrNone(sql,iduser);
}
User.listarTodosTokens = () =>{
    const sql =`
    SELECT U.NOTIFICATION_TOKEN 
      FROM USERS u
     WHERE U.NOTIFICATION_TOKEN IS NOT NULL
    `;
    return db.manyOrNone(sql);
}
User.listarTokenTiendaCliente = () =>{
    const sql =`
    select u.email as id_user,
           u.name,u.lastname,
           ( CASE WHEN 
               (select lat from address where id_user = u.id and disponibilidad = true limit 1) IS null then '999999'
                else (select lat from address where id_user = u.id and disponibilidad = true limit 1)
             END
           ) as lat,
           ( CASE WHEN 
               (select lng from address where id_user = u.id and disponibilidad = true limit 1) IS null then '999999'
                else (select lng from address where id_user = u.id and disponibilidad = true limit 1)
             END
           ) as lng,
		   u.notification_token
     from users as u inner join user_has_roles as ur on u.id = ur.id_user
    where ur.id_rol='1'
	  and u.notification_token is not null
    group by u.id
    `;
    return db.manyOrNone(sql);
}
User.findByPhone = (phone) => {
    const sql= `
    SELECT u.ID,EMAIL,u.NAME,LASTNAME,u.IMAGE,PHONE,PASSWORD,SESSION_TOKEN,notification_token,is_available,idgiro,u.correo,
          json_agg(
              json_build_object(
                      'id', r.id,
                   'name', r.name,
                   'image', r.image,
                   'route', r.route
              )
          ) as roles		
    FROM USERS as u inner join user_has_roles as uhr on u.id=uhr.id_user
                     inner join roles r on uhr.id_rol=r.id 
    WHERE u.PHONE = $1
      AND estado = true
    group by u.id
    `
    return db.oneOrNone(sql, phone);
}
User.findByEmail = (correo) => {
    const sql= `
    SELECT u.ID,EMAIL,u.NAME,LASTNAME,u.IMAGE,PHONE,PASSWORD,SESSION_TOKEN,notification_token,is_available,idgiro,u.correo,
    json_agg(
        json_build_object(
                'id', r.id,
             'name', r.name,
             'image', r.image,
             'route', r.route
        )
    ) as roles		
FROM USERS as u inner join user_has_roles as uhr on u.id=uhr.id_user
                 inner join roles r on uhr.id_rol=r.id 
WHERE u.correo = $1
  AND estado = true
group by u.id
    `
    return db.oneOrNone(sql, correo);
}
User.findByOrden = (email) => {
    const sql = `
    SELECT MAX(id) as id FROM orders
     WHERE id_client = $1
    `;
    return db.oneOrNone(sql, email);
}
User.findByDeliveryMen = (idTienda) => {
    const sql= `
    SELECT u.ID,
       EMAIL,
	   u.NAME,
	   LASTNAME,
	   u.IMAGE,
	   PHONE,
	   PASSWORD,
	   SESSION_TOKEN,
	   notification_token,
	   ( 
        case 
		    when (select lat from address a where isdelivery = true and a.id_user= u.id) is null then 9999999
			else (select lat from address a where isdelivery = true and a.id_user= u.id)
		end
	   ),
	   ( 
        case 
		    when (select lng from address a where isdelivery = true and a.id_user= u.id) is null then 9999999
			else (select lng from address a where isdelivery = true and a.id_user= u.id)
		end
	   ),
       u.rango_cliente_tienda,
       u.rango_repartidor_tienda
    FROM USERS AS U INNER JOIN USER_HAS_ROLES AS UHR ON UHR.ID_USER = U.ID
                    INNER JOIN ROLES AS R ON R.ID = UHR.ID_ROL
					INNER JOIN TIENDA_HAS_DELIVERY AS td on td.id_delivery = u.id
    WHERE R.ID = 3
      AND U.is_available = true
      and td.estado = true
	  and td.id_tienda = $1
    `;
    return db.manyOrNone(sql,idTienda);
}
User.findByUserId= (id) => {
    const sql= `
    SELECT u.ID,EMAIL,u.NAME,LASTNAME,u.IMAGE,PHONE,PASSWORD,SESSION_TOKEN,notification_token,is_available as estado,u.correo,
    json_agg(
        json_build_object(
                'id', r.id,
             'name', r.name,
             'image', r.image,
             'route', r.route
        )
    ) as roles		
    FROM USERS as u inner join user_has_roles as uhr on u.id=uhr.id_user
                     inner join roles r on uhr.id_rol=r.id 
    WHERE u.ID = $1
    group by u.id
    `
    return db.oneOrNone(sql, id);
}
User.findById = (id, callback) => {
    const sql= `
        SELECT ID, EMAIL, NAME, LASTNAME, IMAGE, PHONE, PASSWORD, SESSION_TOKEN,notification_token,correo
          FROM USERS
        WHERE ID = $1
    `
    return db.oneOrNone(sql, id).then(user => {callback(null, user)})
}
User.buscarRepartidor = (id) => {
    const sql= `
    SELECT u.ID, EMAIL, NAME, LASTNAME,	IMAGE, PHONE, PASSWORD, SESSION_TOKEN,notification_token,
        (
        case 
            when 
             (select estado from tienda_has_delivery where id_delivery=u.id) is null then false
              else (select estado from tienda_has_delivery where id_delivery=u.id)
            end ) as estado_delivery, 
        rango_cliente_tienda,
        ( 
        case 
            when (select lat from address a where istienda = true and a.id_user= u.id) is null then 9999999
            else (select lat from address a where istienda = true and a.id_user= u.id)
        end ) as lat,
        ( 
        case 
            when (select lng from address a where istienda = true and a.id_user= u.id) is null then 9999999
            else (select lng from address a where istienda = true and a.id_user= u.id)
        end ) as lng,
        documento as dni
        FROM USERS as u
        WHERE email = $1
    `
    return db.oneOrNone(sql, id)
}
User.buscarUsuario = (id) => {
    const sql= `
        SELECT count(*)
          FROM USERS
        WHERE email = $1
    `
    return db.oneOrNone(sql, id);
}
User.buscarTelefono = (phone) => {
    const sql= `
        SELECT count(*)
          FROM USERS
         WHERE phone = $1
    `
    return db.oneOrNone(sql, phone);
}
User.buscarCorreo = (correo) => {
    const sql= `
        SELECT count(*)
          FROM USERS
         WHERE correo = $1
    `
    return db.oneOrNone(sql, correo);
}
User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex')
    if (myPasswordHashed === hash) {
        // console.log(`${myPasswordHashed} - ${hash} - true`)
        return true
    }
    // console.log(`${myPasswordHashed} - ${hash} - 'false`)
    return false
}
User.updateToken = (id, token) => {
    const sql = ` 
    UPDATE USERS SET SESSION_TOKEN= $2
    WHERE ID=$1 
    `;
    return db.none(sql, [
        id,
        token
    ])
}
User.updateNotificationToken = (id, token) => {
    const sql = ` 
    UPDATE USERS SET NOTIFICATION_TOKEN= $2
    WHERE ID=$1 
    `;
    return db.none(sql, [
        id,
        token
    ])
}
User.getUserNotificationToken = (id) => {
    const sql = `
    SELECT
        U.notification_token
    FROM 
        users AS U
    WHERE
        U.id = $1
    `
    return db.oneOrNone(sql, id);
}
User.updateDelivery = (iduser, estado) => {
    const sql= `
    update users set is_available = $2
     where id = $1
    `;
    return db.none(sql, [iduser, estado])
}
User.eliminarUsuario = (id) => {
    const sql= `
    update users set estado = false
    where id =  $1
    `;
    return db.none(sql, id)
}
User.actualizarComentario = (idorder, comentariousuario, calificacion) => {
    const sql= `
    update evidencia set comentariousuario = $2, calificacion = $3
     where idorder = $1
    `;
    return db.none(sql, [idorder, comentariousuario, calificacion])
}
User.buscarConst = (codigo, idUser) => {
    const sql= `
    select priceDelivery, imageDelivery, publicKey_mp, accessToken_mp, yape_token_key, yape_op_key 
      from datos_constantes 
     where codigo=$1
       and id_user = $2
    `
    return db.oneOrNone(sql, [codigo, idUser]);
}
User.versionApp = () => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'Version'
    `
    return db.oneOrNone(sql);
}
User.telefonoEmp = () => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'telefono_emp'
    `
    return db.oneOrNone(sql);
}

//SMS
User.smsIdPlanServicio = () => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'idPlanServicio'
    `
    return db.oneOrNone(sql);
}
User.smsCredential = () => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'smsCredential'
    `
    return db.oneOrNone(sql);
}

User.urlSinch = () => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'urlSinch'
    `
    return db.oneOrNone(sql);
}
User.fromSms = () => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'fromSms'
    `
    return db.oneOrNone(sql);
}
User.bodySms = () => {
    const sql= `
    SELECT ID, descripcion, mensaje, estado
      FROM configuracion
     WHERE descripcion = 'body_sms'
    `
    return db.oneOrNone(sql);
}
//fin SMS

//card
User.getAllCardClient = (idClient) => {
    const sql=`
    select id, id_client, expiration_year, expiration_month, card_number, document_type, document_number, nombre, estado, card_brand, card_type
      from datos_card
     where id_client = $1
       and estado = true
     order by id asc
    `
    return db.manyOrNone(sql,idClient)
}

User.getBuscarCardClient = (idClient, cardNumber) => {
    const sql=`
    select id, id_client, expiration_year, expiration_month, card_number, document_type, document_number, nombre, estado, card_brand, card_type
      from datos_card
     where id_client = $1
       and card_number = $2
       and estado = true
     order by id asc
    `
    return db.manyOrNone(sql,[idClient,cardNumber])
}

User.createCardClient = (card) => {

    const sql= `
    insert into datos_card (
        id_client, expiration_year, expiration_month, card_number, document_type, document_number, nombre,card_brand, card_type
    )values(
        $1, $2, $3, $4, $5, $6, $7,$8, $9
        ) returning id
    `
    return db.oneOrNone(sql, [
        card.id_client,
        card.expiration_year,
        card.expiration_month,
        card.card_number,
        card.document_type,
        card.document_number,
        card.nombre,
        card.card_brand,
        card.card_type
    ])
}

User.disenableCard = (iduser, cardNumber) => {
    const sql= `
    update datos_card set estado = false
     where id_client = $1
       and card_number = $2
    `;
    return db.none(sql, [iduser, cardNumber])
}
//fin card

//chat
User.crearChat = (idClient, idSoporte,tipo) => {
    const sql= `
            insert into chat (idclient,idsoporte,create_at,tipo)
            values ($1 , $2, $3, $4);              
    `
    return db.oneOrNone(sql, [
        idClient, idSoporte ,new Date(), tipo
    ])
}
User.buscarChat = (idClient, idSoporte, tipo) => {
    const sql=`
    select count(*)
      from chat
     where idclient = $1
       and idsoporte = $2
       and tipo = $3
    `
    return db.oneOrNone(sql,[idClient, idSoporte, tipo])
}
User.listaChat = (tipo) => {
    const sql=`
            select idchat, idclient, idsoporte, u.name || ' '|| u.lastname as name, u.image, c.tipo
              from chat c inner join users u on c.idclient = u.id
            where c.tipo = $1
             order by idchat desc
    `
    return db.manyOrNone(sql,tipo)
}
//fin chat

//eliminar imagenes de storage
User.eliminarImg = () => {
    const sql=`
    SELECT image FROM public.users WHERE image IS NOT NULL AND image LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT image FROM public.roles WHERE image IS NOT NULL AND image LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT image1 AS image FROM public.products WHERE image1 IS NOT NULL AND image1 LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT image2 AS image FROM public.products WHERE image2 IS NOT NULL AND image2 LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT image3 AS image FROM public.products WHERE image3 IS NOT NULL AND image3 LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT image FROM public.giros WHERE image IS NOT NULL AND image LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT image1 AS image FROM public.evidencia WHERE image1 IS NOT NULL AND image1 LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT imagedelivery AS image FROM public.datos_constantes WHERE imagedelivery IS NOT NULL AND imagedelivery LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%'
    UNION
    SELECT image FROM public.categories WHERE image IS NOT NULL AND image LIKE 'https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com%';
    `
    return db.manyOrNone(sql)
}
module.exports=User


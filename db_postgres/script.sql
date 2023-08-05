drop table if exists mediopago cascade;
CREATE TABLE mediopago
(
    id_mediopago bigserial primary key,
    descripcion varchar(255) null,
    estado boolean DEFAULT true
);

insert into mediopago (descripcion)
values ('Efectivo');
insert into mediopago (descripcion)
values ('Mercado Pago');
insert into mediopago (descripcion)
values ('POS');
insert into mediopago (descripcion)
values ('Yape');
insert into mediopago (descripcion)
values ('Plin');


drop table if exists roles cascade;
create table roles(
	id bigserial primary key,
	name varchar(180) not null unique,
	image varchar(255) null,
	route varchar(255) null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null
);


drop table if exists giros cascade;
create table giros(
	idgiro bigserial primary key,
	descripcion varchar(255) not null unique,
	estado boolean null default true,
	image varchar(255) null,
);
insert into giros (	DESCRIPCION ) 
       values ('Persona Natural');
insert into giros (	DESCRIPCION ) 
       values ('Licores');
insert into giros (	DESCRIPCION ) 
       values ('Restaurante');
insert into giros (	DESCRIPCION ) 
       values ('Pizzería');
insert into giros (	DESCRIPCION ) 
       values ('Polleria');
insert into giros (	DESCRIPCION ) 
       values ('Tecnologia');
insert into giros (	DESCRIPCION ) 
       values ('Libreria');
insert into giros (	DESCRIPCION ) 
       values ('Veterinaria');
insert into giros (	DESCRIPCION ) 
       values ('Mototaxi');

drop table if exists users cascade;
create table users(
	id bigserial primary key,
	email varchar(20) not null unique,
	correo varchar(100) null unique,
	name varchar(100) not null,
	lastname varchar(100) not null,
	phone varchar(20) not null unique,
	image varchar(255) not null,
	notification_token varchar(255) null,
	password varchar(255) not null,
	is_available boolean null default true,
	session_token varchar(500) null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	direc_fiscal varchar(250) null default 'Sin direccion fiscal',
	cumpleanio varchar(10) null default '14-01-1988',
	idGiro bigint null default 1,
	estado boolean null default true,
	llegaen varchar(100) null default 'No es Tienda',
	desde varchar(10) null default '0',
	hasta varchar(10) null default '0',
	rango_cliente_tienda varchar(10) not null default '4500',
	rango_repartidor_tienda varchar(10) not null default '4500',
	withlogin varchar(15) not null default 'Sin informacion',
	foreign key(idgiro) references giros(idgiro) on update cascade on delete cascade
);

drop table if exists datos_constantes cascade;
create table datos_constantes(
	id bigserial not null,
	codigo varchar(20) not null,
	id_user bigint not null,
	priceDelivery decimal default 3,
	imageDelivery varchar(255) not null default 'https://firebasestorage.googleapis.com/v0/b/laser-halia.appspot.com/o/ROLES%2Fdelivery.jpeg?alt=media&token=d2d7544c-e349-41ed-a7e5-01ac53538c9e',
	publicKey_mp varchar(255) not null default 'APP_USR-04dfab39-81db-4b43-9f76-8468126ef827',
	accessToken_mp varchar(255) not null default 'APP_USR-1181137664744409-120823-00a328d8dbd81d6967dd857a28f2a421-1258945087',
	yape_token_key varchar(255) not null default 'pk_live_e88f5b01949d3fb3'
	yape_op_key varchar(255) not null default 'sk_live_84b62c0c8047ac0d'
	foreign key(id_user) references users(id) on update cascade on delete cascade,
	primary key(id)
);

drop table if exists chat cascade;
create table chat(
	idchat bigserial not null,
	idclient bigint not null,
	idsoporte bigint not null,
	create_at timestamp(0) not null,
	foreign key(idclient) references users(id) on update cascade on delete cascade,
	foreign key(idsoporte) references users(id) on update cascade on delete cascade,
	primary key(idclient,idsoporte)
);

drop table if exists user_has_roles cascade;
create table user_has_roles(
	id_user bigserial not null,
	id_rol bigserial not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	foreign key(id_user) references users(id) on update cascade on delete cascade,
	foreign key(id_rol) references roles(id) on update cascade on delete cascade,
	primary key(id_user,id_rol)
);

drop table if exists tienda_has_delivery cascade;
create table tienda_has_delivery(
	id_tienda bigserial not null,
	id_delivery bigserial not null,
	estado boolean null default true,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	foreign key(id_tienda) references users(id) on update cascade on delete cascade,
	foreign key(id_delivery) references users(id) on update cascade on delete cascade,
	primary key(id_tienda,id_delivery)
);

insert into roles (
	name,route,create_at,update_at,image
) values (
	'CLIENTE','categoria','2021-07-15','2021-07-15','https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com/o/ROLES%2Fadmin.png?alt=media&token=a907d6ae-6baa-4c97-8abb-5f27829ce921');
insert into roles (
	name,route,create_at,update_at,image
) values (
	'TIENDA','restaurant/orders/list','2021-07-15','2021-07-15','https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com/o/ROLES%2Fadmin.png?alt=media&token=a907d6ae-6baa-4c97-8abb-5f27829ce921');
insert into roles (
	name,route,create_at,update_at,image
) values (
	'REPARTIDOR','delivery/orders/list','2021-07-15','2021-07-15','https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com/o/ROLES%2Fadmin.png?alt=media&token=a907d6ae-6baa-4c97-8abb-5f27829ce921');
insert into roles (
	name,route,create_at,update_at,image
) values (
	'ADMIN','admin/list/inicio','2021-07-15','2021-07-15','https://firebasestorage.googleapis.com/v0/b/hl-delivery.appspot.com/o/ROLES%2Fadmin.png?alt=media&token=a907d6ae-6baa-4c97-8abb-5f27829ce921');

drop table IF exists CATEGORIES cascade;

create table CATEGORIES (
	ID bigserial primary key,
	NAME varchar(100) not null unique,
	description varchar(255) not null,
	image varchar(255) null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	id_user bigint null,
	foreign key(id_user) references USERS(id) on update cascade on delete cascade
);

drop table IF exists products cascade;
create table products (
	ID bigserial primary key,
	NAME varchar(180) not null, --unique
	description varchar(255) not null,
	price decimal default 0,
	pricecompra decimal default 0,
	image1 varchar(255) null,
	image2 varchar(255) null,
	image3 varchar(255) null,
	id_category bigint not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	id_user bigint not null,
	estado boolean NOT NULL DEFAULT true,
    cantidad bigint NOT NULL DEFAULT 0,
	foreign key(id_category) references CATEGORIES(id) on update cascade on delete cascade,
	foreign key(id_user) references USERS(id) on update cascade on delete cascade
);

drop table IF exists address cascade;
CREATE TABLE ADDRESS(
	ID bigserial PRIMARY KEY,
	id_user BIGINT NOT NULL,
	ADDRESS VARCHAR(255) NOT NULL,
	NEIGHBORHOOD VARCHAR(255) NOT NULL,
	referencia VARCHAR(100) NOT NULL default 'sin referencia',
	LAT DECIMAL default 0,
	LNG DECIMAL default 0,
	CREATE_AT timestamp(0) NOT NULL,
	update_AT timestamp(0) NOT NULL,
	disponibilidad boolean not null default true,
	istienda boolean NOT NULL DEFAULT false,
	isdelivery boolean NOT NULL DEFAULT false,
	Foreign key(id_user) references users(id) on update cascade on delete cascade
);

drop table IF exists orders cascade;
CREATE TABLE orders(
	ID bigserial PRIMARY KEY,
	id_client bigint not null,
	id_delivery bigint null,
	id_address bigint not null,
	lat decimal default 0,
	lng decimal default 0,
	status varchar(90) not null,
	timestamp bigint not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	status_pago boolean not null default false,
	id_tienda bigint not null,
	id_mediopago bigint NOT NULL DEFAULT 1,
	total decimal default 0,
	idmp varchar(15) not null DEFAULT '0',
	idyape varchar(30) not null DEFAULT '0',
	comision decimal default 0,
	idyapedevolucion varchar(30) not null DEFAULT '0',
	Foreign key(id_client) references users(id) on update cascade on delete cascade,
	Foreign key(id_delivery) references users(id) on update cascade on delete cascade,
	Foreign key(id_address) references address(id) on update cascade on delete cascade,
	Foreign key(id_tienda) references users(id) on update cascade on delete cascade
);


drop table if exists datos_card cascade;
create table datos_card(
	id bigserial primary key,
	id_client bigint not null,
	expiration_year varchar(4) not null,
	expiration_month bigint not null,
	card_number varchar(16) not null,
	document_type varchar(15) not null,
	document_number varchar(15) not null,
	nombre varchar(150) not null,
	estado boolean null default true,
	card_brand varchar(15) not null default 'visa',
	card_type varchar(15) not null default 'debito',
	Foreign key(id_client) references users(id) on update cascade on delete cascade,
);

drop table IF exists orders_has_products cascade;
CREATE TABLE orders_has_products(
	id_order bigint not null,
	id_product bigint not null,
	quantity bigint not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	estado boolean NOT NULL DEFAULT true,
	sub_total decimal default 0,
	comentario varchar(255) null,
	PRIMARY key(ID_order, id_product),
	Foreign key(ID_order) references orders(id) on update cascade on delete cascade,
	Foreign key(id_product) references products(id) on update cascade on delete cascade
);

drop table IF exists orders_has_delivery cascade;
CREATE TABLE orders_has_delivery(
	id_or_has_de bigserial not null,
	id_order bigint not null,
	price_delivery decimal not null,
	estado boolean NOT NULL DEFAULT true,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	PRIMARY key(id_order, id_or_has_de),
	Foreign key(id_order) references orders(id) on update cascade on delete cascade
);

drop table IF exists evidencia cascade;
create table evidencia (
	ID bigserial primary key,
	comentario varchar(255) not null,
	comentariousuario varchar(255) not null default 'Sin Comentario',
	iddelivery bigint not null,
	idusuario bigint not null,
	idtienda bigint not null,
	idorder bigint not null,
	calificacion decimal default 4.0,
	image1 varchar(255) null,
	create_at timestamp(0) not null,
	foreign key(iddelivery) references USERS(id) on update cascade on delete cascade,
	foreign key(idusuario) references USERS(id) on update cascade on delete cascade,
	foreign key(idtienda) references USERS(id) on update cascade on delete cascade,
	foreign key(idorder) references orders(id) on update cascade on delete cascade
);

drop table if exists configuracion cascade;
create table configuracion(
	id bigserial primary key,
	descripcion varchar(255) not null,
	mensaje varchar(255) not null,
	estado boolean null default true
);
insert into configuracion (	descripcion,mensaje ) 
       values ('Version','1.0.15+16');

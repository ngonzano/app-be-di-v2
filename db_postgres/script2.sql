server qa
port: 5432
clave: 14@qweszxC

-- Productos mas vendidos
select id_product as id,
	       p.name as description,
	       image1,
	       p.id_user as iduser,
	       p.name as namecategoria, 
	       count(quantity) as quantity
    from public.orders_has_products op inner join public.products p on op.id_product = p.id
  									   inner join public.categories as c on c.id = p.id_category
    where op.estado = true
      and p.id_user = $1
    group by id_product,p.name,image1,p.id_user,p.name
    order by quantity desc
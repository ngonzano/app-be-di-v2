const Product = require('../models/product')
const storage = require('../utils/cloud_storage')
const asyncForEach = require('../utils/async_foreach')

module.exports = {
    async findByCategory(req, res, next){
        try {
            const id_category= req.params.id_category;
            const id_user=req.params.id_user;
            const id_cantidad=req.params.id_cantidad;

            const data = await Product.findByCategory(id_category, id_user, id_cantidad);
            return res.status(201).json(data);

        } catch (error) {
            //console.log(`Error findByCategory: ${error}`)
                return res.status(501).json({
                    message: `Error al mostrar el producto por categoria`,
                    success: false,
                    error: error
                })
        }
    },
    async findByCategoryAndProductName(req, res, next){
        try {
            // //console.log(`findByCategoryAndProductName | categoria: ${req.params.id_category} | id de la tienda: ${req.params.id_user} - product_name: ${req.params.product_name}`)
            const id_category = req.params.id_category;//cliente
            const id_user = req.params.id_user;//id de la tienda
            const product_name = req.params.product_name;//producto
            const id_cantidad=req.params.id_cantidad;//cantidad para este caso se pondra por defecto 99999 como un dato para no mostrar
            
            const data = await Product.findByCategoryAndProductName(id_category, id_user, product_name, id_cantidad);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`)
                return res.status(501).json({
                    message: `Error al mostrar el producto por categoria`,
                    success: false,
                    error: error
                })
        }
    },
    async create(req, res, next) {
        let product = JSON.parse(req.body.product)
        
        //console.log(`product: ${JSON.stringify(product)}`)
        
        const files = req.files;
        let inserts = 0
        
        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto no tiene imagen.',
                success: false
            })
        } else {
            try {
                const data = await Product.create(product)//almacenando la informacion
                
                product.id=data.id
                
                const start = async () => {
                    
                    await asyncForEach(files, async(file) => {
                        const pathImage =`image_${Date.now()}`
                        
                        const url = await storage(file, pathImage)
                        
                        if(url !== undefined && url !== null){
                            if (inserts==0) { //IMAGE 1
                                product.image1 = url
                            }
                            else if (inserts == 1) { //imagen2
                                product.image2 = url
                            }
                            else if (inserts == 2) { //imagen2
                                product.image3 = url
                            }
                        }
                        await Product.update(product)
                        inserts = inserts + 1
                        if (inserts === files.length) {
                            return res.status(201).json({
                                message: 'El producto se ha registrado correctamente.',
                                success: true
                            })
                        }
                    })
                }
                start()
            } catch (error) {
                // console.log(`Error: ${error}`)
                return res.status(501).json({
                    message: `Error al registrar el Producto ${error}`,
                    success: false,
                    error: error
                })
            }
        }
    },
    async updateController(req, res, next) {
        let product = JSON.parse(req.body.product) 
        
        const files = req.files;
        let inserts = 0
        
        if (files.length === 0) {
            await Product.updateproducto(product)

            return res.status(201).json({
                message: 'El producto se ha actualizado correctamente.',
                success: true
            })

        } else {
            try {                
                const start = async () => {
                    
                    await asyncForEach(files, async(file) => {

                        const pathImage =`image_${Date.now()}`                        

                        const url = await storage(file, pathImage)                        
                        
                        if(url !== undefined && url !== null){
                            let img = 0;

                            if (img === 0 && product.image1 === null) {
                                product.image1 = url;
                                img = 1
                            }
                            else if (product.image2 === null && img !== 2) {
                                product.image2 = url;
                                img = 2
                            }
                            else {
                                product.image3 = url;
                            }

                            // if (product.image1 !== null) {
                            //     //console.log('imagen 1 sin modificar');                                    
                            // }
                            // else {
                            //     product.image1 = url
                            // }

                            // if (product.image2 !== null) {
                            //         //console.log('imagen 2 sin modificar'); 
                            //     }
                            // else {
                            //     product.image2 = url
                            // }
                            // if  (product.image3 !== null) {
                            //         //console.log('imagen 3 sin modificar'); 
                            //     }
                            // else {
                            //     product.image3 = url
                            // } 
                        }                        
                        await Product.updateproducto(product)     
                        inserts = inserts + 1                  

                        if (inserts === files.length) {
                            return res.status(201).json({
                                message: `El producto ${inserts} se ha actualizado correctamente.`,
                                success: true
                            })
                        }
                    })
                }
                start()
            } catch (error) {
                console.log(`Error: ${error}`)
                return res.status(501).json({
                    message: `Error al actualizar el Producto ${error}`,
                    success: false,
                    error: error
                })
            }
        }
    },
    //Administrador
  

}
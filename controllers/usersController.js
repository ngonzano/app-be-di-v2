//const { json } = require('express')
const User = require('../models/user')
const Rol = require('../models/rol')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
//const { json } = require('express')
//const { storage } = require('firebase-admin')
const storage = require('../utils/cloud_storage')
const { findByDeliveryMen, getAdminsNotificationTokens } = require('../models/user')

module.exports = {
    async getAllTiendas(req,res, next){
        try {
            const data= await User.getAllTiendas()
            ////console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario.'
            })
        }
    },
    async getAllGirosController(req,res, next){
        try {
            const data= await User.getAllGiros()
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener giros.'
            })
        }
    },
    async getUsuarioController(req,res, next){
        try {
            const email = await req.params.email
            const cumpleanio = await req.params.cumpleanio
            ////console.log(`${email}-${cumpleanio}`);
            const data = await User.getUsuario(email, cumpleanio)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario.'
            })
        }
    },
    async findById(req,res, next){
        try {
            const id = await req.params.id
            const data= await User.findByUserId(id)
            // console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario por id.'
            })
        }
    },
    async buscarUsuarioController(req,res, next){
        try {
            const id = await req.params.id
            const data= await User.buscarUsuario(id)
            ////console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario por id.'
            })
        }
    },
    async buscarTiendaController(req,res, next){
        try {
            const descripcion = await req.params.descripcion
            const data= await User.buscarTienda(descripcion)
            ////console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener lista de tiendas.'
            })
        }
    },
    async buscarRepartidorController(req,res, next){
        try {
            const id = await req.params.id
            const data= await User.buscarRepartidor(id)
            
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario por id.'
            })
        }
    },

    async buscarTelefonoController(req,res, next){
        try {
            const phone = await req.params.phone
            const data= await User.buscarTelefono(phone)
            
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener telefono.'
            })
        }
    },
    async buscarCorreoController(req,res, next){
        try {
            const correo = await req.params.correo
            const data= await User.buscarCorreo(correo)
            
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener correo.'
            })
        }
    },
    async findByOrderController(req,res, next){
        try {
            const email = await req.params.email
            const data= await User.findByOrden(email)
            ////console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener la orden'
            })
        }
    },
    async findByDeliveryMenController(req,res, next){
        try {
            const id = await req.params.id
            const data= await User.findByDeliveryMen(id)
            ////console.log(`Repartidores: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener repartidores.'
            })
        }
    },    
    //Trae los tokens de notificacion de todas las tiendas 
    // async getAdminsNotificationTokens(req,res, next){
    //     try {
            
    //         const data= await User.getAdminsNotificationTokens()
    //         let tokens =[];
    //         data.forEach(d => {
    //             tokens.push(d.notification_token);
    //         })
    //         //console.log(`Tokens -------> : ${tokens}`)
    //         return res.status('201').json(tokens)
    //     } catch (error) {
    //         //console.log(error)
    //         return res.status(501).json({
    //             success: false,
    //             message: 'Error al obtener repartidores.'
    //         })
    //     }
    // },
    
    async getAdminsNotificationTokens(req,res, next){
        try {
            const iduser = await req.params.iduser
            const data= await User.getAdminsNotificationTokens(iduser)
            let tokens =[];
            data.forEach(d => {
                tokens.push(d.notification_token);
            })
            //console.log(`Tokens -------> : ${tokens}`)
            return res.status('201').json(tokens)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener repartidores.'
            })
        }
    },
    async listarTokenTiendaClienteController(req,res, next){
        // try {
        //     const data= await User.listarTokenTiendaCliente()
        //     let tokens =[];
        //     data.forEach(d => {
        //         tokens.push(d.id_user,d.lastname,d.lat,d.lng,d.notification_token);
        //     })
        //     //console.log(`Tokens -------> : ${tokens}`)
        //     return res.status('201').json(tokens)
        // } catch (error) {
        //     //console.log(error)
        //     return res.status(501).json({
        //         success: false,
        //         message: 'Error al obtener repartidores.'
        //     })
        // }
        try {
            const data= await User.listarTokenTiendaCliente()
            ////console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario.'
            })
        }
    },
    async listarTodosTokensController(req,res, next){
        try {
            const data= await User.listarTodosTokens()
            let tokens =[];
            data.forEach(d => {
                tokens.push(d.notification_token);
            })
            //console.log(`Tokens -------> : ${tokens}`)
            return res.status('201').json(tokens)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener repartidores.'
            })
        }
    },
    async register(req, res, next){
        try {
            const user= req.body
            const data = await User.create(user)

            await Rol.create(data.id, 1)//rol por defecto (cliente)

            return res.status(201).json({
            success: true,
            message: 'El registro se realizo correctamente.',
            data: data.id
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Error al registrar al usuario.',
                error: error
            })
        }
    },
    async updateNotificationToken(req, res, next){
        try {
            const body= req.body
            //console.log('INFO NOTIFICACIONES: ',body)
            await User.updateNotificationToken(body.id, body.notification_token)

            return res.status(201).json({
                success: true,
                message: 'El token de notificaciones se ha almacenado correctamente'
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Hubo un error al tratar de actualizar el token del usuario',
                error: error
            })
        }
    },
    async registerWithImage(req, res, next){
        try {
            const user= JSON.parse(req.body.user)
            const files = req.files
            const withlogin = await req.params.withlogin

            if (files.length>0) {
                const pathImage = `image_${Date.now()}` //nombre del archivo
                const url= await storage(files[0], pathImage)

                if (url != undefined && url != null) {
                    user.image=url
                }
            }
            const data = await User.create(user, withlogin)
            await Rol.create(data.id, 1)//rol por defecto (cliente)

            return res.status(201).json({
            success: true,
            message: 'El registro se realizo correctamente, Bienvenido.',
            data: data.id
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Error al registrar al usuario.',
                error: error
            })
        }
    },
    async createEvidenciaController(req, res, next){
        try {
            const evidencia = JSON.parse(req.body.evidencia)
            const files = req.files
            if (files.length>0) {
                const pathImage = `image_${Date.now()}` //nombre del archivo
                const url= await storage(files[0], pathImage)

                if (url != undefined && url != null) {
                    evidencia.image1=url
                }
            }
            const data = await User.createEvidencia(evidencia)

            return res.status(201).json({
            success: true,
            message: 'Se ingreso la evidencia correctamente.',
            data: data.id
        })
        } catch (error) {
            //console.log(`Error registerEvidencia: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Error al registrar al usuario.',
                error: error
            })
        }
    },
    async mostrarEvidenciaController(req,res, next){
        try {
            //idorder,iduser,iddelivery,idtienda
            const idorder = await req.params.id
            const iduser = await req.params.iduser
            const iddelivery = await req.params.iddelivery
            const idtienda = await req.params.idtienda
            //console.log(idorder,iduser,iddelivery,idtienda);

            const data= await User.mostrarEvidencia(idorder,iduser,iddelivery,idtienda)
            ////console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los datos de la entrega por id.'
            })
        }
    },
    async update(req, res, next){
        try {
            const user= JSON.parse(req.body.user)
            const files = req.files
            if (files.length>0) {
                const pathImage = `image_${Date.now()}` //nombre del archivo
                const url= await storage(files[0], pathImage)

                if (url != undefined && url != null) {
                    user.image=url
                }
            }
            await User.update(user)

            return res.status(201).json({
            success: true,
            message: 'Los datos se actualizaron correctamente.'
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Error al actualizar al usuario.',
                error: error
            })
        }
    },
    async updateUserPassController(req, res, next){
        try {
            let user = req.body
            //console.log(user);
            await User.updateUserPass(user)
            
            return res.status(201).json({
                success : true,
                message : 'Se actualizo la clave correctamente.',
                data    : user
            })

        } catch (error) {
            //console.log(`Error en actualizar la clave: ${error}`)
            return res.status(501).json({
                success : false,
                message : `Error en actualizar la clave: ${error}`,
                error : error
            })
        }
    },
    async login(req, res, next){
        try {
            const dato = req.body.dato
            const password = req.body.password
            let myUser

            if (dato.includes('@')) {
                 myUser = await User.findByEmail(dato)
                //  console.log('correo');
            } else {
                 myUser = await User.findByPhone(dato)
                //  console.log('telefono');
            }
            
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'EL documento no fue encontrado.'
                })
            }
            // console.log(`VALIDAR CLAVE: ${myUser.password} - ${password}`);
            if (User.isPasswordMatched(password, myUser.password)) {
                const token = jwt.sign({id: myUser.id, phone: myUser.phone}, keys.secretOrKey,{
                    expiresIn: (60*24*60*365)//la expiracion se mide en segundos tiene que cerrar session y luego entrar
                    //expiresIn: (60*5) //5 min
                })
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    estado : myUser.is_available,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles,
                    idgiro: myUser.idgiro,
                    correo: myUser.correo
                }
                await User.updateToken(myUser.id, `JWT ${token}`)
                return res.status(201).json({
                    success: true,
                    message:`Bienvenido ${myUser.name} ${myUser.lastname}`,
                    data: data
                })
            }
            else {
                return res.status(201).json({
                    success: true,
                    message: 'La contraseña es incorrecta.',
                    data: data
                })
            }
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al realizar login, verifique su usuario y/o contraseña.',
                error: error
            })
        }    
    },
    async logout(req, res, next){
        try {
            const id = req.body.id
            await User.updateToken(id, null)
            return res.status(201).json({
                success: true,
                message: 'LA SESION HA EXPIRADO.'
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al cerrar sesion.',
                error: error
            })
        }    
    },
    async updateDeliveryController(req, res, next) {
        try {
            let iduser = req.params.id
            let estado = req.params.estado
            await User.updateDelivery(iduser, estado)

            return res.status(201).json({
                success : true,
                message : 'Se cambio el estado correctamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar el estado: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar el estado',
                error : error
            })
        }
    },
    async eliminarUsuarioController(req, res, next) {
        try {
            let id = req.params.id
            await User.eliminarUsuario(id)

            return res.status(201).json({
                success : true,
                message : 'Se elimino el usuario permanentemente..'
            })

        } catch (error) {
            // //console.log(`Error en eliminar usuario: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al eliminar usuario:',
                error : error
            })
        }
    },
    async actualizarComentarioController(req, res, next) {
        try {
            let idorder = req.params.idorder
            let comentariousuario = req.params.comentariousuario
            let calificacion = req.params.calificacion
            // //console.log(idorder, comentariousuario);

            await User.actualizarComentario(idorder, comentariousuario, calificacion)

            return res.status(201).json({
                success : true,
                message : 'Se actualizo el comentario y la calificacion satisfactoriamente.'
            })

        } catch (error) {
            //console.log(`Error en actualizar el comentario: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar el comentario',
                error : error
            })
        }
    },
    async asignarRolRepartidorController(req, res, next) {
        try {
            const user = req.body;
            const data = await User.asignarRolRepartidor(user)
            return res.status(201).json({
                success : true,
                message : 'Se actualizo el rol del repartidor exitosamente.',
                
            })

        } catch (error) {
            console.log(`Error al crear rol: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'El repartidor ya se encuentra registrado como repartidor en su negocio.',
                error : error
            })
        }
    },
    async agregarNegocioController(req, res, next) {
        try {
            const user = req.body;
            await User.agregarNegocio(user)
            return res.status(201).json({
                success : true,
                message : 'Se agrego el negocio satisfactoriamente',
                
            })

        } catch (error) {
            console.log(`Error al crear el negocio: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Error al crear el negocio.',
                error : error
            })
        }
    },
    async buscarConstController(req,res, next){
        try {
            const codigo = await req.params.codigo
            const data= await User.buscarConst(codigo)
            console.log(`Constante: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            //console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener constante.'
            })
        }
    },
}
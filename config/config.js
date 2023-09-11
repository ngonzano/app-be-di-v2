const promise = require('bluebird')
const options = {
    promiseLib: promise,
    query:(e)=>{}
}
const pgp=require('pg-promise')(options)
const types = pgp.pg.types
types.setTypeParser(1114, function(stringValue){
    return stringValue
})

const databaseConfig={
    // PRODUCION
    'host': 'ep-delicate-shadow-30737887.us-east-2.aws.neon.tech',
    'port': 5432,
    'database': 'fl0-db-pidepe',
    'user': 'fl0user',
    'password': 'mGi3PMWSH7IK',
    ssl: {
        rejectUnauthorized: false
    },
    
    //habilitar si es para heroku
    // ssl: {
    //     rejectUnauthorized: false
    // },

    //QA
    // 'host': 'localhost',
    // 'port': 5432,
    // 'database': 'postgres',
    // 'user': 'postgres',
    // 'password': '14@qweszxC',
}
const db = pgp(databaseConfig)
module.exports = db
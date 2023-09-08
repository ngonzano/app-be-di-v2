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
    'host': '35.226.197.243',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres',
    'password': '14@qweszxC',
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
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
    'host': 'ec2-3-219-137-162.compute-1.amazonaws.com',
    'port': 5432,
    'database': 'd8n42rchdp95on',
    'user': 'fzdaencubsqpxs',
    'password': '47243b44ec0032ee5db04cda1d41bcb342b8c826daeccb9c3909e2c19c73c02d',
    ssl: {
        rejectUnauthorized: false
    },

    //QA
    // 'host': 'localhost',
    // 'port': 5432,
    // 'database': 'postgres',
    // 'user': 'postgres',
    // 'password': '14@qweszxC',
}
const db = pgp(databaseConfig)
module.exports = db
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
    'host': 'ec2-54-225-234-165.compute-1.amazonaws.com',
    'port': 5432,
    'database': 'deafral9ii9fql',
    'user': 'bmsgnitgratweq',
    'password': '56557786b49a05f953ba430e8eac12eabe5ef93b8ec8a450eaae10b3e0f8cfe9',
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
// 获取环境变量.配置数据库的线上和线下环境
const env = process.env.NODE_ENV

console.log(env);


let MYSQL_COFN
let REDIS_COFN

if (env == "dev") {
    //mysql数据库配置
    MYSQL_COFN = {
        host: '18.141.135.79',
        user: 'cander',
        password: 'xMQ@%^@xup6!qYjs',
        database: 'novel'
    },
        REDIS_COFN = {
            port: 6379,
            host: "18.141.135.79",
            password:"AP$jkK9k@sgHEdsa"
        }
}


if (env == "production") {
    //mysql数据库配置
    MYSQL_COFN = {
        host: '18.141.135.79',
        user: 'cander',
        password: 'xMQ@%^@xup6!qYjs',
        database: 'novel'
    },
        REDIS_COFN = {
            port: 6379,
            host: "18.141.135.79",
            password:"AP$jkK9k@sgHEdsa"
        }
}
console.log(MYSQL_COFN);


module.exports = {
    MYSQL_COFN,
    REDIS_COFN
}
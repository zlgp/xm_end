const redis = require("redis");
// 引入环境配置文件
const { REDIS_COFN } = require("./confign/confign")

const client = redis.createClient(REDIS_COFN);

client.on("error", (error) => {
    console.error(error);
});

// 封装redis的set方法
// 存
exports.set = ((key, val) => {
    client.set(key, val, redis.print);
})
// 取
exports.get = ((key) => {
    return new Promise((reslove, reject) => {
        client.get(key, (error, val) => {
            if (error) {
                reject(error)
            } else {
                reslove(val)
            }
        });
    })
})
// 删
exports.del = ((key) => {
    client.del(key, redis.print);
})


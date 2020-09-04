const mysql = require('mysql')

// 引入环境配置文件
const { MYSQL_COFN } = require("./confign/confign")
console.log(MYSQL_COFN);


var connection = mysql.createConnection(MYSQL_COFN);

connection.connect();

exports.select = (sql) => {
    return new Promise((reslove, reject) => {
        connection.query(sql, (error, results) => {
            if (error) {
                reject(error)
            } else {
                reslove(results)
            }
        });
    })
}






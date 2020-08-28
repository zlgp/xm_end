const express = require('express')

const router = express.Router()

// 引入封装好的mysql文件
const mysql = require('./mysql')

// 引入封装好的redis文具
const redis = require('./redis')
// 处理时间的
const moment = require('moment')
// 轮播图
router.post("/banner", (req, res) => {
    // 第一次进来先从mysql读,第二次从redis缓存中读
    redis.get("banner").then(results => {
        if (results != null) {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            mysql.select('SELECT id,cover_link,book_name,description FROM dp_book limit 16').then(results => {
                redis.set("banner", JSON.stringify(results))
                res.send({
                    msg: "读取成功",
                    code: 0,
                    data: results
                })
            }).catch(error => {
                console.error(error)
                res.send({
                    msg: "微服务故障",
                    code: 1,
                })
            })
        }
    }).catch(error => {
        console.error(error)
        res.send({
            msg: "微服务故障",
            code: 0,
        })
    })
})

// 重磅推荐
router.post("/recommend", (req, res) => {
    redis.get("recommend").then(results => {
        if (results != null) {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            mysql.select('SELECT dp_book.id,dp_book.cover_link,dp_book.book_name,dp_author.author_name FROM dp_book ,dp_author WHERE  dp_book.author_id=dp_author.id  limit 12').then(results => {
                redis.set("recommend", JSON.stringify(results))
                res.send({
                    msg: "读取成功",
                    code: 0,
                    data: results
                })
            }).catch(error => {
                console.error(error)
                res.send({
                    msg: "微服务故障",
                    code: 1,
                })
            })
        }
    }).catch(error => {
        console.error(error)
        res.send({
            msg: "微服务故障",
            code: 0,
        })
    })
})
let recommend = []
let catogory = []
let girl_recommend = []
// 频道
router.post("/get/channel", (req, res) => {
    redis.get("channel").then(results => {
        if (results != null) {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            // 先查出男生的推荐
            mysql.select(`SELECT dp_book.id,dp_book.cover_link,dp_book.book_name,dp_author.author_name FROM dp_book INNER JOIN dp_author WHERE dp_book.author_id=dp_author.id AND  dp_book.girl=0  LIMIT 6`).then(results => {
                //  再查出男生的分类
                recommend = results
                return mysql.select(`SELECT dp_book.id,dp_book.book_name,dp_author.author_name,dp_cate.cate_name FROM dp_book INNER JOIN dp_author JOIN dp_cate WHERE dp_book.author_id=dp_author.id AND dp_book.cate_id=dp_cate.id AND dp_book.girl=0 LIMIT 16`)
            }).then(results => {
                catogory = results
                // 开始读女生的
                return mysql.select(`SELECT dp_book.id,dp_book.cover_link,dp_book.book_name,dp_author.author_name FROM dp_book INNER JOIN dp_author WHERE dp_book.author_id=dp_author.id AND  dp_book.girl=1  LIMIT 6`)
            }).then(results => {
                girl_recommend = results
                return mysql.select(`SELECT dp_book.id,dp_book.book_name,dp_author.author_name,dp_cate.cate_name FROM dp_book INNER JOIN dp_author JOIN dp_cate WHERE dp_book.author_id=dp_author.id AND dp_book.cate_id=dp_cate.id AND dp_book.girl=1 LIMIT 16`)
            }).then(results => {
                let wholeData = {
                    boy: {
                        name: "男生",
                        recommend: recommend,
                        catogory: catogory
                    },
                    girl: {
                        name: "女生",
                        recommend: girl_recommend,
                        catogory: results
                    }
                }
                redis.set("channel", JSON.stringify(wholeData))
                res.send({
                    code: 0,
                    msg: "读取成功",
                    data: {
                        boy: {
                            name: "男生",
                            recommend: recommend,
                            catogory: catogory
                        },
                        girl: {
                            name: "女生",
                            recommend: girl_recommend,
                            catogory: results
                        }
                    }
                })
            })
                // 返回错误的信息
                .catch(error => {
                    res.send({
                        code: 1,
                        msg: "读取失败",
                    })
                })
        }

    }).catch(error => {
        console.error(error)
    })
})
// 最新上线
router.post("/new", (req, res) => {
    // 第一次进来先从mysql读,第二次从redis缓存中读
    redis.get("new").then(results => {
        if (results != null) {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            mysql.select('SELECT id,cover_link,book_name,description,score FROM dp_book ORDER BY create_time  DESC LIMIT 6').then(results => {
                redis.set("new", JSON.stringify(results))
                res.send({
                    msg: "读取成功",
                    code: 0,
                    data: results
                })
            }).catch(error => {
                console.error(error)
                res.send({
                    msg: "微服务故障",
                    code: 1,
                })
            })
        }
    }).catch(error => {
        console.error(error)
        res.send({
            msg: "微服务故障",
            code: 1,
        })
    })
})
// 查出分类
router.post("/get/category", (req, res) => {
    // 第一次进来先从mysql读,第二次从redis缓存中读
    redis.get("category").then(results => {
        if (results != null) {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            mysql.select('SELECT cate_name FROM dp_cate').then(results => {
                redis.set("category", JSON.stringify(results))
                res.send({
                    msg: "读取成功",
                    code: 0,
                    data: results
                })
            }).catch(error => {
                console.error(error)
                res.send({
                    msg: "微服务故障",
                    code: 1,
                })
            })
        }
    }).catch(error => {
        console.error(error)
        res.send({
            msg: "微服务故障",
            code: 1,
        })
    })
})
// 分类内容
router.post("/search/condition", (req, res) => {
    let current_page = 1
    if (req.body.page) {
        current_page = parseInt(req.body.page);
    }
    //条数
    let limit = req.body.limit
    // 从第几条开始
    start = (current_page - 1) * limit
    // 总条数
    let count = ""
    let total_page = ""
    if (req.body.girl == -1 && req.body.is_end == -1 && req.body.year == 0) {
        redis.get("noCondition").then(results => {
            console.log(results, "noCondition");
            if (results != null) {
                res.send({
                    msg: "读取成功",
                    code: 0,
                    data: JSON.parse(results)
                })
            } else {
                mysql.select(`SELECT COUNT(*)  as count FROM dp_book`).then(results => {
                    count = results[0].count
                    return mysql.select(`SELECT dp_book.id,dp_book.book_name,dp_book.cover_link,dp_book.description,dp_cate.cate_name,dp_author.author_name FROM dp_book JOIN dp_cate INNER JOIN dp_author ON dp_book.author_id=dp_author.id AND dp_book.cate_id=dp_cate.id  limit ${start},${limit}`)
                }).then(results => {

                    // 总页数
                    total_page = Math.ceil(count / limit)
                    let conditionData = {
                        results,
                        count,
                        total_page
                    }
                    console.log(conditionData, 'mysql');

                    redis.set("noCondition", JSON.stringify(conditionData))
                    res.send({
                        code: 0,
                        msg: "ok",
                        data: {
                            results,
                            count,
                            total_page
                        }
                    })
                }).catch(error => {
                    console.error(error)
                    res.send({
                        msg: "微服务故障",
                        code: 1,
                    })
                })
            }
        })

    }
    else {
        let count_sql = `SELECT COUNT(*)  as count FROM dp_cate JOIN dp_book INNER JOIN dp_author  ON dp_book.author_id=dp_author.id AND dp_book.cate_id=dp_cate.id`
        if (req.body.year != 0) {
            let year_count = moment(req.body.year).unix()
            // 查询介绍的年份
            let next_year_change_count = moment((parseInt(req.body.year) + 1).toString()).unix()
            count_sql += ` AND dp_book.create_time>'${year_count}' AND dp_book.create_time<'${next_year_change_count}'`

        }
        if (req.body.girl != -1) {
            let girl_count = req.body.girl
            count_sql += ` AND dp_book.girl='${girl_count}'`
        }
        if (req.body.is_end != -1) {
            let is_end_count = req.body.is_end
            count_sql += ` AND dp_book.is_end='${is_end_count}'`
        }
        mysql.select(count_sql).then(results => {
            count = results[0].count
            let sql = `SELECT dp_book.id, dp_book.book_name, dp_book.cover_link, dp_book.description, dp_cate.cate_name, dp_author.author_name FROM dp_cate JOIN dp_book INNER JOIN dp_author  ON dp_book.author_id=dp_author.id AND dp_book.cate_id=dp_cate.id `
            if (req.body.year != 0) {
                let year = moment(req.body.year).unix()
                // 查询介绍的年份
                let next_year_change = moment((parseInt(req.body.year) + 1).toString()).unix()
                sql += `AND dp_book.create_time>'${year}' AND dp_book.create_time<'${next_year_change}'`

            }

            if (req.body.girl != -1) {
                let girl = req.body.girl
                sql += ` AND dp_book.girl='${girl}'`
            }


            if (req.body.is_end != -1) {
                let is_end = req.body.is_end
                sql += ` AND dp_book.is_end='${is_end}'`
            }

            return mysql.select(sql + ` LIMIT ${start},${limit}`)
        }).then(results => {
            // 总页数
            total_page = Math.ceil(count / limit)
            res.send({
                code: 0,
                msg: "ok",
                data: {
                    results,
                    count,
                    total_page
                }
            })
        }).catch(error => {
            console.error(error)
            res.send({
                msg: "微服务故障",
                code: 1,
            })
        })

    }
})

// 获取跳转过来详情页的书本详情
let detail
router.post("/book/detail", (req, res) => {
    redis.get("detail").then(results => {
        if (results != null) {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            // 先查出基本信息,再查出章节信息
            mysql.select(`SELECT dp_book.id,dp_book.book_name,dp_book.cover_link,dp_book.description,dp_cate.cate_name,dp_author.author_name FROM dp_book JOIN dp_cate INNER JOIN dp_author ON dp_book.author_id=dp_author.id AND dp_book.cate_id=dp_cate.id WHERE dp_book.id='${req.body.id}' `).then(results => {
                detail = results[0]
                return mysql.select(`SELECT dp_chapter.book_id,dp_chapter.chapter_id,dp_chapter.chapter_title,dp_chapter.create_time FROM dp_chapter WHERE dp_chapter.book_id='${req.body.id}'`)
            }).then(zeroth => {
                let wholeResults = {
                    detail,
                    zeroth
                }
                redis.set("detail", JSON.stringify(wholeResults))
                res.send({
                    msg: "读取成功",
                    code: 0,
                    data: {
                        detail,
                        zeroth
                    }
                })
            }).catch(error => {
                console.error(error)
                res.send({
                    msg: "微服务故障",
                    code: 1,
                })
            })
        }
    }).catch(error => {
        console.error(error)
        res.send({
            msg: "微服务故障",
            code: 1,
        })
    })
})
// 阅读.获取所有章节
let px = ""
router.post("/book/catelog", (req, res) => {
    if (req.body.ascending == "true") {
        // 升序
        px = "ASC"
    } else {
        //降序
        px = "DESC"
    }
    redis.get("catelog").then(results => {
        if (results != null && px == "DESC") {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            redis.get("Acatelog").then(results => {
                if (results != null && px == "ASC") {
                    res.send({
                        msg: "读取成功",
                        code: 0,
                        data: JSON.parse(results)
                    })
                } else {
                    mysql.select(`SELECT dp_chapter.id,dp_chapter.chapter_id,dp_chapter.chapter_title FROM dp_chapter WHERE dp_chapter.book_id='${req.body.id}' ORDER BY dp_chapter.chapter_id ${px.replace("", '')}`).then(results => {
                        if (px == "DESC") {
                            redis.set("catelog", JSON.stringify(results))
                        } else {
                            redis.set("Acatelog", JSON.stringify(results))
                        }
                        res.send({
                            code: 0,
                            msg: "获取信息成功",
                            data: {
                                results
                            }
                        })
                    }).catch(error => {
                        console.error(error)
                        res.send({
                            code: 1,
                            msg: "微服务故障"
                        })
                    })
                }
            })

        }

    }).catch(error => {
        console.error(error)
        res.send({
            msg: "微服务故障",
            code: 1,
        })
    })
})
// 获取跳转过来的阅读详情
router.post('/book', (req, res) => {
    redis.get("book").then(results => {
        console.log(results, 'book');
        if (results != null) {
            res.send({
                msg: "读取成功",
                code: 0,
                data: JSON.parse(results)
            })
        } else {
            mysql.select(`SELECT dp_chapter.id,dp_chapter.book_id,dp_chapter.chapter_title,dp_chapter.chapter_id,dp_chapter.chapter_content,dp_book.book_name FROM dp_chapter INNER JOIN dp_book WHERE dp_book.id=dp_chapter.book_id AND dp_chapter.book_id='${req.body.book_id}' AND dp_chapter.chapter_id='${req.body.chapter_id}'`).then(results => {
                console.log(results[0], 'mysql');

                redis.set("book", JSON.stringify(results[0]))
                res.send({
                    code: 0,
                    msg: "获取信息成功",
                    data: results[0]
                })
            }).catch(error => {
                console.error(error)
                res.send({
                    msg: "微服务故障",
                    code: 1,
                })
            })
        }

    }).catch(error => {
        console.error(error)
        res.send({
            msg: "微服务故障",
            code: 1,
        })
    })
})





module.exports = router
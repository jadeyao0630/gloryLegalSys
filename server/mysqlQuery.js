var mysql=require("mysql");
const dotenv = require('dotenv');
const path = require("path");
const { env } = process;
dotenv.config({
    path: path.resolve(
        __dirname,
        `./env.${env.NODE_ENV ? env.NODE_ENV : "home"}`
      ),
});
var pool = mysql.createPool({
    host: env.HOST,
    user:env.USER,
    password:env.PASSWORD,
    database:env.DATABASE,
    port:env.DB_PORT,
});

var query=function(sql,options,callback){

    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,options,function(err,results,fields){
                //事件驱动回调
                callback(err,results,fields);
            });
            //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
            conn.release();
        }
    });
};

module.exports=query;
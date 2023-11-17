const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require("path");
let instance = null;
const { env } = process;
dotenv.config({
    path: path.resolve(
        __dirname,
        `./env.${env.NODE_ENV ? env.NODE_ENV : "local"}`
      ),
});

const connection = mysql.createConnection({
    host: env.HOST,
    user:env.USER,
    password:env.PASSWORD,
    database:env.DATABASE,
    por:env.DB_PORT,
    //ssl: true,
});

connection.connect((err)=>{

    if(err){
        console.log(err.message);
    }
    console.log('db '+ connection.state);
});

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    async getAllData(){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = "SELECT * FROM names";
                connection.query(query, (err,results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            
            console.log(response);
            return response;
        }catch (error){
            console.log(error);
        }
    }
    async insertNewName(name){
        try{
            //console.log(name);
            const dateAdded = new Date();
            const insertId = await new Promise((resolve,reject)=>{
                const query = "REPLACE INTO names (user,pass,position,level,createDate) VALUES (?, ?, ?, ?, ?);";
                connection.query(query,[name,"1555","1",4,dateAdded], (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result.insertId);
                    resolve(result);
                });
            });
            
            console.log(insertId);
            return {
                id: insertId,
                name : name,
                createDate: dateAdded
            };
        }catch(error){
            console.log(error);
        }
    }
    async login(name, pass){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = `SELECT * FROM names WHERE user=? AND pass=?;`;
                connection.query(query,[name,pass], (err,result)=>{
                    if (err) reject(new Error(err.message));
                    console.log(result);
                    resolve(result);
                });
            });
            
            //console.log("typeof: "+(typeof response));
            return {
                success : response.length>0,
                data: JSON.stringify(response[0])
            };
        }catch(error){
            console.log(error);
        }
    }

}

module.exports = DbService;
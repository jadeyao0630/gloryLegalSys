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
    async select(query){
        try{
            const response = await new Promise((resolve,reject)=>{
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
    async createTable(table,columns){
        try{
            var keys=Object.keys(columns);
            //var keys_str=keys.split(",");
            const values=[];
            const pk=[];
            const unique=[];
            keys.forEach((key)=>{
                var char=columns[key].split(',');
                if(char.length>0){
                    if(char.length==1){
                        values.push(key+" "+char[0]);
                    }else if(char.length>1){
                        values.push(key+" "+char[0]);
                        if(char[1].toUpperCase().includes("PRIMARY KEY")){
                            pk.push(key);
                        }else if(char[1].toUpperCase().includes("UNIQUE")){
                            unique.push(key);
                        }
                    }
                }
                
            });
            if(pk.length>0){
                values.push("PRIMARY KEY("+pk.join()+")");
            }
            if(unique.length>0){
                values.push("UNIQUE("+unique.join()+")");
            }
            console.log(values);
            const response = await new Promise((resolve,reject)=>{
                const query = "CREATE TABLE "+table+" ("+values.join()+");";
                connection.query(query, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result.insertId);
                    resolve(result);
                });
            });
            
            console.log(response);
            return {
                success: response,
            };
        }catch(error){
            console.log(error);
            return {
                success: false,
                error: error
            };
        }
    }
    async insertNewCase(table,data){
        try{
            //console.log(name);
            const dateAdded = new Date();
            var keys=Object.keys(data);
            //var keys_str=keys.split(",");
            const values=[];
            const _values=[];
            keys.forEach((key)=>{
                values.push(data[key]);
                _values.push("?");
            });
            const insertId = await new Promise((resolve,reject)=>{
                const query = "REPLACE INTO "+table+" ("+keys.join()+") VALUES ("+_values.join()+");";
                console.log(query);
                connection.query(query,values, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result.insertId);
                    resolve(result);
                });
            });
            
            console.log(insertId);
            return {
                success: true,
                id: insertId,
                createDate: dateAdded,
            };
        }catch(error){
            console.log(error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    async insertNewUser(user,pass){
        try{
            //console.log(name);
            const dateAdded = new Date();
            const insertId = await new Promise((resolve,reject)=>{
                const query = "REPLACE INTO names (user,pass,position,level,createDate) VALUES (?, ?, ?, ?, ?);";
                connection.query(query,[user,pass,"1",4,dateAdded], (err,result)=>{
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
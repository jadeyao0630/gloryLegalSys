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
    user:'glory',
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
    //#region 选择
    async getBasic(columnData){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = "SELECT * FROM "+columnData.tablename+
                    (columnData.conditions!=undefined?columnData.conditions:"");
                connection.query(query, (err,results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            
            //console.log(response);
            return response;
        }catch (error){
            console.log(error);
        }
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
            
            //console.log(response);
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
            
            //console.log(response);
            return response;
        }catch (error){
            console.log(error);
        }
    }
    //#endregion 选择
    //#region 创建
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
            //console.log(values);
            const response = await new Promise((resolve,reject)=>{
                const query = "CREATE TABLE "+table+" ("+values.join()+");";
                connection.query(query, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result.insertId);
                    resolve(result);
                });
            });
            
            //console.log(response);
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
    //#endregion 创建
    //#region 插入
    async insertNewCase(query){
        try{
            
            const insertId = await new Promise((resolve,reject)=>{

                connection.query(query, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            
            //console.log(insertId);
            return {
                success: true,
                id: insertId,
            };
        }catch(error){
            console.log(error);
            return {
                success: false,
                error: error.message
            };
        }
    }
       async insertRow(table,data){
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
                //console.log(query);
                connection.query(query,values, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result.insertId);
                    resolve(result);
                });
            });
            
            //console.log(insertId);
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
    async insertRows(table,datas){
        try{
            //console.log(name);
            const dateAdded = new Date();
            var queries=[];
            var keys;
            datas.forEach(data=>{
                if(keys==undefined) keys=Object.keys(data);
                const _values=[];
                keys.forEach((key)=>{
                    //console.log((data[key].constructor === String));
                    var val=(data[key].constructor === String)?'"'+data[key]+'"':data[key];
                    _values.push(val);
                });
                queries.push("("+_values.join()+")");
            });
            var query="REPLACE INTO `"+table+"` ("+keys.join()+") VALUES "+queries.join();
            const insertId = await new Promise((resolve,reject)=>{
                //console.log(query);
                connection.query(query, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result.insertId);
                    resolve(result);
                });
            });
            
            //console.log(insertId);
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
            
            //console.log(insertId);
            return {
                id: insertId,
                name : name,
                createDate: dateAdded
            };
        }catch(error){
            console.log(error);
        }
    }
    //#endregion 插入
    
    //#region 删除
    async removeRow(id,table){
        try{
            const response = await new Promise((resolve,reject)=>{
                //console.log(table);
                const query = `DELETE FROM `+table+` WHERE \`id\` = ?;`;
                connection.query(query,id, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result);
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
    async removeRows(ids,table){
        try{
            const response = await new Promise((resolve,reject)=>{
                //console.log(table);
                const query = `DELETE FROM `+table+` WHERE \`id\` IN (`+ids.join()+`);`;
                connection.query(query, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result);
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
    //#endregion 删除
    //#region 功能
    async login(name, pass){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = `SELECT * FROM names WHERE user=? AND pass=?;`;
                connection.query(query,[name,pass], (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result);
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
    //#endregion 功能
}

module.exports = DbService;
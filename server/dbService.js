﻿﻿const ftp = require("basic-ftp");
const path = require("path");
const fs = require('fs');
const Jimp = require('jimp');
let instance = null;

const mquery = require('./mysqlQuery.js');

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    async downloadFile(filePath,file,res){
        try{
            const client = new ftp.Client();
            const remoteFilePath = path.join(filePath, fileName); 
            const localFilePath = path.join(__dirname, 'uploads', fileName);
            await client.access({
                host: "192.168.10.69",
                user: "FWdb\\administrator",
                password: "Glorypty@123",
                secure: false 
            });
            await client.downloadTo(remoteFilePath, localFilePath);
      
            // Send the file to the client
            res.download('uploads', file);
        }catch (error){
            console.log(error);
        }
        
    }
    async uploadImage(rootPath,folder,file,newFileName){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                const extension=file.name.split('.').pop();
                const _newfilename=newFileName.replace('.'+extension,'')+"_thumb."+extension;
                const localFilePath = path.join(rootPath,folder, newFileName);
                await new DbService().uploadFileL(rootPath,folder,file,newFileName).then(async(data)=>{
                    if(data.success){
                        const image = await Jimp.read(localFilePath);
                        image.scaleToFit(200,200, function(err){
                            if (err) throw err;
                        })
                        .write(path.join(rootPath,folder, _newfilename));

                    }
                    resolve(data)
                });
            });
            return response;
        }catch (error){
            console.log(error);
        }
    }
    async uploadFileL(rootPath,folder,file,newFileName){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                var fileName=file.name;
                const extension=file.name.split('.').pop();
                const _newfilename=newFileName.replace('.'+extension,'');
                //const remoteFilePath = path.join(filePath, fileName); // Replace 'filename.jpg' with the desired file name
                
                const localFilePath = path.join(rootPath,folder, newFileName); // Save the uploaded file to the 'uploads' directory
                file.mv(localFilePath, async function(err) {
                    if (err) {
                        console.error('Error saving file:', err);
                        reject(new Error(err.message));
                        resolve({
                            status:500,
                            success:false,
                            message:'Error saving file '+fileName,
                            newFileName:newFileName,
                            originalFileName:fileName,
                            error:err
                        });
                    }
                    
                    resolve({
                        status:200,
                        success:true,
                        message:'File uploaded successfully '+fileName,
                        newFileName:newFileName,
                        originalFileName:fileName,
                    });
                    
                });
            });
            return response;
        }catch (error){
            console.log(error);
        }
        
    }
    async uploadFile(filePath,file){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                var fileName=file.name;
                const remoteFilePath = path.join(filePath, fileName); // Replace 'filename.jpg' with the desired file name
                const client = new ftp.Client();
                await client.access({
                    host: "192.168.10.69",
                    user: "FWdb\\administrator",
                    password: "Glorypty@123",
                    secure: false 
                });
            
                const localFilePath = path.join(__dirname, 'uploads', fileName); // Save the uploaded file to the 'uploads' directory
                file.mv(localFilePath, async function(err) {
                    if (err) {
                        console.error('Error saving file:', err);
                        reject(new Error(err.message));
                        resolve({
                            status:500,
                            message:'Error saving file '+fileName,
                            error:err
                        });
                    }
            
                    try {
                        await client.uploadFrom(localFilePath, remoteFilePath);
                        console.log('File uploaded successfully to FTP server '+fileName);
                        resolve({
                            status:200,
                            message:__dirname+' File uploaded successfully '+fileName
                        });
                    } catch (err) {
                        console.error('Error uploading file to FTP server:', err);
                        reject(new Error(err.message));
                        resolve({
                            status:500,
                            message:'Error uploading file to FTP server '+fileName,
                            error:err
                        });
                    } finally {
                        client.close();
                    }
                });
            });
            return response;
        }catch (error){
            console.log(error);
        }
        
    }
    //#region 选择
    async getBasic(columnData){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = "SELECT * FROM "+columnData.tablename+
                    (columnData.conditions!=undefined?" "+columnData.conditions:"")+(columnData.orderBy!=undefined?" "+columnData.orderBy:"");
                    mquery(query, (err,results)=>{
                    if (err) reject(new Error(err.message+"--"+query));
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
                mquery(query, (err,results)=>{
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
                mquery(query, (err,results)=>{
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
                mquery(query, (err,result)=>{
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

                mquery(query, (err,result)=>{
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
                mquery(query,values, (err,result)=>{
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
                mquery(query, (err,result)=>{
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
                error: error.message,
                sourceData:datas
            };
        }
    }
    async pureInsertRows(table,datas){
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
            var query="INSERT INTO `"+table+"` ("+keys.join()+") VALUES "+queries.join();
            const insertId = await new Promise((resolve,reject)=>{
                //console.log(query);
                mquery(query, (err,result)=>{
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
                error: error.message,
                sourceData:datas
            };
        }
    }
    async insertNewUser(user,pass){
        try{
            //console.log(name);
            const dateAdded = new Date();
            const insertId = await new Promise((resolve,reject)=>{
                const query = "REPLACE INTO names (user,pass,position,level,createDate) VALUES (?, ?, ?, ?, ?);";
                mquery(query,[user,pass,"1",4,dateAdded], (err,result)=>{
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
    async insert(table,data){
        try{
            //console.log(name);
            const dateAdded = new Date();
            var keys=Object.keys(data);
                const _values=[];
                keys.forEach((key)=>{
                    //console.log((data[key].constructor === String));
                    var val=(data[key].constructor === String)?'"'+data[key]+'"':data[key];
                    _values.push(val);
                });
            
            var query="INSERT INTO `"+table+"` ("+keys.join()+") VALUES "+"("+_values.join()+")";
            const insertId = await new Promise((resolve,reject)=>{
                //console.log(query);
                mquery(query, (err,result)=>{
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
    //#endregion 插入
    
    //#region 删除
    async removeRow(id,table){
        try{
            const response = await new Promise((resolve,reject)=>{
                //console.log(table);
                const query = `DELETE FROM `+table+` WHERE \`id\` = ?;`;
                mquery(query,id, (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result);
                    resolve(result);
                });
            });
            
            //console.log("typeof: "+(typeof response));
            return {
                success : response.affectedRows>0,
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
                mquery(query, (err,result)=>{
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
            return {
                success: false,
                error: error.message
            };
        }
    }
    async constrolRows(ids,isInactived){
        var error_mesg;
        try{
            const response = await new Promise((resolve,reject)=>{
                //console.log(table);
                const query = `UPDATE caseStatus SET isInactived=`+isInactived+` WHERE \`id\` IN (`+ids.join()+`);`;
                mquery(query, (err,result)=>{
                    if (err) {
                        reject(new Error(err.message));
                        error_mesg=err;
                    }
                    resolve(result);
                });
            });
            
            //console.log("typeof: "+(typeof response));
            return {
                success : true,
                data: response
            };
        }catch(error){
            console.log(error);
        }
        return {
            success: false,
            error: error_mesg
        };
    }
    async constrolItem(where,table,isInactived){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = `UPDATE `+table+` SET isInactived=`+isInactived+` WHERE `+where;
                mquery(query, (err,result)=>{
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
            return {
                success: false,
                error: error.message
            };
        }
    }
    //#endregion 删除
    async updateUser(where,value){
        var error_mesg;
        try{
            var query;
            const response = await new Promise((resolve,reject)=>{
                
                query = `UPDATE names SET `+value+` WHERE `+where;
                mquery(query, (err,result)=>{
                    
                    if (err) {
                        reject(new Error(err.message));
                        error_mesg=err;
                    }
                    //console.log(result);
                    resolve(result);
                });
            });
            
            //console.log("typeof: "+(typeof response));
            return {
                data: response,
                query:query
            };
        }catch(error){
            console.log(error);
            return {
                success: false,
                error: error_mesg
            };
        }
    }
    async update(where,table,value){
        var error_mesg;
        try{
            var query;
            const response = await new Promise((resolve,reject)=>{
                var vals=[];
                if (value instanceof Object){
                    var keys=Object.keys(value);
                    keys.forEach((key)=>{
                        vals.push(key+"=\""+value[key]+"\"");
                    })
                    value=vals.join();
                }
                query = `UPDATE `+table+` SET `+value+` WHERE `+where;
                mquery(query, (err,result)=>{
                    if (err) {
                        reject(new Error(err.message));
                        error_mesg=err;
                    }

                        resolve(result);
                    
                    //console.log(result);
                });
            });
            
            //console.log("typeof: "+(typeof response));
            return {
                data: response,
                query:query,
                success:true
            };
        }catch(error){
            console.log(error,query,"value",value);
            return{
                data:error_mesg,success:false,state:'error'
            }
        }
    }
    async execute(query){
        var error_mesg;
        try{
            var query;
            const response = await new Promise((resolve,reject)=>{

                mquery(query, (err,result)=>{
                    if (err) {
                        reject(new Error(err.message));
                        error_mesg=err;
                    }

                        resolve(result);
                    
                    //console.log(result);
                });
            });
            
            //console.log("typeof: "+(typeof response));
            return {
                data: response,
                query:query,
                success:true
            };
        }catch(error){
            console.log(error);
            return{
                data:error_mesg,success:false,state:'error'
            }
        }
    }
    //#region 功能
    async login(name, pass){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = `SELECT * FROM names WHERE user=? AND pass=?;`;
                mquery(query,[name,pass], (err,result)=>{
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
    async oalogin(name){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = `SELECT * FROM names WHERE user=?;`;
                mquery(query,[name], (err,result)=>{
                    if (err) reject(new Error(err.message));
                    //console.log(result);
                    resolve(result);
                });
            });
            
            //console.log("typeof: "+(typeof response));
            return {
                success : response.length>0,
                data: response[0]
            };
        }catch(error){
            console.log(error);
        }
    }
    //#endregion 功能
}

module.exports = DbService;
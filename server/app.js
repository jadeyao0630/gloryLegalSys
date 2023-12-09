const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const $ = require("jquery");

const path = require('path');
const { env } = process;
dotenv.config({
    path: path.resolve(
        __dirname,
        `./env.${env.NODE_ENV ? env.NODE_ENV : "local"}`
      ),
});


const DbService = require('./dbService');

var corsOptions = {
    origin: '*',
    credentials:true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions)).use((req,res,next)=>{
    console.log(req);
    res.setHeader('Access-Control-Allow-Origin',"*");
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended:false}));




// create
app.post('/insertUser',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {user} = request.body;
    const {pass} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertNewUser(user,pass);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/insert',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {data} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertRow(table,data);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/insertAll',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {data} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertRows(table,data);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/createTable',cors(corsOptions),(request,response) => {
    //console.log("request.body "+request.body.columns);
    const {columns} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.createTable(table,columns);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/insertCase',(request,response) => {
    const {data} = request.body;
    const {template} = request.body;
    const results = [];
    //console.log(template,list);
    var tablekeys=Object.keys(template);
    var keys=Object.keys(data);
    var queries=[];
    tablekeys.forEach((tableKey)=>{
        var tableCols=Object.keys(template[tableKey].template);
        var values=[]
        var valuesKeys=[];
        var update=[];
        tableCols.forEach((tablecol)=>{
            if(keys.includes(tablecol)){
                var val=data[tablecol];
                //console.log(tablecol,template[tableKey].template[tablecol],template[tableKey].template[tablecol].toUpperCase().indexOf('INT'),val);
                if (template[tableKey].template[tablecol].toUpperCase().indexOf('INT')>-1){
                    if(val.constructor === String) val=parseInt(val.replace('"',''));
                    else val=val;
                } 
                else if (template[tableKey].template[tablecol].toUpperCase().indexOf('BOOL')>-1){
                    if(val.constructor === String) val=parseInt(val.replace('"',''));
                    else val=val;
                }
                else if (template[tableKey].template[tablecol].toUpperCase().indexOf('DATETIME')>-1 && val.length<19) val="\""+val+" 00:00:00\"";
                else val='"'+val+'"';
                update.push(tablecol+"="+val);
                values.push(val);
                valuesKeys.push(tablecol);
            }
        });
        queries.push("INSERT INTO `"+template[tableKey].tablename+"` ("+valuesKeys.join()+") VALUES ("+values.join()+") ON DUPLICATE KEY "+
            "UPDATE "+update.join()+";");
        //queries.push("REPLACE INTO `"+template[tableKey].tablename+"` ("+valuesKeys.join()+") VALUES ("+values.join()+");");
    });
    var counter=0;
    queries.forEach((q)=>{
        const db = DbService.getDbServiceInstance();
        const result = db.insertNewCase(q);
        result
        .then(data => {
            //console.log("in loop",k,data);
            results.push(data.success);
            counter++;
        })
        .catch(err => console.log(err));
    });

    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            //console.log('results',Object.keys(results).length);
        if (results.length === tablekeys.length) {
            clearInterval(intervalId);
            resolve(results);
            var isSuccess=true;
            results.forEach(r=>{
                if(!r) {
                    isSuccess=false;
                    return false;
                }
            })
            response.json({data:{success:isSuccess,}});
        }
        }, 100);
    });

});

// read
app.get('/getAll',(request,response) => {
    const db = DbService.getDbServiceInstance();
    const result = db.getAllData();

    result
    .then(data => response.json({data:data}))
    .catch(err => console.log(err));

});
app.post('/select',(request,response) => {
    const {query} = request.body;
    const db = DbService.getDbServiceInstance();
    const result = db.select(query);

    result
    .then(data => response.json({data:data}))
    .catch(err => console.log(err));

});
app.post('/getBasic',(request,response) => {
    const {template} = request.body;
    const {list} = request.body;
    const results = {};
    //console.log(template,list);
    var keys=Object.keys(template);
    keys.forEach((k)=>{
        if(list==undefined || list.length==0 || list.includes(k)){
            //console.log();
            
            const db = DbService.getDbServiceInstance();
            const result = db.getBasic(template[k].tablename);
            result
            .then(data => {
                console.log("in loop",k,data);
                results[k]=data;
            })
            .catch(err => console.log(err));
            
        }else{
            return;
        }
    });

    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            //console.log('results',Object.keys(results).length);
        if (Object.keys(results).length === Object.keys(template).length ||
        (list.length>1 && Object.keys(results).length==list.length)) {
            clearInterval(intervalId);
            //console.log('results',results);
            resolve(results);
            response.json({data:results});
        }
        }, 100);
    });

});

// create
app.post('/login',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {name} = request.body;
    const {pass} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.login(name,pass);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

// update


// delete
app.post('/delete',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {id} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.removeRow(id,table);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
app.post('/deleteRows',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {ids} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.removeRows(ids,table);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('app is runing at port: '+process.env.PORT))
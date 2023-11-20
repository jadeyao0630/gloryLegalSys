const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config();

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
    //console.log("request.body "+request.header('Content-Type'));
    const {data} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertNewCase(table,data);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
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

app.listen(process.env.PORT, () => console.log('app is runing at port: '+process.env.PORT))
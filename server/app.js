const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config();

const DbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// create
app.post('/insert',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {name} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertNewName(name);
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
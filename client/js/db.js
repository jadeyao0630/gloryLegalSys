var headers={
    'Content-Type': 'application/json'
};
async function getCaseLatestIndex(){
    var latestId=-1;
    var query="SELECT * FROM cases ORDER BY id DESC LIMIT 1"
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) latestId = data['data'][0].id;
    });
    return latestId;
}
async function getCasesData(res){
    var _data=undefined;
    var query="SELECT * FROM cases ORDER BY id ASC"
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) _data=data['data'];
    });
    res(_data);
}
async function getCasesStatus(res){
    var _data=undefined;
    var query="SELECT * FROM caseStatus ORDER BY id ASC"
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) _data=data['data'];
    });
    res(_data);
}
async function getUserList(res){
    var _data=undefined;
    await fetch('http://'+ip+':'+port+'/getAll')
    .then(response => response.json())
    .then(data => {if(data['data'].length>0) _data=data['data'];});
    res(_data);
}
async function insertCase(data,res){
    await fetch("http://"+ip+":"+port+"/insertCase",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ table: "cases", data:data})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        res(data.data);
    });
}
async function insert(table,data,res){
    await fetch("http://"+ip+":"+port+"/insert",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ table: table, data:data})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        res(data.data);
    });
}
async function createTable(table,template,res){
    await fetch("http://"+ip+":"+port+"/createTable",{
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ table: table, columns:template})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        res(data.data);
    });
}
async function getData(table,res){
    var _data=undefined;
    var query="SELECT * FROM "+table+" ORDER BY id ASC";
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) _data=data['data'];
    });
    res(_data);
}
function createBasicDatabase(list){
    $.each(basicTableList,async function(k,v){
        if(list==undefined || list.includes(k)){
            await createTable(v.tablename,v.template,function(r){
                console.log('createTable '+v.tablename+" "+r);
            });
        }else{
            return false;
        }
         
        
    })
}
function insertBasicDatabaseData(list){
    $.each(basicTableList,async function(k,v){
        if(list==undefined || list.includes(k)){
            await formatInsertData(k,v.data).forEach(async (data)=>{
                await insert(v.tablename,data,function(r){
                
                    console.log('insert '+v.tablename+" "+r);
                    console.log(data);
                });
            })
            
        }else{
            return false;
        }
         
        
    })
}
function getBasicDatabaseData(list){
    $.each(basicTableList,async function(k,v){
        if(list==undefined || list.includes(k)){
            await getData(v.tablename,function(r){
                //getDatabaseData(r);
                console.log('get '+v.tablename+" ");
                console.log(r);
                console.log( getDatabaseData(k,r));
            });
        }else{
            return false;
        }
         
        
    })
}
function formatInsertData(key,data){
    if(key=="caseStatus"){
        var _data=[];
        $.each(data,(i,element) => {
            if(element instanceof Array){
                
                $.each(element,(index,val)=>{
                    console.log(val);
                    _data.push({id:i+index/10,name:val});
                })
            }else{
                _data.push({id:i,name:element});
            }
        });
        return _data;
    }
}
function getDatabaseData(key,data){
    if(key=="caseStatus"){
        var _data=[];
        var _subData=[];
        $.each(data,(i,element) => {
            if(element.hasSub){
                _subData.push(element);
            }else{
                if(_subData.length>0){
                    _data.push(_subData);
                }
                _subData=[];
            }
            _data.push(element);
            
        });
        console.log(_data);
        return _data;
    }
}
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
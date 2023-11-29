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
            return;
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
async function getBasicDatabaseData(list){
    const response = new Promise((resolve,reject)=>{
        var datas={};
        var count=-1;
        var dataSize=Object.keys(basicTableList).length;
        $.each(basicTableList,async function(k,v){
            count++;
            if(list==undefined || list.includes(k)){
                
                var query="SELECT * FROM "+v.tablename+" ORDER BY id ASC";
                await fetch("http://"+ip+":"+port+"/select",{
                    headers:headers,
                    method: 'POST',
                    body: JSON.stringify({ query: query})
                })
                .then(response => response.json())
                .then(data => {
                    if(data['data'].length>0) {
                        datas[k]=formatDatabaseData(k,data['data'])
                        var event = jQuery.Event( "dataLoaded" );
                        event.key = k;
                        event.value = formatDatabaseData(k,data['data']);
                        //console.log(event.value);
                        $('body').trigger(event);
                        if(k=='attorneys') {
                            var _event = jQuery.Event( "dataLoaded" );
                            _event.value = "completed";
                            //console.log(event.value);
                            $('body').trigger(_event);
                        }
                    }
                });
                
            }else{
                return;
            }
           
        })
        
        resolve(datas);
    });
    var data=await response;
    //res(data);
    //console.log(response);
    return data;

}
function formatInsertData(key,data){
    if(key=="caseStatus"){
        var _data=[];
        $.each(data,(i,element) => {
            if(element instanceof Array){
                
                $.each(element,(index,val)=>{
                    console.log(val);
                    _data.push({id:i+index/10,name:val,isMain:false});
                })
            }else{
                _data.push({id:i,name:element, isMain:true});
            }
        });
        return _data;
    }else if(key=="caseLabels"){
        var _data=[];
        count=0;
        $.each(data,(key,val) => {
            _data.push({id:count,label:key,labelStyle:JSON.stringify(val)});
            count++;
        });
        return _data;
    }else if(key=="caseTypes"||key=="caseCatelogs"||key=='caseCauses'||key=='caseReason'||key=='propertyStatus'||key=='counselTitles'){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,label:val});
        });
        return _data;
    }else if(key=="projects"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }else if(key=="corporateCompanies"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }else if(key=="corporatePartners"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }else if(key=="legalAgencies"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val.name,authLevel:val.authLevel});
        });
        return _data;
    }else if(key=="legalCounsels"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val.name,contact:val.contact,title:val.title,institution:val.institution});
        });
        return _data;
    }
    else if(key=="attorneys"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val.name,contact:val.contact,title:val.title,lawFirm:val.lawFirm});
        });
        return _data;
    }
    else if(key=="lawFirms"||key=="legalInstitution"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }
    else if(key=="authLevels"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,descriptions:val});
        });
        return _data;
    }
}
function formatDatabaseData(key,data){
    if(key=="caseStatus"){
        var _data=[];
        var _subData=[];
        $.each(data,(i,element) => {
            if(element.isMain){
                if(_subData.length>0){
                    _data.push(_subData);
                }
                _subData=[];
                _data.push(element);
                
            }else{
                _subData.push(element);
            }
        });
        return _data;
    }else if(key=="caseLabels"){
        var _data={};
        $.each(data,(i,element) => {
            _data[element.label]=JSON.parse(element.labelStyle);
        });
        return _data;
    }else{
        var _data=[];
        $.each(data,(i,element) => {
            _data.push(element);
        });
        return _data;
    }
}
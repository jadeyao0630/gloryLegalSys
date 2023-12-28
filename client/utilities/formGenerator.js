function databaseBatchForm(data){
    var combineDB=Object.assign(basicTableList,caseTableList)
    var form= new mform({template:databasePage_form,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    if(data==undefined) form.setEmptyValues();
    else form.setData(data);
    $('#database_container').empty();
    $('#database_container').append(form.instance);
    $('#database_container').trigger('create');
    $('#database_container').find('.database-submit').on('click',function(e){
        form.getFormValues(function(e){
            console.log('databaseBatchForm',e)
            if(e.success){
                $().mloader("show",{message:"提交中...."});
                e.values.id=0;
                var tableName=combineDB[e.values.dbName].tablename;

                var range0=e.values["matchRange"].split(',')[0];
                var range1=e.values["matchRange"].split(',')[1];
                var rangeStr=range0==range1?"="+range0:(" BETWEEN \""+range0+"\" AND \""+range1+"\"");
                console.log(range0,range0);
                console.log("update "+tableName+ " set "+e.values.targetId+"=\""+e.values.targetValue+"\""+" where "+e.values.matchId+rangeStr);
                
                update(e.values.matchId+rangeStr,
                    tableName,
                    e.values.targetId+"=\""+e.values.targetValue+"\"",(e)=>{
                        console.log(e.data.message);
                        $().mloader("hide");
                        $().minfo('show',{title:"提示",message:"保存完成。"+e.data.data.message},function(){
                           // goToPage('#');
                        });

                })
                
            }
        });
    });
    $('#database_container').find('.database-insert-submit').on('click',function(e){
        form.getFormValues(function(e){
            console.log('databaseInsertForm',e)
            if(e.success){
                e.values.id=0;
                try{
                    var query=JSON.parse(e.values.insertQuery);
                    console.log(Object.keys(query));
                }catch(e){
                    $().minfo('show',{title:"提示",message:e},function(){
                        // goToPage('#');
                     });
                }
                //$().mloader("show",{message:"提交中...."});
                
                
            }
        });
    });
    $('#database_container').find('.database-reset').on('click',function(e){
        form.setEmptyValues();
    });
    $('#database_container').find('.database-insert-reset').on('click',function(e){
        form.setEmptyValues();
    });
    $('#database_container').find('#dbName').on('change',function(e){
        var combineDB=Object.assign(basicTableList,caseTableList)
        //console.log(combineDB[$(this).find("option:selected").text()].template);
        console.log($(this).find("option:selected").length,$(this).find("option:selected").text());
        if($(this).find("option:selected").length>0){
            var selectValue=$(this).find("option:selected").text();
            var keys=[];
            var select=$('#matchId');
            var select1=$('#targetId');
            select.empty();
            select1.empty();
            if(combineDB.hasOwnProperty(selectValue)){
                keys=Object.keys(combineDB[selectValue].template);
            }
            
            console.log(keys);
            databasePage_form.template.databseBatch.data.matchId.data=keys;
            databasePage_form.template.databseBatch.data.targetId.data=keys;
            
            keys.forEach((key,index)=>{
                var type=getDataColumnType(combineDB[selectValue].template[key]);
                
                select.append($('<option value="'+(index)+'">'+key+" ["+type+']</option>'));
                select1.append($('<option value="'+(index)+'">'+key+" ["+type+']</option>'));
            })
            select.selectmenu().selectmenu( "refresh" ).trigger('create');
            select1.trigger('create').selectmenu().selectmenu( "refresh" );
        }

        /*
        form.getFormValues(0,databasePage_form.template,function(message,values){
            //console.log("changed",values);
            if(values.data.dbName!="无" && values.key=="dbName"){
                console.log('databaseBatchForm',basicTableList[values.data.dbName])
            }
            

        });
        */
        //basicTableList[]
        //$('#database_container').find('#matchId')
    });
    return form;
}
function getDataColumnType(typeStr){
    var pk='';
    var unq='';
    if(typeStr.toLowerCase().indexOf('PRIMARY KEY'.toLowerCase())>0) pk=',主键';
    if(typeStr.toLowerCase().indexOf('UNIQUE'.toLowerCase())>0) unq=',唯一';
    if(typeStr.toLowerCase().indexOf('VARCHAR'.toLowerCase())==0) return '字符'+pk+unq;
    else if(typeStr.toLowerCase().indexOf('INT'.toLowerCase())==0) return '整数'+pk+unq;
    else if(typeStr.toLowerCase().indexOf('datetime'.toLowerCase())==0) return '日期时间'+pk+unq;
    else if(typeStr.toLowerCase().indexOf('bool'.toLowerCase())==0||typeStr.toLowerCase().indexOf('boolean'.toLowerCase())==0) return '布尔值'+pk+unq;
    return ''+pk+unq;
}
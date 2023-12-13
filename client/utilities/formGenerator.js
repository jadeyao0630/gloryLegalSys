function databaseBatchForm(data){
    var combineDB=Object.assign(basicTableList,caseTableList)
    var form= new mform({template:databasePage_form});
    if(data==undefined) form.setEmptyData();
    else form.setData(data);
    $('#database_container').empty();
    $('#database_container').append(form.instance);
    $('#database_container').trigger('create');
    $('#database_container').find('.database-submit').on('click',function(e){
        form.instance.getValues(0,databasePage_form.template,function(message,values){
            console.log('databaseBatchForm',values)
            if(values.success){
                var tableName=combineDB[values.data.values.dbName].tablename;

                var range0=values.data.values["matchRange"].split(',')[0];
                var range1=values.data.values["matchRange"].split(',')[1];
                var rangeStr=range0==range1?"="+range0:(" BETWEEN \""+range0+"\" AND \""+range1+"\"");
                console.log(range0,range0);
                console.log("update "+tableName+ " set "+values.data.values.targetId+"=\""+values.data.values.targetValue+"\""+" where "+values.data.values.matchId+rangeStr);
                
                update(values.data.values.matchId+rangeStr,
                    tableName,
                    values.data.values.targetId+"=\""+values.data.values.targetValue+"\"",(e)=>{
                        console.log(e);
                })
                
            }
        });
    });
    $('#database_container').find('.database-reset').on('click',function(e){
        form.setEmptyData();
    });
    $('#database_container').find('#dbName').on('change',function(e){
        form.instance.getValues(0,databasePage_form.template,function(message,values){
            //console.log("changed",values);
            if(values.data.dbName!="无" && values.key=="dbName"){
                console.log('databaseBatchForm',basicTableList[values.data.dbName])
            }
            

        });
        //basicTableList[]
        //$('#database_container').find('#matchId')
    });
    return form;
}
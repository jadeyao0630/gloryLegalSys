var lockeventListener=[];
var isAddPage=false;
var excutePoint=2;
$('.popup-add-table').on('click',function(e){
    //createBasicDatabase();
    //createTable('caseUpdates',caseUpdates);
    //createTable('caseExcutes',caseExcutes);
    //createTable('caseProperties',properties);
    //createTable('caseAttachments',attachments);
});
$('.popup-read-table').on('click', function(e){
    //getBasicDatabaseData(list).then(res=>console.log(res));

});
$('.popup-add-row').on('click', function(e){
    console.log('add row');
    //formatCasesData(DataList.casesDb);
    //insertBasicDatabaseData(list);
    //insertRows('caseUpdates',caseStatus_,(r)=>{})
    //insertRows('caseExcutes',caseExcutes_,(r)=>{})
    //insertRows('caseProperties',caseProperties_,(r)=>{})
    //insertRows('caseAttachments',caseAttachments_,(r)=>{})
});
$('#popupMenu').find('a').on('click',function(e){
    e.preventDefault();
    switch($(this).text()){
        case '设置':
            goToPage( $(this).attr( "href" ));
            break;
        case '退出':
            //goToPage( $(this).attr( "href" ));
            setGlobal("currentUser",undefined);
            window.location.href = 'index.html';
            break;
    }
    
})
var currentProgress={};
var tableFuntionButListenerList=[];
function setTableFunctionButonClickedEvent(){
    tableFuntionButListenerList.forEach(but=>{
        $(but).off('click', functionBtnsEvent);
    })
    tableFuntionButListenerList=[];
    $.each($("[name^='fn_btn']"),(index,btn)=>{
        setToolTip($(btn));
    })
    
    $("[name^='fn_btn']").on('click', functionBtnsEvent);
}
function setTableRowFunctionButonClickedEvent(buttons){
    
    $(buttons).on('click', functionBtnsEvent);
}
//#region 主表里的功能按钮
function functionBtnsEvent(but){
    tableFuntionButListenerList.push(but.currentTarget);
    var index=but.currentTarget.dataset.item;
    var matchItems=DataList.combinedData.filter((item) =>item.id == index);
    var matchedUpdates=DataList.caseUpdates.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProperties=DataList.caseProperties.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedAttachments=DataList.caseAttachments.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    //console.log(index+"--"+but.currentTarget.name,matchItems);

    if(but.currentTarget.name=="fn_btn_details"){//主表里的删除按钮
        showProgressDetails(matchItems,matchedUpdates,matchedExcutes,matchedProperties,matchedAttachments);
    }
    else if(but.currentTarget.name=="fn_btn_edit"){//主表里的编辑按钮
        isAddPage=false;
        if(matchItems.length>0){
            $().mloader("show",{message:"读取中...."});
            //_showEditForm(matchItems[0]);//naviation.js
            var _this=this;
            //$("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
            setGlobal("currentId", matchItems[0].id);
            //_setBlurBackgroundVisibility(true);
            goToPage( $(_this).attr( "href" ));
            setTimeout(function() {
                //console.log(matchItems[0]);
                //main_form.setData(matchItems[0]);
                //main_form.readOnly(false);
                //
                //console.log("data-role------"+$('.edit-header-btn[name="save_btn"').jqmData('role'));
                caseForm.setData(matchItems[0]);
                caseForm.readOnly(matchItems[0].isReadOnly);
                _setTitleBar("reg_form_title");
                $().mloader("hide");
            }, 500);
            //$('.progress_lock.edit-info').removeClass('hide');
            //_setFormReadOnly(data.isReadOnly);
            //_setBlurBackgroundVisibility(true);
            
        }
    }
    else if(but.currentTarget.name=="fn_btn_update"){//主表里的信息按钮
        $().mloader("show",{message:"读取中...."});
        $("#progress_details").empty();
        $("#progress_diagram").empty();
        setGlobal("currentId",index);
        progressInfoForm=_createNewCaseForm(progress_form_template,"progress_details");
        progressInfoForm.instance.find('#attorney').parent().css({"width": "250px"});
        goToPage( '#progress');
        if(matchItems.length>0){
            
            _setTitleBar("progress_title",'caseNo');
            var status_val=-1;
            if(matchItems.length>0){
                console.log("matchItems",matchItems[0]);
                progressInfoForm.setData(matchItems[0]).readOnly(matchItems[0].isReadOnly);
                //$("#progress_diagram").empty();
                status_val=Number(matchItems[0].caseStatus);
                
            }else{
                progressInfoForm.setEmptyData();
            }
            //console.log('status_val',status_val);
            
            var but=new ProgressesButton({
                steps:progresses,
                deadSteps:deads,
                showLabel:true,
                containerId:'#progress_diagram',
                currentPosition:status_val,
                fontSize:15,
                line_size:4,
                size:30,
                width:840,
                hasShadow:true,
                isViewMode:true,
                //verticalGap:2,
                //labelPosition:"bottom",
                showSubSteps:true,
                readOnly:matchItems[0].isReadOnly,
                showCounter:true,
                counterData:matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments),
            });
            //console.log("caseNo",matchItems[0].caseNo);
            currentProgress['currentDiagramButton']=but;
            $(but.instance).on("itemOnClicked",  function (e){
                console.log(but.opt.counterData);
                console.log('targetPosition...e',e);
                currentProgress['targetPosition']=e.Position;
                currentProgress['target']=e.target;
                currentProgress['originalPosition']=formatIndex(but.opt.currentPosition);
                currentProgress['isReadOnly']=matchItems[0].isReadOnly;
                
            //console.log('targetPosition...',currentProgress['targetPosition']);

                //$( "#update_panel" ).panel( "open" );
                var title=progresses[e.Position.main] instanceof Array?progresses[e.Position.main][e.Position.sub]:progresses[e.Position.main];
                
                $("#progress_popupMenu_title").text('请选择对 '+title+' 的操作');
                if(matchItems[0].isReadOnly) $('.progress_popupMenu_add_group').hide();
                else {
                    $('.progress_popupMenu_add_group').show();
                    
                }
                var exeBtn=$.grep($($('#progress_popupMenu_add_group').find('a')),(a)=>{
                    //console.log('setMainForm', $(a).text()=="执行");
                    return $(a).text()=="执行";
                });
                //console.log('setMainForm',e.Position.main);
                if((e.Position.main==3||e.Position.main==excutePoint)&&!matchItems[0].isReadOnly){
                    $(exeBtn).show();
                    $(exeBtn).css({'display':'block'});
                }else{
                    $(exeBtn).hide();
                }
                //$('#progress_popupMenu_add').find('ul').trigger('create').listview().listview('refresh');
               // $('#progress_popupMenu_add').find('div').trigger('create');
                //$('#progress_popupMenu_add').find('div').
                //console.log('progress_popupMenu_add',$('#progress_popupMenu_add').find('ul'));
                //console.log('progress_popupMenu_add',$("#progress_popupMenu").find('ul'));
                $("#progress_popupMenu").trigger('create');
                
                $("#progress_popupMenu").popup('open');
                $("#progress_popupMenu").popup('reposition',{x:e.event.pageX,y:e.event.pageY});
                $("#progress_popupMenu_add_group").listview().listview('refresh');
                //console.log($("#progress_popupMenu"));
            });
            $("#progress_diagram").trigger('create');
            $("#progress_details").trigger('create');
        }
        //setTimeout(function() {
            
        //},5000);
        $("#progress_details").trigger('create');
        setTimeout(function() {
            $().mloader("hide");
        },10);
    }
}
//#endregion /主表里的功能按钮
//流程图节点点击弹出菜单
$('#progress_popupMenu').find('a').on('click',async function(e){
    $('#progress_popupMenu').popup('close');
    var title=progresses[currentProgress['targetPosition'].main] instanceof Array?progresses[currentProgress['targetPosition'].main][currentProgress['targetPosition'].sub]:progresses[currentProgress['targetPosition'].main];
    var index=Number(sessionStorage.getItem("currentId"));
    var caseStatus=currentProgress['targetPosition'].main+currentProgress['targetPosition'].sub/10;
    var caseStatus_=$.grep(DataList.caseStatus,(d)=>Number(d.id)==index);
    
    console.log('currentId',index,caseStatus_,DataList.caseStatus)
    
    //console.log('dateSortItems',sortedItems,dateSortItems);
    var caseNo=caseStatus_[0].caseNo;
    switch($(this).text()){
        case '查看':
            //$( "#update_panel" ).panel( "open" );
            //$( "#progress_details_info" ).removeClass('hide');
            $().mloader('show',{message:"读取中..."});
            setTimeout(() => {
                var matchedUpdates=$.grep(DataList.caseUpdates,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus) && (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
                var matchedExcutes=$.grep(DataList.caseExcutes,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus) && (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
                var matchedProperties=$.grep(DataList.caseProperties,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus) && (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
                var matchedAttachments=$.grep(DataList.caseAttachments,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus) && (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
                
                var greatMatched=matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments);
                var dateSortItems={}
                greatMatched.forEach(item=>{
                    var _data=getEventsDetails(item);
                    var date=_data.date.replace(" ","");
                    if(!dateSortItems.hasOwnProperty(date)){
                        dateSortItems[date]=[];
                    }
                    dateSortItems[date].push(_data);
                })
                var sortedItems=Object.keys(dateSortItems).sort(function(a,b){
                    //console.log(a,dateSortItems[a],b,dateSortItems[b]);
                    //console.log(dateSortItems[a][0].originalDate,dateSortItems[b][0].originalDate,dateSortItems[a][0].originalDate>dateSortItems[b][0].originalDate);
                    return dateSortItems[a][0].originalDate>dateSortItems[b][0].originalDate;
                });
                //console.log('查看...',sessionStorage.getItem("currentId"));
                //_setTitleBar("progress_details_info_title",'caseNo');
                console.log('查看...',index,caseStatus,DataList.caseUpdates);
                
                console.log('查看...',greatMatched);
                $('#progress_details_info_body').empty();
                $('#progress_details_info_title').text(title);
                sortedItems.forEach(date=>{
                    var items=dateSortItems[date];
                    console.log('items',items);
                //$.each(dateSortItems,(date,items)=>{
                    var date_bar=$('<li data-role="list-divider">'+date+'<span class="ui-li-count">'+items.length+'</span></li>');
                    $('#progress_details_info_body').append(date_bar);
                    items.forEach(item=>{
                        var item_container=$('<li data-item=\''+JSON.stringify(item)+'\'></li>');
                        //console.log('JSON.stringify',item_d);
                        var del_btn;
                        if(item.hasOwnProperty('evidenceId')){
                            var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+"["+item.typeName+"] "+item.description+'</h3>');
                            
                            item_container=$('<li style="padding:0px;" data-item=\''+JSON.stringify(item)+'\'></li>');
                            var group=$('<div style="display: grid;grid-template-columns: 1fr auto auto;grid-gap: 0px;margin:-8px 0px;"></div>');
                            var view_btn=$('<a href="#" class="ui-btn ui-icon-eye ui-btn-icon-notext btn-icon-blue view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">查看</a>')
                            del_btn=$('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red view-list-button" style="padding:10px 5px;border: none;">删除</a>')
                            
                            if(item.isInactived){
                                del_btn=$('<a href="#" class="ui-btn ui-icon-recycle ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border: none;">还原</a>')
                            }
                            group.append(list_item);
                            group.append(view_btn);
                            group.append(del_btn);
                            view_btn.jqmData('label',list_item);
                            item_container.append(group);
                        }else{
                            var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+"["+item.typeName+"] "+item.description+'</h3>');
                            
                            item_container=$('<li style="padding:0px;" data-item=\''+JSON.stringify(item)+'\'></li>');
                            var group=$('<div style="display: grid;grid-template-columns: 1fr auto auto;grid-gap: 0px;margin:-8px 0px;"></div>');
                            var view_btn=$('<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext btn-icon-blue view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">编辑</a>')
                            del_btn=$('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red view-list-button" style="padding:10px 5px;border: none;">删除</a>')
                            
                            if(item.isInactived){
                                del_btn=$('<a href="#" class="ui-btn ui-icon-recycle ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border: none;">还原</a>')
                            }
                            group.append(list_item);
                            group.append(view_btn);
                            group.append(del_btn);
                            view_btn.jqmData('label',list_item);
                            item_container.append(group);
                        }
                        
                        
                        
                        $('#progress_details_info_body').append(item_container);
                    })
                })
            
                $('#progress_details_info_body').find('a.view-list-button').on('click',function(e){
                    //console.log($(this));
                    var _this=this;
                    var typeName=$(this).text().length==0?$(this).attr('title'):$(this).text();
                    var data=$(this).closest('li').data('item');
                    //console.log($(this).closest('li'),data.id,data.type,data.key,typeName);
                    switch(typeName){
                        case '查看':
                            break;
                        case '编辑':
                            //console.log(data.id,data.type,data.key,typeName)
                            var itemData=getDataById(DataList[data.type],data.key,data.id);
                            console.log(itemData)
                            switch (data.type){
                                case 'caseUpdates':
                                    console.log("进展");
                                    var form= new mform({template:add_update_template});
                                    var data={table:data.type,idkey:'updatesId',dateKey:'dateUpdated',data:itemData};
                                    
                                    itemData['dateUpdated']=getDateTime();
                                    form.setData(itemData);
                                    $('#progress_popup_edit_title').text("修改进展");
                                    $('#progress_popup_edit_form').empty();
                                    $('#progress_popup_edit_form').append(form.instance);
                                    $('#progress_popup_edit_form').trigger('create');
                                    //console.log(JSON.stringify(data));
                                    $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                                    form.instance.jqmData('label',$(this).jqmData('label'));
                                    $('.progress_popup_edit_form_submit').jqmData('form',form);
                                    $('#progress_popup_edit').trigger('create');
                                    $('#progress_popup_edit').popup('open');
                                    //setProgressPopupForm(add_update_template,"添加新的进展",{table:'caseUpdates',key:'updatesId',dateKey:'dateUpdated',id:itemData.id,caseStatus:itemData.caseStatus,caseNo:itemData.caseNo});
                                    break;
                                case 'caseExcutes':
                                    console.log("执行");
                                    var form= new mform({template:add_execute_template});
                                    var data={table:data.type,idkey:'excutesId',dateKey:'dateExecuted',data:itemData};
                                    
                                    itemData['dateExecuted']=getDateTime();
                                    form.setData(itemData);
                                    $('#progress_popup_edit_title').text("修改执行");
                                    $('#progress_popup_edit_form').empty();
                                    $('#progress_popup_edit_form').append(form.instance);
                                    $('#progress_popup_edit_form').trigger('create');
                                    //console.log(JSON.stringify(data));
                                    $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                                    form.instance.jqmData('label',$(this).jqmData('label'));
                                    $('.progress_popup_edit_form_submit').jqmData('form',form);
                                    $('#progress_popup_edit').trigger('create');
                                    $('#progress_popup_edit').popup('open');
                                    break;
                                case 'caseProperties':
                                    console.log("财产");
                                    var form= new mform({template:add_property_template});
                                    var data={table:data.type,idkey:'propertyId',dateKey:'dateUpdated',data:itemData};
                                    
                                    itemData['dateUpdated']=getDateTime();
                                    form.setData(itemData);
                                    $('#progress_popup_edit_title').text("修改资产变更");
                                    $('#progress_popup_edit_form').empty();
                                    $('#progress_popup_edit_form').append(form.instance);
                                    $('#progress_popup_edit_form').trigger('create');
                                    //console.log(JSON.stringify(data));
                                    $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                                    form.instance.jqmData('label',$(this).jqmData('label'));
                                    $('.progress_popup_edit_form_submit').jqmData('form',form);
                                    $('#progress_popup_edit').trigger('create');
                                    $('#progress_popup_edit').popup('open');
                                    //setProgressPopupForm(add_property_template,"添加新的财产变更",{table:'caseProperties',key:'propertyId',dateKey:'dateUpdated',id:index,caseStatus:caseStatus,caseNo:caseNo});
                                    break;
                                case 'caseAttachments':
                                    console.log("附件");
                                    var form= new mform({template:add_property_template});
                                    var data={table:data.type,idkey:'evidenceId',dateKey:'dateUploaded',data:itemData};
                                    
                                    itemData['dateUploaded']=getDateTime();
                                    form.setData(itemData);
                                    $('#progress_popup_edit_title').text("修改附件证明");
                                    $('#progress_popup_edit_form').empty();
                                    $('#progress_popup_edit_form').append(form.instance);
                                    $('#progress_popup_edit_form').trigger('create');
                                    //console.log(JSON.stringify(data));
                                    $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                                    form.instance.jqmData('label',$(this).jqmData('label'));
                                    $('.progress_popup_edit_form_submit').jqmData('form',form);
                                    $('#progress_popup_edit').trigger('create');
                                    $('#progress_popup_edit').popup('open');
                                    //setProgressPopupForm(add_evidence_template,"添加新的附件证明",{table:'caseAttachments',key:'evidenceId',dateKey:'dateUploaded',id:index,caseStatus:caseStatus,caseNo:caseNo});
                                    break;
                            }
                            break;
                        case '删除':
                            console.log('删除');
                            inactiveItem(data.key+'='+data.id,data.type,function(r){
                                var value={isInactived:1}
                                value[data.key]=data.id;
                                DataList[data.type]=updateOriginalData(DataList[data.type],value,data.key);
                                currentProgress['currentDiagramButton'].opt.counterData=updateOriginalData(currentProgress['currentDiagramButton'].opt.counterData,value,data.key);
                                $(_this).removeClass('ui-icon-delete').addClass('ui-icon-recycle');
                                $(_this).removeClass('btn-icon-red').addClass('btn-icon-blue');
                                $(_this).text('还原');
                                $(_this).attr('title','还原');
                                $(_this).trigger('create');
                            });
                            
                            break;
                        case '还原':
                            
                            restoreItem(data.key+'='+data.id,data.type,function(r){
                                var value={isInactived:0}
                                value[data.key]=data.id;
                                DataList[data.type]=updateOriginalData(DataList[data.type],value,data.key);
                                currentProgress['currentDiagramButton'].opt.counterData=updateOriginalData(currentProgress['currentDiagramButton'].opt.counterData,value,data.key);
                                $(_this).removeClass('ui-icon-recycle').addClass('ui-icon-delete');
                                $(_this).removeClass('btn-icon-blue').addClass('btn-icon-red');
                                $(_this).text('删除');
                                $(_this).attr('title','删除');
                                $(_this).trigger('create');
                            });
                            break;
                    }
                })
                //$('#progress_details_info_body').trigger('create');
                $('#progress_details_info_body').listview().listview('refresh');
                goToPage( "#progress_details_info");
                $().mloader('hide');
            }, 200);
            //goToPage( "#progress_details_info");
            break;
        case '进展':
            console.log("进展");
            
            setProgressPopupForm(add_update_template,"添加新的进展",{table:'caseUpdates',key:'updatesId',dateKey:'dateUpdated',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
        case '执行':
            console.log("执行");
            setProgressPopupForm(add_execute_template,"添加新的执行",{table:'caseExcutes',key:'excutesId',dateKey:'dateExecuted',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
        case '财产':
            console.log("财产");
            setProgressPopupForm(add_property_template,"添加新的财产变更",{table:'caseProperties',key:'propertyId',dateKey:'dateUpdated',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
        case '附件':
            console.log("附件");
            
            setProgressPopupForm(add_evidence_template,"添加新的附件证明",{table:'caseAttachments',key:'evidenceId',dateKey:'dateUploaded',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
    }
})

function checkProgressEdiableStatus(){
    console.log("clicked position",currentProgress['targetPosition'],"status position",currentProgress['originalPosition']);
    if(currentProgress['targetPosition'].main>currentProgress['originalPosition'].main){
        return "new";
    }else{
        if(currentProgress['targetPosition'].main==currentProgress['originalPosition'].main){
            if(currentProgress['targetPosition'].sub==currentProgress['originalPosition'].sub || currentProgress['originalPosition'].main>excutePoint) return "update";
            else return "shift";
        }else{
            if(currentProgress['targetPosition'].main==excutePoint && currentProgress['originalPosition'].main>excutePoint && currentProgress['targetPosition'].sub!=currentProgress['originalPosition'].sub)
                return "shift";
            else return "update";
        }
    }
    //currentProgress['targetPosition']=e.Position;
    //currentProgress['originalPosition']=formatIndex(but.opt.currentPosition);
}
$('.progress_popup_add_form_submit').on('click', updateSubmitEvent)

$('.progress_popup_edit_form_submit').on('click', function (e){
    $(window).trigger('saving');
    console.log($(this).data('item'));
    var data=JSON.parse($(this).data('item'));
    
    var form=$(this).jqmData('form');
    form.instance.getValues(0,form.opt.template.template, function(message,values){
        console.log(values);
        if(values.success){
            var vals=[];
            var newData={};
            $.each(values.data.values,(key,val)=>{
                if(key!='id'){
                    vals.push(key+'="'+val+'"');
                    newData[key]=val;
                }
            })
            newData[data.dateKey]=getDateTime();
            newData[data.idkey]=data.data[data.idkey];
            update("id="+data.data.id+" AND "+data.idkey+"="+data.data[data.idkey],
                data.table,
                vals.join(),async function(r){
                //console.log('update result',r);
                var formatData=getEventsDetails(newData);
                form.instance.jqmData('label').text("["+formatData.typeName+"] "+formatData.description);
                //console.log('DataList['+data.table+'] before',DataList[data.table]);
                DataList[data.table]=updateOriginalData(DataList[data.table],newData,data.idkey);
                history.back();
                $(window).trigger('hidepopup');
                //console.log('DataList['+data.table+'] after',DataList[data.table]);
                //await currentProgress['currentDiagramButton'].setStep(currentProgress['target']);
            })
            
        }
    });
})
function updateSubmitEvent(e){
    console.log($(this).data('item'));
    var data=JSON.parse($(this).data('item'));
    
    var form=$(this).jqmData('form');
    console.log(form.opt.template);
    form.instance.getValues(0,form.opt.template.template, function(message,values){
        console.log(values);
        if(values.success){
            var editableStatus=checkProgressEdiableStatus();
            var goNext=false;
            var intervalId;
            if(editableStatus!="new" && editableStatus!="update"){
                //var list2delete=[];
                var tables={};
                var deleteItem=currentProgress['currentDiagramButton'].opt.counterData.filter((d)=>{
                    var isMatched=false;
                    if(formatIndex(d.caseStatus).main>=currentProgress['targetPosition'].main && formatIndex(d.caseStatus).sub!=currentProgress['targetPosition'].sub){
                        var matcher=Object.keys(tableNamesMatcher);
                        matcher.forEach(match=>{
                            if(d.hasOwnProperty(match)){
                                if(!tables.hasOwnProperty(tableNamesMatcher[match])){
                                    tables[tableNamesMatcher[match]]=[];
                                }
                                tables[tableNamesMatcher[match]].push(d);
                            }
                        })
                        //tables[]
                        isMatched=true;
                    }
                    return isMatched;
                })
                
                
                $('#progress_popup_add').popup('close');
                setTimeout(() => {
                    $().requestDialog({
                        title:'提示',
                        message:"再次确认！这个操作将会删除已有的("+deleteItem.length+")条记录，你继续吗？",
                    },function(go){
                        goNext=go;
                        if(!go) clearInterval(intervalId);
                        else{
                            
                        }
                        setTimeout(() => {
                            $('#progress_popup_add').popup('open');
                        }, 200);
                    });
                }, 200);
                
            }else{
                
                goNext=true;
            }
            intervalId = setInterval(async() => {
                if (goNext) {
                    clearInterval(intervalId);
                    $().mloader("show",{message:"提交中...."});
                    //var files=[];
                    var idx=await getRecordLatestIndex(data.table,data.key);
                    if(data.table!='caseAttachments'){
                        var subidx=await getRecordLatestIndex(data.table,'subId','caseStatus='+data.caseStatus);
                        values.data.values.subId=subidx+1;
                    }else{
                        //files=values.data.caseAttachments;
                        if(values.data.values.filePath.length>0){
                            values.data.values.filePath=values.data.values.filePath[0].name;
                        }
                        
                        //values.data.caseAttachments
                    }
                    /*
                    if(files.length>0){
                        var filePath=[];
                        $.each(files,(index,file)=>{
                            filePath.push({
                                id:data.id,
                                caseNo:data.caseNo,
                                evidenceId:idx+1,
                                aseStatus:data.caseStatus,
                            });
                        });
                        //values.data.caseAttachments=
                    }
                    */
                    //console.log(data.table+" id",idx,data.table+" subid",subidx);
                    values.data.values[data.key]=idx+1;
                    values.data.values.caseNo=data.caseNo;
                    values.data.values.id=data.id;
                    values.data.values.isInactived=0;
                    values.data.values.caseStatus=data.caseStatus;
                    values.data.values[data.dateKey]=getDateTime();
                    var newCaseStatus=currentProgress['targetPosition'].main+(currentProgress['originalPosition'].main>excutePoint && currentProgress['targetPosition'].main> currentProgress['originalPosition'].main?currentProgress['originalPosition'].sub:currentProgress['targetPosition'].sub)/10;
                    if(editableStatus=="new" || editableStatus=="shift"){
                        update("id="+data.id,'caseStatus','caseStatus="'+newCaseStatus+'"',async function(r){
                            console.log('update result',r);
                            $.each(DataList.combinedData,(index,item)=>{
                                if(item.id == data.id) {
                                    DataList.combinedData[index].caseStatus=newCaseStatus;
                                    return false;
                                }
                            });
                            await currentProgress['currentDiagramButton'].setStep(currentProgress['target']);
                        })
                        if(editableStatus=="shift"){
                            $.each(tables,(table,del)=>{
                    
                                del.forEach((dl)=>{
                                    //console.log(table,del.length,dl.caseStatus,dl.id);
                                    inactiveItem("caseStatus="+dl.caseStatus+" AND id="+dl.id,table);
                                    var index=currentProgress['currentDiagramButton'].opt.counterData.indexOf(dl);
                                    console.log("indexOf",index)
                                    if(index>-1){
                                        //currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=1;
                                        currentProgress['currentDiagramButton'].opt.counterData.splice(index, 1);
                                    }
                                    index=DataList[table].indexOf(dl);
                                    if(index>-1){
                                        //currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=1;
                                        DataList[table][index].isInactived=1;
                                    }
                                })
                            })
                            console.log('DataList',DataList);
                        }
                    }
                    
                    console.log("final values",data.table,values.data.values);
                    insert(data.table,values.data.values,(r)=>{
                        console.log('insert result',data.table,r,currentProgress['target']);
                        
                        DataList[data.table].push(values.data.values);
                        
                        currentProgress['currentDiagramButton'].opt.counterData.push(values.data.values);
                        currentProgress['currentDiagramButton'].updateCounterIndicator(data);
                        
                        $().mloader("hide");
                    
                    });
                    history.back();
                }
            }, 100);
        }
        

    });
}
function setProgressPopupForm(template,title,data){
    console.log('checkProgressEdiableStatus',checkProgressEdiableStatus());
    var editableStatus=checkProgressEdiableStatus();
    var goNext=false;
    var intervalId;
    if(editableStatus!="new" && editableStatus!="update"){
        $().requestDialog({
            title:'提示',
            message:"这个操作将会删除已有的记录，你确定吗？",
        },function(go){
            goNext=go;
            if(!go) clearInterval(intervalId);
            else{

            }
        });
    }else{
        goNext=true;
    }
    intervalId = setInterval(() => {
        if (goNext) {
            clearInterval(intervalId);
            setTimeout(() => {
                $().mloader("show",{message:"读取中...."});
                var form= new mform({template:template});
                $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" "+title);
                $('#progress_popup_add_form').empty();
                $('#progress_popup_add_form').append(form.instance);
                $('#progress_popup_add_form').trigger('create');
                $('.progress_popup_add_form_submit').data('item',JSON.stringify(data));
                
                $('.progress_popup_add_form_submit').jqmData('form',form);
                $('#progress_popup_add').popup('open');
                $().mloader("hide");
            }, 200);
            
        }
    }, 100);
    
}
//第一页左下方 添加 删除 按钮事件
$('.case_reg_but').on('click',async function(e){
    e.preventDefault();
    if(this.id=="case_reg_but_add"){//第一页左下方 添加
        isAddPage=true;
        $().mloader("show",{message:"读取中...."});
        await getCaseLatestIndex().then(id=>{
            
            sessionStorage.setItem("currentId", id+1);
            
            //main_form.readOnly(false);
            //main_form.instance.setEmptyData(FormTemplate.template);
            //main_form.readOnly(false).setEmptyData();
            //main_form.instance.setEmptyData()
            //
            
            //main_form.readOnly(false).setEmptyData();
            $('.progress_lock.edit-info').addClass('hide');
            //console.log($('.progress_lock.edit-info'));
            $("#reg_form_title").html("新增档案");
            $('.edit-header-btn[name="save_btn"').show();
            //_setBlurBackgroundVisibility(true);
            goToPage( $(this).attr( "href" ));
           // main_form.readOnly(false).setEmptyData();
                //$().mloader("hide");
            setTimeout(function() {
                caseForm.readOnly(false).setEmptyData();
                
                $().mloader("hide");
            }, 10);
            //main_form.setData(getGlobalJson("mainData")[0]);
            //$("#fullscreenPage").trigger('create');
            //main_form.instance.trigger('create');
        });
        
    }else if(this.id=="case_reg_but_remove"){
        var targetTable='#pageOneTable';
        
        //console.log($('#pageOneTable').find('input[type="checkbox"][name="item_checkbox"]:checked'));
        var checked=$(targetTable).find('input[type="checkbox"][name="item_checkbox"]:checked');
        console.log(checked);
        if(checked.length>0){
            $().requestDialog({
                title:'提示',
                message:"确认删除所选案件吗？",
            },function(form){
                console.log("删除");
                
                pageOnTable.removeTableItem(getGlobalJson('currentUser').level,function(ids){
                    console.log(ids);
                    if(getGlobalJson('currentUser').level==adminLevel){
                        
                        $.each(DataList.combinedData,function(index,item){
                            if(ids.includes(item.id)){
                                DataList.combinedData[index].isInactived=1;
                            }
                        });
                    }else{
                        DataList.combinedData=$.grep(DataList.combinedData,function(val){
                            return !ids.includes(val.id);
                        });
                        currentData=$.grep(currentData,function(val){
                            return !ids.includes(val.id);
                        });
                    }
                    
                    console.log(DataList.combinedData);
                    $('.reg-checkbox-all').prop("checked",false);
                    //pageSeTable.pageTable('refresh');
                    //DataList.combinedData=data;
                    //if(enableRealDelete) 
                        inactiveCases(ids,(res)=>console.log);
                    setTimeout(() => {
                        //fancyTable1.tableUpdate($("#pageOneTable"));
                        $("#pageOneTable").trigger('create');
                    }, 1000);
                    
                })
                //_initRegTable(r,firstPageTableColumns,"pageOneTable");
                
                //$("#pageOneTable").hpaging({ limit: 5 });
                //$("#pageOneTable").trigger('create');
            });
        }
        
       
    }else if(this.id=="case_reg_but_restore"){
        var targetTable='#pageOneTable';
        var checked=$(targetTable).find('input[type="checkbox"][name="item_checkbox"]:checked');
        console.log(checked);
        if(checked.length>0){
            $().requestDialog({
                title:'提示',
                message:"确认恢复所选案件吗？",
            },function(form){
                console.log("恢复");
                pageOnTable.restoreTableItem(function(ids){
                    console.log(ids);
                    
                    $.each(DataList.combinedData,function(index,item){
                        if(ids.includes(item.id)){
                            DataList.combinedData[index].isInactived=0;
                        }
                    });
                    
                    console.log(DataList.combinedData);
                    $('.reg-checkbox-all').prop("checked",false);
                    //pageSeTable.pageTable('refresh');
                    //DataList.combinedData=data;
                    //if(enableRealDelete) 
                        restoreCases(ids,(res)=>console.log);
                        setTimeout(() => {
                            //fancyTable1.tableUpdate($("#pageOneTable"));
                            $("#pageOneTable").trigger('create');
                        }, 1000);
                    
                });
            });
        }
    }
})
//#region 查看信息页面的按钮事件
function showProgressDetails(datas,updates,excutes,properties,attachments){
    $().mloader('show',{message:"读取中..."});
    if(datas.length>0){
        //window.location="./test/timeline.html"
        $("#summary_list").children().remove();
        var data={
            template:["立案","一审","二审","执行","结案","再审","监督"],
            basic:datas[0],
            updates:updates,
            excutes:excutes,
            properties:properties,
            attachments:attachments,
            
        }
        
    //console.log('showProgressDetails',data);
        //if(datas[0].id>30){
            //dataList=[];
        //}

        $('#timelineTitle').text(datas[0].caseNo);
        var canvas=document.getElementById('myCanvas');
        //eventManager.setCanvas(canvas);

        new timelinePage({template:_summary_template,data:data,summaryListContainer:"#summary_list",canvas:canvas});
        $("#summary_list").trigger('create');
        goToPage( "#timeline");
        //$("#page4").removeClass('hide');
        //$(getGlobal('currentPage')).addClass('hide');
        //_setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,matchItems[0].id);
    }
    setTimeout(function() {
        $().mloader("hide");
    },10);
}
//#region 保存按钮事件
$('.edit-header-btn').on('click',function(e){
    console.log('currentPage',sessionStorage.getItem('currentPage'));
    if($(this).text()=="保存"){
        //console.log("保存");
        //console.log($(pageOnTable).html())
        if(sessionStorage.getItem('currentPage')=="#casePage"){
            caseForm.instance.getValues(getGlobal("currentId"),FormTemplate3.template,function(message,values){
                console.log('getvalues',values);
                if(values.success){
                    //console.log(message.message);
                    if(isAddPage){
                        values.data.caseStatus['penalty']='0.00';
                        values.data.caseStatus['paidAmount']='0.00';
                        values.data.caseStatus['caseStatus']=-1;
                        values.data.caseStatus['lawFirm']=0;
                        values.data.caseStatus['attorney']='无0';
                        values.data.caseStatus['FirstInstance']='0000-00-00 00:00:00';
                        values.data.caseStatus['SecondInstance']='0000-00-00 00:00:00';
                    }
                    values.data.values=Object.assign(values.data.values,values.data.caseStatus);
                    console.log('save data',values.data);
                    values.data.values["caseCreateDate"]=getDateTime();
                    //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
                    if(getGlobalJson("currentUser")==null || getGlobalJson("currentUser")==undefined){
                        $().minfo('show',{title:"错误: "+error.FORM_INVALID_USER.message,message:"是否跳转到登录页面？"},function(){
                            //HideMessage();
                            window.location.href = 'index.html';
                        });
                    }else{
                        values.data.values["caseApplicant"]=getGlobalJson("currentUser").id;
                        values.data.values["isReadOnly"]=_isReadOnlyCurrentForm();
                        values.data.values["id"]=Number(values.data.values["id"]);
                        history.back();
                        if(isAddPage){
                            pageOnTable.insertTableData(values.data.values);
                            setTableRowFunctionButonClickedEvent($("[name^='fn_btn'][data-item="+values.data.values.id+"]"));
                        }
                        //pageOnTable.addTableData([values.data.values],true);
                        //console.log('保存',values.data.values.id,$("[name^='fn_btn'][data-item="+values.data.values.id+"]"));
                        //setTableRowFunctionButonClickedEvent($("[name^='fn_btn'][data-item="+values.data.values.id+"]"));
                        if(enableRealDelete){
                            $().mloader('show',{message:"保存中..."});
                            //console.log(values.data);
                            insertCase(values.data.values,caseInfoList,function(r){
                                //console.log(r);
                                if(r.success){
                                    console.log("修改添加成功。");
                                    $().minfo('show',{title:"提示",message:"保存完成。"},function(){
                                        goToPage('#');
                                    });
                                    console.log('pageOneTable id',$('#pageOneTable').find('tr[data-item='+values.data.values.id+']'));
                                    pageOnTable.updateTableData(values.data.values,$('#pageOneTable').find('tr[data-item='+values.data.values.id+']'));
                                    
                                    DataList.combinedData=updateOriginalData(DataList.combinedData,values.data.values,'id');//tools.js
                                    DataList.caseStatus=updateOriginalData(DataList.caseStatus,values.data.values,'id');//tools.js
                                }else{
                                    console.log(r);
                                    $().minfo('show',{title:"错误",message:r.error});
                                }
                                $().mloader('hide');
                            });
                        }else{
                            
                            pageOnTable.updateTableData(values.data.values,$('#pageOneTable').find('tr[data-item='+values.data.values.id+']'));
                            DataList.combinedData=updateOriginalData(DataList.combinedData,values.data.values,'id');
                            DataList.caseStatus=updateOriginalData(DataList.caseStatus,values.data.values,'id');//tools.js
                            currentData=updateOriginalData(currentData,values.data.values,'id');//tools.js
                        }
                        if(isAddPage){
                            currentData.push(values.data.values);
                            DataList.combinedData.push(values.data.values);
                            DataList.caseStatus.push(values.data.values);
                        }
                        setTimeout(() => {
                            //syncHeaderCloneWidth();
                        }, 100);
                    }
                    
                    
                }else{
                    console.log(message.message+(message.id==0?" 但是有错误。":""));
                }
            });
        
        }else if(sessionStorage.getItem('currentPage')=="#progress"){
            progressInfoForm.instance.getValues(getGlobal("currentId"),progress_form_template.template,function(message,values){
                //console.log(values)
                if(values.success){
                    $(window).trigger('saving');
                    var data=[];
                    var newValue={};
                    $.each(values.data.values,(key,val)=>{
                        if(key!='id'){
                            data.push(key.replace("_p","")+"=\""+val+"\"");
                        }
                        newValue[key.replace("_p","")]=val;
                    })
                    //console.log(data.join());
                    update('id='+newValue.id,'caseStatus',data.join(),function(r){
                        pageOnTable.updateTableData(newValue,$('#pageOneTable').find('tr[data-item='+newValue.id+']'));
                        DataList.caseStatus=updateOriginalData(DataList.caseStatus,newValue,'id');
                        DataList.combinedData=updateOriginalData(DataList.combinedData,newValue,'id');
                        currentData=updateOriginalData(currentData,newValue,'id');//tools.js
                        console.log(DataList.caseStatus);
                        $(window).trigger('hidepopup');
                    });
                }
            });
        }
    }
        
})
//#endregion
function _setTitleBar(titlebarId,displayKey){
    var lockedTitle="查看案件";
    var unlockedTitle="修改案件";
    titlebarId=titlebarId.replace("#","");
    var matched=DataList.combinedData.filter((d)=>{return d.id==sessionStorage.getItem("currentId")});
    if(matched.length>0){
        if(displayKey!=undefined){
            lockedTitle=matched[0][displayKey];
            unlockedTitle=matched[0][displayKey];
        }
        if(matched[0].isReadOnly) {
            $("#"+titlebarId).html('<i class="fa fa-lock text-red edit-lock"></i>'+lockedTitle);
            $('.edit-header-btn[name="save_btn"').hide();
        }
        else {
            $("#"+titlebarId).html('<i class="fa fa-unlock text-green edit-lock"></i>'+unlockedTitle);
            $('.edit-header-btn[name="save_btn"').show();
        }
    }
    if(!lockeventListener.includes(titlebarId)){
        console.log(titlebarId+"没有注册锁按钮事件。。");
        $("#"+titlebarId).on('click',lockEvent);
        lockeventListener.push(titlebarId);
    }
        

}
function lockEvent(e){
    var _this=this;
    $().requestPassword(function(res){
        if(res.success){
            console.log("登陆成功。。")
            var id=getGlobal("currentId");
            var datas=DataList.combinedData.filter(d=>d.id==id);
            if(datas.length>0){
                //console.log(Boolean(datas[0].isReadOnly));
                datas[0].isReadOnly=!Boolean(datas[0].isReadOnly);
                //console.log(datas[0].isReadOnly);
                if(datas[0].isReadOnly) {
                    if(_this.id=="reg_form_title"){
                        $("#reg_form_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+"查看档案");
                    }else if(_this.id=="progress_title"){
                        $("#progress_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+$("#progress_title").text());
                        
                    }else if(_this.id=="progress_details_info_title"){
                        $("#progress_details_info_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+$("#progress_details_info_title").text());
                        
                    }
                    $('.edit-header-btn[name="save_btn"').hide();
                }
                else {
                    if(_this.id=="reg_form_title"){
                        $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                    }else if(_this.id=="progress_title"){
                        $("#progress_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+$("#progress_title").text());
                        
                    }else if(_this.id=="progress_details_info_title"){
                        $("#progress_details_info_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+$("#progress_details_info_title").text());
                        
                    }
                    $('.edit-header-btn[name="save_btn"').show();
                }
                
                //_setFormReadOnly(data.isReadOnly);
                //console.log(getGlobalJson('mainData'));
                if(_this.id=="reg_form_title"){
                    caseForm.readOnly(datas[0].isReadOnly);
                }else if(_this.id=="progress_details_info_title"){
                    
                }else if(_this.id=="progress_title"){
                    progressInfoForm.readOnly(datas[0].isReadOnly);
                    currentProgress['currentDiagramButton'].switchReadyOnly();
                }
            }
        }else{
            $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
        }
        
    });
}
function _isReadOnlyCurrentForm(){
    var datas=DataList.combinedData.filter(d=>d.id==getGlobal("currentId"));
    if(datas.length>0)
        return datas[0].isReadOnly;
    return true;
}
function formatCasesData(data){
	$.each(data,(index,cas)=>{
		var personnel=cas['casePersonnel'];
		var case2ndParty=cas['case2ndParty'];
		var val=[];
		var case2ndPartyVal=[];
		//case2ndPartyVal=convertOldData(case2ndParty,casePersonnelStatus);
		if(case2ndParty.indexOf('；')>-1 || case2ndParty.indexOf('、')>-1|| case2ndParty.indexOf('(')>-1|| case2ndParty.indexOf('（')>-1){
			var sencodParty=[];
			if(case2ndParty.indexOf('；')>-1)
				sencodParty=case2ndParty.split('；');
			else if(case2ndParty.indexOf('、')>-1)
				sencodParty=case2ndParty.split('、');
			else
				sencodParty=[case2ndParty];
			
			$.each(sencodParty,(index,party)=>{
				if(party.length>0){
					var party_data=party.split('(');
					if(party.indexOf('（')>-1){
						party_data=party.split('（');
					}
					var party_name="";
					var party_status="无";
					var party_status_id=0;
					if(party_data.length>1){
						party_name=party_data[0];
						party_status=party_data[1].replace(')','').replace('）','');
						party_status_id=casePersonnelStatus.indexOf(party_status);
	
					}else if(party_data.length==1){
						party_name=party_data[0];
					}
					
					if(party.indexOf('（')>-1){
						//console.log('format data special',party_status_id+party_name,party_data);
					}
					case2ndPartyVal.push(party_status_id+party_name);
				}
				
			});
		}else{
			if(isNaN(parseInt(case2ndParty[0]))){
				case2ndPartyVal.push(0+case2ndParty);
			}
		}
		if(personnel.indexOf('；')>-1 || personnel.indexOf('、')>-1 || personnel.indexOf('(')>-1|| personnel.indexOf('（')>-1){
			//console.log("format data special--------------",cas['id'],personnel);
			personnel=personnel.replace('（北京）','');
			var peronnels=[];
			if(personnel.indexOf('；')>-1)
				peronnels=personnel.split('；');
			else if(personnel.indexOf('、')>-1)
				peronnels=personnel.split('、');
			else
				peronnels=[personnel];
			$.each(peronnels,(index,peronnel)=>{
				if(peronnel.length>0){
					var _data=peronnel.split('(');
					if(peronnel.indexOf('（')>-1){
						_data=peronnel.split('（');
					}
					var _name="";
					var _nameId=0;
					var _status="无";
					var _status_id=0;
					var _group="";
					var _group_id=0;
					
					if(_data.length>1){
						if(!isNaN(parseInt(_data[0]))){

						}else{
							_name=_data[0];
							_status=_data[1].replace(')','').replace('）','');
							_status_id=casePersonnelStatus.indexOf(_status);
							

						}
	
					}else if(_data.length==1){
						//console.log("format data special--------------",cas['id'],_status_id);
						_name=_data[0];
					}
					$.each(corporate_companies,(index,company)=>{
						if(_name.indexOf(company)>-1){
							_group='公司';
							_nameId=index;
							_group_id=0;
						}
						
					});
					$.each(corporate_partners,(index,partner)=>{
						if(_name.indexOf(partner)>-1){
							_group='个人';
							_nameId=index;
							_group_id=1;
						}
						
					});
					
					val.push(_status_id+_group+_nameId);
				}
			});
			/*
			//console.log(peronnels);
			$.each(corporate_companies,(index,company)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
				peronnels.forEach((p)=>{
					if(p.indexOf(company)>-1){
						//console.log(index+"--"+company);
						val.push('公司'+index);
					}
				})
			});
			$.each(corporate_partners,(index,partner)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
				peronnels.forEach((p)=>{
					if(p.indexOf(partner)>-1){
						//console.log(index+"--"+partner);
						val.push('个人'+index);
					}
				})
			});
			*/
		}
		
		//console.log("format data",cas['id'],cas['casePersonnel'],val.join(','));
		if(val.length>0){
			cas['casePersonnel']=val.join(',');
		}
		if(case2ndPartyVal.length>0){
			cas['case2ndParty']=case2ndPartyVal.join(',');
		}
		//cas['isReadOnly']=true;
		//cas['isReadOnly']=true;
		//console.log('caseDate',cas['id'],cas['caseDate']);
		cas['caseDate']=getDateTime(cas['caseDate']);
		cas['caseCreateDate']=getDateTime(cas['caseCreateDate']);
		cas['appealAmount']=0.00;
		cas['requestAmount']=0.00;
		cas['caseCounterclaimRequest']="";
		cas['caseLawsuitRequest']="";
		console.log("format data",cas['id']+"---"+case2ndPartyVal.join(','),val.join(','));
		//insert('cases',cas,(e)=>{
			//console.log(e);
		//})	
		if(cas.id>30){
			//delete cas.caseStatus;
			delete cas.lawFirm;
			delete cas.legalAgencies;
			delete cas.legalCounsel;
			delete cas.legalInstitution;
			delete cas.paidAmount;
			delete cas.penalty;
			delete cas.requestAmount;
			delete cas.attorney;
			delete cas.FirstInstance;
			delete cas.SecondInstance;
			var status_data={
				id:cas.id,
				caseNo:cas.caseNo,
				//caseStatus:cas.id<67?1.0:3.1,
				caseStatus:cas.caseStatus==2||cas.caseStatus==4.1?cas.caseStatus-1:cas.caseStatus,
				//legalAgencies:1,
				//lawFirm:0,
				//attorney:"无0",
				FirstInstance:'0000-00-00 00:00:00',
				SecondInstance:'0000-00-00 00:00:00',
				//legalCounsel:"无0",
				//legalInstitution:1
			}
			//insert('cases',cas,(e)=>{
				//console.log("format data",cas);
				//console.log(e);
			//})
			insert('caseStatus',status_data,(e)=>{
				console.log(e);
			})	
		}
		
	});
	return data;
}
function getDataById(source,idKey,matchValue){
    return source.find((data)=>data[idKey]==matchValue);
    
}
function updateOriginalData(source,newData,matchKey){
    var matchedIndex=-1;
    $.each(source,(index,item)=>{
        //console.log(matchKey,item[matchKey],"=="+newData[matchKey]);
        if(item[matchKey]==newData[matchKey]){
            matchedIndex=index;
            source[index]=Object.assign(source[index],newData);
            
            return false;
        }
    })
    //console.log(matchedIndex,source[matchedIndex],newData);
    return source;
}
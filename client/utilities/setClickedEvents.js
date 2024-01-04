var lockeventListener=[];
var isAddPage=false;
var excutePoint=3;
var titleBarDisplayFormat="{caseNo} [{id}]";

var currentForm,currentEvents;
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
        case '个人信息':
            setting_info_form= new mform({template:settingPage_form,isAdmin:getGlobalJson('currentUser').level==adminLevel});
            var userInfo=getGlobalJson("currentUser");
            userInfo.pass=decrypt(userInfo.pass);
            setting_info_form.setValues(userInfo);
            $('#info_container').empty();
            $('#info_container').append(setting_info_form.instance);
                            
            setAuthFunctions();
            $('#info_container').trigger('create');
            $($(this).attr( "href" )).find('.edit-header-btn.ui-icon-check').text('保存');
            goToPage( $(this).attr( "href" ));
            break;
        case '添加用户':
            setting_add_form= new mform({template:settingPage_add_form,isAdmin:getGlobalJson('currentUser').level==adminLevel});
            setting_add_form.setEmptyValues();
            $('#info_container').empty();
            $('#info_container').append(setting_add_form.instance);
                            
            setAuthFunctions();
            $('#info_container').trigger('create');
            $($(this).attr( "href" )).find('.edit-header-btn.ui-icon-check').text('添加');
            goToPage( $(this).attr( "href" ));
            break;
        case '修改用户':
            var _this=this;
            var select=$('<select id="user_edit_select" data-native-menu="true" class="filterSelect"></select>');
            $.each(resourceDatas['users'],(index,user)=>{
                console.log(user);
                var option=$('<option value="'+(index+1)+'">'+user.name+'</option>');
                if(user.isInactived.constructor == String) user.isInactived=parseInt(user.isInactived);
                if(user.isInactived){
                    option.addClass('item-inActived');
                }
                select.append(option);
            });
            //select.selectmenu().selectmenu('refresh', true);
            select.trigger('create');
            $().requestDialog({content:select,message:"请选择一个用户"},function(isYes,selt){
                if(isYes){
                    $().mloader('show',{message:"读取中..."});
                    console.log($(selt).find('option:selected').val())
                
                    getCurrentUser({'id':$(selt).find('option:selected').val()}).then((d)=>{
                        //console.log(d,d.data.length);
                        if(d.data.length>0){
                            var userD=d.data[0];
                            userD.isInactived_a=userD.isInactived;
                            userD.pass=decrypt(userD.pass);
                            console.log(userD.name);
                            setting_add_form= new mform({template:settingPage_add_form,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                            setting_add_form.setValues(userD);
                            $('#info_container').empty();
                            $('#info_container').append(setting_add_form.instance);
                            
                            setAuthFunctions();
                            $('#info_container').trigger('create');
                            $($(_this).attr( "href" )).find('.edit-header-btn.ui-icon-check').text('修改');
                            $($(_this).attr( "href" )).find('.edit-header-btn.ui-icon-check').data('item',JSON.stringify(userD));
                            goToPage( $(_this).attr( "href" ));
                            setTimeout(() => {
                                $().mloader('hide');
                            }, 500);
                        }
                        
                    });
                }
                
            });
            break;
        case '数据库管理':

            goToPage( $(this).attr( "href" ));
            break;
        case '退出':
            //goToPage( $(this).attr( "href" ));
            setGlobalJson("currentUser",{});
            window.location.href = 'index.html';
            break;
    }
    
})
function compareValues(source,target,prefix){
    prefix=prefix||'';
    var isSame=true;
    $.each(source,(k,v)=>{
        console.log(k,k.replace(prefix,""))
        if(target[k.replace(prefix,"")]!=undefined){
            if(v.toString()!=target[k.replace(prefix,"")].toString()) {isSame=false; return false;}
        }
    });
    return isSame;
}
$('#progress_point_info').find('a[data-rel="back"]').on('click',function(e){
    //console.log(getGlobal('currentPage'));
    e.preventDefault();
    currentForm.getFormValues(function(e){
        console.log(e,currentForm.currentData);
        if(compareValues(e.values,currentForm.currentData,"_p")){
            console.log('数据没有变化');
            history.back();
        }else{
            console.log('数据不同');
            $().requestDialog({
                title:'提示',
                message:'表格内容已修改，是否保存?',
            },function(go){
                if(go){
                    $('#progress_point_info').find('[name="save_btn"]').trigger('click')
                }
                setTimeout(() => {
                    history.back();
                }, 200);
            });
        }
    })
})
var isFirstTimeBack=true;
var scrollSpeed=1000;
$(window).on('popstate', function(event) {
    //event.preventDefault();
    if(event.originalEvent.state!=null){
        //console.log("pop",'back',sessionStorage.getItem('scrollPosition'));
        //sessionStorage.setItem('scrollPosition', );
        if(isFirstTimeBack){
            $("html, body").animate({ scrollTop: sessionStorage.getItem('scrollPosition')}, scrollSpeed);
            isFirstTimeBack=false;
            scrollSpeed=0;
        }else{

            $("html, body").scrollTop(sessionStorage.getItem('scrollPosition'));
        }
        //console.log('currentPage',getGlobal('currentPage'))
        //$("html, body").animate({ scrollTop: sessionStorage.getItem('scrollPosition')}, 100);
    }else{
        if(getGlobal('currentPage')!="#timeline")
            sessionStorage.setItem('scrollPosition', $("html, body").scrollTop());
        else{

            isFirstTimeBack=true;
            scrollSpeed=0;
        }
        //console.log("pop",sessionStorage.getItem('scrollPosition'));
    }
    
});
var currentProgress={};

function showTooltip(self){
    if($(self).hasClass('header-filter-btn')){
        if($(self).hasClass('btn-icon-green')){
            $(self).data('tooltip','解锁搜索栏');
        }else{
            $(self).data('tooltip','锁定搜索栏');
        }
    }
    $(self).tooltip('show',$(self).data('tooltip')!=undefined?$(self).data('tooltip'):$(self).text());
}
function hideTooltip(self){
    $(self).tooltip('hide');
}

$("#progress_point_popupMenu").on( "popupafterclose", function( event, ui ) {
    $('#progress_point_popupMenu_add').collapsible( "collapse" );
} );
function formatMainEventData(d){
    var title=''
    d.typeId=d.typeId.constructor==String?parseInt(d.typeId):d.typeId;
    if(d.typeId==1||d.typeId==2) title='判决';
    else if(d.typeId==7) title='裁定';
    var legalInstitution=$.grep(resourceDatas.legalInstitution_,dd=>dd.id==d.legalInstitution);
    if(legalInstitution.length>0) legalInstitution=legalInstitution[0].name;
    console.log('legalInstitution',resourceDatas.legalInstitution_,d.legalInstitution,legalInstitution);
    return {index:d.typeId,date:formatDateTime(new Date(d.judgmentDate),'yyyy年MM月dd日'),caseNo:d.caseNo,legalInstitution:legalInstitution,sum:d.judgmentSum,title:title};
}
//节点修改保存按钮事件
$('#progress_point_info').find('[name="save_btn"]').on('click',function(e){
    console.log('save_btn',getGlobal("currentPoint"),$(this).jqmData('form'));
    //if(parseInt(getGlobal("currentPoint"))==0) return;
    console.log('save_btn',$(this));
    var form=$(this).jqmData('form');
    var events=$(this).jqmData('events');
    form.getFormValues(function(e){
        console.log(e);
        var newData={};
        if(e.success){
            $.each(e.values,(key,val)=>{
                newData[key.replace("_p","")]=val;
            })
            if(parseInt(getGlobal("currentPoint"))==0) {
                
                newData["caseCreateDate"]=formatDateTime(new Date(),'yyyy-MM-dd HH:mm:ss');
                console.log('save data',e);
                //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
                if(getGlobalJson("currentUser")==null || getGlobalJson("currentUser")==undefined){
                    $().minfo('show',{title:"错误: "+error.FORM_INVALID_USER.message,message:"是否跳转到登录页面？"},function(){
                        //HideMessage();
                        window.location.href = 'index.html';
                    });
                }else{
                    newData["caseApplicant"]=getGlobalJson("currentUser").id;
                    //if(enableReadOnlyMode) e.values["isReadOnly"]=_isReadOnlyCurrentForm();
                    newData["id"]=parseInt(getGlobal("currentId"));
                    fireDataChnaged("caseChanged",newData,"update");
                    
                    var legalInstitution=$.grep(resourceDatas.legalInstitution_,d=>d.id==newData.legalInstitution);
                    if(legalInstitution.length>0) legalInstitution=legalInstitution[0].name;
                    var mainEventData={index:0,date:formatDateTime(new Date(newData.caseDate),'yyyy年MM月dd日'),caseNo:newData.caseNo,legalInstitution:legalInstitution,sum:newData.caseSum,title:'立案'};
                    $('#progress_diagram').trigger({type:'updateMainEvent',targetIndex:0,
                    mainEventData:mainEventData})
                }
            }else{
                newData.id=parseInt(getGlobal("currentId"));
                $().mloader("show",{message:"提交中...."});
                insert('caseProgresses',newData,function(ee){
                    console.log(ee,getGlobal("currentIsAdd"));
                    if(ee.success){
                        if(parseInt(getGlobal("currentIsAdd"))==1){
                            DataList.caseProgresses.push(newData);
                            
                            var matched=$.grep(resourceDatas.caseStatus_,label=>label.id==parseInt(getGlobal("currentPoint")));//获取节点属性数据
                            
                            if(matched.length>0){
                                $('#progress_diagram').trigger({type:'moveNext',sourceData:matched[0],sourceIndex:parseInt(getGlobal("currentIndex")),
                                            eventsData:events,
                                            mainEventData:formatMainEventData(newData)});
                                $('#pageOneTable').updateTableItem({caseStatus:parseInt(getGlobal("currentPoint")),id:newData.id});
                            }
                            update('id='+newData.id,'caseStatus',{'caseStatus':JSON.stringify($('#progress_diagram').jqmData('status'))},function(eee){
                                $().mloader("hide");
                                if(eee.data.success){
                                    DataList.combinedData=updateOriginalData(DataList.combinedData,{id:newData.id,caseStatus:JSON.stringify($('#progress_diagram').jqmData('status'))},'id');
                                    $().minfo('show',{title:"提示",message:"保存成功。"},function(){});
                                }else{
                                    $().minfo('show',{title:"错误",message:eee.data.data.sqlMessage});
                                }
                                updatePenaltyPaidSummary($('#execute_summary'));
                            });
                        }else{
                            DataList.caseProgresses.forEach(progress=>{
                                if(progress.id==newData.id && progress.typeId==newData.typeId){
                                    $.each(newData,(key,val)=>{
                                        progress[key]=val;
                                    })
                                    return false;
                                }
                            })
                            //DataList.caseProgresses=updateOriginalData(DataList.caseProgresses,newData,'id');
                            $().mloader("hide");
                            $().minfo('show',{title:"提示",message:"更新成功。"},function(){});
                            updatePenaltyPaidSummary($('#execute_summary'));
                            console.log("更新成功",newData.typeId,formatMainEventData(newData));
                            $('#progress_diagram').trigger({type:'updateMainEvent',targetIndex:parseInt(getGlobal("currentIndex")),
                                mainEventData:formatMainEventData(newData)})
                        }
                    }else{
                        $().mloader("hide");
                        $().minfo('show',{title:"错误",message:ee.error});
                    }
                })
            }
            
        }
    });
})
function progress_point_editor(typeId,pointIndex,data,update_data,isAdd){
    console.log({typeId:typeId,data:data,update_data:update_data,pointIndex:pointIndex});
    
    var template=FormTemplate3_p;
    
    if(typeId==1 || typeId==2 || typeId==7) template=FormTemplate3_instance;
    else if(typeId==0){
        
    }
    else if(typeId>2){
        template=FormTemplate3_execute;
    }
    $().mloader("show",{message:"读取中...."});
    //_showEditForm(matchItems[0]);//naviation.js
    //$("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
    setGlobal("currentId", data.id);
    setGlobal("currentPoint", typeId);
    setGlobal("currentIndex", pointIndex);
    setGlobal("currentIsAdd", isAdd?1:0);
    //_setBlurBackgroundVisibility(true);
    //节点信息表格及相关事件列表
    $('#progress_point_info_form').empty();
    var progress_point_form=_createNewCaseForm(template,"progress_point_info_form");
    
    currentForm = progress_point_form;
    data.typeId=typeId;
    progress_point_form.setValues(data,'_p');

    var updateContainer=$('.updateContainer');
    if(updateContainer.length==0) {
        updateContainer=$('<div class="updateContainer"></div>');
    }else{
        updateContainer.empty();
    }
    var collapsible=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"><h3>更新</h3><div>');
    var newUpdateBtn=$('<a href="#progress_point_popupMenu_" data-rel="popup" style="position: absolute;z-index:100;margin-top:2px;right:10px;height:14px;line-height:14px;" class="ui-btn ui-btn-a ui-mini ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-plus btn-icon-green">添加</a>')
    updateContainer.append(newUpdateBtn);
    var listview=$('<ul data-role="listview" id="progress_point_info_body"></ul>');
    collapsible.append(listview);
    updateContainer.append(collapsible);
    progress_point_form.instance.append(updateContainer);
    console.log('progress_point_form.instance',progress_point_form.instance,updateContainer);
    var pointName=$.grep(progressLabels,label=>label.id==typeId);
    if(pointName.length>0) pointName=pointName[0].name;

    //_setTitleBar("progress_point_info_title");
    $('#progress_point_info_title').text((isAdd?'添加':'修改')+' '+pointName+' ['+data.id+']');
    $('#progress_point_info').find('[name="save_btn"]').jqmData('form',progress_point_form);
    $('#progress_point_info').find('[name="save_btn"]').jqmData('events',update_data);
    currentEvents=update_data;
    progress_point_form.instance.trigger('create')
    console.log('progress_point_form',progress_point_form);
    $('#progress_point_info_form').trigger('create')
    setTimeout(function() {
        goToPage('#progress_point_info');
        var dateSortItems={}
        update_data.forEach(item=>{
            var _data=getEventsDetails(item);
            var date=_data.date.replace(" ","");
            if(!dateSortItems.hasOwnProperty(date)){
                dateSortItems[date]=[];
            }
            dateSortItems[date].push(_data);
        })
        console.log('progress_point_editor',update_data,dateSortItems);
        generateUpdateInfoList(listview,dateSortItems);
        $().mloader("hide");
    }, 100);
}
function getUpdateEvents(){
    var index=getGlobal("currentId");
    var matchedUpdates=DataList.caseUpdates.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProperties=DataList.caseProperties.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedAttachments=DataList.caseAttachments.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    //var matchedCaseLinked=DataList.caseLinked.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    //var matchedProgresses=DataList.caseProgresses.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var eventsData=matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments);
    return eventsData;
}
function getSortedUpdateEvents(){
    var dateSortItems={};
    getProgressEvents(getUpdateEvents(),getGlobal("currentPoint")).forEach(item=>{
        var _data=getEventsDetails(item);
        var date=_data.date.replace(" ","");
        if(!dateSortItems.hasOwnProperty(date)){
            dateSortItems[date]=[];
        }
        dateSortItems[date].push(_data);
    })
    return dateSortItems;
}
$('#progress_point_viewer_btn').on('click',function(e){
    var caseId=getGlobal("currentId");
    var matchItems=DataList.combinedData.filter((item) =>item.id == caseId);
    var matchedUpdates=DataList.caseUpdates.filter((d)=>d.id==caseId&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==caseId&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProperties=DataList.caseProperties.filter((d)=>d.id==caseId&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedAttachments=DataList.caseAttachments.filter((d)=>d.id==caseId&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedCaseLinked=DataList.caseLinked.filter((d)=>d.id==caseId&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProgressStatus=DataList.caseProgresses.filter((d)=>d.id==caseId);
    var eventsData=matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments);
    var typeId=parseInt($(this).jqmData('point'));
    var progressData=$.grep(matchedProgressStatus,d=>d.typeId==typeId);
    if(progressData.length>0) progressData=progressData[0];
    //console.log('pointIndex',$(this).jqmData('pointIndex'));
    console.log('progress_point_viewer_btn',progressData,typeId);
    progress_point_editor(typeId,parseInt($(this).jqmData('pointIndex')),typeId==0?matchItems[0]:progressData,getProgressEvents(eventsData,typeId));
});
function calcPenaltyAmount(data){
    var penaltySum=0.0;
    data.forEach(progress=>{
        if(progress.penalty==null) progress.penalty=0.0;
        penaltySum+=progress.penalty.constructor==String?parseFloat(progress.penalty):progress.penalty;
    });
    return penaltySum;
}
function calcPaidAmount(data){
    var paidSum=0.0;
    data.forEach(excute=>{
        paidSum+=parseFloat(excute.exexuteAmount);
    });
    return paidSum;
}
function calcPenaltyPaidSum(penalty,paid){
    return {penalty:calcPenaltyAmount(penalty),paid:calcPaidAmount(paid)}
}
function generatePenaltyPaidSummary(container,penaltyPaidSum){
    $(container).empty();
    var caption=$('<h3>执行金额情况：<h3>');
    
    var penalty_label=$('<p>判决金额：'+penaltyPaidSum.penalty+'万元<p>');
    var paid_label=$('<p>执行金额：'+penaltyPaidSum.paid+'万元<p>');
    var penalty=$('<div class="penalty-bar">'+'</div>');
    var percentage=(penaltyPaidSum.paid/(penaltyPaidSum.penalty)*100);

    var paid=$('<div class="paid-bar">'+(Number.isNaN(percentage)||percentage==0?'':percentage.toFixed(2)+'%')+'</div>');
    penalty.append(paid);
    $(container).append(caption);
    $(container).append(penalty_label);
    $(container).append(paid_label);
    $(container).append(penalty);
    
    paid.css({width:percentage*(screen.width)+"px"})
    console.log("execute summary",penaltyPaidSum,percentage*(screen.width-100),percentage);
    $(container).trigger('create');
}
function updatePenaltyPaidSummary(container,caseId){
    caseId=caseId||parseInt(getGlobal("currentId"));
    var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==caseId&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProgressStatus=DataList.caseProgresses.filter((d)=>d.id==caseId);
    generatePenaltyPaidSummary(container,calcPenaltyPaidSum(matchedProgressStatus,matchedExcutes));
}

//#region 主表里的功能按钮
function functionBtnsEvent(but,index){
    //tableFuntionButListenerList.push(but.currentTarget);
    //console.log('functionBtnsEvent',index,this,e);
    //var index=data.id;
    console.log('functionBtnsEvent',index);
    if(index.constructor==String){
        index=JSON.parse(index).id;
    }else if(index.constructor==Object){
        index=index.id;
    }
    var matchItems=DataList.combinedData.filter((item) =>item.id == index);
    var matchedUpdates=DataList.caseUpdates.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProperties=DataList.caseProperties.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedAttachments=DataList.caseAttachments.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedCaseLinked=DataList.caseLinked.filter((d)=>d.id==index&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProgressStatus=DataList.caseProgresses.filter((d)=>d.id==index);
    //console.log(index+"--"+but.currentTarget.name,matchItems);

    if(but.name=="fn_btn_details"){//主表里的删除按钮
        showProgressDetails(matchItems,matchedUpdates,matchedExcutes,matchedProperties,matchedAttachments,matchedCaseLinked);
    }
    else if(but.name=="fn_btn_edit"){//主表里的编辑按钮
        isAddPage=false;
        if(matchItems.length>0){
            $().mloader("show",{message:"读取中...."});
            
            
            //_showEditForm(matchItems[0]);//naviation.js
            //$("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
            setGlobal("currentId", matchItems[0].id);
            //_setBlurBackgroundVisibility(true);
            goToPage( $(but).attr( "href" ));
            setTimeout(function() {
                //console.log(matchItems[0]);
                //main_form.setValues(matchItems[0]);
                //main_form.readOnly(false);
                //
                //console.log("data-role------"+$('.edit-header-btn[name="save_btn"').jqmData('role'));
                //caseForm.setValues(matchItems[0]);
                //if(enableReadOnlyMode) caseForm.readOnly(matchItems[0].isReadOnly);
                _setTitleBar("reg_form_title");
                $().mloader("hide");
            }, 500);
            //$('.progress_lock.edit-info').removeClass('hide');
            //_setFormReadOnly(data.isReadOnly);
            //_setBlurBackgroundVisibility(true);
            
        }
    }
    else if(but.name=="fn_btn_update"){//主表里的案件更新按钮
        $().mloader("show",{message:"读取中...."});
        $("#progress_details").empty();
        $("#progress_diagram").empty();
        setGlobal("currentId",index);//caseId
        goToPage( '#progress');
        if(matchItems.length>0){
            //流程图下主要事件数据提取
            //generatePenaltyPaidSummary($('#execute_summary'),calcPenaltyPaidSum(matchedProgressStatus,matchedExcutes));
            updatePenaltyPaidSummary($('#execute_summary'));
            var progressChartMainEvents=[];
            
            var legalInstitution=$.grep(resourceDatas.legalInstitution_,d=>d.id==matchItems[0].legalInstitution);
            if(legalInstitution.length>0) legalInstitution=legalInstitution[0].name;
            progressChartMainEvents.push({index:0,date:formatDateTime(new Date(matchItems[0].caseDate),'yyyy年MM月dd日'),caseNo:matchItems[0].caseNo,legalInstitution:legalInstitution,sum:matchItems[0].caseSum,title:'立案'})
            $.each(matchedProgressStatus,(i,d)=>{
                progressChartMainEvents.push(formatMainEventData(d))
            })

            _setTitleBar("progress_title",titleBarDisplayFormat);
            //console.log('caseStatus',matchItems[0].caseStatus,JSON.parse(matchItems[0].caseStatus));
            //更新事件数据
            var eventsData=matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments);
            //流程节点数据
            var status=JSON.parse(matchItems[0].caseStatus);
            if(status.constructor!=Array)status=[status];
            $('#progress_diagram').progressChart({
                width:screen.width-32-80,
                eventsData:eventsData,//更新事件数据
                mainEventData:progressChartMainEvents,//流程图下主要事件数据提取
                data:resourceDatas.caseStatus_,
                status:status,//流程节点数据
                steps:7})
            $('#progress_diagram').on('newPointAdded',function(e){
                console.log(e.status)

            })
            //节点点击事件
            $('#progress_diagram').on('pointClick',function(e){
                console.log(e);
                //当前节点id
                $('#progress_point_viewer_btn').jqmData('point',$(e.source).jqmData('id'));
                //获取当前节点数据
                console.log('eventsData',eventsData,$(e.source).jqmData('id'));
                var updates=getProgressEvents(eventsData,$(e.source).jqmData('id'));
                $('#progress_point_viewer_btn').jqmData('itemUpdates',updates)
                $('#progress_point_viewer_btn').jqmData('pointIndex',e.index)
                var itemData=matchItems[0];
                
                if($(e.source).jqmData('id')>0){
                    itemData=$.grep(matchedProgressStatus,d=>d.typeId==$(e.source).jqmData('id'))
                    if(itemData.length>0) itemData=itemData[0]
                }
                console.log('source id',$(e.source).jqmData('id'),matchedProgressStatus,itemData);
                $('#progress_point_viewer_btn').jqmData('item',itemData);
                //var title=progresses[e.Position.main] instanceof Array?progresses[e.Position.main][e.Position.sub]:progresses[e.Position.main];
                $('#progress_point_popupMenu_add_list').empty();
                //获取已激活的节点id
                var ids=[];
                $.each($('#progress_diagram').find('.actived_point'),(i,point)=>{
                    if($(point).jqmData('index')!=undefined)
                        ids.push($(point).jqmData('id'));
                });
                if($(e.source).hasClass('last_point')&&ids.length<resourceDatas.caseStatus_.length){
                    console.log('ids',ids);
                    
                    $('#progress_point_popupMenu_add').show();
                    resourceDatas.caseStatus_.forEach(label=>{
                        if(label.name!="立案"){
                            if(!ids.includes(label.id)){
                                var li=$('<li data-index='+label.id+'></li>');
                                var a=$('<a href="#" data-rel="back">'+label.name+'</a>');
            
                                li.append(a);
                                $('#progress_point_popupMenu_add_list').append(li);
                                a.on('click',function(ee){
                                    console.log('eventsData',eventsData);
                                    var updatesdata=getProgressEvents(eventsData,label.id);
                                    progress_point_editor(label.id,e.index,matchItems[0],updatesdata,true);
                                    //$('#progress_diagram').trigger({type:'moveNext',sourceData:label,sourceIndex:e.index,eventsData:updatesdata});
                                    $('#progress_point_popupMenu_add').collapsible( "collapse" );
                                    //console.log($(this).jqmData('index'),$(this).jqmData('item'))
                                });
                            }
                        }
                        
                        
                    })
                }else{
                    $('#progress_point_popupMenu_add').hide();
                }
                
                $("#progress_point_popupMenu_add").trigger('create')
                $('#progress_point_popupMenu_add_list').trigger('create')
                $('#progress_point_popupMenu_add_list').listview().listview('refresh');
                $("#progress_point_popupMenu").trigger('create')
                $("#progress_point_popupMenu").popup('open');
                $("#progress_point_popupMenu").popup('reposition',{x:e.event.pageX,y:e.event.pageY});

                //console.log($("#progress_popupMenu"));
            });
        }
        $("#progress_details").trigger('create');
        setTimeout(function() {
            $().mloader("hide");
        },10);
    }
}

//#endregion /主表里的功能按钮
//流程图节点点击弹出菜单
$('#progress_point_popupMenu_').find('a').on('click',async function(e){
    $('#progress_point_popupMenu_').popup('close');
    var index=Number(sessionStorage.getItem("currentId"));
    var caseStatus=getGlobal("currentPoint");
    var caseStatus_=$.grep(DataList.caseStatus,(d)=>Number(d.id)==index);
    
    console.log('currentId',index,caseStatus_,DataList.caseStatus)
    
    //console.log('dateSortItems',sortedItems,dateSortItems);
    var caseNo=caseStatus_[0].caseNo;
    switch($(this).text()){
        case '进展':
            console.log("进展");
            
            setProgressPopupFormWithoutCheck(add_update_template,"添加新的进展",{table:'caseUpdates',key:'updatesId',dateKey:'dateUpdated',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
        case '执行':
            console.log("执行");
            setProgressPopupFormWithoutCheck(add_execute_template,"添加新的执行",{table:'caseExcutes',key:'excutesId',dateKey:'dateExecuted',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
        case '财产':
            console.log("财产");
            setProgressPopupFormWithoutCheck(add_property_template,"添加新的财产变更",{table:'caseProperties',key:'propertyId',dateKey:'dateUpdated',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
        case '附件':
            console.log("附件");
            
            setProgressPopupFormWithoutCheck(add_evidence_template,"添加新的附件证明",{table:'caseAttachments',key:'evidenceId',dateKey:'dateUploaded',id:index,caseStatus:caseStatus,caseNo:caseNo});
            break;
        case '关联':
            console.log("关联");
            break;
    }
});
/*
function getMatchedEventData(){
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
    return dateSortItems;
}
*/
function generateUpdateInfoList(listview,dateSortItems){
    console.log('generateUpdateInfoList',dateSortItems);
    var sortedItems=Object.keys(dateSortItems).sort(function(a,b){
        console.log(dateSortItems,a,b)
        return dateSortItems[a][0].originalDate>dateSortItems[b][0].originalDate;
    });
    listview.empty();
    sortedItems.forEach(date=>{
        var items=dateSortItems[date];
        //console.log('items',items);
    //$.each(dateSortItems,(date,items)=>{
        var date_bar=$('<li data-role="list-divider">'+date+'<span class="ui-li-count">'+items.length+'</span></li>');
        listview.append(date_bar);
        items.forEach(item=>{
            var item_container=$('<li data-item=\''+JSON.stringify(item)+'\'></li>');
            //console.log('JSON.stringify',item_d);
            var del_btn;
            if(item.type=='caseAttachments'){
                var itemData=getDataById(DataList[item.type],item.key,item.id);
                var icon=getIconFromTypeName(item.typeName,itemData.filePath);
                
                var attachmentData=getAttachmentData(itemData.filePath);
                var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+item.description+'</h3>');
                list_item.prepend(icon);
                
                item_container=$('<li style="padding:0px;" data-item=\''+JSON.stringify(item)+'\'></li>');
                var group=$('<div style="display: grid;grid-template-columns: 1fr auto auto;grid-gap: 0px;margin:-8px 0px;"></div>');
                var view_btn=$('<a href="#" class="ui-btn ui-icon-eye ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">查看</a>')
                console.log('preview',"http://"+ip+':'+port+'/downloadLocal?fileName='+itemData.filePath+'&folder='+itemData.id);
                if(!attachmentData.previewable)
                    view_btn=$('<a href="http://'+ip+':'+port+'/downloadLocal?fileName='+itemData.filePath+'&folder='+itemData.id+'" class="ui-btn ui-icon-action ui-btn-icon-notext btn-icon-blue view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">下载</a>')
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
                var icon=getIconFromTypeName(item.typeName);
                var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+item.description+'</h3>');
                list_item.prepend(icon);
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
            listview.append(item_container);
        })

    })
    bindUpdateInfoBtnClick();
    listview.listview().listview('refresh')
}
function bindUpdateInfoBtnClick(){
    $('#progress_point_info_body').find('a.view-list-button').on('click',async function(e){
        //console.log($(this));
        var _this=this;
        var typeName=$(this).text().length==0?$(this).attr('title'):$(this).text();
        var data=$(this).closest('li').data('item');
        //console.log($(this).closest('li'),data.id,data.type,data.key,typeName);
        switch(typeName){
            case '查看':
                $().mloader('show',{message:"读取中..."});
                setTimeout(() => {
                    var itemData=getDataById(DataList[data.type],data.key,data.id);
                    console.log('查看',data,itemData);
                    //downloadFile(itemData.id,itemData.filePath);
                    //"http://"+ip+":"+port+"/downloadLocal?fileName="+data,itemData+"&folder="+itemData.id;
                    var container=$('<div style="width:100%;height:100%;"></div>');
                    //$('#preview_container').append(container);
                    $('#preview_container').empty();
                    
                    const embedTag = `<embed src="${url}" type="application/pdf" width="100%" height="600px" />`;
                    var headerHeight=$('#progress_file_preview').find('div[data-role="header"]').outerHeight();
                    //var office='https://view.officeapps.live.com/op/view.aspx?src=';
                    var extension=itemData.filePath.split('.').pop().toLowerCase();
                    

                    if(extension=='docx'||extension=='xlsx'){
                        const docxOptions = Object.assign(docx.defaultOptions, {
                            debug: true,
                            experimental: true,
                            breakPages:true,
                            inWrapper:true
                        });
                        getDocxFile(itemData.id,itemData.filePath).then(blob=>{
                                docx.renderAsync(blob, $('#preview_container').get(0), null, docxOptions)
                                .then((x) => {
                                    
                                    console.log(x);
                                }).catch(error => {
                                    $().requestDialog({
                                        title:'提示',
                                        message:'文件预览出了问题，可能文件损坏，不存在，或者加密了，你是否需要下载？',
                                    },function(go){
                                        if(go){
                                            downloadFile(itemData.id,itemData.filePath);
                                        }
                                        setTimeout(() => {
                                            history.back();
                                        }, 200);
                                    });
                                    });;
                            
                        });
                        
                    }else{
                        var url="http://"+ip+":"+port+"/preview?fileName="+itemData.filePath+"&folder="+itemData.id;
                        var frame=$("<iframe src='"+url+"' style='position: absolute;top: "+40+"px;left: 0;width: 100%;height: 100%;border: none;'>"+
                                    +"</iframe>");
                        $('#preview_container').append(frame);
                    }
                    console.log('height',$('#progress_file_preview').find('div[data-role="header"]'),headerHeight);
                    
                    
                    goToPage('#progress_file_preview');
                    setTimeout(() => {
                        $().mloader('hide');
                    },200);
                },200);
                
                //var media=$('<embed  class="media" src="'+"http://"+ip+":"+port+"/preview?fileName="+itemData.filePath+"&folder="+itemData.id+'"></a>');

                break;
            case '编辑':
                //console.log(data.id,data.type,data.key,typeName)
                var itemData=getDataById(DataList[data.type],data.key,data.id);
                console.log(itemData)
                switch (data.type){
                    case 'caseUpdates':
                        console.log("进展");
                        var form= new mform({template:add_update_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        var data={table:data.type,idkey:'updatesId',dateKey:'dateUpdated',data:itemData};
                        
                        //itemData['dateUpdated']=getDateTime();
                        form.setValues(itemData);
                        $('#progress_popup_edit_title').text("修改进展");
                        $('#progress_popup_edit_form').empty();
                        $('#progress_popup_edit_form').append(form.instance);
                        $('#progress_popup_edit_form').trigger('create');
                        //console.log(JSON.stringify(data));
                        $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                        form.instance.jqmData('label',$(this).jqmData('label'));
                        $('.progress_popup_edit_form_submit').jqmData('form',form);
                        $('#progress_popup_edit').trigger('create');
                        $('#progress_popup_edit').popup().popup('open');
                        //setProgressPopupForm(add_update_template,"添加新的进展",{table:'caseUpdates',key:'updatesId',dateKey:'dateUpdated',id:itemData.id,caseStatus:itemData.caseStatus,caseNo:itemData.caseNo});
                        break;
                    case 'caseExcutes':
                        console.log("执行");
                        var form= new mform({template:add_execute_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        var data={table:data.type,idkey:'excutesId',dateKey:'dateExecuted',data:itemData};
                        
                        //itemData['dateExecuted']=getDateTime();
                        form.setValues(itemData);
                        $('#progress_popup_edit_title').text("修改执行");
                        $('#progress_popup_edit_form').empty();
                        $('#progress_popup_edit_form').append(form.instance);
                        $('#progress_popup_edit_form').trigger('create');
                        //console.log(JSON.stringify(data));
                        $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                        form.instance.jqmData('label',$(this).jqmData('label'));
                        $('.progress_popup_edit_form_submit').jqmData('form',form);
                        $('#progress_popup_edit').trigger('create');
                        $('#progress_popup_edit').popup().popup('open');
                        break;
                    case 'caseProperties':
                        console.log("财产");
                        var form= new mform({template:add_property_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        var data={table:data.type,idkey:'propertyId',dateKey:'dateUpdated',data:itemData};
                        
                        //itemData['dateUpdated']=getDateTime();
                        form.setValues(itemData);
                        $('#progress_popup_edit_title').text("修改资产变更");
                        $('#progress_popup_edit_form').empty();
                        $('#progress_popup_edit_form').append(form.instance);
                        $('#progress_popup_edit_form').trigger('create');
                        //console.log(JSON.stringify(data));
                        $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                        form.instance.jqmData('label',$(this).jqmData('label'));
                        $('.progress_popup_edit_form_submit').jqmData('form',form);
                        $('#progress_popup_edit').trigger('create');
                        $('#progress_popup_edit').popup().popup('open');
                        //setProgressPopupForm(add_property_template,"添加新的财产变更",{table:'caseProperties',key:'propertyId',dateKey:'dateUpdated',id:index,caseStatus:caseStatus,caseNo:caseNo});
                        break;
                    case 'caseAttachments':
                        console.log("附件");
                        var form= new mform({template:add_evidence_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        var data={table:data.type,idkey:'evidenceId',dateKey:'dateUploaded',data:itemData};
                        
                        //itemData['dateUploaded']=getDateTime();
                        form.setValues(itemData);
                        $('#progress_popup_edit_title').text("修改附件证明");
                        $('#progress_popup_edit_form').empty();
                        $('#progress_popup_edit_form').append(form.instance);
                        $('#progress_popup_edit_form').trigger('create');
                        //console.log(JSON.stringify(data));
                        $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                        form.instance.jqmData('label',$(this).jqmData('label'));
                        $('.progress_popup_edit_form_submit').jqmData('form',form);
                        $('#progress_popup_edit').trigger('create');
                        $('#progress_popup_edit').popup().popup('open');
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
    });
}
/*
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
                var dateSortItems=getMatchedEventData();
                var sortedItems=Object.keys(dateSortItems).sort(function(a,b){
                    return dateSortItems[a][0].originalDate>dateSortItems[b][0].originalDate;
                });
                //console.log('查看...',sessionStorage.getItem("currentId"));
                //_setTitleBar("progress_details_info_title",'caseNo');
                //console.log('查看...',index,caseStatus,DataList.caseUpdates);
                
                //console.log('查看...',greatMatched);
                //generateUpdateInfoList(sortedItems,dateSortItems);
                
                console.log('generateUpdateInfoList',dateSortItems);
                
                //$('#progress_details_info_body').trigger('create');
                
                goToPage( "#progress_details_info");
                setTimeout(() => {
                    $().mloader('hide');
                },200);
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
        case '关联':
            console.log("关联");
            /*
            isAddPage=true;
            $().mloader("show",{message:"读取中...."});
            await getCaseLatestIndex().then(id=>{
                
                sessionStorage.setItem("currentId", id+1);
                
                //main_form.readOnly(false);
                //main_form.instance.setEmptyValues(FormTemplate.template);
                //main_form.readOnly(false).setEmptyValues();
                //main_form.instance.setEmptyValues()
                //
                
                //main_form.readOnly(false).setEmptyValues();
                $('.progress_lock.edit-info').addClass('hide');
                //console.log($('.progress_lock.edit-info'));
                $("#reg_form_title").html("新增档案");
                $('.edit-header-btn[name="save_btn"').show();
                //_setBlurBackgroundVisibility(true);
                goToPage( $(this).attr( "href" ));
            // main_form.readOnly(false).setEmptyValues();
                    //$().mloader("hide");
                setTimeout(function() {
                    caseForm.readOnly(false).setEmptyValues();
                    
                    $().mloader("hide");
                }, 10);
                //main_form.setValues(getGlobalJson("mainData")[0]);
                //$("#fullscreenPage").trigger('create');
                //main_form.instance.trigger('create');
            });
            
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

*/
//节点添加保存
$('.progress_popup_add_form_submit').on('click', _updateSubmitEvent)
//节点修改保存
$('.progress_popup_edit_form_submit').on('click', function (e){
    $(window).trigger('saving');
    console.log($(this).data('item'));
    var data=JSON.parse($(this).data('item'));
    
    var form=$(this).jqmData('form');
    form.getFormValues(function(e){
        console.log(e);
        if(e.success){
            var vals=[];
            var newData={};
            $.each(e.values,(key,val)=>{
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
                
                form.instance.jqmData('label').text(formatData.description);
                form.instance.jqmData('label').prepend(getIconFromTypeName(formatData.typeName))
                //console.log('DataList['+data.table+'] before',DataList[data.table]);
                DataList[data.table]=updateOriginalData(DataList[data.table],newData,data.idkey);
                if(data.table=='caseExcutes'){
                    
                    newData.id=data.data.id;
                    //DataList.caseExcutes=updateOriginalData(DataList[data.table],newData,data.idkey);
                    fireDataChnaged("caseexcutesChanged",newData,"update");
                    updatePenaltyPaidSummary($('#execute_summary'));
                }
                history.back();
                $(window).trigger('hidepopup');
                //console.log('DataList['+data.table+'] after',DataList[data.table]);
                //await currentProgress['currentDiagramButton'].setStep(currentProgress['target']);
            })
            
        }
    });
})
//节点更新事件保存
function _updateSubmitEvent(e){
    console.log('updateSubmitEvent',$(this).data('item'));
    var data=JSON.parse($(this).data('item'));
    
    var form=$(this).jqmData('form');
    console.log(form.opt.template);
    form.getFormValues(async function(e){
        console.log("获取到的表格值",e,data);
        if(e.success){
            $('#progress_point_popup_add').popup('close');
            $().mloader("show",{message:"提交中...."});
            //var files=[];
            //var cango=true;
            var fileOk=true;
            var idx=await getRecordLatestIndex(data.table,data.key);
            if(data.table!='caseAttachments'){//非文件上传类
                var subidx=await getRecordLatestIndex(data.table,'subId','caseStatus='+data.caseStatus);
                e.values.subId=subidx+1;
            }else{
                fileOk=false;
                //files=values.data.caseAttachments;
                if(e.values.filePath.length>0){
                    var filePaths= [];
                    
                    uploadFiles(data.id,e.values.filePath).then(r=>{
                        //console.log(r);
                        $.each(r,(index,uploadResult)=>{
                            if(!uploadResult.success){
                                console.log(uploadResult.fileName+" 上传失败！");
                                //cango=false;
                                //$().mloader("hide");
                            }else{
                                console.log(uploadResult.fileName+" 上传成功！");
                                filePaths.push(uploadResult.fileName);
                            }
                        });
                        e.values.filePath=filePaths.join(',');
                        fileOk=true;
                    });
                }
            }
            var _intervalId = setInterval(async() => {
                if (fileOk) {
                    clearInterval(_intervalId);
                    e.values[data.key]=idx+1;
                    e.values.caseNo=data.caseNo;
                    e.values.id=data.id;
                    e.values.isInactived=0;
                    e.values.caseStatus=data.caseStatus;
                    e.values[data.dateKey]=getDateTime();
                    console.log("final values",data.table,e.values);
                    //添加新提交的数据到数据库
                    pureinsert(data.table,e.values,(r)=>{
                        console.log('insert result',data.table,r);
                        //添加新提交的数据到缓存
                        DataList[data.table].push(e.values);
                        //更新当前视图事件列表
                        console.log(getSortedUpdateEvents(),$('#progress_point_info_body'));
                        generateUpdateInfoList($('#progress_point_info_body'),getSortedUpdateEvents());
                        //更新节点视图计数器
                        
                        //更新节点图
                        if(data.table=='caseExcutes'){
                            //DataList.caseExcutes=updateOriginalData(DataList.caseExcutes,newData,data.idkey);
                            fireDataChnaged("caseexcutesChanged",e.values,"add");
                        }
                        var canGo=true;
                        if(parseInt(getGlobal("currentIsAdd"))==1) {
                            canGo=false;
                            currentForm.getFormValues(function(e){
                                console.log(e);
                                var newData={};
                                $.each(e.values,(key,val)=>{
                                    newData[key.replace("_p","")]=val;
                                })
                                
                                newData.id=parseInt(getGlobal("currentId"));
                                if(e.success){
                                    insert('caseProgresses',newData,function(ee){
                                        console.log(ee,getGlobal("currentIsAdd"));
                                        if(ee.success){
                                            
                                                DataList.caseProgresses.push(newData);
                                                
                                                var matched=$.grep(resourceDatas.caseStatus_,label=>label.id==parseInt(getGlobal("currentPoint")));//获取节点属性数据
                                                
                                                if(matched.length>0){
                                                    $('#progress_diagram').trigger({type:'moveNext',sourceData:matched[0],sourceIndex:parseInt(getGlobal("currentIndex")),
                                                                eventsData:currentEvents,
                                                                mainEventData:formatMainEventData(newData)});
                                                    $('#pageOneTable').updateTableItem({caseStatus:parseInt(getGlobal("currentPoint")),id:newData.id});
                                                    canGo=true;
                                                }
                                                update('id='+newData.id,'caseStatus',{'caseStatus':JSON.stringify($('#progress_diagram').jqmData('status'))},function(eee){
                                                    
                                                    if(eee.data.success){
                                                        DataList.combinedData=updateOriginalData(DataList.combinedData,{id:newData.id,caseStatus:JSON.stringify($('#progress_diagram').jqmData('status'))},'id');
                                                        $().minfo('show',{title:"提示",message:"保存成功。"},function(){});
                                                    }else{
                                                        $().minfo('show',{title:"错误",message:eee.data.data.sqlMessage});
                                                    }
                                                    $().mloader("hide");
                                                });
                                            
                                            
                                        }else{
                                            $().mloader("hide");
                                            $().minfo('show',{title:"错误",message:ee.error});
                                        }
                                    })
                                
                                }
                            });
                        }
                        //console.log('getUpdateEvents',getUpdateEvents())
                        setTimeout(() => {
                            const intervalId = setInterval(() => {
                                if (canGo) {
                                    clearInterval(intervalId);
                                    $('#progress_diagram').trigger({type:'updateIndicator',eventsData:getUpdateEvents()})
                                    updatePenaltyPaidSummary($('#execute_summary'));
                                }
                            }, 100);
                        }, 100);
                        
                        
                        $().mloader("hide");
                    
                    });
                    //history.back();
                }
            });
            $().mloader('hide')
        }
    });
}
/*
//节点添加保存
function updateSubmitEvent(e){
    console.log('updateSubmitEvent',$(this).data('item'));
    var data=JSON.parse($(this).data('item'));
    
    var form=$(this).jqmData('form');
    console.log(form.opt.template);
    form.getFormValues(function(e){
        console.log("获取到的表格值",e);
        if(e.success){
            var editableStatus=checkProgressEdiableStatus();
            var goNext=false;
            var intervalId;
            console.log("提交方式为",editableStatus);
            if(editableStatus!="new" && editableStatus!="update"){
                //var list2delete=[];

                //需要删除旧的节点事件
                var tables={};
                var deleteItem=currentProgress['currentDiagramButton'].opt.counterData.filter((d)=>{
                    var isMatched=false;
                    if(formatIndex(d.caseStatus).main>=currentProgress['targetPosition'].main && 
                    formatIndex(d.caseStatus).sub!=currentProgress['targetPosition'].sub && d.isInactived==0){
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
                //需要恢复新的节点删除事件
                var activedtables={};
                var activedItem=currentProgress['currentDiagramButton'].opt.counterData.filter((d)=>{
                    var isMatched=false;
                    if(formatIndex(d.caseStatus).main==currentProgress['targetPosition'].main && 
                    formatIndex(d.caseStatus).sub==currentProgress['targetPosition'].sub && d.isInactived==1){
                        var matcher=Object.keys(tableNamesMatcher);
                        matcher.forEach(match=>{
                            if(d.hasOwnProperty(match)){
                                if(!activedtables.hasOwnProperty(tableNamesMatcher[match])){
                                    activedtables[tableNamesMatcher[match]]=[];
                                }
                                activedtables[tableNamesMatcher[match]].push(d);
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
                    //var cango=true;
                    var fileOk=true;
                    var idx=await getRecordLatestIndex(data.table,data.key);
                    if(data.table!='caseAttachments'){
                        var subidx=await getRecordLatestIndex(data.table,'subId','caseStatus='+data.caseStatus);
                        e.values.subId=subidx+1;
                    }else{
                        fileOk=false;
                        //files=values.data.caseAttachments;
                        if(e.values.filePath.length>0){
                            var filePaths= [];
                            
                            uploadFiles(data.id,e.values.filePath).then(r=>{
                                //console.log(r);
                                $.each(r,(index,uploadResult)=>{
                                    if(!uploadResult.success){
                                        console.log(uploadResult.fileName+" 上传失败！");
                                        //cango=false;
                                        //$().mloader("hide");
                                    }else{
                                        console.log(uploadResult.fileName+" 上传成功！");
                                        filePaths.push(uploadResult.fileName);
                                    }
                                });
                                e.values.filePath=filePaths.join(',');
                                fileOk=true;
                            });
                            
                            
                        }
                        
                        //values.data.caseAttachments
                    }

                    var _intervalId = setInterval(async() => {
                        if (fileOk) {
                            clearInterval(_intervalId);
                            e.values[data.key]=idx+1;
                            e.values.caseNo=data.caseNo;
                            e.values.id=data.id;
                            e.values.isInactived=0;
                            e.values.caseStatus=data.caseStatus;
                            e.values[data.dateKey]=getDateTime();
                            var newCaseStatus=currentProgress['targetPosition'].main+(currentProgress['originalPosition'].main>excutePoint && currentProgress['targetPosition'].main> currentProgress['originalPosition'].main?currentProgress['originalPosition'].sub:currentProgress['targetPosition'].sub)/10;
                            if(editableStatus=="new" || editableStatus=="shift"){
                                //pageOnTable.updateTableData({caseStatus:newCaseStatus},$('#pageOneTable').find('tr[data-item='+data.id+']'));
                                $('#pageOneTable').updateTableItem({caseStatus:newCaseStatus,id:data.id});
                                console.log("提交方式为",editableStatus,'状态更新为',newCaseStatus,'目标ID',data.id);
                                
                                //因为是添加，需要更新节点在表格caseStatus的位置
                                update("id="+data.id,'caseStatus','caseStatus="'+newCaseStatus+'"',async function(r){
                                    console.log('update result',r);
                                    $.each(DataList.combinedData,(index,item)=>{
                                        if(item.id == data.id) {
                                            DataList.combinedData[index].caseStatus=newCaseStatus;
                                            return false;
                                        }
                                    });
                                    //await currentProgress['currentDiagramButton'].setStep(currentProgress['target']);
                                    var targetPosition=currentProgress['targetPosition'];
                                    if(currentProgress['originalPosition'].main>=currentProgress['currentDiagramButton'].opt.breakpoint){
                                        
                                        if(targetPosition.main==currentProgress['currentDiagramButton'].opt.breakpoint){
        
                                        }else{
                                            targetPosition.sub=currentProgress['originalPosition'].sub;
                                        }
                                    }
                                    await currentProgress['currentDiagramButton'].MoveTo(targetPosition.main+targetPosition.sub/10);
                                })
                                if(editableStatus=="shift"){
                                    //删除旧节点事件--更新数据库，更新缓存数据
                                    $.each(tables,(table,del)=>{
                            
                                        del.forEach((dl)=>{
                                            //console.log(table,del.length,dl.caseStatus,dl.id);
                                            //更新数据库
                                            inactiveItem("caseStatus="+dl.caseStatus+" AND id="+dl.id,table);
                                            //更新缓存数据
                                            var index=currentProgress['currentDiagramButton'].opt.counterData.indexOf(dl);
                                            console.log("indexOf",index)
                                            if(index>-1){
                                                //currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=1;
                                                //currentProgress['currentDiagramButton'].opt.counterData.splice(index, 1);
                                                currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=1;
                                            }
                                            index=DataList[table].indexOf(dl);
                                            if(index>-1){
                                                //currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=1;
                                                DataList[table][index].isInactived=1;
                                            }
                                        })
                                    })
                                    //恢复新的节点原有删除的事件--更新数据库，更新缓存数据
                                    $.each(activedtables,(table,actived)=>{
                            
                                        actived.forEach((ac)=>{
                                            //console.log(table,del.length,dl.caseStatus,dl.id);
                                            //更新数据库
                                            restoreItem("caseStatus="+ac.caseStatus+" AND id="+ac.id,table);
                                            //更新缓存数据
                                            var index=currentProgress['currentDiagramButton'].opt.counterData.indexOf(ac);
                                            console.log("indexOf",index)
                                            if(index>-1){
                                                //currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=1;
                                                currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=0;
                                            }
                                            index=DataList[table].indexOf(ac);
                                            if(index>-1){
                                                //currentProgress['currentDiagramButton'].opt.counterData[index].isInactived=1;
                                                DataList[table][index].isInactived=0;
                                            }
                                        })
                                    })
                                    console.log('DataList',DataList);
                                }
                            }
                            //更新节点数据
                            console.log("final values",data.table,e.values);
                            //添加新提交的数据到数据库
                            pureinsert(data.table,e.values,(r)=>{
                                console.log('insert result',data.table,r,currentProgress['target']);
                                //添加新提交的数据到缓存
                                DataList[data.table].push(e.values);
                                currentProgress['currentDiagramButton'].opt.counterData.push(e.values);
                                //更新节点图
                                currentProgress['currentDiagramButton'].updateCounterIndicator(data,editableStatus=="shift"?currentProgress['originalPosition']:undefined);
                                if(data.table=='caseExcutes'){
                                    fireDataChnaged("caseexcutesChanged",e.values,"add");
                                }
                                $().mloader("hide");
                            
                            });
                            history.back();
                        }
                    });
                    
                }
            }, 100);
        }
        

    });
}
*/
function setProgressPopupFormWithoutCheck(template,title,data){
    $().mloader("show",{message:"读取中...."});
    var form= new mform({template:template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    $('#progress_point_popup_add_title').text(" "+title);
    $('#progress_point_popup_add_form').empty();
    $('#progress_point_popup_add_form').append(form.instance);
    $('#progress_point_popup_add_form').trigger('create');
    $('.progress_popup_add_form_submit').data('item',JSON.stringify(data));
    $('.progress_popup_add_form_submit').jqmData('form',form);
    setTimeout(() => {
        $('#progress_point_popup_add').popup('open');
        $().mloader("hide");
    },200);
}
/*
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
                var form= new mform({template:template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
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
*/
//第一页左下方 添加 删除 按钮事件
$('.case_reg_but').on('click',async function(e){
    e.preventDefault();
    if(this.id=="case_reg_but_add"){//第一页左下方 添加
        isAddPage=true;
        $().mloader("show",{message:"读取中...."});
        
            
            //main_form.readOnly(false);
            //main_form.instance.setEmptyValues(FormTemplate.template);
            //main_form.readOnly(false).setEmptyValues();
            //main_form.instance.setEmptyValues()
            //
            
            //main_form.readOnly(false).setEmptyValues();
            $('.progress_lock.edit-info').addClass('hide');
            //console.log($('.progress_lock.edit-info'));
            $("#reg_form_title").html("新增档案");
            $('.edit-header-btn[name="save_btn"').show();
            //_setBlurBackgroundVisibility(true);
            goToPage( $(this).attr( "href" ));
           // main_form.readOnly(false).setEmptyValues();
                //$().mloader("hide");
           //setTimeout(function() {
                caseForm.setEmptyValues();
                
                $().mloader("hide");
            //}, 10);
            //main_form.setValues(getGlobalJson("mainData")[0]);
            //$("#fullscreenPage").trigger('create');
            //main_form.instance.trigger('create');
        getCaseLatestIndex().then(id=>{
            console.error('currentId',id+1)
            sessionStorage.setItem("currentId", id+1);
            
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
            },function(go){
                if(go){
                    console.log("删除");
                    $("#pageOneTable").removeTableItem(getGlobalJson('currentUser').level==adminLevel,function(ids){
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
                        inactiveCases(ids,(res)=>{
                            showResponse(res);
                        });
                        
                    })
                }
                
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
            },function(go){
                if(go){
                    console.log("恢复");
                    $('#pageOneTable').restoreTableItem(function(ids){
                        console.log(ids);
                        
                        $.each(DataList.combinedData,function(index,item){
                            if(ids.includes(item.id)){
                                DataList.combinedData[index].isInactived=0;
                            }
                        });
                        
                        console.log(DataList.combinedData);
                        restoreCases(ids,(res)=>{
                            showResponse(res);
                        });
                        
                    });
                }
                
            });
        }
    }else if(this.id=="chart_sum"){
        $('#chart_sum_p').children().hide();
        $('#chart_sum_all').show();
        $('.chart-btn').removeClass('listview-item-active');
        $($('.chart-btn')[0]).addClass('listview-item-active');
        var caseCause={};
        var caseCause1={};
        var project={};
        var project1={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.caseCauses_,(d=>d.id==item.caseCause));
            if(match.length>0){
                var catelog=match[0].label;
                if(!caseCause.hasOwnProperty(catelog)) caseCause[catelog]=[];
                if(!caseCause1.hasOwnProperty(catelog)) caseCause1[catelog]=0.0;
                caseCause[catelog].push(item);
                caseCause1[catelog]+=item.requestAmount;
            }
            var matchp=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject));
            if(matchp.length>0){
                var catelog=matchp[0].name;
                if(!project.hasOwnProperty(catelog)) project[catelog]=[];
                if(!project1.hasOwnProperty(catelog)) project1[catelog]=0.0;
                project[catelog].push(item);
                project1[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        console.log('chart_sum',caseCause1);

        var chartCaseCause=[];
        var chartCaseCause1=[];
        $.each(caseCause,(key,items)=>{
            chartCaseCause.push({'label':key,'value':items.length})
        });
        $.each(caseCause1,(key,value)=>{
            chartCaseCause1.push({'label':key,'value':value, })
        });setChartsPage([
            {data:chartCaseCause1,caption:'案件纠纷涉及金额',type:"bar2d"},{data:chartCaseCause,caption:'案件纠纷数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartCaseCause,caption:'案件纠纷数量比例',type:"pie3d"},{data:chartCaseCause1,caption:'案件纠纷涉及金额',type:"bar2d"},);
        //$('#chart_sum').trigger('create')
        goToPage( $(this).attr( "href" ));
    }
})

$('#export_chart').on('click',function(e){
    var form= new mform({template:export_chart_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    $('#export_popup_title').text("导出设置");
    $('#export_popup_form').empty();
    $('#export_popup_form').append(form.instance);
    $('#export_popup_form').trigger('create');
    //console.log(JSON.stringify(data));
    $('#export_popup_form_submit').jqmData('form',form);
    $('#export_popup').trigger('create');
    $('#export_popup').popup('open');
})

$('.chart-btn').on('click',function(e){
    console.log('chart-btn');
    $('.chart-btn').removeClass('listview-item-active');
    $(this).addClass('listview-item-active');
    if($(this).text()=="纠纷"){
        $('#chart_sum_p').children().hide();
        $('#chart_sum_all').show();
        var caseCause={};
        var caseCause1={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.caseCauses_,(d=>d.id==item.caseCause));
            if(match.length>0){
                var catelog=match[0].label;
                if(!caseCause.hasOwnProperty(catelog)) caseCause[catelog]=[];
                if(!caseCause1.hasOwnProperty(catelog)) caseCause1[catelog]=0.0;
                caseCause[catelog].push(item);
                caseCause1[catelog]+=item.requestAmount;
            }
        });
        console.log('chart_sum',caseCause1);
        var chartCaseCause=[];
        var chartCaseCause1=[];
        $.each(caseCause,(key,items)=>{
            chartCaseCause.push({'label':key,'value':items.length})
        });
        $.each(caseCause1,(key,value)=>{
            chartCaseCause1.push({'label':key,'value':value, })
        });
        setChartsPage([
            {data:chartCaseCause1,caption:'案件纠纷涉及金额',type:"bar2d"},{data:chartCaseCause,caption:'案件纠纷数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartCaseCause,caption:'案件纠纷数量比例',type:"pie3d"},{data:chartCaseCause1,caption:'案件纠纷涉及金额',type:"bar2d"},);
    }else if($(this).text()=="项目"){
        
        $('#chart_sum_p').children().hide();
        
        $('#chart_sum_all').show();
        var project={};
        var project1={};
        DataList.casesDb.forEach(item=>{
            var matchp=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject));
            if(matchp.length>0){
                var catelog=matchp[0].name;
                if(!project.hasOwnProperty(catelog)) project[catelog]=[];
                if(!project1.hasOwnProperty(catelog)) project1[catelog]=0.0;
                project[catelog].push(item);
                project1[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        console.log('chart_sum',caseCause1);
        var chartProject=[];
        var chartProject1=[];
        $.each(project,(key,items)=>{
            chartProject.push({'label':key,'value':items.length})
        });
        $.each(project1,(key,value)=>{
            chartProject1.push({'label':key,'value':value, })
        });
        setChartsPage([
            {data:chartProject1,caption:'项目涉及金额',type:"bar2d"},{data:chartProject,caption:'项目案件数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartProject,caption:'项目案件数量比例',type:"pie3d"},{data:chartProject1,caption:'项目涉及金额',type:"bar2d"});
    }else if($(this).text()=="诉讼类型"){
        
        $('#chart_sum_p').children().hide();
        
        $('#chart_sum_all').show();
        var data1={};
        var data2={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.caseLabels_,(d=>d.id==item.caseLabel));
            if(match.length>0){
                var catelog=match[0].label;
                if(!data1.hasOwnProperty(catelog)) data1[catelog]=[];
                if(!data2.hasOwnProperty(catelog)) data2[catelog]=0.0;
                data1[catelog].push(item);
                data2[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        
        var chartData1=[];
        var chartData2=[];
        $.each(data1,(key,items)=>{
            chartData1.push({'label':key,'value':items.length})
        });
        $.each(data2,(key,value)=>{
            chartData2.push({'label':key,'value':value, })
        });
        setChartsPage([
            {data:chartData2,caption:'诉讼类型涉及金额',type:"column2d"},{data:chartData1,caption:'诉讼类型数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartData1,caption:'诉讼类型数量比例',type:"pie3d"},{data:chartData2,caption:'诉讼类型涉及金额',type:"column2d"});
    }else if($(this).text()=="在审项目"){
        
        $('#chart_sum_p').children().hide();
        
        $('#chart_sum_all').show();
        var data1={};
        var data2={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseStatus>=0 && item.caseStatus<3));
            if(match.length>0){
                var catelog=match[0].name;
                if(!data1.hasOwnProperty(catelog)) data1[catelog]=[];
                if(!data2.hasOwnProperty(catelog)) data2[catelog]=0.0;
                data1[catelog].push(item);
                data2[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        
        var chartData1=[];
        var chartData2=[];
        $.each(data1,(key,items)=>{
            chartData1.push({'label':key,'value':items.length})
        });
        $.each(data2,(key,value)=>{
            chartData2.push({'label':key,'value':value, })
        });
        
        setChartsPage([
            {data:chartData2,caption:'在审项目涉及金额',type:"bar2d"},{data:chartData1,caption:'在审项目数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartData1,caption:'在审项目数量比例',type:"pie3d"},{data:chartData2,caption:'在审项目涉及金额',type:"bar2d"});
    }else if($(this).text()=="在执项目"){
        
        $('#chart_sum_p').children().hide();
        
        $('#chart_sum_all').show();
        var data1={};
        var data2={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseStatus>=3 && item.caseStatus<4));
            if(match.length>0){
                var catelog=match[0].name;
                if(!data1.hasOwnProperty(catelog)) data1[catelog]=[];
                if(!data2.hasOwnProperty(catelog)) data2[catelog]=0.0;
                data1[catelog].push(item);
                data2[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        
        var chartData1=[];
        var chartData2=[];
        $.each(data1,(key,items)=>{
            chartData1.push({'label':key,'value':items.length})
        });
        $.each(data2,(key,value)=>{
            chartData2.push({'label':key,'value':value, })
        });
        
        setChartsPage([
            {data:chartData2,caption:'在执项目涉及金额',type:"bar2d"},{data:chartData1,caption:'在执项目数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartData1,caption:'在执项目数量比例',type:"pie3d"},{data:chartData2,caption:'在执项目涉及金额',type:"bar2d"});
    }else if($(this).text()=="重大案件"){
        
        $('#chart_sum_p').children().hide();
        
        $('#chart_sum_all').show();
        var data1={};
        var data2={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseLabel==2));
            if(match.length>0){
                var catelog=match[0].name;
                if(!data1.hasOwnProperty(catelog)) data1[catelog]=[];
                if(!data2.hasOwnProperty(catelog)) data2[catelog]=0.0;
                data1[catelog].push(item);
                data2[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        
        var chartData1=[];
        var chartData2=[];
        $.each(data1,(key,items)=>{
            chartData1.push({'label':key,'value':items.length})
        });
        $.each(data2,(key,value)=>{
            chartData2.push({'label':key,'value':value, })
        });
        setChartsPage([
            {data:chartData2,caption:'重大案件项目涉及金额',type:"bar2d"},{data:chartData1,caption:'重大案件项目数量比例',type:"pie3d"}
        ])
        //setChartPage({data:chartData1,caption:'一千万以上案件项目数量比例',type:"pie3d"},{data:chartData2,caption:'一千万以上案件项目涉及金额',type:"bar2d"});
    }else if($(this).text()=="群诉案件"){
        $('#chart_sum_p').children().hide();
        $('#chart_sum_all').show();
        var data1={};
        var data2={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseLabel==3));
            if(match.length>0){
                var catelog=match[0].name;
                if(!data1.hasOwnProperty(catelog)) data1[catelog]=[];
                if(!data2.hasOwnProperty(catelog)) data2[catelog]=0.0;
                data1[catelog].push(item);
                data2[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        
        var chartData1=[];
        var chartData2=[];
        $.each(data1,(key,items)=>{
            chartData1.push({'label':key,'value':items.length})
        });
        $.each(data2,(key,value)=>{
            chartData2.push({'label':key,'value':value, })
        });
        setChartsPage([
            {data:chartData2,caption:'群诉案件项目涉及金额',type:"bar2d"},
            {data:chartData1,caption:'群诉案件项目数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartData1,caption:'重大群诉案件项目数量比例',type:"pie3d"},{data:chartData2,caption:'重大群诉案件项目涉及金额',type:"bar2d"});
    }else if($(this).text()=="法务统计"){
        $('#chart_sum_p').children().hide();
        $('#chart_sum_all').show();
        var data1={};
        var data2={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.legalAgencies,(d=>d.id==item.legalAgencies));
            if(match.length>0){
                var catelog=match[0].name;
                if(!data1.hasOwnProperty(catelog)) data1[catelog]=[];
                if(!data2.hasOwnProperty(catelog)) data2[catelog]=0.0;
                data1[catelog].push(item);
                data2[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        
        var chartData1=[];
        var chartData2=[];
        $.each(data1,(key,items)=>{
            chartData1.push({'label':key,'value':items.length})
        });
        $.each(data2,(key,value)=>{
            chartData2.push({'label':key,'value':value, })
        });
        setChartsPage([
            {data:chartData2,caption:'法务案件项目涉及金额',type:"bar2d"},
            {data:chartData1,caption:'法务案件项目数量比例',type:"pie3d"},
        ])
        //setChartPage({data:chartData1,caption:'重大群诉案件项目数量比例',type:"pie3d"},{data:chartData2,caption:'重大群诉案件项目涉及金额',type:"bar2d"});
    }else if($(this).text()=="全部"){
        $('#chart_sum_p').children().hide();
        $('#chart_sum_all').show();
        var data1={};
        var data2={};
        var caseCause={};
        var caseCause1={};
        var project={};
        var project1={};
        var caseType={};
        var caseType1={};
        var inProgress={};
        var inProgress1={};
        var inExcution={};
        var inExcution1={};
        var oneK={};
        var oneK1={};
        var legalAgencies={};
        var legalAgencies1={};
        DataList.casesDb.forEach(item=>{
            var match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseLabel==3));
            if(match.length>0){
                var catelog=match[0].name;
                if(!data1.hasOwnProperty(catelog)) data1[catelog]=[];
                if(!data2.hasOwnProperty(catelog)) data2[catelog]=0.0;
                data1[catelog].push(item);
                data2[catelog]+=item.requestAmount;
            }
            match=$.grep(resourceDatas.caseCauses_,(d=>d.id==item.caseCause));
            if(match.length>0){
                var catelog=match[0].label;
                if(!caseCause.hasOwnProperty(catelog)) caseCause[catelog]=[];
                if(!caseCause1.hasOwnProperty(catelog)) caseCause1[catelog]=0.0;
                caseCause[catelog].push(item);
                caseCause1[catelog]+=item.requestAmount;
            }
            var matchp=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject));
            if(matchp.length>0){
                var catelog=matchp[0].name;
                if(!project.hasOwnProperty(catelog)) project[catelog]=[];
                if(!project1.hasOwnProperty(catelog)) project1[catelog]=0.0;
                project[catelog].push(item);
                project1[catelog]+=item.requestAmount;
            }
            match=$.grep(resourceDatas.caseLabels_,(d=>d.id==item.caseLabel));
            if(match.length>0){
                var catelog=match[0].label;
                if(!caseType.hasOwnProperty(catelog)) caseType[catelog]=[];
                if(!caseType1.hasOwnProperty(catelog)) caseType1[catelog]=0.0;
                caseType[catelog].push(item);
                caseType1[catelog]+=item.requestAmount;
            }
            match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseStatus>=0 && item.caseStatus<3));
            if(match.length>0){
                var catelog=match[0].name;
                if(!inProgress.hasOwnProperty(catelog)) inProgress[catelog]=[];
                if(!inProgress1.hasOwnProperty(catelog)) inProgress1[catelog]=0.0;
                inProgress[catelog].push(item);
                inProgress1[catelog]+=item.requestAmount;
            }
            match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseStatus>=3 && item.caseStatus<4));
            if(match.length>0){
                var catelog=match[0].name;
                if(!inExcution.hasOwnProperty(catelog)) inExcution[catelog]=[];
                if(!inExcution1.hasOwnProperty(catelog)) inExcution1[catelog]=0.0;
                inExcution[catelog].push(item);
                inExcution1[catelog]+=item.requestAmount;
            }
            match=$.grep(resourceDatas.projects_,(d=>d.id==item.caseProject && item.caseLabel==2));
            if(match.length>0){
                var catelog=match[0].name;
                if(!oneK.hasOwnProperty(catelog)) oneK[catelog]=[];
                if(!oneK1.hasOwnProperty(catelog)) oneK1[catelog]=0.0;
                oneK[catelog].push(item);
                oneK1[catelog]+=item.requestAmount;
            }
            match=$.grep(resourceDatas.legalAgencies,(d=>d.id==item.legalAgencies));
            if(match.length>0){
                var catelog=match[0].name;
                if(!legalAgencies.hasOwnProperty(catelog)) legalAgencies[catelog]=[];
                if(!legalAgencies1.hasOwnProperty(catelog)) legalAgencies1[catelog]=0.0;
                legalAgencies[catelog].push(item);
                legalAgencies1[catelog]+=item.requestAmount;
            }
            //console.log('chart_sum',match.label,match)
            //caseCause.push({})
        });
        
        var chartData1=[];
        var chartData2=[];
        $.each(data1,(key,items)=>{
            chartData1.push({'label':key,'value':items.length})
        });
        $.each(data2,(key,value)=>{
            chartData2.push({'label':key,'value':value, })
        });

        var chartCaseCause=[];
        var chartCaseCause1=[];
        $.each(caseCause,(key,items)=>{
            chartCaseCause.push({'label':key,'value':items.length})
        });
        $.each(caseCause1,(key,value)=>{
            chartCaseCause1.push({'label':key,'value':value, })
        });

        var chartProject=[];
        var chartProject1=[];
        $.each(project,(key,items)=>{
            chartProject.push({'label':key,'value':items.length})
        });
        $.each(project1,(key,value)=>{
            chartProject1.push({'label':key,'value':value, })
        });

        var caseTypeData1=[];
        var caseTypeData2=[];
        $.each(caseType,(key,items)=>{
            caseTypeData1.push({'label':key,'value':items.length})
        });
        $.each(caseType1,(key,value)=>{
            caseTypeData2.push({'label':key,'value':value, })
        });
        
        var inProgressData1=[];
        var inProgressData2=[];
        $.each(inProgress,(key,items)=>{
            inProgressData1.push({'label':key,'value':items.length})
        });
        $.each(inProgress1,(key,value)=>{
            inProgressData2.push({'label':key,'value':value, })
        });

        var inExcutionData1=[];
        var inExcutionData2=[];
        $.each(inExcution,(key,items)=>{
            inExcutionData1.push({'label':key,'value':items.length})
        });
        $.each(inExcution1,(key,value)=>{
            inExcutionData2.push({'label':key,'value':value, })
        });

        var oneK1Data1=[];
        var oneK1Data2=[];
        $.each(oneK,(key,items)=>{
            oneK1Data1.push({'label':key,'value':items.length})
        });
        $.each(oneK1,(key,value)=>{
            oneK1Data2.push({'label':key,'value':value, })
        });

        var legalAgenciesData1=[];
        var legalAgenciesData2=[];
        $.each(legalAgencies,(key,items)=>{
            legalAgenciesData1.push({'label':key,'value':items.length})
        });
        $.each(legalAgencies1,(key,value)=>{
            legalAgenciesData2.push({'label':key,'value':value, })
        });
        var chartList=[
            {data:chartCaseCause1,caption:'案件纠纷涉及金额',type:"bar2d"},{data:chartCaseCause,caption:'案件纠纷数量比例',type:"pie3d"},
            {data:chartProject1,caption:'项目涉及金额',type:"bar2d"},{data:chartProject,caption:'项目案件数量比例',type:"pie3d"},
            {data:caseTypeData2,caption:'诉讼类型涉及金额',type:"column2d"},{data:caseTypeData1,caption:'诉讼类型数量比例',type:"pie3d"},
            {data:inProgressData2,caption:'在审项目涉及金额',type:"bar2d"},{data:inProgressData1,caption:'在审项目数量比例',type:"pie3d"},
            {data:inExcutionData2,caption:'在执项目涉及金额',type:"bar2d"},{data:inExcutionData1,caption:'在执项目数量比例',type:"pie3d"},
            {data:oneK1Data2,caption:'重大案件项目涉及金额',type:"bar2d"},{data:oneK1Data1,caption:'重大案件项目数量比例',type:"pie3d"},
            {data:chartData2,caption:'群诉案件项目涉及金额',type:"bar2d"},{data:chartData1,caption:'群诉案件项目数量比例',type:"pie3d"},
            
        ]
        if(getGlobalJson('currentUser').level>=supervisorLevel){
            chartList.push({data:legalAgenciesData2,caption:'法务案件项目涉及金额',type:"bar2d"},{data:legalAgenciesData1,caption:'法务案件项目数量比例',type:"pie3d"});
        }
        setChartsPage(chartList);
        //setChartPage({data:chartData1,caption:'重大群诉案件项目数量比例',type:"pie3d"},{data:chartData2,caption:'重大群诉案件项目涉及金额',type:"bar2d"});
    }
})
function setChartsPage(datas){
    $('#chart_sum_all').empty();
    var checkboxes=[];
    var charts=[];
    FusionCharts.ready(function(){
        datas.forEach((data,index)=>{
            var outterFrame=$('<div style="width: 100%; height:calc( 100% - 70px);"></div>');
            var  checkboxFrame=$('<div style="position:absolute;width:50%"></div>');
            var checkbox=$('<input type="checkbox" name="checkbox_'+index+'" id="checkbox_'+index+'">');
            var caption=$('<label style="text-align: center;border: none;border-radius: 0;background:white;" data-iconpos="right" for="checkbox_'+index+'">'+data.caption+'</label>');
            checkboxFrame.append(checkbox);
            checkboxes.push(checkbox);
            checkboxFrame.append(caption);
            
            outterFrame.append(checkboxFrame);
            var container=$('<div id="chart_'+index+'" ></div>');
            outterFrame.append(container);
            data.renderAt='chart_'+index;
            $('#chart_sum_all').append(outterFrame);
            if(data.type=="pie3d"){
                var chart=setPieChart(data);
                checkbox.jqmData('chart',chart)
                charts.push(chart);
                chart.render();
            }else if(data.type=="bar2d" || data.type=="column2d"){
                var chart=setColumnBarChart(data);
                checkbox.jqmData('chart',chart)
                charts.push(chart);
                chart.render();
            }
        })
        $('#chart_sum_all').trigger('create');
        window.exportAllChartsToPDF = function() {
            console.log('export...');
            //console.log($($(this).jqmData('form')).find('input:checked').val(),$('#exportFileType').val(),$('#exportFileName').val())
            $(this).jqmData('form').getFormValues(function(e){

                
                
                if(e.success){
                    if(e.values.exportType!=0){
                        charts=[];
                        checkboxes.forEach((checkbox)=>{
                            if($(checkbox).jqmData('chart')!=undefined && $(checkbox).prop('checked')){
                                charts.push($(checkbox).jqmData('chart'));
                            }
                        })
                    }
                    console.log(charts);
                    FusionCharts.batchExport({
                        "charts": charts,
                        "exportFormat": e.values.exportFileType,
                        "exportFileName":e.values.exportFileName,
                      });
                    
                }
            })
            

        };
        
        document.getElementById("export_popup_form_submit").addEventListener("click", exportAllChartsToPDF);
    });

}
function setColumnBarChart(data){
    return new FusionCharts({
        type: data.type, 
        renderAt: data.renderAt,  
        width: $(window).width()/2,  
        height: $(window.top).height()-100,  
        dataFormat: 'json',  
        dataSource: {  
            "chart": {  
                "caption": data.caption,  
                "bgColor": "#ffffff",  
                "showBorder": "0",  
                "captionFontSize": "18",  
                "captionFontColor": "#333",
                "subcaptionFontSize": "18",  
                "formatNumberScale": "1",
                "numberScaleUnit": "万,亿",  // Setting the scale units in Chinese
                "numberScaleValue": "1,10000",  // Setting the scale values
                "palettecolors": "#5d62b5,#29c3be,#f2726f,#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "plotBorderAlpha": "0", // Setting the plotBorderAlpha to 0 to remove the column borders
                "usePlotGradientColor": "0",
                "baseFontSize": "14",
                "legendShadow": '0',  
            },  
            "data": data.data
        }  
    });
}
function setPieChart(data){
    return new FusionCharts({ 
        type: data.type,  
        renderAt: data.renderAt,  
        width: $(window).width()/2,  
        height: $(window.top).height()-100,  
        dataFormat: 'json',  
        dataSource: {  
            "chart": {  
                "caption": data.caption,  
                "captionFontColor": "#333",
                "subCaption": "",  
                "paletteColors": "#5d62b5,#29c3be,#f2726f,#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",  
                "bgColor": "#ffffff",  
                "showBorder": "0",  
                "use3DLighting": "0",  
                "showShadow": "0",  
                "enableSmartLabels": "0",  
                "startingAngle": "0",  
                "showPercentValues": "1",  
                "showPercentInTooltip": "0",  
                "decimals": "2",  
                "captionFontSize": "18",  
                "subcaptionFontSize": "18",  
                "subcaptionFontBold": "0",  
                //"toolTipColor": "#ffffff",  
                //"toolTipBorderThickness": "0",  
                //"toolTipBgColor": "#000000",  
                //"toolTipBgAlpha": "80",  
                //"toolTipBorderRadius": "2",  
                //"toolTipPadding": "5",  
                "showHoverEffect":"1",  
                "showLegend": "1",  
                "legendBgColor": "#ffffff",  
                "legendBorderAlpha": '0',  
                "legendShadow": '0',  
                "legendItemFontSize": '14',  
                "legendItemFontColor": '#666666'  ,
                "labelFontSize": "14",
                "baseFontSize": "16",
            },  
            "data": data.data
        }  
    });
}
function setChartPage(data1,data2){
    FusionCharts.ready(function(){
        console.log($('#chart_container').css('width'),$(window).width())
        var revenueChart = new FusionCharts({ 
            type: data1.type,  
            renderAt: 'chart_container',  
            width: $(window).width()/2,  
            height: $(window.top).height()-50,  
            dataFormat: 'json',  
            dataSource: {  
                "chart": {  
                    "caption": data1.caption,  
                    "captionFontColor": "#333",
                    "subCaption": "",  
                    "paletteColors": "#5d62b5,#29c3be,#f2726f,#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",  
                    "bgColor": "#ffffff",  
                    "showBorder": "0",  
                    "use3DLighting": "0",  
                    "showShadow": "0",  
                    "enableSmartLabels": "0",  
                    "startingAngle": "0",  
                    "showPercentValues": "1",  
                    "showPercentInTooltip": "0",  
                    "decimals": "2",  
                    "captionFontSize": "18",  
                    "subcaptionFontSize": "18",  
                    "subcaptionFontBold": "0",  
                    //"toolTipColor": "#ffffff",  
                    //"toolTipBorderThickness": "0",  
                    //"toolTipBgColor": "#000000",  
                    //"toolTipBgAlpha": "80",  
                    //"toolTipBorderRadius": "2",  
                    //"toolTipPadding": "5",  
                    "showHoverEffect":"1",  
                    "showLegend": "1",  
                    "legendBgColor": "#ffffff",  
                    "legendBorderAlpha": '0',  
                    "legendShadow": '0',  
                    "legendItemFontSize": '14',  
                    "legendItemFontColor": '#666666'  ,
                    "labelFontSize": "14",
                    "baseFontSize": "16",
                },  
                "data": data1.data
            }  
        });
        revenueChart.render(); 
        
        var revenueChart1 = new FusionCharts({
            type: data2.type, 
            renderAt: 'chart_amount_container',  
            width: $(window).width()/2,  
            height: $(window.top).height()-50,  
            dataFormat: 'json',  
            dataSource: {  
                "chart": {  
                    "caption": data2.caption,  
                    "bgColor": "#ffffff",  
                    "showBorder": "0",  
                    "captionFontSize": "18",  
                    "captionFontColor": "#333",
                    "subcaptionFontSize": "18",  
                    "formatNumberScale": "1",
                    "numberScaleUnit": "万,亿,兆",  // Setting the scale units in Chinese
                    "numberScaleValue": "1,10000,100000000",  // Setting the scale values
                    "palettecolors": "#5d62b5,#29c3be,#f2726f,#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                    "plotBorderAlpha": "0", // Setting the plotBorderAlpha to 0 to remove the column borders
                    "usePlotGradientColor": "0",
                    "baseFontSize": "14",
                    "legendShadow": '0',  
                },  
                "data": data2.data
            }  
        });
        revenueChart1.render();  
        window.exportAllChartsToPDF = function() {
            //console.log($($(this).jqmData('form')).find('input:checked').val(),$('#exportFileType').val(),$('#exportFileName').val())
            $(this).jqmData('form').getFormValues(function(e){
                console.log(e);
                if(e.success){
                    if(Number(e.values.exportType)==0){
                        FusionCharts.batchExport({
                            "charts": [revenueChart, revenueChart1],
                            "exportFormat": e.values.exportFileType,
                            "exportFileName":e.values.exportFileName
                          });
                    }
                    
                }
            })
            

        };
        
        document.getElementById("export_popup_form_submit").addEventListener("click", exportAllChartsToPDF);
    });
}
//#region 查看信息页面的按钮事件

function showProgressDetails(datas,updates,excutes,properties,attachments,caseLinked){
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
            caseLinked:caseLinked
        }
        
    //console.log('showProgressDetails',data);
        //if(datas[0].id>30){
            //dataList=[];
        //}
        $('#timelineTitle').text(getFormatText(titleBarDisplayFormat,datas[0]));
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
function saveMainForm(form,isAddPage){
    form.getFormValues(function(e){
        console.log('getvalues',e);
        if(e.success){
            //console.log(message.message);
            //return;
            e.values.id=getGlobal("currentId");
            if(isAddPage){
                e.values['penalty']='0.00';
                e.values['paidAmount']='0.00';
                e.values['caseStatus']=[0];
                //e.values['lawFirm']=0;
                //e.values['attorney']='无0';
                //e.values['FirstInstance']='0000-00-00 00:00:00';
                //e.values['SecondInstance']='0000-00-00 00:00:00';
            }
            //e.values=Object.assign(e.values,e.caseStatus);
            e.values["caseCreateDate"]=formatDateTime(new Date(),'yyyy-MM-dd HH:mm:ss');
            console.log('save data',e);
            //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
            if(getGlobalJson("currentUser")==null || getGlobalJson("currentUser")==undefined){
                $().minfo('show',{title:"错误: "+error.FORM_INVALID_USER.message,message:"是否跳转到登录页面？"},function(){
                    //HideMessage();
                    window.location.href = 'index.html';
                });
            }else{
                e.values["caseApplicant"]=getGlobalJson("currentUser").id;
                //if(enableReadOnlyMode) e.values["isReadOnly"]=_isReadOnlyCurrentForm();
                e.values["id"]=Number(e.values["id"]);
                fireDataChnaged("caseChanged",e.values,isAddPage?"add":"update");
            }
            
            
        }else{
            
            console.log(e.valiation.join()," 有错误。");
        }
    });
}
//#region 保存按钮事件
$('.edit-header-btn').on('click',async function(e){
    console.log('currentPage',sessionStorage.getItem('currentPage'));
    if($(this).text()=="保存"){
        //console.log("保存");
        //console.log($(pageOnTable).html())

        //保存案件页面
        if(sessionStorage.getItem('currentPage')=="#casePage"){
            saveMainForm(caseForm,isAddPage);
            
        
        }
        //保存进展页面
        else if(sessionStorage.getItem('currentPage')=="#progress"){
            progressInfoForm.getFormValues(function(e){
                console.log('保存进展页面',e.values)
                if(e.success){
                    e.values.id=getGlobal("currentId");
                    fireDataChnaged("caseStatusChanged",e.values,"update");
                    
                }
            });
        }
        //保存个人信息页面
        else if(sessionStorage.getItem('currentPage')=="#infoPage"){
           
            setting_info_form.getFormValues(function(e){
                //console.log(values)
                if(e.success){
                    console.log(e);
                    $().mloader("show",{message:"提交中...."});
                    var newData={};
                    $.each(e.values,(key,val)=>{
                        if(key.replace("_p","")=='pass'){
                                newData[key.replace("_p","")]=encrypt(val);
                        }else{
                            newData[key.replace("_p","")]=val;
                        }
                    })
                    newData.id=getGlobalJson("currentUser").id;
                    update('id='+getGlobalJson("currentUser").id,userDbTableName,newData,function(r){
                        
                        if(r.data.data.affectedRows>0){
                            console.log("修改成功。");
                            resetPassChangeState(setting_info_form.instance);
                            fireDataChnaged('userDataChanged',newData,"update");
                            
                            $().minfo('show',{title:"提示",message:"修改成功。"},function(){
                                
                            });
                        }else{
                            console.log(r);
                            $().minfo('show',{title:"错误",message:r.error});
                        }
                        $().mloader("hide");
                    });
                    
                }
            });
        }
    }else if($(this).text()=="添加"){
        //添加个人信息页面
        if(sessionStorage.getItem('currentPage')=="#infoPage"){
            setting_add_form.getFormValues(async function(e){
                //console.log(values)
                if(e.success){
                    console.log(e);
                    $().mloader("show",{message:"提交中...."});
                    e.values.createDate=getDateTime();
                    e.values.id=(await getRecordLatestIndex(userDbTableName,'id'))+1;
                    e.values['isInactived']=e.values.isInactived_a;
                    delete e.values.isInactived_a;
                    e.values.pass=encrypt(e.values.pass)
                    saveCurrentUser(e.values,true).then((r)=>{
                        if(r.success){
                            console.log("添加成功。");
                            if(e.values.position>0)
                                resourceDatas.legalAgencies=updateOriginalData(resourceDatas.legalAgencies,e.values,'id');
                            resourceDatas['users']=updateOriginalData(resourceDatas['users'],e.values,'id');
                            $().minfo('show',{title:"提示",message:"添加成功。"},function(){
                                
                            });
                        }else{
                            console.log(r);
                            $().minfo('show',{title:"错误",message:r.error});
                        }
                        $().mloader("hide");
                    });
                }
            });
        }
    }else if($(this).text()=="修改"){
        var _this=this;
        //修改个人信息页面
        if(sessionStorage.getItem('currentPage')=="#infoPage"){
            
            var userD=JSON.parse($(_this).data('item'));
            setting_add_form.getFormValues(function(e){
                //console.log(values)
                if(e.success){
                    //values.data.values.createDate=getDateTime(userD.createDate);
                    $().mloader("show",{message:"提交中...."});
                    e.values['isInactived']=e.values.isInactived_a;
                    e.values.id=userD.id;
                    delete e.values.isInactived_a;
                    //console.log(values,userD);
                    var data=[];
                    $.each(e.values,(key,val)=>{
                        if(key!='id'){
                            if(key.replace("_p","")=='pass') data.push(key.replace("_p","")+"=\""+encrypt(val)+"\"");
                            else data.push(key.replace("_p","")+"=\""+val+"\"");
                        }
                    })
                    update('id='+userD.id,userDbTableName,data.join(),function(r){
                        
                        
                        if(r.data.data.affectedRows>0){
                            console.log("修改成功。");
                            if(e.values.position>0)
                                resourceDatas.legalAgencies=updateOriginalData(resourceDatas.legalAgencies,e.values,'id');
                            resourceDatas['users']=updateOriginalData(resourceDatas['users'],e.values,'id');
                            $().minfo('show',{title:"提示",message:"修改成功。"},function(){
                                
                            });
                        }else{
                            console.log(r);
                            $().minfo('show',{title:"错误",message:r.error});
                        }
                        $().mloader("hide");
                    });
                    
                }
            });
        }
    }
        
})
function getFormatText(format,dataObject){
    var text=format;
    $.each(dataObject,(k,v)=>{
        text=text.replace("{"+k+"}",v==null||v.length==0?"尚未设定":v);
    })
    return text;
}
function resetPassChangeState(form){
    var change_btn=form.find('#pass_controlgroup').find('a.btn-edit');
    var showHide_btn=form.find('#pass_controlgroup').find('a.btn-eye');
    var input=form.find('#pass_controlgroup').find('input');

    showHide_btn.removeClass('btn-icon-green');
    showHide_btn.trigger('create');
    input.attr('type',"password");
    input.addClass("ui-state-disabled");
    input.trigger('create')
    change_btn.removeClass('ui-icon-check').addClass('ui-icon-edit');;
    change_btn.removeClass('btn-icon-green').addClass('btn-icon-blue');
    change_btn.trigger('create');
}
//#endregion
function _setTitleBar(titlebarId,displayKey){
    titlebarId=titlebarId.replace("#","");
    var matched=DataList.combinedData.filter((d)=>{return d.id==sessionStorage.getItem("currentId")});
    
    var lockedTitle="查看案件";
    var unlockedTitle="修改案件";
    if(matched.length>0){
        lockedTitle+=" ["+matched[0].id+"]";
        unlockedTitle+=" ["+matched[0].id+"]";
        if(displayKey!=undefined){
            var title=getFormatText(displayKey,matched[0]);
            lockedTitle=title;
            unlockedTitle=title;
        }
        if(enableReadOnlyMode) {
            if(matched[0].isReadOnly) {
                $("#"+titlebarId).html('<i class="fa fa-lock text-red edit-lock"></i>'+lockedTitle);
                $('.edit-header-btn[name="save_btn"').hide();
            }
            else {
                $("#"+titlebarId).html('<i class="fa fa-unlock text-green edit-lock"></i>'+unlockedTitle);
                $('.edit-header-btn[name="save_btn"').show();
            }

        }else{
            $("#"+titlebarId).text(unlockedTitle);
        }
    }
    if(!lockeventListener.includes(titlebarId)){
        console.log(titlebarId+"没有注册锁按钮事件。。");
        $("#"+titlebarId).on('click',lockEvent);
        lockeventListener.push(titlebarId);
    }
        

}
function lockEvent(e){
    if(!enableReadOnlyMode) return;
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
                    //caseForm.readOnly(datas[0].isReadOnly);
                }else if(_this.id=="progress_details_info_title"){
                    
                }else if(_this.id=="progress_title"){
                    progressInfoForm.readOnly(datas[0].isReadOnly);
                    //currentProgress['currentDiagramButton'].switchReadyOnly();
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
    var found=false;
    if(source instanceof Array){
        $.each(source,(index,item)=>{
            //console.log(matchKey,item[matchKey],"=="+newData[matchKey]);
            if(item[matchKey]==newData[matchKey]){
                matchedIndex=index;
                source[index]=Object.assign(source[index],newData);
                found=true;
                return false;
            }
        })
        if(!found) source.push(newData);
    }else{
        var keys=Object.keys(newData);
        $.each(source,(key,item)=>{
            //console.log(matchKey,item[matchKey],"=="+newData[matchKey]);
            if(keys.includes(key)){
                found=true;
                source[key]=newData[key];
            }
        })
    }
    
    output('updateOriginalData',source,newData);
    return source;
}
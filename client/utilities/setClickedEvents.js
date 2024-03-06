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
$('#user_notification').find('[name="new_message"]').on('click',function(e){
    console.log('add message');
    
    $('#new_message_body').empty();
    
    $('#new_message_title').text(`发送消息`);
    $('#new_message_page').find('[name="send_new_message"]').text('发送');
    //new_message_template
    var form= new mform({template:new_message_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    form.setValueById('isSystemMessage',true);
    $('#new_message_body').append(form.instance);
    form.instance.trigger('create');
    $('#new_message_body').trigger('create');
    $('#new_message_page').find('[name="send_new_message"]').jqmData('form',form);
    $('#new_message_page').find('[name="send_new_message"]').jqmData('isEdit',false);
    goToPage( $(this).attr( "href" ));
})
$('#new_message_page').find('[name="send_new_message"]').on('click',function(e){
    var form=$(this).jqmData('form');
    var isEdit=$(this).jqmData('isEdit');
    var messageId=$(this).jqmData('messageId');
    var attachments=$(this).jqmData('files');

    form.getFormValues(function(e){
        console.log(e)
        if(e.success){
            $().mloader("show",{message:"提交中...."});
            e.values.sender=e.values.isSystemMessage?0:getGlobalJson("currentUser").id;
            e.values.lastEditor=getGlobalJson("currentUser").id;
            delete e.values.isSystemMessage;
            e.values.date=getDateTime();
            e.values.message=e.values.message.replaceAll('"','\'');
            e.values.isInactived=e.values.isInactived?1:0;
            e.values.targetGroup="["+e.values.targetGroup+"]";
            e.values.targetPerson="["+e.values.targetPerson+"]";
            if(isEdit){
                var currentItems=[];
                //attachment_item
                var items=$('#new_message_page').find('.attachment_item');
                if(attachments!=undefined){
                    
                    console.log(items,attachments)
                    $.each(items,(i,item)=>{
                        currentItems.push("\'"+$(item).jqmData('file')+"\'");
                    })
                    var deleteFiles=$.grep(attachments,file=>!currentItems.includes("\'"+file+"\'"));
                    console.log('deleteFiles',deleteFiles);
                    $.each(deleteFiles,(i,file)=>{
                        //var thumb=file.
                        deleteFile(attachmentFolder,file);
                        deleteFile(attachmentFolder,getThumbFileName(file));
                    })
                    //e.values.attachments='['+JSON.parse(e.values.attachments.replaceAll("'","\"")).concat(currentItems).join(',')+']';
                }
                e.values.id=messageId;
                uploadFiles(attachmentFolder,e.values.attachments,true).then(rr=>{
                    //console.log(r);
                    var filePaths=[];
                    $.each(rr,(index,uploadResult)=>{
                        if(!uploadResult.success){
                            console.log(uploadResult.fileName+" 上传失败！");
                            //cango=false;
                            //$().mloader("hide");
                        }else{
                            console.log(uploadResult.fileName+" 上传成功！");
                            filePaths.push('\''+uploadResult.fileName+'\'');
                            
                        }
                    });
                    var finalfilePaths=currentItems.concat(filePaths);
                    e.values.attachments='['+finalfilePaths.join(',')+']';
                    
                    console.log("edit save",e.values);
                    broadcast(e.values,'edit',function(res){
                        $().mloader("hide");
                        if(res.success){
                            $().minfo('show',{title:"提示",message:"消息已修改。"},function(){});
                            
                            history.back();
                        }else{
                            $().minfo('show',{title:"提示",message:"发送时出现错误。"},function(){});
                        }
                        
                        
                        console.log(res);
                    });
                });
                
                
            }else{
                uploadFiles(attachmentFolder,e.values.attachments,true).then(rr=>{
                    //console.log(r);
                    var filePaths=[];
                    $.each(rr,(index,uploadResult)=>{
                        if(!uploadResult.success){
                            console.log(uploadResult.fileName+" 上传失败！");
                            //cango=false;
                            //$().mloader("hide");
                        }else{
                            console.log(uploadResult.fileName+" 上传成功！");
                            filePaths.push('\''+uploadResult.fileName+'\'');
                            
                        }
                    });
                    e.values.attachments='['+filePaths.join(',')+']';
                    
                    getTheLastIndex('notifications','id').then((r)=>{
                
                        e.values.id=r==-1?0:r+1;
                        broadcast(e.values,'add',function(res){
                            $().mloader("hide");
                            if(res.success){
                                $().minfo('show',{title:"提示",message:"消息已发送。"},function(){});

                                history.back();
                            }else{
                                $().minfo('show',{title:"提示",message:"发送时出现错误。"},function(){});
                            }
                            
                            
                            console.log(res);
                        });
                    });
                });
                
            }
            
        }
    })
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
        case '用户登录记录':
            $('#loginInfo_title_body').empty();
            var login_info_form= new mform({template:loginInfo_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
            $('#loginInfo_title_body').append(login_info_form.instance);
            
            $('#loginInfo_title_body').trigger('create');
            var searchBtn=login_info_form.instance.find('.btn-login-search');
            searchBtn.jqmData('form',login_info_form);
            searchBtn.on('click',function(e){
                var form=$(this).jqmData('form');
                form.getFormValues(function(e){
                    if(e.success){
                        console.log("user:",e.values)
                        
                        var dateRange=e.values.loginInfo_dateRange.split(',');
                        var whereDate;
                        var whereUser;
                        if(e.values.loginInfo_users==undefined||e.values.loginInfo_users.length==0){
                            whereUser="";
                        }else{
                            whereUser='id IN (-1,'+e.values.loginInfo_users+')';
                        }
                        if(dateRange.length==2){
                            var from=new Date(dateRange[0]+" 00:00:00");
                            var to=new Date(dateRange[1]+" 23:59:59");
                            //console.log(from.toISOString,to)
                            if((from instanceof Date && !isNaN(from)) && (to instanceof Date && !isNaN(from))){
                                whereDate = ' AND lastLogin between '+from.getTime()+" AND "+to.getTime()
                            }
                        }
                        console.log(`${whereUser}${whereDate||''}`);
                        $().mloader("show",{message:"查询中...."});
                        selectQuery('loginLogs',`${whereUser}${whereDate||''}`,"lastLogin DESC").then(e=>{
                            console.log(e);
                            if (e==undefined) {
                                $('#loginInfo_title_body').find('ul[data-role="listview"]').remove();
                                $().mloader("hide");
                                return;
                            }
                            var newOrder={};
                            var systemReboot=[];
                            e.forEach(log=>{
                                if(log.id!=-1){
                                    var key=log.name+"_"+log.id;
                                    if(!newOrder.hasOwnProperty(key)){
                                        newOrder[key]=[];
                                    }
                                    newOrder[key].push(log);
                                }else{
                                    systemReboot.push(log);
                                }
                                
                            })
                            //console.log(newOrder,systemReboot);
                            setLoginList(newOrder,systemReboot);
                            
                            $().mloader("hide");
                        });
                    }
                })
            })
            goToPage( $(this).attr( "href" ));
            break;
        case '数据库管理':

            goToPage( $(this).attr( "href" ));
            break;
        case '消息中心':
            
            setNotificationsList();
            goToPage( $(this).attr( "href" ));
            break;
        case '退出':
            //goToPage( $(this).attr( "href" ));
            setGlobalJson("currentUser",{});
            window.location.href = 'index.html';
            break;
    }
    
})
function setLoginList(data,systemReboot){
    $('#loginInfo_title_body').find('ul[data-role="listview"]').remove();
    var listview=$('<ul data-role="listview" data-inset="true"><li>无数据</li></ul>');
    $('#loginInfo_title_body').append(listview);
    if(Object.keys(data).length>0) listview.empty();
    $.each(data,(key,values)=>{
        var name_id=key.split("_");
        var title=$('<li class="collapsible_li" data-role="list-divider" data-index="'+key+'">'+name_id[0]+" ["+name_id[1]+']</li>');
        var counter=$('<span class="ui-li-count"></span>');
        listview.append(title);
        var count=0;
        var logout_data;
        values.forEach(value=>{
            if(value.isLogout==1){
                count++;
                logout_data=value;
            }else{
                var li=$('<li data-key="'+key+'"></li>');
                var state=$('<span style="margin-right:10px;">'+(value.isLogout==0?'<i class="fa fa-sign-in-alt text-green" /> 登录':'<i class="fa fa-sign-out-alt text-red" /> 登出')+'</span>')
                var time=$('<span>'+formatDateTime(new Date(value.lastLogin),"yyyy年MM月dd日 hh:mm:ss a")+'</span>')
                li.append(state);
                li.append(time);
                if(logout_data!=undefined){
                    state=$('<span style="margin-right:10px;margin-left:10px;">'+(logout_data.isLogout==0?'<i class="fa fa-sign-in-alt text-green" /> 登录':'<i class="fa fa-sign-out-alt text-red" /> 登出')+'</span>')
                    time=$('<span>'+formatDateTime(new Date(logout_data.lastLogin),"yyyy年MM月dd日 hh:mm:ss a")+'</span>')
                    li.append(state);
                    li.append(time);
                    var type_time=' 秒';
                    var diff_num=Math.abs(logout_data.lastLogin-value.lastLogin)/1000;
                    if (diff_num>60) {diff_num=diff_num/60;type_time=' 分钟';}
                    if (diff_num>60) {diff_num=diff_num/60;type_time=' 小时';}
                    var diff=$('<span style="margin-left:10px;">在线时常 '+Math.round(diff_num)+type_time+'</span>')
                    
                    li.append(diff);
                }else{
                    if(systemReboot.length>0){
                        var reboot_time=$.grep(systemReboot,sys=>{
                            //console.log(value.lastLogin,sys.lastLogin,Math.abs(value.lastLogin-sys.lastLogin));
                            return Math.abs(value.lastLogin-sys.lastLogin)<3000;
                        });
                        if(reboot_time.length>0){
                            var reboot=$('<span style="margin-left:10px;"><i class="fa fa-redo-alt text-blue" /> 系统在 '+formatDateTime(new Date(reboot_time[0].lastLogin),"yyyy年MM月dd日 hh:mm:ss a")+' 重启了</span>')
                            li.append(reboot);
                        }
                    }
                    
                }
                listview.append(li);
                logout_data=undefined;
            }
            
        })
        counter.text(count)
        title.append(counter);
        title.jqmData('collapsed',false);
        title.on('click',function(e){
            var _items=listview.find('[data-key="'+$(this).data('index')+'"]');
            $(this).jqmData('collapsed',!$(this).jqmData('collapsed'));
            var collapsed=$(this).jqmData('collapsed');
            if(collapsed) _items.hide();
            else _items.show();
        })
    })
    listview.listview().listview('refresh');
    $('#loginInfo_title_body').trigger('create');
}
function compareValues(source,target,prefix){
    prefix=prefix||'';
    var isSame=true;
    if(target==undefined) return false;
    $.each(source,(k,v)=>{
        
        if(target[k.replace(prefix,"")]!=undefined){
            v=v||"";
            var sourceVal=v.toString();
            var targetVal=target[k.replace(prefix,"")].toString();
            if(k.replace(prefix,"")=="judgmentDate" || k.replace(prefix,"")=="trialDate" || k.replace(prefix,"")== "caseDate"){
                if(targetVal!="0000-00-00 00:00:00")
                    targetVal=getDateTime(targetVal);
            }
            console.log(k.replace(prefix,""),sourceVal,targetVal,sourceVal==targetVal)
            //getDateTime
            if(sourceVal!=targetVal) {
                console.log('compareValues',k.replace(prefix,""),sourceVal,targetVal,target[k.replace(prefix,"")].toString());
                isSame=false; 
                return false;
            }
        }
    });
    console.log(source,target)
    if(isSame) isSame=Object.keys(source).length<=Object.keys(target).length;
    console.log('compareValues',waitingList,isSame)
    if(isSame && Object.keys(waitingList).length>0) {isSame=false;}
    return isSame;
}
console.log('backbtn',$('#progress_point_info').find('[data-role="header"]'))
$('#progress_point_info').find('[data-role="header"]').find('a[data-rel="back"]').on('click',function(e){
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
                    message:'信息尚未保存，是否保存当前?',
                },function(go){
                    if(go){
                        if(e.success){
                        $('#progress_point_info').find('[name="save_btn"]').trigger('click')
                        
                    setTimeout(() => {
                        history.back();
                    }, 200);
                    }
                    }else{
                        //restoreTempData();
                        waitingList={};
                        
                    setTimeout(() => {
                        history.back();
                    }, 200);
                    }
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
    var date=d.judgmentDate!="0000-00-00 00:00:00"?formatDateTime(new Date(d.judgmentDate),'yyyy年MM月dd日'):d.judgmentDate;
    return {index:d.typeId,date:date,caseNo:d.caseNo,legalInstitution:legalInstitution,sum:d.judgmentSum,title:title};
}
//节点修改保存按钮事件
$('#progress_point_info').find('[name="save_btn"]').on('click',function(e){
    
    console.log('save_btn',getGlobal("currentPoint"),$(this).jqmData('form'));
    //if(parseInt(getGlobal("currentPoint"))==0) return;
    console.log('save_btn',$(this));
    var form=$(this).jqmData('form');
    var events=$(this).jqmData('events');
    form.getFormValues(function(e){

        console.log('compareValues',getGlobal("currentPoint"),e.values,form.currentData);
        if(compareValues(e.values,form.currentData,"_p")){
            $().minfo('show',{title:"提示",message:"您还没有修改过任何数据。不需要保存。"},function(){});
            return;
        }
        var newData={};
        if(e.success){
            $.each(e.values,(key,val)=>{
                newData[key.replace("_p","")]=val;
            })
            e.values.typeId=getGlobal("currentPoint");
            runWaitingTask();
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
                        DataList.caseProgresses=updateOriginalDataM(DataList.caseProgresses,newData,['id','typeId']);
                        if(parseInt(getGlobal("currentIsAdd"))==1){
                            
                            
                            var matched=$.grep(resourceDatas.caseStatus_,label=>label.id==parseInt(getGlobal("currentPoint")));//获取节点属性数据
                            
                            if(matched.length>0){
                                console.log("add progress",newData,formatMainEventData(newData));
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
                                    form.setValues(newData);
                                    
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
                            console.log("更新成功",newData.typeId,newData,formatMainEventData(newData));
                            $('#progress_diagram').trigger({type:'updateMainEvent',targetIndex:parseInt(getGlobal("currentIndex")),
                                mainEventData:formatMainEventData(newData)});
                            
                            form.setValues(newData);
                        }
                        const matchProgressData=DataList.caseProgresses.filter(item=>item.id===newData.id)
                        
                        var _legalFee=0.0
                        if(matchProgressData.length>0){
                            matchProgressData.forEach(data=>{
                                if(Number(data.typeId)===Number(newData.typeId)){
                                    _legalFee+=Number(newData.legalFee)
                                }else{
                                    _legalFee+=(data.legalFee===null || data.legalFee==='null'?0:Number(data.legalFee))
                                }
                                
                            })
                        }
                        console.log('matchProgressData',_legalFee,matchProgressData,newData)
                        $('#pageOneTable').updateTableItem({legalFee:_legalFee,id:newData.id});
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
    console.log('progress_point_editor',{typeId:typeId,data:data,update_data:update_data,pointIndex:pointIndex});
    
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
    //var key_num=Object.keys(data).length;
    console.log('progress_point_editor',data)
    if(isAdd) {
        progress_point_form.setEmptyValues();
        progress_point_form.setValueById('typeId_p',data.typeId)
        progress_point_form.setValueById('caseNo_p',data.caseNo)
        progress_point_form.setValueById('legalAgencies_p',data.legalAgencies)
        progress_point_form.setValueById('legalInstitution_p',data.legalInstitution)
        progress_point_form.setValueById('legalCounsel_p',data.legalCounsel)
    }
    else progress_point_form.setValues(data,'_p');

    var updateContainer=$('.updateContainer');
    if(updateContainer.length==0) {
        updateContainer=$('<div class="updateContainer"></div>');
    }else{
        updateContainer.empty();
    }
    
    progress_point_form.instance.append(updateContainer);
    
    updateContainer.updateListView();
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
        generateUpdateInfoList($('.updateContainer'),dateSortItems);
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
function getSortedUpdateEvents(source){
    var dateSortItems={};
    source=source||getUpdateEvents();
    getProgressEvents(source,getGlobal("currentPoint")).forEach(item=>{
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
    else progressData={typeId:typeId,id:caseId}
    //console.log('pointIndex',$(this).jqmData('pointIndex'));
    //console.log('progress_point_viewer_btn',progressData,typeId);
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
    console.log('paidSum',paidSum);
    return paidSum;
}
function calcPenaltyPaidSum(penalty,paid){
    console.log('paid',paid);
    return {penalty:calcPenaltyAmount(penalty),paid:calcPaidAmount(paid)}
}
function generatePenaltyPaidSummary(container,penaltyPaidSum){
    $(container).empty();
    var caption=$('<h3>执行金额情况：<h3>');
    
    var penalty_label=$('<p>判决金额：'+penaltyPaidSum.penalty+'万元<p>');
    var paid_label=$('<p>执行金额：'+penaltyPaidSum.paid+'万元<p>');
    var penalty=$('<div class="penalty-bar">'+'</div>');
    var percentage=(penaltyPaidSum.paid/(penaltyPaidSum.penalty)*100);
    if (Number.isNaN(percentage)) percentage=0;
    else if(!Number.isFinite(percentage)) percentage=100;
    var paid=$('<div class="paid-bar">'+(percentage==0?'':percentage.toFixed(2)+'%')+'</div>');
    penalty.append(paid);
    $(container).append(caption);
    $(container).append(penalty_label);
    $(container).append(paid_label);
    $(container).append(penalty);
    
    paid.css({width:percentage/100*(screen.width-90)+"px"})
    console.log("execute summary",penaltyPaidSum,percentage*(screen.width-100),percentage);
    $(container).trigger('create');
}
function updatePenaltyPaidSummary(container,caseId){
    caseId=caseId||parseInt(getGlobal("currentId"));
    var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==caseId&& (d.isInactived==0 || getGlobalJson('currentUser').level==adminLevel));
    var matchedProgressStatus=DataList.caseProgresses.filter((d)=>d.id==caseId);
    console.log('updatePenaltyPaidSummary',matchedExcutes,matchedProgressStatus)
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
                                    console.log('eventsData',eventsData,label.id,);
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

function generateUpdateInfoList(listview,dateSortItems){
    listview.updateListViewData(dateSortItems);
}
var waitingList={};
var waitingTasks=[];
function runWaitingTask(){
    var fileName;
    $.each(waitingList,(k,task)=>{
        task();
    });
    waitingList={};
    /*
    waitingTasks.forEach((task)=>{
        if(task.type=='update'){
            update(task.where,
                task.table,
                task.value,async function(r){
                DataList[task.tableData.table]=updateOriginalData(DataList[task.tableData.table],task.newData,task.tableData.idkey);
                if(task.tableData.table=='caseExcutes'){
                    task.newData.id=task.tableData.data.id;
                    //DataList.caseExcutes=updateOriginalData(DataList[data.table],newData,data.idkey);
                    fireDataChnaged("caseexcutesChanged",task.newData,"update");
                    updatePenaltyPaidSummary($('#execute_summary'));
                }
            })
        }else if(task.type=="pureinsert"){
            if(fileName!=undefined) task.newData.filePath=fileName;
            pureinsert(task.table,task.value,(r)=>{
                console.log('insert result',task.table,r);
                //添加新提交的数据到缓存
                DataList[task.table].push(task.newData);
                //更新当前视图事件列表
                //console.log(getSortedUpdateEvents(),$('#progress_point_info_body'));
                //generateUpdateInfoList($('#progress_point_info_body'),getSortedUpdateEvents());
                //更新节点视图计数器
                
                //更新节点图
                if(task.table=='caseExcutes'){
                    //DataList.caseExcutes=updateOriginalData(DataList.caseExcutes,newData,data.idkey);
                    fireDataChnaged("caseexcutesChanged",task.newData,"add");
                }
                var canGo=true;
                if(parseInt(getGlobal("currentIsAdd"))==1) {
                    canGo=false;
                    currentForm.getFormValues(function(e){
                        console.log(e);
                        var newData={};
                        $.each(task.newData,(key,val)=>{
                            newData[key.replace("_p","")]=val;
                        })
                        
                        newData.id=parseInt(getGlobal("currentId"));
                        if(e.success){

                            //type:insert,table:"caseProgresses",value:newData

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
                                        //type:update,table:"caseStatus",where:'id='+newData.id,value:{'caseStatus':JSON.stringify($('#progress_diagram').jqmData('status'))}
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
            });
            //history.back();
        }else if(task.type=='inactiveItem'){

            inactiveItem(task.where,task.table,function(r){

            });
        }else if(task.type=='restoreItem'){

            restoreItem(task.where,task.table,function(r){
                
            });
        }
        
    })
    waitingTasks=[];
    */
}
//节点添加保存
//$('.progress_popup_add_form_submit').on('click', _updateSubmitEvent)
//节点修改保存

var tempData;
function storeTempData(key,value,matchKey){
    if(tempData==undefined) tempData={};
    if(!tempData.hasOwnProperty(key)) {
        tempData[key]={};
        tempData[key]['push']=[];
        tempData[key]['restore']=[]
    }
    if(matchKey==undefined) {
        tempData[key]['push'].push(value);
        return tempData[key]['push'].length-1;
    }else {
        var matched=$.grep(DataList[key],target=>target[matchKey]==value[matchKey]);
        if(matched.length>0){
            tempData[key]['restore'].push({data:matched[0],matchKey:matchKey});
            return tempData[key]['push'].length-1;
        }
    }
}
function restoreTempData(){
    $.each(tempData,(key,types)=>{
        $.each(types,(type,items)=>{
            items.forEach(item=>{
                if(type=="push") {
                    var index=DataList[key].indexOf(item);
                    if(index>-1) DataList[key].splice(index,1);
                }else{
                    DataList[key]=updateOriginalData(DataList[key],item.data,item.matchKey);
                }
            })
        })
    })
    tempData=undefined;
}
function removeDataFromTempData(){
    tempData[key][type]
}
//节点更新事件保存




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
        dataSource.forEach(item=>{
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
    var dataSource=currentData || DataList.casesDb
    if($(this).text()=="纠纷"){
        $('#chart_sum_p').children().hide();
        $('#chart_sum_all').show();
        var caseCause={};
        var caseCause1={};
        dataSource.forEach(item=>{
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
        dataSource.forEach(item=>{
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
        dataSource.forEach(item=>{
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
        dataSource.forEach(item=>{
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
        dataSource.forEach(item=>{
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
        dataSource.forEach(item=>{
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
        dataSource.forEach(item=>{
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
        dataSource.forEach(item=>{
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
                e.values['legalFee']='0.00';
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
function updateOriginalDataM(source,newData,matchKeys){
    var found=false;
    if(source instanceof Array){
        $.each(source,(index,item)=>{
            //console.log(matchKey,item[matchKey],"=="+newData[matchKey]);
            var result=[];
            matchKeys.forEach(matchKey=>{
                if(item[matchKey]==newData[matchKey]){
                    result.push(true);
                }
            })
            if(result.length==matchKeys.length){
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
function setUserNotifiications(){
    $('.notif_num').hide();
    var userData=getGlobalJson('currentUser');
    var isread=[];
    if(userData.isRead!=null||userData.isRead!='null'){
        isread=JSON.parse(userData.isRead)
    }
    var notifications=[];
    var level=userData.level;
    var userId=userData.id;
    resourceDatas.notifications.forEach(notification=>{
        if(getGlobalJson('currentUser').level < adminLevel){
            console.log('userData.deleted',JSON.parse(userData.deleted));
            if((JSON.parse(notification.targetGroup).includes(level)|| JSON.parse(notification.targetPerson).includes(userId)) &&
            !JSON.parse(userData.deleted).includes(notification.id) && 
            notification.isInactived==0){
                notifications.push(notification.id);
            }
        }else{
            notifications.push(notification.id);
        } 
            
    })
    //userData.read=JSON.stringify(isread.concat(unreads));
    
    userData.notifications=JSON.stringify(notifications);
    setGlobalJson('currentUser',userData);
    console.log("unreads",notifications,isread,getUnreadNum(notifications,isread));
    $('.notif_num').text(getUnreadNum(notifications,isread));
    if(getUnreadNum(notifications,isread)>0){
        $('.notif_num').show();
        
    }else{
        $('.notif_num').hide();
    }
}
function getUnreadNum(notifications,isread){
    return $.grep(notifications,id=>!isread.includes(id)).length;
}
function setNotificationsList(){
    
    $('#notification_list').empty();
    var notifications=JSON.parse(getGlobalJson("currentUser").notifications);
    var unreads=JSON.parse(getGlobalJson("currentUser").unread);
    var isreads=JSON.parse(getGlobalJson("currentUser").isRead);
    var data=$.grep(resourceDatas.notifications,noti=>{
        return notifications.includes(noti.id);
    });
    // var sortedItems=data.sort(function(a,b){
    //     return data[a].date>data[b].date;
    // });
    var sortedItems=data.sort(function(a,b){
        console.log(a,b)
        return a.date<b.date;
    });
    var sortedData={};
    sortedItems.forEach(d=>{
        var date=formatDateTime(new Date(d.date),"yyyy年MM月dd日");
        if(!sortedData.hasOwnProperty(date)) sortedData[date]=[];
        sortedData[date].push(d);
    });
    $.each(sortedData,(date,values)=>{
        var title=$('<li class="collapsible_li" data-role="list-divider">'+date+'<span class="ui-li-count">'+values.length+'</span></li>');
        $('#notification_list').append(title);
        var items=[];
        $.each(values,(index,value)=>{
            
            var sender="系统消息";
            if(value.sender>0) {
                sender=$.grep(resourceDatas.users,user=>user.id==value.sender);
                if(sender.length>0) sender=sender[0].name;
                else sender='未知';
            }
            var li=$('<li data-index="'+value.id+'" style="display:grid;grid-template-columns: 1fr auto auto;border-top:1px solid lightgray;"></li>');
            items.push(li);
            var messageBody=$('<div style="padding:5px 15px;"></div>');
            var messageBtn=$('<a href="#" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-notext btn-icon-red message-btn-delete" style="height:100%;padding:0px 5px;border-bottom:none;border-top:none;border-right:none;"></a>');
            var editBtn=$('<a href="#new_message_page" class="ui-btn ui-btn-inline ui-icon-edit ui-btn-icon-notext btn-icon-green message-btn-edit" style="height:100%;padding:0px 5px;border-bottom:none;border-top:none;border-right:none;"></a>');
            var messageTitle=$('<h2>'+value.title+'</h2>');
            var messageContent=$('<p style="font-size:14px;">'+value.message.replace(/\n/g, "</br>")+'</p>');
            var attachmentsContainer=$('<div></div>');
            var _attachmentsContainer=$('<div></div>');
            attachmentsContainer.append(_attachmentsContainer);
            var messageTime=$('<p class="ui-li-aside" style="display:grid;grid-template-columns: auto 1fr;margin-right:'+(getGlobalJson('currentUser').level==adminLevel?40:20)+'px;"><strong style="line-height: 24px;margin-left: 5px;font-size:12px;">'+formatDateTime(new Date(value.date),"hh:mm a")+'</strong></p>');
            var messageRead=$('<a href="#" style="margin-top:0px;padding:3px 5px;color:'+(isreads.includes(value.id)?'gray':'green')+';" class="ui-btn ui-btn-inline ui-corner-all message_isRead" id="message_checkbox_'+value.id+'" data-mini="true" data-index="'+value.id+'">'+(isreads.includes(value.id)?'标记未读':'标记已读')+'</a>');
            var checkboxLable=$('<label for="message_checkbox_'+value.id+'" class="no-check" style="color:'+(isreads.includes(value.id)?'gray':'green')+';">'+(isreads.includes(value.id)?'标记未读':'标记已读')+'</label>')
            var messageSender=$('<p><strong style="font-size:12px;">'+sender+'</strong></p>');
            messageTime.prepend(messageRead);
            //messageRead.after(checkboxLable);
            messageBody.append(messageSender);
            messageBody.append(messageTitle);
            messageBody.append(messageContent);
            var imgLoaded=[];

            try{
                console.log(value.attachments)
                var attachments=JSON.parse(value.attachments.replaceAll("'","\""));
                
                if(attachments.length>0){
                    attachmentsContainer.append($('<div class="fa fa-spinner fa-spin" style="font-size: 12px;color:steelblue;vertical-align:middle;"></div><span class="loading_message"> 附件加载中...</span>'));
                    var imageloading=setInterval(() => {
                        if(imgLoaded.length==attachments.length){
                            clearInterval(imageloading);
                            attachmentsContainer.find('.fa-spinner').remove();
                            attachmentsContainer.find('.loading_message').remove();
                        }
                        
                    }, 100);
                    attachments.forEach((attachment,i)=>{
                        var _image=$('<a class="messge_attachments" href="#" data-index='+i+' data-file="'+attachment+'" data-rel="popup" data-position-to="window" data-transition="fade"></a>');
                        var _image_pic=$('<img src="'+"http://"+ip+":"+port+"/downloadLocal?fileName="+getThumbFileName(attachment)+"&folder="+attachmentFolder+'"></img>')
                        _image_pic.load(function(){
                            //console.log('_image_pic loaded');
                            imgLoaded.push(true);
                            
                        })
                        _image.append(_image_pic);
                        _attachmentsContainer.append(_image);
                        _image.on('click',function(e){
                            console.log($(this));
                            $().mloader("show",{message:"加载中...."});
                            //var preItem=(i-1>-1?attachments[i-1]:undefined);
                            //var popup=$($(this).attr('href'));
                            var file=$(this).data('file');
                            var header = '<div data-role="header"><h2>预览</h2></div>';
                            var closebtn = '<a href="#" data-rel="back" style="margin-top:18px;margin-right:20px;" class="ui-btn ui-corner-all btn-icon-red ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>';
                            var imageBtns=$('<div></div>')
                            var img = $('<img src="'+"http://"+ip+":"+port+"/downloadLocal?fileName="+file+"&folder="+attachmentFolder+'" class="message_image">');
                            var rightBtn,leftBtn;
                            leftBtn=$('<div data-index='+i+' class="imagePreview_btn"></div>')
                            rightBtn=$('<div data-index='+i+' class="imagePreview_btn imagePreview_btn_right"></div>')
                            popup = $('<div data-role="popup" class="message_attachment_preview ui-btn ui-corner-all ui-shadow" id="message_attachments_popup_'+i+'" data-theme="none" data-overlay-theme="b" data-corners="false" data-tolerance="15"></div>');
                            leftBtn.jqmData('image',img);
                            rightBtn.jqmData('image',img);
                            leftBtn.jqmData('btn',rightBtn);
                            rightBtn.jqmData('btn',leftBtn);
                            $( header ).appendTo( $( popup ).appendTo( $.mobile.activePage ).popup() ).toolbar().before( closebtn ).after( $(imageBtns) );
                            $(imageBtns).append($(leftBtn));
                            $(imageBtns).append($(rightBtn));
                            $(imageBtns).append($(img));
                            popup.on( "popupbeforeposition", function() {
                                console.log('popupbeforeposition')
                                var image = $( this ).find( "img" ),
                                height = image.height(),
                                width = image.width();
                                
                                
                                // Set height and width attribute of the image
                                $( this ).attr({ "height": height, "width": width });
                                // 68px: 2 * 15px for top/bottom tolerance, 38px for the header.
                                var maxHeight = $( window ).height() - 68 + "px";
                                $( "img.message_image", this ).css( "max-height", maxHeight );
                            
                            });
                            // Remove the popup after it has been closed to manage DOM size
                            popup.on( "popupafterclose", function() {
                                $( this ).remove();
                            });
                            leftBtn.on('click',function(e){
                                var currentIndex=$(this).data('index');
                                //$( "#message_attachments_popup_"+i ).prop( "id", "message_attachments_popup_"+(currentIndex-1));
                                var image=$(this).jqmData('image');
                                var btn=$(this).jqmData('btn');
                                if(currentIndex-1>-1){
                                    $(this).data('index',currentIndex-1);
                                    $(btn).data('index',currentIndex-1);
                                    //console.log($(this).data('index'),$(btn).data('index'));
                                    image.prop('src',"http://"+ip+":"+port+"/downloadLocal?fileName="+attachments[currentIndex-1]+"&folder="+attachmentFolder);
                                    //popup.popup('close');
                                    //attachmentsContainer.find('a[data-index="'+(currentIndex-1)+'"]').trigger('click');
                                    $().mloader("show",{message:"加载中...."});
                                    
                                }
                            })
                            rightBtn.on('click',function(e){
                                var currentIndex=$(this).data('index');
                                var image=$(this).jqmData('image');
                                var btn=$(this).jqmData('btn');
                                
                                console.log(currentIndex,$(btn).data('index'));
                                if(currentIndex+1<attachments.length){
                                    $(this).data('index',currentIndex+1);
                                    //$( "#message_attachments_popup_"+i ).prop( "id", "message_attachments_popup_"+(currentIndex+1));
                                    $(btn).data('index',currentIndex+1);
                                    image.prop('src',"http://"+ip+":"+port+"/downloadLocal?fileName="+attachments[currentIndex+1]+"&folder="+attachmentFolder);
                                    //popup.popup('close');
                                    //attachmentsContainer.find('a[data-index="'+(currentIndex+1)+'"]').trigger('click');
                                    $().mloader("show",{message:"加载中...."});
                                    
                                    
                                }
                            })
                            $( ".message_image", "#message_attachments_popup_"+i ).load(function() {
                                // Open the popup
                                console.log('message_image load');
                               // $( "#message_attachments_popup_"+i ).popup();
                                
                                setTimeout(() => {
                                    console.log('message_image load1');
                                    $().mloader("hide");
                                    $( "#message_attachments_popup_"+i ).popup( "open" );
                                    //repositionPopupToCenter($( "#message_attachments_popup_"+i ));
                                    setTimeout(() => {
                                        repositionPopupToCenter(popup);
                                        $().mloader("hide");
                                    }, 100);
                                }, 100);
                                // Clear the fallback
                                
                                clearTimeout( fallback );
                            });
                                // Fallback in case the browser doesn't fire a load event
                            var fallback = setTimeout(function() {
                                console.log('message_image load1');
                                $().mloader("hide");
                                $( "#message_attachments_popup_"+i ).popup( "open" );
                                //repositionPopupToCenter($( "#message_attachments_popup_"+i ));
                                setTimeout(() => {
                                    repositionPopupToCenter(popup);
                                    $().mloader("hide");
                                }, 100);
                            }, 1000);
                            $(popup).on('resize',function(e){
                                console.log('popup size changed')
                            })
                            
                        });
                        
                    })
                }
                
                
            }catch(e){
            }

            messageBody.append(attachmentsContainer);
            messageBody.append(messageTime);
            li.append(messageBody);
            li.append(editBtn);
            li.append(messageBtn);
            li.on('click',function(e){
                $(this).removeClass('newItem');
            })
            if(getGlobalJson('currentUser').level==adminLevel) editBtn.show();
            else editBtn.hide();
            if(value.isInactived==1) li.css({color:'grey'});
            else li.css({color:'#333'});
            editBtn.jqmData("value",value);
            messageBtn.jqmData("value",value);
            //console.log('changed',messageRead);
            //messageRead.checkboxradio().checkboxradio( "refresh" );
            checkboxLable.trigger('create');
            $('#notification_list').append(li);
        })
        title.jqmData('items',items);
        title.jqmData('collapsed',false);
        title.on('click',function(e){
            var _items=$(this).jqmData('items');
            $(this).jqmData('collapsed',!$(this).jqmData('collapsed'));
            var collapsed=$(this).jqmData('collapsed');
            _items.forEach(item=>{
                if(collapsed) item.hide();
                else item.show();
            })
        });
    });
    $('#notification_list').trigger('create');
    $('#notification_list').listview().listview('refresh')
    $('.message-btn-edit').off();
    $('.message-btn-delete').off();
    $('.message_isRead').off();
    $('.message-btn-edit').on('click',function(e){
        $('#new_message_body').empty();
        
        //new_message_template
        var value=$(this).jqmData('value');
        
        $('#new_message_title').text(`修改消息 [${value.id}]`);
        $('#new_message_page').find('[name="send_new_message"]').text('修改');
        value.targetPerson=JSON.parse(value.targetPerson).join(',');
        value.targetGroup=JSON.parse(value.targetGroup).join(',');
        value.isSystemMessage=value.sender==0;
        //new_message_template.
        var form= new mform({template:new_message_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
        form.setValues(value);
        $('#new_message_body').append(form.instance);
        form.instance.trigger('create');
        $('#new_message_body').trigger('create');
        $('#new_message_page').find('[name="send_new_message"]').jqmData('form',form);
        $('#new_message_page').find('[name="send_new_message"]').jqmData('isEdit',true);
        $('#new_message_page').find('[name="send_new_message"]').jqmData('messageId',$(this).jqmData('value').id);
        try{
            console.log(value.attachments)
            var attachments=JSON.parse(value.attachments.replaceAll("'","\""));
            if(attachments.length>0){
                $('#new_message_page').find('[name="send_new_message"]').jqmData('files',attachments);
                var listview=$('<ul data-role="listview" data-inset="true"></ul>');
                attachments.forEach((attachment,i)=>{
                    var li=$('<li class="attachment_item"></li>');
                    var image=$('<a class="messge_attachments" href="#" data-file="'+attachment+'" data-rel="popup" data-position-to="window" data-transition="fade"><img src="'+"http://"+ip+":"+port+"/downloadLocal?fileName="+getThumbFileName(attachment)+"&folder="+attachmentFolder+'"></img></a>');
                    li.append(image);
                    var delBtn=$('<a href="#" class="ui-icon-delete btn-icon-red"></a>');
                    li.jqmData('file',attachment);
                    li.append(delBtn);
                    listview.append(li);
                    delBtn.on('click',function(e){
                        $(this).closest('li').remove();
                    })
                    image.on('click',function(e){
                        console.log($(this));
                        $().mloader("show",{message:"加载中...."});
                        //var popup=$($(this).attr('href'));
                        var file=$(this).data('file');
                        var header = '<div data-role="header"><h2>预览</h2></div>';
                        var closebtn = '<a href="#" data-rel="back" style="margin-top:18px;margin-right:20px;" class="ui-btn ui-corner-all btn-icon-red ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>';
                        var imageBtns=$('<div></div>')
                        var img = $('<img src="'+"http://"+ip+":"+port+"/downloadLocal?fileName="+file+"&folder="+attachmentFolder+'" class="message_image">');
                            var rightBtn,leftBtn;
                            leftBtn=$('<div data-index='+i+' class="imagePreview_btn"></div>')
                            rightBtn=$('<div data-index='+i+' class="imagePreview_btn imagePreview_btn_right"></div>')
                            popup = $('<div data-role="popup" class="message_attachment_preview ui-btn ui-corner-all ui-shadow" id="message_attachments_popup_edit_'+i+'" data-theme="none" data-overlay-theme="b" data-corners="false" data-tolerance="15"></div>');
                            leftBtn.jqmData('image',img);
                            rightBtn.jqmData('image',img);
                            leftBtn.jqmData('btn',rightBtn);
                            rightBtn.jqmData('btn',leftBtn);
                            $( header ).appendTo( $( popup ).appendTo( $.mobile.activePage ).popup() ).toolbar().before( closebtn ).after( $(imageBtns) );
                            $(imageBtns).append($(leftBtn));
                            $(imageBtns).append($(rightBtn));
                            $(imageBtns).append($(img));
                            popup.on( "popupbeforeposition", function() {
                                console.log('popupbeforeposition')
                                var image = $( this ).find( "img" ),
                                height = image.height(),
                                width = image.width();
                                
                                
                                // Set height and width attribute of the image
                                $( this ).attr({ "height": height, "width": width });
                                // 68px: 2 * 15px for top/bottom tolerance, 38px for the header.
                                var maxHeight = $( window ).height() - 68 + "px";
                                $( "img.message_image", this ).css( "max-height", maxHeight );
                            
                            });
                            // Remove the popup after it has been closed to manage DOM size
                            popup.on( "popupafterclose", function() {
                                $( this ).remove();
                            });
                            leftBtn.on('click',function(e){
                                var currentIndex=$(this).data('index');
                                //$( "#message_attachments_popup_"+i ).prop( "id", "message_attachments_popup_"+(currentIndex-1));
                                var image=$(this).jqmData('image');
                                var btn=$(this).jqmData('btn');
                                if(currentIndex-1>-1){
                                    $(this).data('index',currentIndex-1);
                                    $(btn).data('index',currentIndex-1);
                                    console.log($(this).data('index'),$(btn).data('index'));
                                    image.prop('src',"http://"+ip+":"+port+"/downloadLocal?fileName="+attachments[currentIndex-1]+"&folder="+attachmentFolder);
                                    //popup.popup('close');
                                    //attachmentsContainer.find('a[data-index="'+(currentIndex-1)+'"]').trigger('click');
                                    $().mloader("show",{message:"加载中...."});
                                    setTimeout(() => {
                                        repositionPopupToCenter(popup);
                                        $().mloader("hide");
                                    }, 100);
                                }
                            })
                            rightBtn.on('click',function(e){
                                var currentIndex=$(this).data('index');
                                var image=$(this).jqmData('image');
                                var btn=$(this).jqmData('btn');
                                
                                console.log(currentIndex,$(btn).data('index'));
                                if(currentIndex+1<attachments.length){
                                    $(this).data('index',currentIndex+1);
                                    //$( "#message_attachments_popup_"+i ).prop( "id", "message_attachments_popup_"+(currentIndex+1));
                                    $(btn).data('index',currentIndex+1);
                                    image.prop('src',"http://"+ip+":"+port+"/downloadLocal?fileName="+attachments[currentIndex+1]+"&folder="+attachmentFolder);
                                    //popup.popup('close');
                                    //attachmentsContainer.find('a[data-index="'+(currentIndex+1)+'"]').trigger('click');
                                    $().mloader("show",{message:"加载中...."});
                                    setTimeout(() => {
                                        repositionPopupToCenter(popup);
                                        $().mloader("hide");
                                    }, 100);
                                    
                                }
                            })
                        $( ".message_image", "#message_attachments_popup_edit_"+i ).load(function() {
                            // Open the popup
                            setTimeout(() => {
                                
                                $().mloader("hide");
                                $( "#message_attachments_popup_edit_"+i ).popup( "open" );
                            }, 500);
                            // Clear the fallback
                            
                            clearTimeout( fallback );
                        });
                            // Fallback in case the browser doesn't fire a load event
                        var fallback = setTimeout(function() {
                            //$().mloader("hide");
                            $().mloader("hide");
                            $( "#message_attachments_popup_edit_"+i ).popup( "open" );
                        }, 1000);
                        
                    });
                    
                })
                $('#new_message_body').append(listview);
                
                $('#new_message_body').trigger('create');
            }
            
            
        }catch(e){

        }
        goToPage( $(this).attr( "href" ));
        value.targetPerson=JSON.stringify(value.targetPerson.split(","));
        value.targetGroup=JSON.stringify(value.targetGroup.split(","));
    })
    $('.message-btn-delete').on('click',function(e){
        var value=$(this).jqmData('value');
        var li=$(this).closest('li');
        $().requestDialog({
            title:'提示',
            message:"确认删除此条消息吗？",
        },function(go){
            if(go){
                
                if(getGlobalJson('currentUser').level==adminLevel){
                    removeMessage(value.id,value,function(e){
                        console.log(e);
                    });
                    
                    console.log('delete attachments',value.attachments)
                    var attachments=JSON.parse(value.attachments.replaceAll("'","\""));
                    attachments.forEach(file=>{
                        //var thumb=file.
                        deleteFile(attachmentFolder,file);
                        deleteFile(attachmentFolder,getThumbFileName(file));
                    })
                    console.log('resourceDatas.notifications',resourceDatas.notifications,value);
                    
                }else{
                    //value.isInactived=1;
                    //update('id='+value.id,'notifications',{isInactived:1})
                }
                
                //var index=resourceDatas.notifications.indexOf(value);
                //if(index>-1) resourceDatas.notifications.splice(index,1);
                var userData=getGlobalJson("currentUser");
                var deleted=JSON.parse(userData.deleted);
                deleted.push(value.id);
                userData.deleted=JSON.stringify(deleted);
                setGlobalJson("currentUser",userData);
                setUserNotifiications();
                update("id="+userData.id,userDbTableName,{deleted:userData.deleted});
                //console.log(resourceDatas.notifications);
                li.remove();
            }
        });
        
    });
    $('.message_isRead').on('click',function(e){
        console.log('changed',$(this).prop('checked'));
        e.preventDefault();
        if($(this).text()=='标记已读'){
            $(this).text('标记未读');
            $(this).css({'color':'grey'});
            var index=isreads.indexOf($(this).data('index'));
            if(index==-1) isreads.push($(this).data('index'));
            //unreads
        }else{
            $(this).text('标记已读');
            $(this).css({'color':'green'});
            var index=isreads.indexOf($(this).data('index'));
            if(index>-1) isreads.splice(index,1);
        }
        var userData=getGlobalJson("currentUser");
        userData.isRead=JSON.stringify(isreads);
        setGlobalJson("currentUser",userData);
        console.log("currentUser",userData);
        setUserNotifiications();
        update("id="+userData.id,userDbTableName,{isRead:userData.isRead});
        //console.log('sortedData',JSON.parse(getGlobalJson("currentUser").unread))
    })
}
function getThumbFileName(file){
    var newFile=file.split(".")
    newFile[newFile.length-1]="."+newFile[newFile.length-1];
    newFile.splice(newFile.length-1,0,"_thumb");
    return newFile.join('');
}
$( ".message_attachment_preview" ).on( "popupbeforeposition", function() {
    console.log('popupbeforeposition')
    var image = $( this ).find( "img" ),
    height = image.height(),
    width = image.width();
    
    
    // Set height and width attribute of the image
    $( this ).attr({ "height": height, "width": width });
    // 68px: 2 * 15px for top/bottom tolerance, 38px for the header.
    var maxHeight = $( window ).height() - 68 + "px";
    $( "img.message_image", this ).css( "max-height", maxHeight );

});
// Remove the popup after it has been closed to manage DOM size
$( ".message_attachment_preview" ).on( "popupafterclose", function() {
    $( this ).remove();
});
function repositionPopupToCenter(popup) {
    console.log('repositionPopupToCenter');
    popup.popup("reposition", {
      positionTo: "window",
      transition: "fade"
    });
  }
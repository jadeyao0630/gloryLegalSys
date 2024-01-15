//global variations
var form,//header filter form
pageOnTable,//main table
caseForm,
progressInfoForm,
setting_info_form,
setting_add_form;
var isHeaderLocked=false;
var currentData;
var fancyTable;
var slidedownOffset=0;
var tableFunBtns='<div data-role="controlgroup" style="min-width:60px;" data-type="horizontal" data-mini="true">'+
//'<a href="#" name="fn_btn_details" class="ui-btn btn-icon-green ui-icon-info ui-btn-icon-notext btn-tooltip" data-tooltip="案件总览" data-transition="slidefade" onmouseout="hideTooltip(this)" onmouseover="showTooltip(this)" onclick=\'functionBtnsEvent(this,{0})\'>查看</a>'+
//'<button href="#casePage" name="fn_btn_edit" class="btn-icon-blue btn-tooltip" data-icon="edit" data-iconpos="notext" data-tooltip="案件编辑修改" onmouseout="hideTooltip(this)" onmouseover="showTooltip(this)" onclick=\'functionBtnsEvent(this,{0})\'>修改</button>'+
'<button name="fn_btn_update" class="btn-icon-red btn-tooltip" data-icon="calendar" data-iconpos="notext" data-tooltip="更新案件进展" onmouseout="hideTooltip(this)" onmouseover="showTooltip(this)" onclick=\'functionBtnsEvent(this,{0})\'>更新</button>'+
'</div>';
//getGlobal("currentId")
//getGlobal("currentUser")

//document.body.style.fontSize = "16px";
function setFontSize(){
    document.documentElement.style.setProperty('--mfont', 14 + "px");
    document.documentElement.style.setProperty('--iconSize', 20 + "px");
    document.documentElement.style.setProperty('--iconMargin', -10 + "px");
    document.documentElement.style.setProperty('--inputHeight', 38 + "px");
    document.documentElement.style.setProperty('--inputLineHeight', 26 + "px");
    document.documentElement.style.setProperty('--HeaderFooterHeight', 44 + "px");
    slidedownOffset=40;
    tableFunBtns='<div data-role="controlgroup" style="min-width:60px;" data-type="horizontal" data-mini="true">'+
    //'<a href="#" name="fn_btn_details" class="ui-btn btn-icon-green ui-icon-info ui-btn-icon-notext btn-tooltip" data-tooltip="案件总览" data-transition="slidefade" onmouseout="hideTooltip(this)" onmouseover="showTooltip(this)" onclick=\'functionBtnsEvent(this,{0})\'>查看</a>'+
    //'<button href="#casePage" name="fn_btn_edit" class="btn-icon-blue btn-tooltip" data-icon="edit" data-iconpos="notext" data-tooltip="案件编辑修改" onmouseout="hideTooltip(this)" onmouseover="showTooltip(this)" onclick=\'functionBtnsEvent(this,{0})\'>修改</button>'+
    '<button name="fn_btn_update" class="btn-icon-red btn-tooltip" data-icon="calendar" data-iconpos="notext" data-tooltip="更新案件进展" onmouseout="hideTooltip(this)" onmouseover="showTooltip(this)" onclick=\'functionBtnsEvent(this,{0})\'>更新</button>'+
    '</div>';
}

function exportExcel () {
    var form= new mform({template:export_excel_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});

    $('#export_excel_popup_title').text("导出设置");
    $('#export_excel_popup_form').empty();
    $('#export_excel_popup_form').append(form.instance);
    $('#export_excel_popup_form').trigger('create');
    //console.log(JSON.stringify(data));
    $('#export_excel_popup_form_submit').jqmData('form',form);
    $('#export_excel_popup').trigger('create');
    $('#export_excel_popup').popup().popup('open');
    //export2Excel('pageOneTable',);
    
    $('#export_excel_popup_form_submit').off();
    $('#export_excel_popup_form_submit').on('click',function(e){
        $(this).jqmData('form').getFormValues(function(e){
            if(e.success){
                var filename=e.values.exportFileName;
                if(filename==undefined || filename.length==0) filename='export_'+formatDateTime(new Date(),"yyyy年MM月dd日")+".xlsx";
                var data=$('#pageOneTable').generateDataForExport()
                console.log('exportExcel',data);
                if(e.values.exportType!=0){//is Selected Only

                }
                export2Excel(filename,data);
                $('#export_excel_popup').popup('close');
            }
        });
        //
    })
};
function setRowsPrePageEvent(){
    var form= new mform({template:change_rows_page_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    //change_rows_page_template.default
    $('#export_excel_popup_title').text("表格显示设置");
    $('#export_excel_popup_form').empty();
    $('#export_excel_popup_form').append(form.instance);
    form.setValueById('rowsNumber',$('#pageOneTable').jqmData('itemsPerPage'));
    console.log('runAnimation',$('#pageOneTable').jqmData('runAnimation'));
    form.setValueById('tableAnimations',$('#pageOneTable').jqmData('runAnimation')?'0':'1');
    form.setValueById('tableStrip',$('#pageOneTable').hasClass('table-stripe')?'0':'1');
    form.setValueById('tableTextOverflow',$('#pageOneTable').jqmData('textOverflow')?'1':'0');
    console.log('tableSettings',$('#pageOneTable').jqmData('textOverflow'));
    $('#export_excel_popup_form').trigger('create');
    //console.log(JSON.stringify(data));
    $('#export_excel_popup_form_submit').jqmData('form',form);
    $('#export_excel_popup').trigger('create');
    $('#export_excel_popup').popup().popup('open');
    //export2Excel('pageOneTable',);
    $('#export_excel_popup_form_submit').off();
    $('#export_excel_popup_form_submit').on('click',function(e){
        $(this).jqmData('form').getFormValues(function(e){
            if(e.success){
                console.log(e);
                $('#export_excel_popup').popup('close');
                $().mloader('show',{message:"请稍等..."});
                    $('#pageOneTable').hasRowAnimation(parseInt(e.values.tableAnimations)==0);
                    $('#pageOneTable').setTableStripe(parseInt(e.values.tableStrip)==0);
                    $('#pageOneTable').setTextOverflow(parseInt(e.values.tableTextOverflow)==1);
                    console.log($('#pageOneTable').jqmData('runAnimation'));
                    setTimeout(() => {
                    
                    $('#pageOneTable').setRowsPrePage(parseInt(e.values.rowsNumber));
                    saveTableSettingsToUser(e.values);
                    $().mloader('hide');
                },200);
                //export2Excel(e.values.exportFileName,e.values.exportType!=0,'pageOneTable');
            }
        });
        //
    })
}
function export2Excel(fileName,data,tag){
    tag=tag||"国瑞法务";
    $().mloader('show',{message:"导出中..."});
    setTimeout(() => {
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, tag);
        XLSX.writeFile(wb,fileName);
        $().mloader('hide');
    },200);
}
var socket;
var watinglist={};
$('body').on(main_load_completed_event_name,function(){
    

    watinglist['main']=true;
    console.error('main_load_completed_event_name','complate.........');
    const intervalId = setInterval(() => {
        console.log('waiting....',watinglist)
        if (watinglist.hasOwnProperty('settings')) {
            clearInterval(intervalId);
            
            currentData=DataList.combinedData;
            $('#pageOneTable').updateSource(DataList.combinedData);
            
            //$('#pageOneTable').trigger('create');
            $().mloader("hide");
            $('#mainFooter').show();
            
            socket = io("http://"+ip+":"+port);
            socket.on('connect', () => {
                console.log('已连接到服务器');
                // 向服务器发送消息
                socket.emit('message', getGlobalJson('currentUser'));
              });
              socket.on('message', function(data) {
                
                if(data.type=="delete"){
                    //var index=resourceDatas.notifications.indexOf(data.data);
                    //if(index>-1) resourceDatas.notifications.splice(index,1);
                    resourceDatas.notifications=$.grep(resourceDatas.notifications,noti=>noti.id!=data.data.id);
                    console.error(data,resourceDatas.notifications)
                }else{
                    resourceDatas.notifications=updateOriginalData(resourceDatas.notifications,data.data,'id');
                    
                    //if(data.type=="add"){
                        if(data.data.lastEditor!=getGlobalJson("currentUser").id){
                            var sender="系统";
                            if(data.data.sender>0) {
                                sender=$.grep(resourceDatas.users,user=>user.id==data.data.sender);
                                if(sender.length>0) sender=sender[0].name;
                                else sender='未知';
                            }
                            var message=`您收到一条来自 ${sender} 的消息，请查看您的消息中心。`;
                            if(data.type=="edit") message=`${sender} 修改了主题【${data.data.title}】的内容，请前往消息中心查看变更。`;
                            showNotifyPanel(message);
                            //newItem
                        }
                        
                    //}
                }
                setUserNotifiications();
                setNotificationsList();
                $('li[data-index="'+data.data.id+'"]','#user_notification').addClass('newItem');
              });
        }
        var unread=parseInt($('div.notif_num').text());
        //console.error('unread',unread,$('.notif_num').text());
        if(unread>0){
            showNotifyPanel(`您有 ${unread} 条消息还未阅读。`);
        }
        $.each($('.tooltip-btn'),(index,btn)=>{
            $(btn).setTooltips();
        });
    }, 100);
});
$('body').on(preload_completed_event_name,function(){

    watinglist['settings']=true;
    setFontSize();
    

    databaseBatchForm();
    //console.log('resourceDatas',getGlobalJson('resourceDatas'));
    var tb=$('.header-btn-search').togglebuttonicon(form,function(e,isbefore){
        
        if(e){
            if(isbefore){
                form.slideDown();
                $('.header-btn-search').text('收起');
                //form.animate({'height':"200px"});
                $('#pageOneTable').animate({'margin-top':145+slidedownOffset+"px"})
                $('#table-fixed-column').animate({'top':83+145+slidedownOffset+"px"})
            }
        }else{
            //$('#header-filter-container').empty();
            if(isbefore){
                form.slideUp();
                $('.header-btn-search').text('更多');
                $('#pageOneTable').animate({'margin-top':"0px"})
                $('#table-fixed-column').animate({'top':83+"px"})
                isHeaderLocked=false;
                $('.header-filter-btn.ui-icon-lock.btn-icon-green').removeClass('btn-icon-green');
                
            }
        }
    },{distance:200});
    //$('#case_reg_but_restore').hide();
    
    setVisibleColumnToTemplate();
    var tableSettings=getUserTableSettings();
    console.log('tableSettings',tableSettings);
    /*
    pageOnTable=new pageTable({
		containerId:"pageOneTable",
		template:_firstPageTableColumns,
		//data:DataList.combinedData,
		//filterParent:"mainFooter",
		rowButtons:tableFunBtns
	});
    */
   
    
    _firstPageTableColumns.rowButtons.data=tableFunBtns;
    $("#pageOneTable").pagination({
        //source:DataList.casesDb,
        tableTemplate:_firstPageTableColumns,
        paginationContainer:$('#pagination_container'),
        itemsPerPage:parseInt(tableSettings.rowsNumber),
        runAnimation:tableSettings.tableAnimations==0,
        textOverflow:tableSettings.tableTextOverflow==1
        //setFixHead:true
    });
    $("#pageOneTable").setTableStripe(parseInt(tableSettings.tableStrip)==0);
    //setFixedHead($('#pageOneTable'),$('#pageOneTable-fixed'));
    //表格重新排序
    $("#pageOneTable").on('sort',function(columnData){
        //console.log(columnData.value);
        $(window).trigger('waiting');
        
        setTimeout(() => {
            //pageOnTable.sortColumn(currentData,columnData.value);
        //setAvailableColumns('pageOneTable',1);
        
        $(window).trigger('hidepopup');
            //syncHeaderCloneWidth();
        }, 100);
        //$().mloader("hide");
    })
    $("#pageOneTable").setFixedHead($('#pageOneTable-fixed'));
    $("#pageOneTable").setColumnToggle();
    //设置主表格头固定顶部位置，需要克隆主表格的原有头
    //var t1Header=$('#pageOneTable').find('thead').clone();
    //$('#pageOneTable-fixed').append(t1Header);
    setTimeout(() => {
        //tableColumnToggle(_firstPageTableColumns,$('.table-column-toggle'),'pageOneTable');
        //setColumnToggleButton();
        setPersonCaseSum(currentData);
    }, 500);
    //pageOnTable.setSort($('#pageOneTable-fixed').find('th'));
    //pageOnTable.setSort($('#pageOneTable').find('th'));
    
    $('#header-filter-container').css({top:$('#main-header').css('height')});
    //添加头部过滤表格
    var filter_form= new mform({template:header_filter_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    form=filter_form.instance;
    form.addClass('header-filter-from')
    var container=$('<div class="header-filter-container-div"></div>')
    container.append(form);
    $('#header-filter-container').prepend(container);
    form.hide();
    filter_form.setEmptyValues();
    form.trigger('create');
    $("#pageOneTable").trigger('create');
    //在过滤表格后同步表格头和身的宽度

    //按权限设置可查看类型和元素
    $('.admin-ui').hide();
    if(getGlobalJson('currentUser').level==1){
        FormTemplate3.template.caseInfo.data.legalAgencies.isDisabled=true;
        FormTemplate3.template.caseInfo.data.legalAgencies.defaultValue=getGlobalJson('currentUser').id;
        FormTemplate3_instance.template.baseInfo.data.legalAgencies_p.defaultValue=getGlobalJson('currentUser').id;
        FormTemplate3_instance.template.baseInfo.data.legalAgencies_p.isDisabled=true;
        FormTemplate3_instance.template.baseInfo.data.typeId_p.isDisabled=true;
        FormTemplate3_execute.template.baseInfo.data.typeId_p.isDisabled=true;
        progress_form_template.template.legalAgencies_p.isDisabled=true;
        header_filter_template.template.legalAgencies_f.isDisabled=true;
        header_filter_template.template.legalAgencies_f.defaultValue=getGlobalJson('currentUser').id;
        console.log('FormTemplate3.template.caseInfo',FormTemplate3.template.caseInfo);
        $('#legalAgenciesSum').hide();
        $('.super-auth').hide();
    }else if(getGlobalJson('currentUser').level==adminLevel){
        //$('#case_reg_but_restore').show();
        $('.admin-ui').show();
    }
    setUserNotifiications();
    
    caseForm=_createNewCaseForm(FormTemplate3,"case_reg_page");
    $('.header-filter-btn:contains("复位")').setTooltips();
    $('.header-filter-btn').on('click',function(e){
        switch($(this).text()){
            case "复位":
                
                
                filter_form.setEmptyValues();
                currentData=DataList.combinedData;
                //pageOnTable.sortColumn(currentData,pageOnTable.currentSort);
                //setAvailableColumns('pageOneTable',1);
                break;
            case "锁定":
                isHeaderLocked=!isHeaderLocked;
                if(isHeaderLocked){
                    $(this).addClass('btn-icon-green');
                }else{
                    $(this).removeClass('btn-icon-green');
                }
                break;
            case "查询":
                //console.log("filter...",$(form).find('select,input'));
                $(window).trigger('waiting');
                setTimeout(() => {
                    var matched=DataList.combinedData;
                    var penalty={};
                    var caseDate={};
                    $.each($(form).find('select,input'),(index,ele)=>{
                        console.log("filter...",ele.nodeName,ele.id.replace('_f',''),$(ele).val());
                        if($(ele).val()!=undefined && $(ele).val().length>0){
                            var id=ele.id.replace('_f','');
                            if(id=="penalty_0"){
                                penalty['from']=$(ele).val();
                            }else if(id=="penalty_1"){
                                penalty['to']=$(ele).val();
                            }else if(id=="caseDate_0"){
                                caseDate['from']=new Date($(ele).val()+" 00:00:00");
                            }else if(id=="caseDate_1"){
                                caseDate['to']=new Date($(ele).val()+" 23:59:00");
                            }else if(id=="caseStatus"){
                                //if($(ele).val().constructor !== String){
                                    //console.log('数子');
                                    matched=$.grep(matched,(item)=>{
                                        return $.grep($(ele).val(),(v)=>{
                                            console.log('JSON.parse',v,item[id])
                                            var val=item[id];
                                            try{
                                                val=JSON.parse(val);
                                                if(val.constructor!=Array) val.split(',');
                                                return Math.round(parseFloat(v))==Math.round(parseFloat(val[val.length-1]));
                                            }catch(e){
                                                if(parseFloat(v)>2){
                                                    return Math.round(parseFloat(v))==Math.round(parseFloat(item[id]));
                                                }else{
                                                    return parseFloat(v)==parseFloat(item[id]);
                                                }
                                            }
                                            
                                            
                                        }).length>0;
                                    });
                                //}
                            }
                            else{
                                matched=$.grep(matched,(item)=>{
                                    //console.log(item[id]);
                                    if(item[id].constructor !== String){
                                        //console.log('数子');
                                        return $(ele).val().includes(item[id]+"");
                                    }else{
                                        //console.log('数组');
                                        if(id=="casePersonnel"){
                                            console.log(id,item[id],$(ele).val());
                                            return $.grep(item[id].split(','),itm=>{
                                                return $.grep($(ele).val(),(it)=>{
                                                
                                                    var numbers=getNumbers(itm);
                                                    var catelog=itm;
                                                    var val2Match=itm;
                                                    if(numbers.length==2){
                                                        numbers.forEach(num=>{
                                                            catelog=catelog.replace(num,'');
                                                        })
                                                        val2Match=catelog+numbers[1];
                                                    }
                                                    if(it==val2Match)
                                                        console.log(itm,it,val2Match);
                                                    return it==val2Match;
                                                }).length>0
                                            }).length>0
                                        }else{
                                            return item[id].split(',').some(itm => $.grep($(ele).val(),(it)=>{
                                                console.log(itm,it,itm.indexOf(it));
                                                return itm.indexOf(it)>-1;
                                            }));
                                        }
                                        
                                    }
                                    //$(ele).val().includes(item[id]+"")
                                    //$.each($(ele).val(),(i,val)=>{
                                        //if(item[id]==Number(val)) return true;
                                    //})
        
                                })
                            }
                            
                            
                        }
                        
                        
                    });
                    
                    if(Object.keys(penalty).length==2){
                        console.log('penalty',penalty,Object.keys(penalty).length);
                        matched=$.grep(matched,(item)=>{
                            console.log(parseFloat(item['penalty']),parseFloat(penalty.from),parseFloat(penalty.to));
                            return parseFloat(item['penalty'])<=parseFloat(penalty.to) && parseFloat(item['penalty'])>=parseFloat(penalty.from);
                        });
                    }
                    if(Object.keys(caseDate).length==2){
                        console.log('caseDate',caseDate,Object.keys(caseDate).length);
                        matched=$.grep(matched,(item)=>{
                            console.log(new Date(item['caseDate']),caseDate.from,caseDate.to);
                            var valDate=new Date(item['caseDate']);
                            return valDate.getTime()<=caseDate.to.getTime() && valDate.getTime()>=caseDate.from.getTime();
                        });
                    }
                    //console.log(matched);
                    currentData=matched;
                    //pageOnTable.addTableData(matched);
                    //pageOnTable.sortColumn(matched,pageOnTable.currentSort);
                    $('#pageOneTable').updateSource(currentData);
                    tb.instance.isTargetToggle=false;
                    
                    setPersonCaseSum(currentData);
                    //setCheckAllBox($('.reg-checkbox-all'),'pageOneTable');
                    if(!isHeaderLocked){
                        form.slideUp();
                        $('#pageOneTable').animate({'margin-top':"0px"})
                        $('.header-btn-search').text('更多');
                        $('#pageOneTable').trigger('create');
                    }
                    

                    //setAvailableColumns('pageOneTable',1);
                    $('#header-filter-container').css({height:$('#pageOneTable-fixed').css('height')});
                    $('#header-filter-container').trigger('create');
                    //resizeTables();
                    //fancyTable.instance.tableUpdate($("#pageOneTable").jqmData('fancyTable'));
                    //console.log('togglebuttonicon',);
                    $(window).trigger('hidepopup');
                }, 10);
        
                
                break;
        }
    });
    
})
$('#main-body').on('scroll',function(e){
    $("#pageOneTable").jqmData('fixedHead').css({'left':$("#main-body").scrollLeft()*-1})
})
$('body').on('userDataChanged',function(e){
    console.log('userDataChanged b',getGlobalJson("currentUser"),e);
    setGlobalJson("currentUser",updateOriginalData(getGlobalJson("currentUser"),e.value,'id'));
    console.log('userDataChanged a',getGlobalJson("currentUser"),e);
    $('#username').text(getGlobalJson("currentUser").name);
    resourceDatas.legalAgencies=updateOriginalData(resourceDatas.legalAgencies,e.value,'id');
    resourceDatas['users']=updateOriginalData(resourceDatas['users'],e.value,'id');
    //console.log(getGlobalJson("currentUser"),resourceDatas.legalAgencies,r);
    $('#legalAgencies_f').trigger('create').selectmenu().selectmenu( "refresh" );
    $('#legalAgencies_p').trigger('create').selectmenu().selectmenu( "refresh" );
    $('#legalAgencies').trigger('create').selectmenu().selectmenu( "refresh" );
    setTimeout(() => {
        
        $('#username').trigger('create');
    }, 1000);
});
$('body').on('caseexcutesChanged',function(e){
    console.log('caseexcutesChanged',e);
    if(e.action=="add"){

    }
    //保存修改数据到数据库

    //更新缓存内数据

    //更新页面ui数据显示
    var paidA=0;
    DataList.caseExcutes.forEach(exe => {
        if(exe.id==e.value.id){
            paidA+=parseFloat(exe.exexuteAmount);
        }
    })
    $('#progress').find('#paidAmount_p').val(paidA);
    DataList.caseStatus.forEach((d,i)=>{
        if(d.id==e.value.id){
            DataList.caseStatus[i].paidAmount=paidA;
        }
    });
    DataList.combinedData.forEach((d,i)=>{
        if(d.id==e.value.id){
            DataList.combinedData[i].paidAmount=paidA;
        }
    });
    currentData.forEach((d,i)=>{
        if(d.id==e.value.id){
            currentData[i].paidAmount=paidA;
        }
    });
    setPersonCaseSum(currentData);
    update("id="+e.value.id,'caseStatus',{paidAmount:paidA},function(r){
        //console.log(r)
        if(!r.data.success){
            $().minfo('show',{title:"提示",message:"更新遇到问题。"+r.data.data.sqlMessage},function(){});
        }
    })
    console.log("on data changed",getGlobal('currentPage'),DataList.caseExcutes,$.grep(DataList.caseExcutes,(exe)=>exe.id==e.value.id));
})
//案件状态数据更新
//影响的缓存内数据：DataList.caseStatus,DataList.combinedData
//影响的UI数据：footer_sum,main_table
$('body').on('caseStatusChanged',function(e){
    if(e.action=='status'){
    }else{
        $(window).trigger('saving');
        var data=[];
        var newValue={};
        $.each(e.value,(key,val)=>{
            if(key!='id'){
                data.push(key.replace("_p","")+"=\""+val+"\"");
            }
            newValue[key.replace("_p","")]=val;
        })
        //保存修改数据到数据库
        update('id='+newValue.id,'caseStatus',data.join(),function(r){
            console.log('caseStatusChanged',r,newValue,e.value);
            if(r.data.success){
                //更新缓存内数据
                //pageOnTable.updateTableData(newValue,$('#pageOneTable').find('tr[data-item='+newValue.id+']'));
                DataList.caseStatus=updateOriginalData(DataList.caseStatus,newValue,'id');
                DataList.combinedData=updateOriginalData(DataList.combinedData,newValue,'id');

                currentData=updateOriginalData(currentData,newValue,'id');//tools.js
                //console.log(DataList.caseStatus);
                //更新页面ui数据显示
                $('#pageOneTable').updateTableItem(e.value);
                setPersonCaseSum(currentData);
                $().minfo('show',{title:"提示",message:"保存完成。"},function(){});
            }else{
                $().minfo('show',{title:"提示",message:"更新遇到问题。"+r.data.data.sqlMessage},function(){});
            }
            
            console.log("on data changed",DataList.combinedData,DataList.caseStatus,e);
            $(window).trigger('hidepopup');
        });
    }
    
    
})
//案件基本数据更新
$('body').on('caseChanged',function(e){
    //保存修改数据到数据库
    $().mloader('show',{message:"保存中..."});
    setTimeout(() => {
        insertCase(e.value,caseInfoList,function(r){
            //console.log(r);
            var error="添加过程中有问题";
            var result=[];
            if(r.length>0){
                r.forEach(d=>{
                    if(!d.success){
                        result.push(d.error);
                    }
                })
                
            }
            if(result.length>0){
                error=result.join();
            }
            if(result.length==0){
                console.log("修改添加成功。");
                console.log("on data changed0",currentData,DataList.combinedData,DataList.caseStatus,e);
                //更新缓存内数据
                currentData=updateOriginalData(currentData,e.value,'id');//tools.js
                DataList.combinedData=updateOriginalData(DataList.combinedData,e.value,'id');//tools.js
                DataList.caseStatus=updateOriginalData(DataList.caseStatus,e.value,'id');//tools.js
                
                //更新页面ui数据显示
                if(e.action=="add"){
                    history.back();
                    //pageOnTable.insertTableData(e.value);
                    $('#pageOneTable').addTableItem(e.value);
                    //setTableRowFunctionButonClickedEvent($("[name^='fn_btn'][data-item="+e.value.id+"]"));
                    $().minfo('show',{title:"提示",message:"保存完成。"},function(){});
                }else{
                    $('#pageOneTable').updateTableItem(e.value);
                    //pageOnTable.updateTableData(e.value,$('#pageOneTable').find('tr[data-item='+e.value.id+']'));
                    $().minfo('show',{title:"提示",message:"保存完成。"},function(){});
                }
                console.log("on data changed1",DataList.combinedData,DataList.caseStatus,e);
                setPersonCaseSum(currentData);
                $().mloader('hide');
            }else{
                console.log(r);
                $().mloader('hide');
                
                $().minfo('show',{title:"错误",message:error});
            }
            
        });
    }, 100);
    
})
$(window).on('waiting',function(e){
    $().mloader('show',{message:"请稍等..."});
})
$(window).on('saving',function(e){
    $().mloader('show',{message:"保存中..."});
})
$(window).on('hidepopup',function(e){
    $().mloader('hide');
})
$(window).resize(function(e){
    //console.log('高度',window.innerHeight,'宽度',window.innerWidth)
    //resizeTables();
    //resizeColumnFilter();
});
$( "#nav-panel" ).on( "panelbeforeopen", function( event, ui ) {
    //console.log($('#panel_sum_info').children().length)
    if($('#panel_sum_info').children().length==0){
        setPersonCaseSum(currentData);
    }
} );
$('#legalAgenciesSum').on( "collapsibleexpand", function( event, ui ) {
    //console.log('expand');
    //console.log(getLegalAngenciesSum());

    $('#legalAgenciesSum-list').empty();
    if(getGlobalJson('currentUser').level>=supervisorLevel){
        $('#legalAgenciesSum-list').empty();
        $.each(getLegalAngenciesSum(),(name,data)=>{
            var divider=$('<li data-role="list-divider">'+name+'<span class="ui-li-count">'+data.number.length+'</span></li>');
            $('#legalAgenciesSum-list').append(divider);
            var li=$('<li></li>');
            var btn=$('<a href="#"></a>');
            var p=$('<p>'+data.amount.formatMoney(0, "￥")+'万</p>');
            var title=$('<h2>涉及金额</h2>');
            $(li).append(btn);
            $(btn).prepend(title);
            $(btn).append(p);
            $('#legalAgenciesSum-list').append(li);
            $(btn).jqmData('index',data.number)
            btn.on('click',function(e){
                console.log($(this).jqmData('index'));
            })
        })
        $('#legalAgenciesSum-list').listview( "refresh" );
        $('#legalAgenciesSum').trigger('create');
    }
    
    
    //$('#legalAgenciesSum-list') 
} );
$.mobile.document.one( "filterablecreate", "#pageOneTable", function() {
    $('#pageOneTable').filterable({
        filter: function( event, ui ) {
            console.log('create');
            //syncHeaderCloneWidth();
        }
    });
});
function setPersonCaseSum(data){
    if(data==undefined) data=DataList.combinedData;
    var personCaseSum=getPersonCaseSum(data);
    console.log(personCaseSum);
    $('#panel_sum_info').empty();
    var info=$(`<li data-role="list-divider" style="border-bottom: 2px solid orangered;">当前表格案件总数<span class="ui-li-count">${personCaseSum.caseNum}</span></li>`+
        `<li>群诉<b id="footer_sum_label_group" style="color:#1362B7;"> ${personCaseSum.caseLabels[3].length} </b>件</li>`+
        `<li>重大案件<b id="footer_sum_label_thousand" style="color:#E25C62;"> ${personCaseSum.caseLabels[2].length} </b>件</li>`+
        `<li>普通案件<b id="footer_sum_label_normal" style="color:green;"> ${personCaseSum.caseLabels[0].length} </b>件</li>`+
        `<li data-role="list-divider" style="border-bottom: 2px solid orangered;">涉及金额</li>`+
        `<li>本诉金额为 <b id="footer_sum_request">${personCaseSum.rquestAmount.formatMoney(0, "￥")}</b> 万</li>`+
        `<li>判决金额为 <b id="footer_sum_penalty">${personCaseSum.penaltyAmount.formatMoney(0, "￥")}</b> 万</li>`+
        `<li>已执行金额为 <b id="footer_sum_paid">${personCaseSum.paidAmount.formatMoney(0, "￥")}</b> 万</li>`
    );
    
    
    //setInfoBarPosition();
    //$('#footer_info_bar').setTooltip();
    //$('#footer_info_bar').append(info);
    $('#panel_sum_info').append(info);
    $('#panel_sum_info').trigger('create');
    $('#panel_sum_info').listview().listview('refresh')
    
    $('#legalAgenciesSum').trigger('collapsibleexpand');
    
    //$(info).setTooltip('，');
    //console.log('mainFooter',footWidth)
}
$(window).on('resize',function() {
    //console.log('window size changed')
    //setInfoBarPosition();
  });

function setInfoBarPosition(){
    var footWidth=$('#mainFooter').width()-40;
    var btns_l=[];
    var btns_r=[];
    $.each($('#mainFooter').find('[data-role="controlgroup"]'),(index,cg)=>{
        $.each(($(cg)).find('a, button'),(i,b)=>{
            footWidth-=90;
            if(index==0) btns_l.push(b);
            else btns_r.push(b);
        })
        //console.log($(cg).outerWidth());
    });
    var diff=((btns_r.length-btns_l.length)*90+40)/2
    $('#footer_info_bar').css({'max-width':footWidth+"px",left:'calc( 50% - '+diff+'px )'});
}
function getPersonCaseSum(data){
    var sum={
        caseNum:data.length,
        caseLabels:{
            0:[],
            1:[],
            2:[],
            3:[]
        },
        rquestAmount:0,
        penaltyAmount:0,
        paidAmount:0
    }
    data.forEach(d=>{
        //findValue
        /*
        var label=resourceDatas.caseLabels_.findValue(d.caseLabel,'id','label');
        if(label!=undefined){
            if(!sum.caseLabels.hasOwnProperty(label)) sum.caseLabels[label]=[];
            sum.caseLabels[label].push(d.id);
        }
        */
        sum.caseLabels[d.caseLabel].push(d.id);
        sum.rquestAmount+=parseFloat(d.requestAmount);
        sum.penaltyAmount+=parseFloat(d.penalty);
        sum.paidAmount+=parseFloat(d.paidAmount);
    });
    console.log(sum);
    return sum;
}
function setVisibleColumnToTemplate(){
    if(getGlobalJson('currentUser').columns!=undefined && getGlobalJson('currentUser').columns!=null){
        var user_cols=getGlobalJson('currentUser').columns.split(',');
        $.each(_firstPageTableColumns,(k,v)=>{
            if(v.isFilterable){
                if(user_cols.includes(k)){
                    v.isHidden=false;
                }else{
                    v.isHidden=true;
                }
            }else{
                v.isHidden=false;
            }

        });
        //$('#pageOneTable').trigger('create');
        //$('#pageOneTable-fixed').trigger('create'); 
    }
}
function getUserTableSettings(){
    if(getGlobalJson('currentUser').tables!=undefined && getGlobalJson('currentUser').tables!=null){
        return JSON.parse(getGlobalJson('currentUser').tables);
    }
    return {rowsNumber:10,
            textOverflow:0,
            tableAnimations:0,
            tableStrip:0};
}
function getLegalAngenciesSum(){
    //var legalAgencies={};
    //var legalAgencies1={};
    var summary={};
    var data=currentData || DataList.combinedData
    console.log('getLegalAngenciesSum',data);
    data.forEach(item=>{
        var match=$.grep(resourceDatas.legalAgencies,(d=>d.id==item.legalAgencies));
        if(match.length>0){
            var catelog=match[0].name;
            //if(!legalAgencies.hasOwnProperty(catelog)) legalAgencies[catelog]=[];
            //if(!legalAgencies1.hasOwnProperty(catelog)) legalAgencies1[catelog]=0.0;
            if(!summary.hasOwnProperty(catelog)) summary[catelog]={};
            if(!summary[catelog].hasOwnProperty('number')) summary[catelog]['number']=[];
            if(!summary[catelog].hasOwnProperty('amount')) summary[catelog]['amount']=0.0;
            //legalAgencies[catelog].push(item);
            //legalAgencies1[catelog]+=item.requestAmount;
            summary[catelog]['number'].push(item);
            summary[catelog]['amount']+=parseFloat(item.requestAmount);
        }
    });
    return summary;
}
function _createNewCaseForm(template, constainerId){
    
    //console.log("_createNewCaseForm template");
    //console.log(template);
    var main_form= new mform({template:template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    var form=main_form.instance;
    
    const popup_form = document.getElementById(constainerId);
    $(popup_form).append(form);
    $(constainerId).trigger('create');


    return main_form;
}
$('#main').on('click',function(e){
    $('#notification_panel').animate({top:'-'+($('#notification_panel').height()+40)+'px'},1000);
})
$('#notification_panel').on('click',function(e){
    $(this).animate({top:'-'+($('#notification_panel').height()+40)+'px'},1000);
    setNotificationsList();
    goToPage( '#user_notification');
})
function showNotifyPanel(message){
    $('#notification_panel').text(message);
    $('#notification_panel').css({top:'-'+($('#notification_panel').height()+40)+'px','z-index':1100,'line-height':$('#notification_panel').height()+"px"})
    $('#notification_panel').animate({top:'10px'},1000);
    setTimeout(() => {
        $('#notification_panel').animate({top:'-'+($('#notification_panel').height()+40)+'px'},1000);
    }, 10000);
}

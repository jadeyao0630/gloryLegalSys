var waitingList={};
var tempFile={};
function appendToWaiting(key,task){
    waitingList[key]=task;
}

$.fn.updateListView=function(args){
    var _this=this;
    var collapsible=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"><h3>更新</h3><div>');
    var newUpdateBtn=$('<a href="#progress_point_popupMenu_" data-rel="popup" style="position: absolute;z-index:100;margin-top:2px;right:10px;height:14px;line-height:14px;" class="ui-btn ui-btn-a ui-mini ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-plus btn-icon-green">添加</a>')
    this.append(newUpdateBtn);
    this.jqmData('listview',$('<ul data-role="listview" id="progress_point_info_body"></ul>'));
    collapsible.append(this.jqmData('listview'));
    this.append(collapsible);

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
                break;
        }
    });
    function setProgressPopupForm(template,title,data){
        $().mloader("show",{message:"读取中...."});
        var form= new mform({template:template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
        $('#progress_point_popup_add_title').text(" "+title);
        $('#progress_point_popup_add_form').empty();
        $('#progress_point_popup_add_form').append(form.instance);
        $('#progress_point_popup_add_form').trigger('create');
        $('.progress_popup_add_form_submit').data('item',JSON.stringify(data));
        $('.progress_popup_add_form_submit').jqmData('form',form);
        $('.progress_popup_add_form_submit').off();
        $('.progress_popup_add_form_submit').on('click', function(e){
            var data=JSON.parse($(this).data('item'));
            var form=$(this).jqmData('form');
            console.log(form.opt.template);
            form.getFormValues(async function(e){
                console.log("获取到的表格值",e,data);
                if(e.success){
                    $('#progress_point_popup_add').popup('close');
                    $().mloader("show",{message:"提交中...."});
                    $.each(e.values,(k,v)=>{
                        e.values[k.replace('_p','')]=v
                        if(k.replace('_p','')!=k) delete e.values[k]
                    })
                    e.values.caseNo=data.caseNo!==null && data.caseNo!=='null'?data.caseNo:e.values.caseNo;
                    e.values.id=data.id;
                    e.values.isInactived=0;
                    e.values.caseStatus=data.caseStatus;
                    e.values[data.dateKey]=getDateTime();
                    e.values.isTemp=true;
                    //console.log('getTheLastIndex',data.table,data.key);
                    getTheLastIndex(data.table,data.key).then((r)=>{
                        //console.log('getTheLastIndex',r);
                        
                        
                        
                        var canSetWatingList=false;
                        if(data.table!='caseAttachments'){
                            e.values[data.key]=r+1;
                            getTheLastIndex(data.table,'subId','caseStatus='+data.caseStatus).then((rr)=>{
                                //console.log('last index',r,'last sub index',rr)
                                e.values.subId=rr+1;
                                canSetWatingList=true;
                            });
                        }else{
                            //console.log('last index',r)
                            //getSortedUpdateEvents();
                            e.values[data.key]=r+Object.keys(tempFile).length+1;
                            uploadFiles(data.id,e.values.filePath).then(rr=>{
                                //console.log(r);
                                var filePaths=[];
                                var ofilePaths=[];
                                $.each(rr,(index,uploadResult)=>{
                                    if(!uploadResult.success){
                                        console.log(uploadResult.fileName+" 上传失败！");
                                        //cango=false;
                                        //$().mloader("hide");
                                    }else{
                                        console.log(uploadResult.fileName+" 上传成功！");
                                        filePaths.push(uploadResult.fileName);
                                        ofilePaths.push(uploadResult.originFileName);
                                        
                                    }
                                });
                                e.values.filePath=filePaths.join(',');
                                e.values.originalFileName=ofilePaths.join(',');
                                
                                
                                if(!tempFile.hasOwnProperty(data.id)) tempFile[data.id]=[];
                                tempFile[data.id].push(filePath);
                                //fileOk=true;
                                
                                canSetWatingList=true;
                            });
                            
                            
                        }
                        const intervalId = setInterval(() => {
                            if (canSetWatingList) {
                                clearInterval(intervalId);
                                var dateSortItems=_this.jqmData('lastData');
                                var _data=getEventsDetails(e.values);
                                var date=_data.date.replace(" ","");
                                if(!dateSortItems.hasOwnProperty(date)){
                                    dateSortItems[date]=[];
                                }
                                dateSortItems[date].push(_data);
                                _this.updateListViewData(dateSortItems);
                                waitingList[data.key+data.id]=function(){
                                    if(e.values.hasOwnProperty('isTemp'))
                                        delete e.values.isTemp;
                                    pureinsert(data.table,e.values,(r)=>{
                                        console.log('insert result',data.table,r);
                                        //添加新提交的数据到缓存
                                        console.log("更新缓存前",DataList[data.table],e.values)
                                        DataList[data.table].push(e.values);
                                        
                                        console.log("更新缓存后",DataList[data.table])
                                        //更新当前视图事件列表
                                        //console.log(getSortedUpdateEvents(),$('#progress_point_info_body'));
                                        //generateUpdateInfoList($('#progress_point_info_body'),getSortedUpdateEvents());
                                        //更新节点视图计数器
                                        
                                        //更新节点图
                                        if(data.table=='caseExcutes'){
                                            //DataList.caseExcutes=updateOriginalData(DataList.caseExcutes,newData,data.idkey);
                                            fireDataChnaged("caseexcutesChanged",e.values,"add");
                                        }
                                        console.log("更新缓存后",getUpdateEvents())
                                        $('#progress_diagram').trigger({type:'updateIndicator',eventsData:getUpdateEvents()})
                                        updatePenaltyPaidSummary($('#execute_summary'));
                                    });
                                }
                            }
                        }, 100);
                    
                    })
                    $().mloader('hide')
                }
            });
        })
        setTimeout(() => {
            $('#progress_point_popup_add').popup('open');
            $().mloader("hide");
        },200);
    }
}
$.fn.updateListViewItem=function(data){
    var _this=this;
    var item= _this.find('h3[data-index="'+data.key+data.id+'"]');
    console.log('updateListViewItem',data,item);
    if(item.length>0){
        $(item[0]).find('span').text(data.description);
        var del=$(item[0]).closest('div').find('a[name="del"]');
        console.log('updateListViewItem',del);
        if(data.isInactived){
            del.removeClass('ui-icon-delete').removeClass('btn-icon-red').addClass('ui-icon-recycle').addClass('btn-icon-green');
            del.text('还原');
        }else{
            del.removeClass('ui-icon-recycle').removeClass('btn-icon-green').addClass('ui-icon-delete').addClass('btn-icon-red');
            del.text('删除');
        }
    }
}
$.fn.updateListViewData=function(data){
    var _this=this;
    if (data==undefined) throw new Error("source data Required");
    _this.jqmData('lastData',data);
    var sortedItems=Object.keys(data).sort(function(a,b){
        return data[a][0].originalDate>data[b][0].originalDate;
    });
    _this.jqmData('listview').empty();
    sortedItems.forEach(date=>{
        var items=data[date];
        var date_bar=$('<li data-role="list-divider">'+date+'<span class="ui-li-count">'+items.length+'</span></li>');
        _this.jqmData('listview').append(date_bar);
        items.forEach(item=>{
            var item_container=$('<li data-item=\''+JSON.stringify(item)+'\'></li>');
            console.log('JSON.stringify',item);
            var del_btn;
            if(item.type=='caseAttachments'){
                var itemData=getDataById(DataList[item.type],item.key,item.id);
                
                if(itemData==undefined) {
                    
                    itemData={};
                    itemData.filePath=item.fileName;
                    itemData.id=item.caseId;
                    console.log('itemData',itemData)
                }
                var icon=getIconFromTypeName(item.typeName,itemData.filePath);
                
                var attachmentData=getAttachmentData(itemData.filePath);
                var list_item=$('<h3 data-index="'+item.key+item.id+'" style="padding-left:15px;margin:auto 0px;"><span>'+item.description+'</span></h3>');
                list_item.prepend(icon);
                
                item_container=$('<li style="padding:0px;" data-item=\''+JSON.stringify(item)+'\'></li>');
                var group=$('<div style="display: grid;grid-gap: 0px;margin:-8px 0px;"></div>');
                var view_btn=$('<a href="#" class="ui-btn ui-icon-eye ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">查看</a>')
                console.log('preview',"http://"+ip+':'+port+'/downloadLocal?fileName='+itemData.filePath+'&folder='+itemData.id);
                var download_btn=$('<a href="http://'+ip+':'+port+'/downloadLocal?fileName='+itemData.filePath+'&folder='+itemData.id+'" class="ui-btn ui-icon-action ui-btn-icon-notext btn-icon-blue view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">下载</a>')
                del_btn=$('<a href="#" name="del" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red view-list-button" style="padding:10px 5px;border: none;">删除</a>')
                
                if(item.isInactived){
                    del_btn=$('<a href="#" name="del" class="ui-btn ui-icon-recycle ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border: none;">还原</a>')
                }
                group.append(list_item);
                if(attachmentData.previewable) {
                    group.append(view_btn);
                    group.css({'grid-template-columns': '1fr auto auto auto'})
                }else{
                    group.css({'grid-template-columns': '1fr auto auto'})
                }
                group.append(download_btn);
                group.append(del_btn);
                view_btn.jqmData('label',list_item);
                item_container.append(group);
            }else{
                var icon=getIconFromTypeName(item.typeName);
                var list_item=$('<h3 data-index="'+item.key+item.id+'" style="padding-left:15px;margin:auto 0px;"><span>'+item.description+'</span></h3>');
                list_item.prepend(icon);
                item_container=$('<li style="padding:0px;" data-item=\''+JSON.stringify(item)+'\'></li>');
                var group=$('<div style="display: grid;grid-template-columns: 1fr auto auto;grid-gap: 0px;margin:-8px 0px;"></div>');
                var view_btn=$('<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext btn-icon-blue view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">编辑</a>')
                del_btn=$('<a href="#" name="del" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red view-list-button" style="padding:10px 5px;border: none;">删除</a>')
                
                if(item.isInactived){
                    del_btn=$('<a href="#" name="del" class="ui-btn ui-icon-recycle ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border: none;">还原</a>')
                }
                group.append(list_item);
                group.append(view_btn);
                group.append(del_btn);
                view_btn.jqmData('label',list_item);
                item_container.append(group);
            }
            
            _this.jqmData('listview').append(item_container);
        })

    })
    _this.jqmData('listview').listview().listview('refresh');
    _this.jqmData('listview').find('.view-list-button').on('click',function(e){
        //_this.trigger({type:'clicked',eventData:e});
        console.log('clicked',e);
        //console.log($(this));
        var typeName=$(this).text().length==0?$(this).attr('title'):$(this).text();
        var data=$(this).closest('li').data('item');
        //console.log($(this).closest('li'),data.id,data.type,data.key,typeName);
        switch(typeName){
            case '查看':
                $().mloader('show',{message:"读取中..."});
                setTimeout(() => {
                    console.log();
                    var itemData=getDataById(DataList[data.type],data.key,data.id);
                    if(itemData==undefined) {
                        itemData={};
                        itemData.filePath=data.fileName;
                        itemData.id=data.caseId;
                    }

                    console.log('查看',data,itemData);
                    $('#preview_container').empty();
                    //var headerHeight=$('#progress_file_preview').find('div[data-role="header"]').outerHeight();

                    
                    if(itemData==undefined) {
                    
                        itemData={};
                        itemData.filePath=data.fileName;
                        itemData.id=data.caseId;
                        console.log('itemData',itemData)
                    }

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
                            });
                        });
                        
                    }else{
                        var url="http://"+ip+":"+port+"/preview?fileName="+itemData.filePath+"&folder="+itemData.id;
                        var frame=$("<iframe src='"+url+"' style='position: absolute;top: "+50+"px;left: 0;width: 100%;height: 100%;border: none;'>"+
                                    +"</iframe>");
                        $('#preview_container').append(frame);
                    }
                    goToPage('#progress_file_preview');
                    setTimeout(() => {
                        $().mloader('hide');
                    },200);
                },200);
                
                //var media=$('<embed  class="media" src="'+"http://"+ip+":"+port+"/preview?fileName="+itemData.filePath+"&folder="+itemData.id+'"></a>');

                break;
            case '编辑':
                //console.log(data.id,data.type,data.key,typeName)
                console.log('编辑');
                var itemData=getDataById(DataList[data.type],data.key,data.id);
                console.log('generateUpdateInfoList',itemData,$(_this).jqmData('label'));
                var form,data,caption;
                switch (data.type){
                    case 'caseUpdates':
                        console.log("进展");
                        form= new mform({template:add_update_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        data={table:data.type,idkey:'updatesId',dateKey:'dateUpdated',data:itemData};
                        caption="修改进展";
                        break;
                    case 'caseExcutes':
                        console.log("执行");
                        form= new mform({template:add_execute_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        data={table:data.type,idkey:'excutesId',dateKey:'dateExecuted',data:itemData};
                        caption="修改执行";
                        break;
                    case 'caseProperties':
                        console.log("财产");
                        form= new mform({template:add_property_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        data={table:data.type,idkey:'propertyId',dateKey:'dateUpdated',data:itemData};
                        caption="修改资产变更";
                        break;
                    case 'caseAttachments':
                        console.log("附件");
                        form= new mform({template:add_evidence_template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
                        data={table:data.type,idkey:'evidenceId',dateKey:'dateUploaded',data:itemData};
                        caption="修改附件证明";
                        break;
                }
                form.setValues(itemData);
                
                $('#progress_popup_edit_title').text(caption);
                $('#progress_popup_edit_form').empty();
                $('#progress_popup_edit_form').append(form.instance);
                $('#progress_popup_edit_form').trigger('create');
                //console.log(JSON.stringify(data));
                $('.progress_popup_edit_form_submit').off();
                $('.progress_popup_edit_form_submit').data('item',JSON.stringify(data));
                form.instance.jqmData('label',$(_this).jqmData('label'));
                $('.progress_popup_edit_form_submit').jqmData('form',form);
                $('#progress_popup_edit').trigger('create');
                $('#progress_popup_edit').popup().popup('open');
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
                            console.log('newData',newData)
                            waitingList[data.key+data.id]=function(){
                                update("id="+data.data.id+" AND "+data.idkey+"="+data.data[data.idkey],
                                    data.table,
                                    vals.join(),async function(r){
                                    DataList[data.table]=updateOriginalData(DataList[data.table],newData,data.idkey);
                                    console.log('caseExcutes',data.table,DataList[data.table],newData)
                                    if(data.table=='caseExcutes'){
                                        newData.id=data.data.id;
                                        //DataList.caseExcutes=updateOriginalData(DataList[data.table],newData,data.idkey);
                                        fireDataChnaged("caseexcutesChanged",task.newData,"update");
                                        //$('#progress_diagram').trigger({type:'updateIndicator',eventsData:getUpdateEvents()})
                                        updatePenaltyPaidSummary($('#execute_summary'));
                                    }
                                })
                            };
                            var formatData=getEventsDetails(newData);
                            console.log('formatData',formatData);
                            _this.updateListViewItem(formatData);
                            //form.instance.jqmData('label').text(formatData.description);
                            //form.instance.jqmData('label').prepend(getIconFromTypeName(formatData.typeName));
                            history.back();
                            $(window).trigger('hidepopup');
                        }
                    });
                })
                break;
            case '删除':
                console.log('删除',data);
                data.isInactived=1;
                var value={isInactived:data.isInactived}
                value[data.key]=data.id;
                if(data.isTemp){
                    
                    //DataList[data.type]=updateOriginalData(DataList[data.type],value,data.key);
                    
                    $.each(_this.jqmData('lastData'),(k,v)=>{
                        _this.jqmData('lastData')[k]=$.grep(v,d=>d.id!=data.id);
                        if(_this.jqmData('lastData')[k].length==0) delete _this.jqmData('lastData')[k];
                    });
                    console.log('删除',_this.jqmData('lastData'),data);
                    _this.updateListViewData(_this.jqmData('lastData'));
                    deleteFile(data.caseId,data.fileName);
                    _this.updateListViewData(_this.jqmData('lastData'));
                    if(waitingList.hasOwnProperty(data.key+data.id))
                        delete waitingList[data.key+data.id];
                }else{
                    _this.updateListViewItem(data)
                    //storeTempData(data.type,value,data.key)
                    waitingList[data.key+data.id]=function(){
                        console.log('删除',data);
                        DataList[data.type]=updateOriginalData(DataList[data.type],value,data.key);
                        inactiveItem(data.key+'='+data.id,data.type,function(r){});
                    };
                }
                
                break;
            case '还原':
                data.isInactived=0;
                var value={isInactived:data.isInactived}
                value[data.key]=data.id;
                if(data.isTemp){
                    //storeTempData(data.type,value,data.key)
                    //DataList[data.type]=updateOriginalData(DataList[data.type],value,data.key);
                    
                    //generateUpdateInfoList($('.updateContainer'),getSortedUpdateEvents());
                }else{
                    _this.updateListViewItem(data);
                    //storeTempData(data.type,value,data.key);
                }
                
                waitingList[data.key+data.id]=function(){
                    DataList[data.type]=updateOriginalData(DataList[data.type],value,data.key);
                    restoreItem(data.key+'='+data.id,data.type,function(r){});
                };
                break;
        }
    })
}

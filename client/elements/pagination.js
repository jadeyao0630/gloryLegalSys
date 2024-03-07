function saveChangedToUser(target){
    target=getElementId(target);
    var checkboxs=$('#'+target+'-columnFilter').find('input[type="checkbox"]:checked');
    var checkedCols=[];
    $.each(checkboxs,(index,checkbox)=>{
        checkedCols.push($(checkbox).attr('name'));
    })
    //console.log(checkedCols);
    var userData=getCurrentUserSaved();
    userData.columns=checkedCols.join();
    userData.createDate=formatDateTimeStr2Mysql(userData.createDate);
    userData.lastLogin=formatDateTimeStr2Mysql(userData.lastLogin);
    saveCurrentUser(userData);
}
function saveTableSettingsToUser(data){
    var userData=getCurrentUserSaved();
    console.log('saveTableSettingsToUser',JSON.stringify(data),userData);
    userData.createDate=formatDateTimeStr2Mysql(userData.createDate);
    userData.lastLogin=formatDateTimeStr2Mysql(userData.lastLogin);
    userData.tables=JSON.stringify(data);
    saveCurrentUser(userData);

}
function getSuperMultValue(template,data,isMultiInput){
    //console.log('getSuperMultValue',data);
    var data=data.split(',');
    var multiValues=[];
    data.forEach(_v=>{
        //console.log(_v)
        var _values=isMultiInput?_v.convertToSuperMultiInputValue():_v.convertToSuperMultiSelectValue(template.data,template.valueKey,template.matchKey);
        //console.log('setSumList',_values);
        if(template.hasOwnProperty('displayFormat')){
            var displayFormat=template.displayFormat;
            $.each(_values,(kk,vv)=>{
                if(displayFormat.indexOf(kk)>-1){
                    displayFormat=displayFormat.replace("{"+kk+"}",vv);
                }
            })
            multiValues.push(displayFormat);
        }else{
            var collector=[];
            $.each(_v,(kk,vv)=>{
                collector.push(vv);
            })
            multiValues.push(collector.join(" "));
        }
    });
    return multiValues;
}
function compareDate(source,target){
    return new Date(target=="0000-00-00 00:00:00"?"1900-01-01 00:00:00":target)>new Date(source=="0000-00-00 00:00:00"?"1900-01-01 00:00:00":source);
}
function getValueIfHaveDataRef(template,data){
    
    if(template.hasOwnProperty('data') && template.data!=undefined){
        var refData=template.data;
        //console.log('hasOwnProperty data',refData);
        if(template.type=='supermulticombobox'){
            return getSuperMultValue(template,data,false)//.join("<br/>");
        }else if(template.type=='supermultiinput'){
            return getSuperMultValue(template,data,true)//.join("<br/>");
        
        }else if(template.type=='progresses'){
            var val=data;
            try{
                val=JSON.parse(val);
                if(val.constructor!=Array) val.split(',');
                //console.log('JSON.parse',val);
                val=template.data[val[val.length-1]];
            }catch(e){
                //console.log('JSON.parse',e);
                var index=formatIndex(val);
                //console.log('val....');
                val=template.data[index.main];
                //console.log(columnSettings.data);
                if(val instanceof Array){
                    val=val[index.sub];
                    //console.log(val);
                }
            }
            
            if(val==undefined) val='未开始流程';
            return val;
        }else{
            var _data;
            if(data.constructor == String && template.isMultipleValue) {
                data=data.split(',');
                }
            if(template.hasOwnProperty('matchKey')){
                refData=$.grep(refData,d=>template.isMultipleValue?data.includes(d[template.matchKey].toString()):d[template.matchKey]==data);
            }else{
                refData=[refData[data]];
            }
            if(refData.length>0){
                if(template.isMultipleValue){
                    console.log("table item",data,refData);
            
                    var temp_data=[];
                    if(template.hasOwnProperty('valueKey')){
                        $.each(refData,(i,v)=>{
                            console.log(i,v);
                            if(v.hasOwnProperty(template.valueKey)) {
                                var val=v[template.valueKey];
                                if(template.hasOwnProperty('displayFormat')){
                                    val=template.displayFormat.replace('{}',val);
                                }
                                temp_data.push(val)
                            };
                        })
                    }else{
                        temp_data = refData;
                    }
                    _data=temp_data.join(",")
                }else{
                    if(template.hasOwnProperty('valueKey')){
                        _data = refData[0][template.valueKey];
                    }else{
                        _data = refData[0];
                    }
                    if(template.hasOwnProperty('displayFormat')){
                        _data=template.displayFormat.replace('{}',_data);
                    }
                }
            }
            
            
            
            return _data;
        }
        
    }else {
        if(template.hasOwnProperty('displayFormat')){
            data=template.displayFormat.replace('{}',data);
        }
        return data;
    }
}
function checkChanged(self){
    console.log($(self).jqmData('table'));
    var table=$(self).jqmData('table');
    var checkboxAll=$($(table).jqmData('fixedHead')!=null?$(table).jqmData('fixedHead'):$(table)).find('.reg-checkbox-all');
    $.each($(table).find("input[type=checkbox][name=item_checkbox]"),function(index,checkbox) {
                var tr=$(table).find('tbody > tr');
                $(checkboxAll).prop("checked",
                    tr.not(':hidden').length==tr.not(':hidden').find('input[type="checkbox"]:checked').length);
    });
    //if(!$(self).prop('checked')) $($(self).jqmData('checkboxAll')).prop('checked',false);
}
function getTdHtml(template,data,id){
    var td=$('<td name="'+id+'"" style="text-align: center;vertical-align: middle;"></td>');
    if(template.type!="checkbox" && template.type!="buttons"){
        //data=getValueIfHaveDataRef(template,data);
        if(data==null||data.length==0) data=template.defaultValue!=undefined?template.defaultValue:"无";
    }
    var ele=$('<label>'+data+'</label>');
    switch(template.type){
        case "backgroundColorLabel":
            var ele=$('<label>'+data+'</label>');
            if(template.hasOwnProperty('backgroundData')){
                td.css(template.backgroundData[data]);
            }
            break;
        case "date":
            //console.log('date',data);
            var date=data;
            if(data=='0000-00-00 00:00:00'){
                date=template.defaultValue!=undefined?template.defaultValue:"无";
            }else{
                date=getDateTime(data);
                if(template.dateFormat!=undefined) date=formatDateTime(new Date(data),template.dateFormat);
            }
            ele=$('<label>'+date+'</label>');
            break;
        case "checkbox":
            ele=$('<input class="reg-checkbox" style="left:0px;" type="checkbox" data-mini="true" onclick="checkChanged(this)" name="item_checkbox" data-item='+data+'>');
            ele.jqmData('item',data)
            break;
        case "buttons":
            if(template.data!=undefined){
                ele=$($(formatString(template.data,JSON.stringify(data))));
            }
            break;
            
    }
    if(template.isHidden){
        td.hide();
    }
    if(template.width!=undefined){
        td.css({width:template.width})
    }
    td.append(ele);
    //td.trigger('create');
    return td;
}
$.fn.extend({
    pagination:function(arg){
        var _this=$(this);
        _this.jqmData('itemsPerPage',15);
        _this.jqmData('currentPage',0);
        _this.jqmData('maxPage',0);
        _this.jqmData('source',[]);
        _this.jqmData('tableTemplate',undefined);
        _this.jqmData('setFixHead',false);
        _this.jqmData('paginationContainer',undefined);
        _this.jqmData('toggleButton',undefined);
        _this.jqmData('columnVisibility',{});
        _this.jqmData('runAnimation',false);
        _this.jqmData('textOverflow',true);
        _this.jqmData('enableFixedColumn',true);
        _this.jqmData('updateTask',undefined);
        _this.jqmData('currentAnimations',[]);
        
        if(arg!=undefined){
            $.each(arg,(k,v)=>{
                _this.jqmData(k,v);
            })
        }
        _this.jqmData('source',_this.convertDatas())
        _this.jqmData('currentData',_this.jqmData('source'));
        _this.setFilter();
        _this.setPagination();
        _this.setTableHead();
        _this.setColumnToggle();
        _this.updateTable();
        _this.trigger('create');
    },
    setPagination:function(){
        if(this.jqmData('paginationContainer')!=undefined){
            var _this=this;
            var controlgroup=$('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" class="pagination_controlgroup"></fieldset>');
            var left_btn=$('<button class="page_btn page_btn_left" data-iconpos="notext"><i class="fa fa-angle-left "></i></button>');
            var page_btn=$('<select name="select-page" id="'+$(_this).attr('id')+'select-page" calss="page_btn"></select>')
            var right_btn=$('<button class="page_btn page_btn_right" data-iconpos="notext"><i class="fa fa-angle-right "></i></button>');
            controlgroup.append(left_btn);
            controlgroup.append(page_btn);
            controlgroup.append(right_btn);
            var exsit=$(this.jqmData('paginationContainer')).find('a');
            $(this.jqmData('paginationContainer')).empty();
            controlgroup.append(exsit);
            $(this.jqmData('paginationContainer')).append(controlgroup);
            $(this.jqmData('paginationContainer')).trigger('create');

            $.each(exsit,(i,a)=>{
                $(a).setTooltips();
            });
            $('.page_btn').on('click',function(e){
                //console.log();
                if($(this).hasClass('page_btn_left')){
                    console.log('前一页');
                    $(_this).prevPage();
                        
                }else{
                    console.log('后一页');
                    $(_this).nextPage();
                }
            });
            $(page_btn).on('change',function(e){
                console.log($(this).val());
                $(_this).gotoPage(parseInt($(this).val()));
            })

        }
    },
    setTableHead:function(){
        var _this=this;
        var template=$(this).jqmData('tableTemplate');
        if (template==undefined) return;
        keys=Object.keys(template);
        var thead=$('<thead></thead>');
        var theadtr=$('<tr></tr>');
        keys.forEach(k=>{
            var th=$('<th name="'+k+'"" style="text-align: center;vertical-align: middle;">'+template[k].label+'</th>');
            if(template[k].type=='checkbox'){
                th=$('<th name="'+k+'"" style="text-align: center;vertical-align: middle;"></th>');
                th.append($('<input class="reg-checkbox-all" style="left:0px;" type="checkbox" data-mini="true" name="item_checkbox">'));
            }
            if(template[k].isFixed){ 
                th.addClass('fixedColumn');
                if(k=='rowButtons') th.addClass('fixed-right');
            }
            if(template[k].isHidden) th.hide();
            theadtr.append(th);
        });
        thead.append(theadtr);
        
        $(this).prepend(thead);
        if(_this.jqmData('setFixHead')) {
            _this.setFixedHead();
        }else{
            _this.setSort();
        }
        _this.setCheckboxes();
    },
    setCheckboxes:function(){
        
        var _this=this;
        var checkboxAll=$($(this).jqmData('fixedHead')!=null?$(this).jqmData('fixedHead'):$(this)).find('.reg-checkbox-all');
        $(checkboxAll).on('change',function() {
            var tr=$(_this).find('tbody > tr');
            //console.log('change');
            tr.not(':hidden').find('input[type="checkbox"]').prop( "checked", $(this).prop('checked') );

        });
    
    },
    convertDatas:function(datas){
        var _this=this;
        var convertedDatas=[];
        if(datas==undefined) datas=_this.jqmData('source');
        //console.log('convertedDatas',_this.jqmData('source'));
        if(datas==undefined) {
            console.error('no data source has been set');
            return convertedDatas;
        }
        $.each(datas,(index,value)=>{
            convertedDatas.push(_this.convertData(value));
        });
        console.log('convertedDatas',convertedDatas);
        return convertedDatas;
    },
    convertData:function(data){
        var template=$(this).jqmData('tableTemplate');
        var convertedData={};
        $.each(data,(k,v)=>{
            if(template!=undefined && template.hasOwnProperty(k))
                convertedData[k]=getValueIfHaveDataRef(template[k],v);
            else
                convertedData[k]=v;
        });
        //console.log('convertedData',convertedData);
        return convertedData;
    },
    setFilter:function(){
        var _this=$(this);
        var searchInput=$($(_this).data('input'));
        if(searchInput.length>0){
            searchInput.on('paste change keyup',function(e){
                //console.log('searchInput changed');
                var input=$(this);
                
                $(_this).searchTable(input.val());
            })
        }
    },
    prevPage:function(){
        var _this=$(this);
        if(_this.jqmData('currentPage')>0){
            _this.jqmData('currentPage',_this.jqmData('currentPage')-1);
            _this.updateTable();
        }
    },
    nextPage:function(){
        var _this=$(this);
        if(_this.jqmData('currentPage')<_this.jqmData('maxPage')-1){
            _this.jqmData('currentPage',_this.jqmData('currentPage')+1);
            _this.updateTable();
        }
    },
    gotoPage:function(pageNum,isNewItem){
        $(this).jqmData('currentPage',pageNum);
        $(this).updateTable(isNewItem);
    },
    searchTable:function(searchStr){
        //console.log('searchTable',searchStr);
        var data=$.grep($(this).jqmData('source'),(d)=>{
            var hasValue=false;
            $.each(d,(k,v)=>{
                if( v!=null && v.toString().indexOf(searchStr)>-1){
                    hasValue=true;
                    return true;
                }
            })
            return hasValue;
            //console.log($.map(d, function(v, k) { return v!=null && v.toString().indexOf(input.val())>-1; }));
            //return $.map(d, function(v, k) { return v!=null && v.toString().indexOf(input.val())>-1; }).length>0;
        })
        $(this).jqmData('currentData',data);
        $(this).jqmData('currentPage',0);
        $(this).updateTable();
        /*
        if($(this).jqmData('runAnimation')){
            $(this).jqmData('runAnimation',false);
            $(this).updateTable().then(()=>{
                $(this).jqmData('runAnimation',true);
            });
        }
        */
    },
    updateTableItem:function(data){
        var _this=this;
        var template=$(this).jqmData('tableTemplate');
        var columnVisibility=_this.jqmData('columnVisibility');
        data=$(this).convertData(data);
        var newDatas=updateOriginalData($(this).jqmData('currentData'),data,'id');
        $(this).jqmData('currentData',newDatas);
        console.log('updateTableItem',$(this).jqmData('currentData'),$(this).find('tr[data-item='+data.id+'] td'))
        var dataKeys=Object.keys(data);
        //console.log('updateTableData',$(tr).find('td'));
        $.each($(this).find('tr[data-item='+data.id+'] td'),(index,td)=>{
            var id=$(td).attr('name');
            //console.log('updateTableData',id,dataKeys.includes(id));
            if(dataKeys.includes(id)){
                var newTd=_this.setTdElement(template,data,id,columnVisibility);
                $(newTd).css({'display':$(td).css('display')});
                $(td).before(newTd);
                $(td).remove();
            }
        })
        $(_this).trigger('create');
    },
    addTableItem:function(data){
        console.log($(this).jqmData('source'));
        //$(this).jqmData('source').unshift($(this).convertData(data));
        var newData=$(this).convertData(data);
        $(this).jqmData('currentData').unshift(newData);
        $(this).jqmData('maxPage',Math.ceil($(this).jqmData('currentData').length/$(this).jqmData('itemsPerPage')));
        $(this).gotoPage( 0 ,true);

    },
    restoreTableItem:function(callback){
        var checkboxAll=$($(this).jqmData('fixedHead')!=null?$(this).jqmData('fixedHead'):$(this)).find('.reg-checkbox-all');
        checkboxAll.prop('checked',false);
        var checked=$(this).find('.reg-checkbox:checked');
        checkboxAll.trigger('change');
        var deletedId=[];
        $.each(checked,(index,checkbox)=>{
            $(checkbox).closest('tr').removeClass('inactived-row');
            var itemIndex=$(this).jqmData('source').indexOf($(checkbox).jqmData('item'));
            $(this).jqmData('source')[itemIndex].isInactived=0;
            itemIndex=$(this).jqmData('currentData').indexOf($(checkbox).jqmData('item'));
            $(this).jqmData('currentData')[itemIndex].isInactived=0;
            deletedId.push($(checkbox).jqmData('item').id);
            $(checkbox).prop('checked',false);
        });
        const intervalId = setInterval(() => {
            if (deletedId.length==checked.length) {
                clearInterval(intervalId);
                if(callback!=undefined) callback(deletedId);
                
            }
        }, 100);
    },
    removeTableItem:function(isColorRemove,callback){
        
        var _this=this;
        var template=$(this).jqmData('tableTemplate');
        var nextPageSart=($(this).jqmData('currentPage')+1)*$(this).jqmData('itemsPerPage');
        var checkboxAll=$($(this).jqmData('fixedHead')!=null?$(this).jqmData('fixedHead'):$(this)).find('.reg-checkbox-all');
        
        var columnVisibility=_this.jqmData('columnVisibility');
        var tbody=$(this).find('tbody');
        var checked=$(this).find('.reg-checkbox:checked');
        var deletedId=[];
        checkboxAll.prop('checked',false);
        checkboxAll.trigger('change');
        console.log("checked id",$(checked));
        if(isColorRemove){
            
            $.each(checked,(index,checkbox)=>{
                console.log("id",$(checkbox).jqmData('item'));
                $(checkbox).closest('tr').addClass('inactived-row');
                var itemIndex=$(this).jqmData('source').indexOf($(checkbox).jqmData('item'));
                $(this).jqmData('source')[itemIndex].isInactived=1;
                itemIndex=$(this).jqmData('currentData').indexOf($(checkbox).jqmData('item'));
                $(this).jqmData('currentData')[itemIndex].isInactived=1;
                deletedId.push($(checkbox).jqmData('item').id);
                $(checkbox).prop('checked',false);
            });
        }else{
            var removedRows=[];
            var addedRows=[];
            $.each(checked,(index,checkbox)=>{
                removedRows.push($(checkbox).closest('tr'));
                //var itemIndex=$(this).jqmData('currentData').indexOf($(checkbox).jqmData('item'));
                //$(this).jqmData('currentData').splice(itemIndex,1);
                var itemIndex=$(this).jqmData('source').indexOf($(checkbox).jqmData('item'));
                $(this).jqmData('source').splice(itemIndex,1);
                itemIndex=$(this).jqmData('currentData').indexOf($(checkbox).jqmData('item'));
                $(this).jqmData('currentData').splice(itemIndex,1);
                deletedId.push($(checkbox).jqmData('item').id);
                $(checkbox).prop('checked',false);
            });
            _this.rebuiltPageIndicator();
            if (nextPageSart<$(this).jqmData('currentData').length){
                for(var i=nextPageSart;i<nextPageSart+checked.length;i++){
                
                    var tr=$('<tr></tr>');
                    var row=$(this).jqmData('currentData')[i];
                    keys.forEach(k=>{
                        tr.append(_this.setTdElement(template,row,k,columnVisibility));
                        
                    })
                    addedRows.push(tr);
                }
            }
            
            //console.log('removeTableItem',removedRows,addedItems);
            removedRows.forEach((row,index)=>{
                _this.itemRowAnimation(row,'slideout',800,function(res){
                    if(!res){
                        if(addedRows.length>0 && addedRows.length>index){
                            var newItem=addedRows[index];
                            //$(newItem).find('td').css({'padding':'0 .5em'})
                            tbody.append(newItem);
                            

                            setTimeout(() => {
                                _this.itemRowAnimation(newItem,'slidein',500,function(res){
                                });
                                
                            }, 100);
                        }
                    }
                });
                
                
            })
        }
        
        const intervalId = setInterval(() => {
            if (deletedId.length==checked.length) {
                clearInterval(intervalId);
                if(callback!=undefined) callback(deletedId);
                
            }
        }, 100);
        
    },
    removeAnimationFromPool:function(element){
        var index=$(this).jqmData('currentAnimations').indexOf(element);
        if(index>-1){
            $(this).jqmData('currentAnimations').splice(index,1);
        }
    },
    animationsControl:function(){
        var _this=this;
        if(_this.jqmData('updateTask')!=undefined) clearTimeout(_this.jqmData('updateTask')); 
        if(_this.jqmData('currentAnimations')!=undefined){
            _this.jqmData('currentAnimations').forEach(animation=>{
                $(animation).stop();
                _this.removeAnimationFromPool(animation);
            })
        }
        
        _this.jqmData('currentAnimations',[]);
    },
    itemRowAnimation:function(tr,slide,duration,callback){
        var _this=this;
        _this.jqmData('currentAnimations').push(tr);
        var tds=$(tr).find('td').wrapInner('<div />').children();
        if(slide=='slidein'){
            tds.css({'margin-top':'-70px','margin-right':'-'+(screen.width*2)+'px'})
            tds.animate({'margin-top':'0px'},duration*0.3,function(){
                if(callback!=undefined) callback(false);
                tds.animate({'margin-right':'-10px'},duration*0.7,function(){
                    tds.css({'margin-right':'0px'})
                    tds.contents().unwrap();
                    $(tr).find('td').css({'border-right':'1px solid rgba(0,0,0,.05)'});
                    _this.removeAnimationFromPool(tr);
                    if(callback!=undefined) callback(true);
                })
            })
            
            $(_this).trigger('create');
        }else if(slide=='slideout'){
            tds.css({'margin-left':'0px','margin-right':'-'+(screen.width*2)+'px'})
            tds.animate({
                'margin-left':'-'+(screen.width*2)+'px'
            },duration*0.7,function() {
                //$(this).css({'padding':'0 .5em'})
                if(callback!=undefined) callback(false);
                $(this).slideUp(duration*0.3,function() {
                    $(this).closest('tr').remove();
                    _this.removeAnimationFromPool(tr);
                    if(callback!=undefined) callback(true);
                });
            });
        }
    },
    updateSource:function(source){
        var datas=$(this).convertDatas(source);
        $(this).jqmData('source',datas);
        $(this).jqmData('currentData',$(this).jqmData('source'));
        $(this).sortColumn($(this).jqmData('currentSort'));
        $(this).updateTable();
        console.log('updateSource',$(this).jqmData('source'),datas)
    },
    rebuiltPageIndicator:function(){
        var _this=this;
        if(_this.jqmData('itemsPerPage')==0) return;

        _this.jqmData('maxPage',Math.ceil(_this.jqmData('currentData').length/_this.jqmData('itemsPerPage')));
        var pageIndicator=$('#'+$(_this).attr('id')+'select-page');
        pageIndicator.empty();
        for(var page=0;page< _this.jqmData('maxPage');page++){
            var num=$('<option value='+page+'>第'+(page+1)+'页</option>');
            if(_this.jqmData('currentPage')==page) num.prop('selected',true);
            pageIndicator.append(num);
        }
        pageIndicator.selectmenu( "refresh" );
        pageIndicator.trigger('create');
    },
    setTdElement:function(template,rowData,key,columnVisibility){
        var td;
        if(template[key].type=='supermulticombobox'||template[key].type=='supermultiinput'){
            //console.log('rowData[key]',$(this).jqmData('textOverflow'),rowData[key]);
            if($(this).jqmData('textOverflow')) {
                if(rowData[key].constructor==Array){
                    rowData[key]=rowData[key].join(",");
                }else if(rowData[key].constructor==String){
                    rowData[key]=rowData[key].replaceAll("<br/>",",");
                }
            }else{
                if(rowData[key].constructor==Array){
                    rowData[key]=rowData[key].join("<br/>");
                }else if(rowData[key].constructor==String){
                    rowData[key]=rowData[key].replaceAll(",","<br/>");
                }
                
            }
        }
        if(rowData.hasOwnProperty(key)){
            td=getTdHtml(template[key],rowData[key],key);
            
        }else{
            if(template[key].type=="checkbox" || template[key].type=="buttons"){ 
               td=getTdHtml(template[key],rowData,key);
               if(template[key].type=="checkbox"){
                //var checkboxAll=$($(this).jqmData('fixedHead')!=null?$(this).jqmData('fixedHead'):$(this)).find('.reg-checkbox-all');
                td.find('.reg-checkbox').jqmData('table',this);
               }
            }
        }
        if(td!==undefined){
            if($(this).jqmData('textOverflow')) {
                td.addClass('textOverflow');
                td.find('label').addClass('textOverflow');
                td.css({

                })
            }
            if(template[key].isFixed){ 
                td.addClass('fixedColumn');
                if(key=='rowButtons') td.addClass('fixed-right');
            }
            if(!columnVisibility.hasOwnProperty(key) || !columnVisibility[key]){
                if(td!=undefined) td.hide();
            }else{
                if(td!=undefined) td.show();
            }
            td.find('label').setTooltip();
        }
        return td;
    },
    setRowsPrePage:function(num){
        if(num<0) num=0;
        //$(this).jqmData('currentPage',0);
        $(this).jqmData('itemsPerPage',num);
        $(this).updateTable();
        /*
         if($(this).jqmData('runAnimation')){
            $(this).jqmData('runAnimation',false);
            $(this).updateTable().then(()=>{
                $(this).jqmData('runAnimation',true);
            });
        }else{
            $(this).updateTable();
        }
        */
        
    },
    hasRowAnimation:function(has){
        $(this).jqmData('runAnimation',has);
    },
    setSort:function(){
        var _this=this;
        var template=$(this).jqmData('tableTemplate');
        var ids=Object.keys(template);
        var fixedHead=$(this).jqmData('fixedHead');
        var head=$(this).find('thead');
        if(fixedHead==undefined) fixedHead=head;
        var ths=fixedHead.find('th');
        var _ths=head.find('th');
        $.each(ids,function(index,id){
            var columnData=template[id];
            if(columnData.hasOwnProperty('sortable')){
                $(ths[index]).css({'cursor':'pointer'})
                var indicator=$(ths[index]).find('i');
                if (indicator.length==0) indicator = $('<i class="fa '+(columnData.sortable.isASC?'fa-caret-up':'fa-caret-down')+'" />');
                if(id!='id') indicator.hide();
                else
                    _this.jqmData('currentSort',columnData.sortable);
                $(ths[index]).append(indicator);
                
                $(ths[index]).data('tooltip',"按"+$(ths[index]).text()+"排序");
                $(ths[index]).setTooltips();
                $(ths[index]).off('click');
                $(ths[index]).on('click',function(e){
                    
                    //$().mloader("show",{message:"排序中...."});
                    //sortColumn(columnData.sortable);
                    _this.jqmData('currentSort',columnData.sortable);
                    $(ths).find('i').hide();
                    $(_ths).find('i').hide();
                    var event=jQuery.Event("sort");
                    event.value=columnData.sortable;
                    columnData.sortable.isASC=!columnData.sortable.isASC;
                    $(_this).trigger(event);
                    $(_this).sortColumn(columnData.sortable);
                    $(this).find('i').show();
                    $(_ths[index]).find('i').show();
                    if(columnData.sortable.isASC) {
                        $(this).find('i').removeClass('fa-caret-down').addClass('fa-caret-up');
                    }else{
                        $(this).find('i').removeClass('fa-caret-up').addClass('fa-caret-down');
                    }
                });
                
            }
        });
        
    },
    refreshTable:function(){
        if($(this).jqmData('runAnimation')){
            $(this).jqmData('runAnimation',false);
            $(this).updateTable().then(()=>{
                $(this).jqmData('runAnimation',true);
            });
        }else{
            $(this).updateTable();
        }
    },

    updateTable:function(isNewItem){
        
        var _this=$(this);
        console.log('updateTask',_this.jqmData('updateTask'),_this.jqmData('currentAnimations'),_this.jqmData('currentPage'));
        _this.animationsControl();
        _this.jqmData('updateTask',setTimeout( async function() {
            //console.log('updateTask',updateTask)
            //_this.jqmData('updateTask',updateTask);
            var template=$(_this).jqmData('tableTemplate');
            var tbody=_this.find('tbody');
            if(tbody.length==0) {
                tbody=$('<tbody></tbody>');
                _this.append(tbody);
            }
            tbody.empty();
            //console.log('pagination',_this.jqmData('currentPage'),_this.jqmData('itemsPerPage'),_this.jqmData('itemsPerPage'),_this.jqmData('currentData'),isNewItem);
            _this.rebuiltPageIndicator();
            //console.log('maxPage',currentData.length/itemsPerPage,maxPage);
            
            var startPage=_this.jqmData('currentPage')*_this.jqmData('itemsPerPage');
            var endPage=startPage+_this.jqmData('itemsPerPage');
            if(_this.jqmData('itemsPerPage')==0){
                startPage=0;
                endPage=_this.jqmData('currentData').length
                $('.page_btn').hide();
                $(_this.jqmData('paginationContainer')).find('.ui-select').hide();
            }else{
                console.log({currentPage:_this.jqmData('currentPage'),maxPage:_this.jqmData('maxPage')});
                $('.page_btn').show();
                $(_this.jqmData('paginationContainer')).find('.ui-select').show();
                if(_this.jqmData('maxPage')==1){
                    $('.page_btn_right').addClass('ui-disabled');
                    $('.page_btn_left').addClass('ui-disabled');
                }else if(_this.jqmData('currentPage')==_this.jqmData('maxPage')-1) {
                    $('.page_btn_right').addClass('ui-disabled');
                    $('.page_btn_left').removeClass('ui-disabled');
                    
                }else if(_this.jqmData('currentPage')==0){
                    $('.page_btn_left').addClass('ui-disabled');
                    $('.page_btn_right').removeClass('ui-disabled');
                }else{
                    $('.page_btn_right').removeClass('ui-disabled');
                    $('.page_btn_left').removeClass('ui-disabled');
                }
            }
            
            console.log("no page",startPage,endPage,_this.jqmData('itemsPerPage'));
            var newItem;
            var tds;
            var columnVisibility=_this.jqmData('columnVisibility');
            console.log('columnVisibility',columnVisibility);
            for(var index = startPage; index < endPage; index++){
                //$.each(data,(key,value)=>{
                    var row=_this.jqmData('currentData')[index];
                    if(row==undefined) break;
                    var tr=$('<tr data-item="'+row.id+'"></tr>');
                    keys.forEach(k=>{
                        var td=_this.setTdElement(template,row,k,columnVisibility);
                       
                        tr.append(td);
                    })
                    if(row.isInactived==1) tr.addClass('inactived-row');
                    //console.log("set new item",isNewItem,index,startPage,index==startPage);
                    if(isNewItem && index==startPage && newItem==undefined) {
                        
                        //console.log("set new item",index,startPage);
                        newItem=tr;
                        $(newItem).find('td').css({'border-right':'none'})
                        tds=$(newItem).find('td').wrapInner('<div style="height:100%;" />').children();
                        tds.css({'margin-top':'-70px','margin-left':'-'+(screen.width*2)+'px'})
                        
                    }
                    tbody.append(tr);
                    tbody.trigger('create');
                    if(_this.jqmData('runAnimation') && index<15+(_this.jqmData('currentPage')*_this.jqmData('itemsPerPage'))){

                        $(_this).itemRowAnimation($(tr),'slidein',50,function(e){
                            
                        });
                        await sleep(10);
                    }
                    //console.log(itemsPerPage,index);
                    
                //})
            }
            _this.trigger('create');
            if(isNewItem && newItem!=undefined){
                
                //console.log('new item',newItem,tds.css('padding'));
                tds.animate({'margin-top':'0px'},500,function(){
                    $(newItem).find('td').css({'padding':'0'})
                    tds.animate({'margin-left':'-10px'},500,function(){
                        tds.css({'margin-left':'0px'})
                        tds.contents().unwrap();
                        $(newItem).find('td').css({'border-right':'1px solid rgba(0,0,0,.05)'})
                        $(newItem).addClass('newItem');
                        $(newItem).on('click',(e)=>{$(newItem).removeClass('newItem');$(newItem).off('click','**')});
                    })
                })
            }
        }, 0)); 
        
    },
    setTableStripe:function(isEnabled){
        if(isEnabled) $(this).addClass('table-stripe');
        else $(this).removeClass('table-stripe');
        $(this).trigger('create');
    },
    setColumnToggle:function(){
        var _this=this;
        var template=$(this).jqmData('tableTemplate');
        var toggleButton=$(this).jqmData('toggleButton');
        var ids=Object.keys(template);
        if(template==undefined || toggleButton==undefined) return;
        //console.log('tableColumnToggle',settings.template,settings.toggleButton,(settings.template.length>0 && settings.toggleButton!=undefined));
        if(ids.length>0){
            console.log('tableColumnToggle ok');
            
            var filterables={};
            var hiddenList={};
            _this.jqmData('columnVisibility',{});
            var duration=500;
            var filterPopup=$('<div data-role="popup" id="'+$(_this).attr('id')+'-columnFilter" data-theme="a" class="ui-corner-all popup-columnFilter"></div>');
            //$(that).append($(settings.toggleButton));
            $("html, body").append(filterPopup);
            $(toggleButton).on('click',function(e){
                $(filterPopup).popup('open');
                $(filterPopup).popup('reposition',{x:e.pageX,y:e.pageY});
            })
            
            
            var filterForm=$('<form></form>');
            var filterFielset=$('<fieldset data-role="controlgroup" style="margin:0px;"></fieldset>');
            //filterForm.append(filterFielset);
            filterPopup.append(filterFielset);
            
            
            filterPopup.popup({
                afterclose: function( event, ui ) {
                    //console.log(getGlobal('currentPage'));
                }
            });
        
            $.each(ids,function(index,id){
                var columnData=template[id];
                if(columnData.isFilterable){
                    _this.jqmData('columnVisibility')[id]=true;
                    filterables[id]=columnData.label;
                    hiddenList[id]=columnData.isHidden;
                    var checked=!columnData.isHidden?" checked='checked'":"";
                    var input=$('<input type="checkbox" name="'+id+'" id="'+id+'-column'+'"'+checked+'>');
                    var label=$('<label for="'+id+'-column'+'">'+columnData.label+'</label>');
                    filterFielset.append(input);
                    filterFielset.append(label);
                    input.on("click",function(e){
                        console.log('clicked')
                        //console.log( $('td[name="'+input.prop('name')+'"]'));
                        _this.setAvailableColumn(input,duration);
                        saveChangedToUser(_this);
                        //setTimeout(() => {
                            //filterPopup.trigger('columnChanged');
                        //}, duration+100);
                        
                    });
                    if(columnData.isHidden){
                        
                        _this.jqmData('columnVisibility')[id]=false;
                        $(_this).find('th[name="'+id+'"]').hide(1);
                        $(_this).find('td[name="'+id+'"]').hide(1);
                    }else{
                        $(_this).find('th[name="'+id+'"]').show(1);
                        $(_this).find('td[name="'+id+'"]').show(1);
                    }
                }else{
                    _this.jqmData('columnVisibility')[id]=true;
                }
                //hiddenList[columnData.label]=columnData.isHidden;
                //th.jqmData('isHidden',columnData.isHidden);
            });
            filterPopup.trigger('create');filterPopup.trigger('change');
            $(_this).trigger('create');
            
            
        }

    },
    setAvailableColumn:function(checkbox,duration){
        var _this=this;
        _this.jqmData('columnVisibility')[$(checkbox).prop('name')]=$(checkbox).prop('checked');
        if(!$(checkbox).prop('checked')){
            _this.jqmData('columnVisibility')[$(checkbox).prop('name')]=false;
            $(_this).find('th[name="'+$(checkbox).prop('name')+'"]').hide(duration);
            if($(_this).jqmData('fixedHead')!=undefined)$(_this).jqmData('fixedHead').find('th[name="'+$(checkbox).prop('name')+'"]').hide(duration);
            $(_this).find('td[name="'+$(checkbox).prop('name')+'"]').hide(duration);
        }else{
            _this.jqmData('columnVisibility')[$(checkbox).prop('name')]=true;
            $(_this).find('th[name="'+$(checkbox).prop('name')+'"]').show(duration);
            if($(_this).jqmData('fixedHead')!=undefined)$(_this).jqmData('fixedHead').find('th[name="'+$(checkbox).prop('name')+'"]').show(duration);
            $(_this).find('td[name="'+$(checkbox).prop('name')+'"]').show(duration);
        }
        console.log('columnVisibility',_this.jqmData('columnVisibility'));
        //setFontSize();
        //restart(1);
    },
    sortColumn:function(columnData){
        if(columnData==undefined) return;
        var data=$(this).jqmData('currentData');
        
        var source=$(this).jqmData('source');
        if (columnData.type=='number') {
            if(!columnData.isASC){
                data=data.sort(function(a,b){return getNumbers(b[columnData.id].toString())-getNumbers(a[columnData.id].toString())});
                source=source.sort(function(a,b){return getNumbers(b[columnData.id].toString())-getNumbers(a[columnData.id].toString())});
            }else{
                data=data.sort(function(a,b){return getNumbers(a[columnData.id].toString())-getNumbers(b[columnData.id].toString())});
                source=source.sort(function(a,b){return getNumbers(a[columnData.id].toString())-getNumbers(b[columnData.id].toString())});
            }
            
        }else if (columnData.type=='date') {
            if(!columnData.isASC){
                data=data.sort(function(a,b){return compareDate(a[columnData.id],b[columnData.id]);});
                source=source.sort(function(a,b){return compareDate(a[columnData.id],b[columnData.id]);});
            }else{
                data=data.sort(function(a,b){return compareDate(b[columnData.id],a[columnData.id]);});
                source=source.sort(function(a,b){return compareDate(b[columnData.id],a[columnData.id]);});
            }
        }
        $(this).jqmData('currentData',data);
        $(this).jqmData('source',source);

        console.log("sortColumn",columnData,data,source,new Date('0000-00-00 00:00:00'));
        $(this).updateTable();
    },
    setFixedHead:function(container) {
        var _this=this;
        // const resizeObserver = new ResizeObserver(entries => {
        //     for (let entry of entries) {
        //         var clones=$(entry.target).jqmData('clone');
        //         clones.forEach(clone=>{

        //             $(clone).css('width',$(entry.target).width());
        //             $(clone).css('min-width',$(entry.target).width());
        //         })
        //     }
        // });
        // //console.log('thead',table.find('thead'));
        // var _Header=$(this).find('thead').clone();
        // var _table_fixed=$('<table data-role="table" class="ui-responsive table-stroke fixed-header" style="margin: 0px 0px;text-shadow: none;width: 100%;position: fixed;z-index:100;"></table>');
        // //_Header.css({'background': '#262626',color:'white'})
        // _Header.css({'background': 'white'})
        // _table_fixed.append(_Header);
        // _table_fixed.trigger('create');
        // //_table_fixed.hide();
        // if(container!=undefined) {
        //     $(container).append(_table_fixed);
        //     $(container).trigger('create');
        // }else{

        //     $(this).parent().prepend(_table_fixed);
        //     $(this).parent().trigger('create');
        // }
        var _ths=$(this).find('thead').find('th');
        $.each( _ths,(index,th)=>{
            //$(th).jqmData('clone',[_ths[index]]);
            if(index==_ths.length-1) {
                var columnToggler=$('<i class="fa fa-gear" data-tooltip="筛选列"></i>');
                $(_ths[index]).empty();
                $(_ths[index]).removeClass('table-column-toggle');
                $(_ths[index]).append(columnToggler);
                $(_ths[index]).addClass('table-column-toggle');
                $(_ths[index]).data('tooltip',"筛选列");
                $(_ths[index]).setTooltips();
                $(_this).jqmData('toggleButton',$(_ths[index]))
                //console.log('isNormal',($(ref_ths[index]).outerWidth()/window.innerWidth>0.1),$(ref_ths[index]).outerWidth(),window.innerWidth);
                //resizeTables($(ref_ths[index]).outerWidth()/window.innerWidth>0.1,true);
            }
            //resizeObserver.observe(th);
        });
        $(this).jqmData('fixedHead',$(this));
        
        $(this).setCheckboxes();
        $(this).setSort();
        //headResizeObserver.observe(_Header.get( 0 ));
        
    },
    generateDataForExport:function(selectedColumn){
        //if(slected)\
        var _this=this;
        var template=$(this).jqmData('tableTemplate');
        var datas=_this.jqmData('currentData');
        var columnVisibility=_this.jqmData('columnVisibility');
        var newDatas=[];
        var keys=Object.keys(template);
        //var columnName=[];
        $.each(datas,(index,data)=>{
            var rowData={};
            keys.forEach(key=>{
                if(data.hasOwnProperty(key) && (selectedColumn.length>0?selectedColumn.includes(key):columnVisibility[key])){
                    var column_label=template[key].label;
                    var value=data[key];
                    
                    if(template[key].type!=undefined && template[key].type.toLowerCase()=="date"){
                        if(value=='0000-00-00 00:00:00'){
                            value='尚未设定';
                        }else{

                            if(template[key].dateFormat != undefined){
                                value=formatDateTime(new Date(value),template[key].dateFormat);
                            }else{
                                value=new Date(value).toLocaleString();
                            }
                        }
                    }
                    rowData[column_label]=value;
                    //if(!columnName.includes(column_label)) columnName.push(column_label);
                }
            })
            if(Object.keys(rowData).length>0)
                newDatas.push(rowData);
        });
        return newDatas;
    },
    setTextOverflow:function(isEnabled,fouceRefresh){
        $(this).jqmData('textOverflow',isEnabled);
        if(fouceRefresh) $(this).updateTable();
    }
});
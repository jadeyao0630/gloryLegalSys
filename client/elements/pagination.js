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
function getValueIfHaveDataRef(template,data){
    
    if(template.hasOwnProperty('data') && template.data!=undefined){
        var refData=template.data;
        //console.log('hasOwnProperty data',refData);
        if(template.type=='supermulticombobox'){
            return getSuperMultValue(template,data,false).join("<br/>");
        }else if(template.type=='supermultiinput'){
            return getSuperMultValue(template,data,true).join("<br/>");
        }else{
            var _data;
            if(template.hasOwnProperty('matchKey')){
                refData=$.grep(refData,d=>d[template.matchKey]==data);
            }else{
                refData=[refData[data]];
            }
            if(template.hasOwnProperty('valueKey')){
                if(refData.length>0) _data = refData[0][template.valueKey];
            }else{
                if(refData.length>0) _data = refData[0];
            }
            if(template.hasOwnProperty('displayFormat')){
                _data=template.displayFormat.replace('{}',_data);
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
        _this.trigger('create');
        _this.updateTable();
    },
    setPagination:function(){
        if(this.jqmData('paginationContainer')!=undefined){
            var _this=this;
            var controlgroup=$('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true"></fieldset>');
            var left_btn=$('<button class="page_btn page_btn_left" data-iconpos="notext"><i class="fa fa-angle-left "></i></button>');
            var page_btn=$('<select name="select-page" id="select-page" ></select>')
            var right_btn=$('<button class="page_btn page_btn_right" data-iconpos="notext"><i class="fa fa-angle-right "></i></button>');
            controlgroup.append(left_btn);
            controlgroup.append(page_btn);
            controlgroup.append(right_btn);
            $(this.jqmData('paginationContainer')).empty();
            $(this.jqmData('paginationContainer')).append(controlgroup);
            $(this.jqmData('paginationContainer')).trigger('create');

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
            if(template[k].isHidden) th.hide();
            theadtr.append(th);
        });
        thead.append(theadtr);
        
        $(this).prepend(thead);
        if(_this.jqmData('setFixHead')) _this.setFixedHead();
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
        datas= datas || _this.jqmData('source');
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
        $(this).jqmData('currentData',$.grep($(this).jqmData('source'),(d)=>{
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
        }));
        $(this).jqmData('currentPage',0);
        $(this).updateTable();
    },
    addTableItem:function(data){
        console.log($(this).jqmData('source'));
        $(this).jqmData('source').unshift(data);
        //$(this).jqmData('currentData').unshift(data);
        $(this).jqmData('maxPage',Math.ceil($(this).jqmData('currentData').length/$(this).jqmData('itemsPerPage')));
        $(this).gotoPage( 0 ,true);

    },
    removeTableItem:function(){
        
        var _this=this;
        var template=$(this).jqmData('tableTemplate');
        var nextPageSart=($(this).jqmData('currentPage')+1)*$(this).jqmData('itemsPerPage');
        var checkboxAll=$($(this).jqmData('fixedHead')!=null?$(this).jqmData('fixedHead'):$(this)).find('.reg-checkbox-all');
        checkboxAll.prop('checked',false);
        var columnVisibility=_this.jqmData('columnVisibility');
        var tbody=$(this).find('tbody');
        var checked=$(this).find('.reg-checkbox:checked');
        var removedRows=[];
        var addedRows=[];
        $.each(checked,(index,checkbox)=>{
            console.log($(checkbox).jqmData('item'));
            removedRows.push($(checkbox).closest('tr'));
            //var itemIndex=$(this).jqmData('currentData').indexOf($(checkbox).jqmData('item'));
            //$(this).jqmData('currentData').splice(itemIndex,1);
            var itemIndex=$(this).jqmData('source').indexOf($(checkbox).jqmData('item'));
            $(this).jqmData('source').splice(itemIndex,1);
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
            $(row).find('td').wrapInner('<div />').children().animate({
                'margin-left':'-'+(screen.width*2)+'px'
            },500,function() {
                $(this).css({'padding':'0 .5em'})
                $(this).slideUp(300,function() {
                    $(this).closest('tr').remove();
                    if($(tbody).find('tr').length==0 && addedRows.length==0) _this.prevPage();
                });
                if(addedRows.length>0 && addedRows.length>index){
                    var newItem=addedRows[index];
                    $(newItem).find('td').css({'padding':'0 .5em'})
                    tbody.append(newItem);
                    
                    var tds=$(newItem).find('td').wrapInner('<div style="height:100%" />').children();
                    tds.css({'margin-top':'-70px','margin-right':'-'+(screen.width*2)+'px'})
                    _this.trigger('create');
                    setTimeout(() => {
                        tds.animate({'margin-top':'0px'},300,function(){})
                        setTimeout(() => {
                            $(newItem).find('td').css({'padding':'.4em .5em'})
                            tds.animate({'margin-right':'-10px'},500,function(){
                                tds.css({'margin-right':'0px'})
                                tds.contents().unwrap();
                                $(newItem).find('td').css({'border-right':'1px solid lightgray'})
                            })
                        }, 100); 
                    }, 100);
                }
                
                
            });
            
        })
        
    },
    updateSource:function(source){
        var datas=$(this).convertDatas(source);
        $(this).jqmData('source',datas);
        $(this).jqmData('currentData',$(this).jqmData('source'));
        $(this).updateTable();
    },
    rebuiltPageIndicator:function(){
        var _this=this;
        _this.jqmData('maxPage',Math.ceil(_this.jqmData('currentData').length/_this.jqmData('itemsPerPage')));
        var pageIndicator=$('#select-page');
        pageIndicator.empty();
        for(var page=0;page< _this.jqmData('maxPage');page++){
            var num=$('<option value='+page+'>'+(page+1)+'</option>');
            if(_this.jqmData('currentPage')==page) num.prop('selected',true);
            pageIndicator.append(num);
        }
        pageIndicator.selectmenu( "refresh" );
    },
    setTdElement:function(template,rowData,key,columnVisibility){
        var td;
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
        if(!columnVisibility.hasOwnProperty(key) || !columnVisibility[key]){
            if(td!=undefined) td.hide();
        }
        return td;
    },
    updateTable:function(isNewItem){
        var template=$(this).jqmData('tableTemplate');
        var _this=$(this);
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
        var newItem;
        var tds;
        var columnVisibility=_this.jqmData('columnVisibility');
        for(var index=startPage;index<startPage+_this.jqmData('itemsPerPage');index++){
            //$.each(data,(key,value)=>{
                var row=_this.jqmData('currentData')[index];
                if(row==undefined) break;
                var tr=$('<tr></tr>');
                keys.forEach(k=>{
                    tr.append(_this.setTdElement(template,row,k,columnVisibility));
                })
                //console.log("set new item",isNewItem,index,startPage,index==startPage);
                if(isNewItem && index==startPage && newItem==undefined) {
                    
                    //console.log("set new item",index,startPage);
                    newItem=tr;
                    $(newItem).find('td').css({'border-right':'none','padding':'0 .5em'})
                    tds=$(newItem).find('td').wrapInner('<div style="height:100%;" />').children();
                    tds.css({'margin-top':'-70px','margin-left':'-'+(screen.width*2)+'px'})
                    
                }
                tbody.append(tr);
                //console.log(itemsPerPage,index);
                
            //})
        }
        _this.trigger('create');
        if(isNewItem && newItem!=undefined){
            
        console.log('new item',newItem,tds.css('padding'));
        tds.animate({'margin-top':'0px'},500,function(){
            $(newItem).find('td').css({'padding':'.4em .5em'})
            tds.animate({'margin-left':'-10px'},500,function(){
                tds.css({'margin-left':'0px'})
                tds.contents().unwrap();
                $(newItem).find('td').css({'border-right':'1px solid lightgray'})
                $(newItem).addClass('newTableItem');
                $(newItem).on('click',(e)=>{$(newItem).removeClass('newTableItem');$(newItem).off('click','**')});
            })
        })
        }
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
            var filterPopup=$('<div data-role="popup" data-theme="a" class="ui-corner-all"></div>');
            //$(that).append($(settings.toggleButton));
            $(this).parent().append(filterPopup);
            $(toggleButton).on('click',function(e){
                $(filterPopup).popup('open');
                $(filterPopup).popup('reposition',{x:e.pageX,y:e.pageY});
            })
            
            
            var filterForm=$('<form></form>');
            var filterFielset=$('<fieldset data-role="controlgroup" style="margin:0px;"></fieldset>');
            filterForm.append(filterFielset);
            filterPopup.append(filterForm);
            
            
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
                        //console.log( $('td[name="'+input.prop('name')+'"]'));
                        _this.setAvailableColumn(input,duration);
                        //saveChangedToUser(target);
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
        console.log(_this.jqmData('columnVisibility'));
        //setFontSize();
        //restart(1);
    },
    setFixedHead:function(container) {
        var _this=this;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                var clone=$(entry.target).jqmData('clone');
                $(clone).css('width',$(entry.target).width());
                $(clone).css('min-width',$(entry.target).width());
            }
        });
        //console.log('thead',table.find('thead'));
        var _Header=$(this).find('thead').clone();
        var _table_fixed=$('<table data-role="table" class="ui-responsive table-stroke fixed-header" style="margin: 0px 0px;text-shadow: none;width: 100%;position: fixed;z-index:100;"></table>');
        //_Header.css({'background': '#262626',color:'white'})
        _Header.css({'background': 'white'})
        _table_fixed.append(_Header);
        _table_fixed.trigger('create');
        //_table_fixed.hide();
        if(container!=undefined) {
            $(container).append(_table_fixed);
            $(container).trigger('create');
        }else{

            $(this).parent().prepend(_table_fixed);
            $(this).parent().trigger('create');
        }
        var _ths=_table_fixed.find('thead').find('th');
        $.each( $(this).find('thead').find('th'),(index,th)=>{
            $(th).jqmData('clone',_ths[index]);
            if(index==_ths.length-1) {
                var columnToggler=$('<i class="fa fa-gear" data-tooltip="筛选列"></i>');
                $(_ths[index]).empty();
                $(_ths[index]).removeClass('table-column-toggle');
                $(_ths[index]).append(columnToggler);
                $(_ths[index]).addClass('table-column-toggle');
                $(_ths[index]).data('tooltip',"筛选列");
                $(_ths[index]).setTooltips();
                $(_this).jqmData('toggleButton',columnToggler)
                //console.log('isNormal',($(ref_ths[index]).outerWidth()/window.innerWidth>0.1),$(ref_ths[index]).outerWidth(),window.innerWidth);
                //resizeTables($(ref_ths[index]).outerWidth()/window.innerWidth>0.1,true);
            }
            resizeObserver.observe(th);
        });
        $(this).jqmData('fixedHead',_table_fixed);
        //headResizeObserver.observe(_Header.get( 0 ));
        
    }
});
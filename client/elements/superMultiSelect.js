$.fn.extend({
    superMultiSelect:function(template){
        var _this=this;
        var id=$(this).attr('id');
        var placeholder=$(this).data('placeholder');
        
        var displayFormat=(template && template.displayFormat)||'{value} ({status})'
        //页面显示为一个带有计数的按钮形式
        var selectButton=$('<a href="#'+id+'-popup" id="'+id+'-button" role="button" aria-haspopup="true" data-rel="popup" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow ui-li-has-count"></a>')
        var textAndCount=$('<span>&nbsp;</span><span class="ui-li-count ui-body-inherit">0</span>');
        selectButton.append(textAndCount);
        $(this).append(selectButton);
        var ele=selectButton.find('span').not('.ui-li-count');
        ele.setTooltip();
        //点击后打开一个popup菜单
        var header=$('<div class="ui-header ui-bar-inherit"><h3 class="ui-title">'+placeholder+'</h3><a href="#" class="ui-btn ui-corner-all ui-btn-left ui-btn-icon-notext ui-icon-delete" role="button" data-rel="back"></a></div>')
        
        var selectPopupMenu=$('<div data-role="popup" id="'+id+'-popup" style="min-width:120px;padding:0px;" data-theme="a">');
        var listbox=$('<div id="'+id+'-listbox" class="ui-selectmenu ui-popup ui-body-inherit ui-overlay-shadow ui-corner-all"></div>');
        //popup主体菜单
        var listboxMenu=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+id+'-menu" role="listbox" aria-labelledby="'+id+'-button"></ul>');
        
        
        listbox.append(header);
        if(template.isFilterable) {
            listboxMenu=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+id+'-menu" role="listbox" data-filter="true" data-filter-placeholder="搜索关键字"></ul>');
        }
        listbox.append(listboxMenu);
        selectPopupMenu.append(listbox)
        $(this).append(selectPopupMenu);
        selectPopupMenu.popup({
            afterclose: function( event, ui ) {
                $(_this).setSuperLabel(displayFormat,true);
            }
        }).trigger('create');
        $(listboxMenu).superMultiSelectCheckboxRowItem(template);
        $(listboxMenu).listview().listview( "refresh" );
        $(listboxMenu).trigger( "updatelayout" );
        listboxMenu.trigger('create');
        listbox.trigger('create');
        //console.log(selectPopupMenu.html())
        if(parseInt(selectButton.find('span.ui-li-count').text())<2) selectButton.find('span.ui-li-count').hide();
    },
    superMultiInput:function(template){
        var _this=this;
        var id=$(this).attr('id');
        var placeholder=$(this).data('placeholder');
        var displayFormat=(template && template.displayFormat)||'{value} ({status})'
        //selectButton: -button 
        //selectPopupMenu: -popup 
        //listbox: -listbox 
        //listboxMenu: -menu 

        //页面显示为一个带有计数的按钮形式
        var selectButton=$('<a href="#'+id+'-popup" id="'+id+'-button" role="button" aria-haspopup="true" data-rel="popup" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow ui-li-has-count"></a>')
        var textAndCount=$('<span>&nbsp;</span><span class="ui-li-count ui-body-inherit">0</span>');
        selectButton.append(textAndCount);
        $(this).append(selectButton);
        var ele=selectButton.find('span').not('.ui-li-count');
        ele.setTooltip();
        //点击后打开一个popup菜单
        var header=$('<div class="ui-header ui-bar-inherit"><h3 class="ui-title">'+placeholder+'</h3><a href="#" class="ui-btn ui-corner-all ui-btn-left ui-btn-icon-notext ui-icon-delete" role="button" data-rel="back"></a></div>')
        var selectPopupMenu=$('<div data-role="popup" id="'+id+'-popup" style="min-width:120px;padding:0px;" data-theme="a">');
        var listbox=$('<div id="'+id+'-listbox" class="ui-selectmenu ui-popup ui-body-inherit ui-overlay-shadow ui-corner-all"></div>');
        //popup主体菜单
        var listboxMenu=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+id+'-menu" role="listbox" aria-labelledby="'+id+'-button"></ul>');
        
        if(template.isFilterable) {
            listboxMenu=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+id+'-menu" role="listbox" data-filter="true" data-filter-placeholder="搜索关键字"></ul>');
        }

        listbox.append(header);
        listbox.append(listboxMenu);
        selectPopupMenu.append(listbox)
        $(this).append(selectPopupMenu);

        //当popup菜单关闭时给计数按钮添加所选菜单标签文字
        selectPopupMenu.popup({
            afterclose: function( event, ui ) {
                $(_this).setSuperLabel(displayFormat,false);
            }
        }).trigger('create');
        listboxMenu.append($(this).superMultiSelectRowItem(0,displayFormat,$(this).getSuperValue(displayFormat)));
        $(listboxMenu).listview().listview( "refresh" );
        $(listboxMenu).trigger( "updatelayout" );
        listboxMenu.trigger('create');
        if(parseInt(selectButton.find('span.ui-li-count').text())<2) selectButton.find('span.ui-li-count').hide();
    },
    setSuperLabel:function(format,isCheckbox){//"[{catelog}] {value} ({status})"
        format=format==undefined||format=='undefined'? '{value} ({status})':format;
        var collector=[];
        var id=$(this).attr('id');
        var selectButton=$(this).find('#'+id+'-button');
        //console.log('setSuperMultiselect setSuperLabel format',format);
        var datas=$(this).getSuperValue(isCheckbox);
        //console.log('formatSuperValue datas',datas,format);
        if(datas==undefined) return;
        datas.forEach((data)=>{
            var label=format;
            var value=data.value;
            var status=data.status;
            if(format!=undefined){
                if(label.indexOf('{value}')>-1) label=label.replace('{value}',value);
                if(label.indexOf('{status}')>-1) label=label.replace('{status}',status);
                //console.log('formatSuperValue datas',label);
            }else{
                label=`${data.value} (${data.status})`;
            }
            collector.push(label);
        });
        if(collector.length>0){
            selectButton.find('span').first().text(collector.join(','));
            selectButton.find('span.ui-li-count').text(collector.length);
            if(collector.length>1) selectButton.find('span.ui-li-count').show();
            else selectButton.find('span.ui-li-count').hide();
        }else{
            selectButton.find('span').first().html('&nbsp;');
            selectButton.find('span.ui-li-count').text(collector.length);
            selectButton.find('span.ui-li-count').hide();
        }
        //console.log('setSuperLabel',$(this),collector,selectButton,selectButton.find('span'));
        $(this).trigger({
            type:"multiselectChanged",
            values:$(this).getSuperFormValue(isCheckbox,$(this).data('valueFormat')),
            id:id
        })
        return collector;
    },
    getSuperValue:function(isCheckbox){
        var id=$(this).attr('id');
        //console.log('formatSuperValue elementId',elementid);
        var listboxMenu=$('#'+id+'-menu');
        var values=[];
        
        //console.log("formatSuperValue listbox_popup",listbox_popup);
        if(isCheckbox){
            $.each(listboxMenu.find('div.ui-controlgroup').find('input:checked'),function(i,checkbox){
                //console.log('getSuperValue isCheckbox',id, isCheckbox);
                //console.log(checkbox,$(checkbox).jqmData('select'));
                var select=$($(checkbox).jqmData('select').find('option:selected'));
                values.push({
                    status:select.text(),
                    statusId:select.val(),
                    value:$(checkbox).data('label'),
                });
                //console.log(values);
            });

        }else{
            $.each(listboxMenu.find('div.ui-controlgroup'),function(i,cg){
                var input=$(cg).find('input');
                var select=$(cg).find('select > option:selected');
                //console.log("getValue input",$(select),$(input).val());
                if($(input).val().length>0){
                    values.push({
                        status:select.text(),
                        statusId:select.val(),
                        value:$(input).val(),
                    });
                    
                    
                }
                
            });
        }
            
        //console.log("formatSuperValue values",values);
        return values;
    //button_span.find('span').text(datas.join(','));
    
    },
    getSuperFormValue:function(isCheckbox,valueFormat){
        var id=$(this).attr('id');
        
        //console.log('formatSuperValue elementId',elementid);
        var listboxMenu=$('#'+id+'-menu');
        var values=[];
        
        //console.log("formatSuperValue listbox_popup",listbox_popup);
        if(isCheckbox){
            $.each(listboxMenu.find('div.ui-controlgroup').find('input:checked'),function(i,checkbox){
                //console.log('getSuperValue isCheckbox',id, isCheckbox);
                //console.log(checkbox,$(checkbox).jqmData('select'));
                var select=$($(checkbox).jqmData('select').find('option:selected'));
                if(valueFormat!=undefined){
                    values.push(valueFormat.replace('{key}',select.val()).replace('{value}',$(checkbox).data('val')));
                }else{
                    values.push(select.val()+$(checkbox).data('val'));
                }
                //console.log(values);
            });

        }else{
            $.each(listboxMenu.find('div.ui-controlgroup'),function(i,cg){
                var input=$(cg).find('input');
                var select=$(cg).find('select > option:selected');
                //console.log("getValue input",$(select),$(input).val());
                if($(input).val().length>0){
                    if(valueFormat!=undefined){
                        values.push(valueFormat.replace('{key}',select.val()).replace('{value}',$(input).val()));
                    }else{
                        values.push(select.val()+$(input).val());
                    }
                }
                
            });
        }
            
        //console.log("formatSuperValue values",values);
        return values;
    //button_span.find('span').text(datas.join(','));
    
    },
    superMultiSelectRowItem:function(idx,format,data,notLast){
        //console.log("superMultiSelectRowItem",data);
        var _this=this;
        var id=$(_this).attr('id');
        var li=$('<li data-option-index="'+idx+'" data-icon="false" class="" role="option" aria-selected="true"></li>');
        var controlgroup=$('<div data-option-index="'+idx+'" data-role="controlgroup" class="row-controlgroup" data-type="horizontal")></div>');
        var select=$('<select class="sub-selectmenu" data-corners="false"></select>');
        $.each(casePersonnelStatus,(index,status)=>{
            var opt=$('<option class="sub-option" value='+index+'>'+status+'</option>');
            if(data!=undefined) {
                if(data.statusId==index) opt=$('<option class="sub-option" value='+index+' selected>'+status+'</option>');
            }
            select.append(opt);
        })
        var input=$('<input id="mutliselect-input-0" type="text" data-wrapper-class="controlgroup-textinput ui-btn">')
        if(data!=undefined) {
            input.val(data.value);
        }
        var button=$('<button data-option-index="'+idx+'" class="ui-btn ui-btn-icon-notext ui-icon-plus btn-icon-green">添加</button>')
        if(notLast){
            button=$('<button data-option-index="'+idx+'" class="ui-btn ui-btn-icon-notext ui-icon-delete btn-icon-red">删除</button>')
        }
        
        controlgroup.append(select);
        controlgroup.append(input);
        controlgroup.append(button);
        li.append(controlgroup);
        select.on('change',function () {
            $(_this).setSuperLabel(format);
        });
        button.on('click',function(e){
            var _id=$(this).jqmData('option-index');
            var _listboxMenu=$(this).closest('ul');
            if($(this).hasClass('ui-icon-plus')){
                //添加新的一行
                _listboxMenu.append($(_this).superMultiSelectRowItem((_id+1)));
                _listboxMenu.trigger('create').listview().listview( "refresh" );
                $(this).removeClass('ui-icon-plus').addClass('ui-icon-delete');
                $(this).removeClass('btn-icon-green').addClass('btn-icon-red');
            }else{
                _listboxMenu.find('div[data-option-index="'+_id+'"]').closest('li').remove();
            }
            $(_this).setSuperLabel(format);
        });
        return li;
    },
    superMultiSelectCheckboxRowItem:function(template){
        var data=template.data;
        var _this=this;
        if(data instanceof Object){
            $.each(data,(groupName,items)=>{
                var li_divider=$('<li data-role="list-divider">'+groupName+'</li>');
                //console.log('superMultiSelectCheckboxRowItem',li_divider);
                _this.append(li_divider);
                $.each(items,(index,item)=>{
                    //if(callback!=undefined) callback()
                    var  li_item=_this.setSuperMultiSelectCheckboxItem(index,item,template,groupName);
                    if(item instanceof Object && item.isInactived) {
                        li_item.hide();
                        li_item.find('label, select, .ui-select > .ui-btn').css({color:'gray'})
                    }
                    _this.append(li_item);
                })
            });
        }else if(data instanceof Array){
            $.each(data,(index,item)=>{
                var  li_item=_this.setCheckboxControlgroup(index,item,template);
                if(item instanceof Object && item.isInactived) {
                    li_item.hide();
                    li_item.find('label, select, .ui-select > .ui-btn').css({color:'gray'})
                }
                _this.append(li_item)
                
            })
        }
        //_this.trigger('create').listview().listview('refresh');
        //console.log('superMultiSelectCheckboxRowItem',_this);
    },
    setSuperMultiSelectCheckboxItem:function(index,item,template,groupName){//index:菜单项目序列，item:菜单项目数据，template:菜单模板数据，groupName:菜单分组名
        
        var li=$('<li data-option-index="'+index+'" data-group="'+groupName+'" data-icon="false" class="" role="option" ></li>');
        
        li.append($(this).setCheckboxControlgroup(index,item,template,groupName));
        //$(this).append(li);
        return li;
    },
    setCheckboxControlgroup:function(index,item,template,groupName){
        var id=$(this).attr('id').replace('-menu','');
        groupName=groupName||'';
        var valueFormat=template.valueFormat;
        var displayFormat=template.displayFormat;
        var controlgroup=$('<div class="ui-controlgroup ui-m-controlgroup" ></div>');
        var select=$('<select data-option-index="'+index+'" class="sub-selectmenu" data-corners="false" ></select>');
        casePersonnelStatus.forEach((s,idx)=>{
            var opt=$('<option class="sub-option" value='+idx+(idx==0?" selected":"")+'>'+s+'</option>');
            select.append(opt);
        });
        controlgroup.append(select);
        select.trigger('create').selectmenu().selectmenu('refresh');

        var val=groupName+index;
        if(valueFormat!=undefined) {
            val=valueFormat.replace('{key}',groupName).replace('{id}',index);
        }
        var text=item;
        if(template.optionFormat!=undefined) {
            text=template.optionFormat;
            $.each(item,(k,v)=>{
                text=text.replace("{"+k+"}",v);
            })
        }
        var checkbox=$('<input type="checkbox" name="'+val+'" id="'+id+'-'+val+'" data-val="'+val+'" data-label="'+text+'" data-iconpos="right" data-corners="false">');
        var checkboxLabel=$('<label for="'+id+'-'+val+'" data-corners="false">'+text+'</label>');
        checkbox.jqmData('select',select);
        controlgroup.append(checkbox);
        controlgroup.append(checkboxLabel);
        select.addClass("ui-state-disabled");
        checkbox.on('change',function(e){
            if($(this).prop('checked')){
                select.removeClass("ui-state-disabled");
            }else{
                select.addClass("ui-state-disabled");
                select[0].selectedIndex = 0;
                select.selectmenu( "refresh" );
            }
            $("#"+id).setSuperLabel(displayFormat,true);
        })
        select.on('change',function () {
            $("#"+id).setSuperLabel(displayFormat,true);
        });
        return controlgroup;
    },
    setSuperMultiSelectValues:function(values,refData,valueKey,matchKey){
        var _this=this;
        //console.log('displayFormat',$(this).data('displayformat'))
        var listboxMenu=$("#"+$(_this).attr('id')+"-menu");
        var listbox=$("#"+$(_this).attr('id')+"-listbox");
        listboxMenu.find('option').prop('selected',false);
        listboxMenu.find('select').addClass("ui-state-disabled").selectmenu( "refresh" );
        listboxMenu.find('input[type="checkbox"]').prop('checked',false).checkboxradio( "refresh" );
        values.split(',').forEach(v=>{
            var formatedData=v.convertToSuperMultiSelectValue(refData,valueKey,matchKey);
            if (formatedData==undefined) return;
            var matchedCheckbox=listboxMenu.find('input[data-val="'+formatedData.catelog+formatedData.valueId+'"]');
            matchedCheckbox.prop('checked',true).checkboxradio( "refresh" );
            matchedCheckbox.jqmData('select').find('option[value="'+formatedData.statusId+'"]').prop('selected',true);
            matchedCheckbox.jqmData('select').removeClass("ui-state-disabled").selectmenu( "refresh" );
            if(matchedCheckbox.closest('li').length>0 && matchedCheckbox.closest('li').css('display')=="none") {
                matchedCheckbox.closest('li').show();
            }
            console.log("setSuperMultiSelectValues",matchedCheckbox.jqmData('select'),matchedCheckbox.closest('li'));
            
            //_this.find('option[value="'+formatedData.statusId+'"]').prop('selected',true);
        });
        $(_this).setSuperLabel($(this).data('displayformat'),true);
        listbox.trigger('create');
        listboxMenu.listview().listview('refresh');
        $(listboxMenu).trigger( "updatelayout" );
        listboxMenu.trigger('create');
        $(_this).trigger('create');
    },
    setSuperMultiInputValues:function(values){
        var _this=this;
        var listboxMenu=$("#"+$(_this).attr('id')+"-menu");
        var listbox=$("#"+$(_this).attr('id')+"-listbox");
        listboxMenu.empty();
        var valArray=values.split(',');
        valArray.forEach((v,index)=>{
            var formatedData=v.convertToSuperMultiInputValue();
            listboxMenu.append($(_this).superMultiSelectRowItem(index,$(_this).data('displayformat'),formatedData,true));
            //_this.find('option[value="'+formatedData.statusId+'"]').prop('selected',true);
        });
        listboxMenu.append($(_this).superMultiSelectRowItem(valArray.length,$(_this).data('displayformat'),undefined,false));
        listbox.trigger('create');
        listboxMenu.listview().listview('refresh');
        $(listboxMenu).trigger( "updatelayout" );
        listboxMenu.trigger('create');
        $(_this).trigger('create');
        //var format=$(_this).data('displayformat') == undefined ? '{value} ({status})':$(_this).data('displayformat');
        //console.log('displayformat',($(_this).data('displayformat') == undefined),format);
        $(_this).setSuperLabel($(_this).data('displayformat'),false);
    }
});
String.prototype.convertToSuperMultiSelectValue=function(refData,valueKey,matchKey){
    //console.log('convertToSuperMultiSelectValue',this);
    if(this==undefined || this.length==0){
        return undefined;
    }
    var numbers=getNumbers(this);
    var catelog=this;//'3个人0'----3:statusId, 个人:catelog, 0:valueId
    numbers.forEach(num=>{
        catelog=catelog.replace(num,'');
    })
    
    var statusid=0;
    var catelogid=0;
    var valueid=0;

    if(numbers.length>1){
        statusid=numbers[0];
        valueid=numbers[1];
    }else if(numbers.length==1){
        valueid=numbers[0];
    }
    var value=valueid;
    if(refData!=undefined){
        if(refData instanceof Object){
            var id=Object.keys(refData).indexOf(catelog);
            if(id>-1) catelogid=id;
            value=$.grep(refData[catelog],(v)=>v[(matchKey!=undefined?matchKey:'id')]==valueid);
            if(value.length>0) value=value[0][(valueKey!=undefined?valueKey:'name')];

        }
    }
    return {
        status:casePersonnelStatus[statusid],
        statusId:statusid,
        value:value,
        valueId:valueid,
        catelog:catelog,
        catelogId:catelogid
    }
}
String.prototype.convertToSuperMultiInputValue=function(){
    //console.log('convertToSuperMultiSelectValue',this);
    if(this==undefined || this.length==0){
        return undefined;
    }
    var numbers=getNumbers(this);
    var value=this;//'3个人0'----3:statusId, 个人:catelog, 0:valueId
    numbers.forEach(num=>{
        value=value.replace(num,'');
    })
    
    var statusid=0;

    if(numbers.length==1){
        statusid=numbers[0];
    }
    return {
        status:casePersonnelStatus[statusid],
        statusId:statusid,
        value:value,
    }
}
$.fn.extend({
    superMultiInput:function(){
        var _this=this;
        var id=$(this).attr('id');
        var placeholder=$(this).data('placeholder');
        //selectButton: -button 
        //selectPopupMenu: -popup 
        //listbox: -listbox 
        //listboxMenu: -menu 

        //页面显示为一个带有计数的按钮形式
        var selectButton=$('<a href="#'+id+'-popup" id="'+id+'-button" role="button" aria-haspopup="true" data-rel="popup" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow ui-li-has-count"></a>')
        var textAndCount=$('<span>&nbsp;</span><span class="ui-li-count ui-body-inherit"></span>');
        selectButton.append(textAndCount);
        $(this).append(selectButton);
        //点击后打开一个popup菜单
        var header=$('<div class="ui-header ui-bar-inherit"><h3 class="ui-title">'+placeholder+'</h3><a href="#" class="ui-btn ui-corner-all ui-btn-left ui-btn-icon-notext ui-icon-delete" role="button" data-rel="back"></a></div>')
        var selectPopupMenu=$('<div data-role="popup" id="'+id+'-popup" style="min-width:120px;padding:0px;" data-theme="a">');
        var listbox=$('<div id="'+id+'-listbox" class="ui-selectmenu ui-popup ui-body-inherit ui-overlay-shadow ui-corner-all"></div>');
        //popup主体菜单
        var listboxMenu=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+id+'-menu" role="listbox" aria-labelledby="'+id+'-button"></ul>');
        listboxMenu.append($(this).superMultiSelectRowItem(0,'{value} ({status})',$(this).getSuperValue('{value} ({status})')));


        listbox.append(header);
        listbox.append(listboxMenu);
        selectPopupMenu.append(listbox)
        $(this).append(selectPopupMenu);

        //当popup菜单关闭时给计数按钮添加所选菜单标签文字
        selectPopupMenu.popup({
            afterclose: function( event, ui ) {
                $(_this).setSuperLabel('{value} ({status})');
            }
        }).trigger('create');
    },
    setSuperLabel:function(format){//"[{catelog}] {value} ({status})"
        format=format|| '{value} ({status})';
        var collector=[];
        var id=$(this).attr('id');
        var selectButton=$('#'+id+'-button');
        //console.log('setSuperMultiselect setSuperLabel format',format);
        var datas=$(this).getSuperValue(id);
        //console.log('formatSuperValue datas',datas);
       if(datas==undefined) return;
        datas.forEach((data)=>{
            var label=format;
            var value=data.value;
            var status=data.status;
            if(format!=undefined){
                if(label.indexOf('{value}')>-1) label=label.replace('{value}',value);
                if(label.indexOf('{status}')>-1) label=label.replace('{status}',status);
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
        return collector;
    },
    getSuperValue:function(format){
        var id=$(this).attr('id');
        console.log('getSuperValue',id);
        //console.log('formatSuperValue elementId',elementid);
        var listboxMenu=$('#'+id+'-menu');
        var values=[];
    
        //console.log("formatSuperValue listbox_popup",listbox_popup);
        $.each(listboxMenu.find('div[data-role="controlgroup"]'),function(i,cg){
            var input=$(cg).find('input');
            
            var select=$(cg).find('select > option:selected');
            //console.log("getValue input",$(select));
            if($(input).val().length>0){
                if(format!=undefined){
                    var label=format;
                    if(label.indexOf('{value}')>-1) label=label.replace('{value}',$(input).val());
                    if(label.indexOf('{status}')>-1) label=label.replace('{status}',select.text());
                    if(label.indexOf('{statusId}')>-1) label=label.replace('{statusId}',select.val());
                    values.push(label);
                }else{
                    values.push({
                        status:select.text(),
                        statusId:select.val(),
                        value:$(input).val(),
                    });
                }
                
            }
        });
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
    }
});
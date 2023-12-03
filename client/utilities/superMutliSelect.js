var casePersonnelStatus=['无','原告','被告','被执行人','执行人'];
var value_format="{value} ({status})";
function setSuperValue(element,values,vformat){
    console.log('setSuperMultiselect setSuperValue format',vformat);
    if(vformat==undefined) vformat=value_format;
    console.log('setSuperValue value',values);
    if(values==undefined) return;
    setSuperLabel(values,element,vformat);
    var listbox_popup=$(element+'-listbox');
    var li=listbox_popup.find('li').not('.ui-li-divider');
    $(li).attr("aria-selected" , false);
    var selects=$(li).find('select');
    $(element).find('option').jqmData('statusValue',0);
    selects.prop('disabled',true);
    var a=li.find('div > a');
    //console.log('setSuperValue a',li.find('div > a'));
    a.removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
    var selected=[];
    values.forEach(value=>{
        $.each(li,(index,_li)=>{
            var a_=$(_li).find('div > a');
            var select_=$(_li).find('div > select');
            
           // console.log('setSuperValue _li',$(_li).html());
            //console.log('setSuperValue select_',select_.find('option[value='+value.statusId+']'));
            var mached = $.grep(a_,(_a)=> value.value==$(_a).text());
            //console.log('setSuperValue',select_.find('option'));
            select_.find('option').prop('selected',false);
            //console.log('setSuperValue opt',select_.find('option'));
            $(mached).removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
            if(mached.length>0){
                //console.log('select_',select_);
                $(_li).attr("aria-selected" , true);
                select_.prop('disabled',false);
                //select_.find('option[value="'+value.statusId+'"]').prop('selected',true);
                //console.log('setSuperValue option',select_.find('option[value="'+value.statusId+'"]'));
                //console.log('setSuperValue option is selected',select_.find('option[value="'+value.statusId+'"]').prop('selected'));
                selected.push(select_.find('option[value="'+value.statusId+'"]'));
            }else{
                
            }
            select_.selectmenu().selectmenu("refresh");
        });
        //console.log('setSuperValue',value.catelog+value.valueId);
        $(element).find('option[value="'+value.catelog+value.valueId+'"]').jqmData('statusValue',value.statusId);
        

    })
    console.log('setSuperValue selected',selected);
    selected.forEach((s)=>{
        $(s).prop('selected',true);
        $(s).parent().selectmenu().selectmenu("refresh");
    })
}
function formatSuperMultiSelectOptionValue(value){
        var splited=value.split('');//'3个人0'----3:statusId, 个人:catelog, 0:valueId
        var statusid=0;
        var catelogid=0;
        var valueid=0;
        var catelog=[];
        
        //console.log('formatSuperMultiSelectOptionValue Number',!isNaN(parseInt(splited[0])))
        if(!isNaN(parseInt(splited[0]))){//我方当事人状态
            statusid=Number(splited[0]);
            for(var i=1;i<splited.length-1;i++){
                catelog.push(splited[i]);
            }
        }else{
            for(var i=0;i<splited.length-1;i++){
                catelog.push(splited[i]);
            }
        }
        if(!isNaN(parseInt(splited[0]))){//我方当事人id
            valueid=Number(splited[splited.length-1]);
        }
        
        catelogid=Object.keys(casePersonnel).indexOf(catelog.join(''));
        console.log('formatSuperMultiSelectOptionValue value',value)
        console.log('formatSuperMultiSelectOptionValue catelog',catelog.join(''))
        console.log('formatSuperMultiSelectOptionValue casePersonnel',casePersonnel[catelog.join('')])
        var value=casePersonnel[catelog.join('')][valueid];
        //if(value.length>0) value=value[0].name;
        console.log('formatSuperMultiSelectOptionValue',{
            status:casePersonnelStatus[statusid],
            statusId:statusid,
            value:value,
            valueId:valueid,
            catelog:catelog.join(''),
            catelogId:catelogid
        });
        return {
            status:casePersonnelStatus[statusid],
            statusId:statusid,
            value:value,
            valueId:valueid,
            catelog:catelog.join(''),
            catelogId:catelogid
        }
}
function getSuperValue(element){

    var id=$(element).attr('id');
    var listbox_popup=$('#'+id+'-listbox');
    var button_span=$('#'+id+'-button')
    //var datas=[];
    var values=[];
    $.each(listbox_popup.find('li[aria-selected="true"]'),function(i,l){
        //console.log($(l).find('select').val());
        //console.log("getValue i",i);
        //console.log("getValue l",l);
        var index=$(l).jqmData('option-index');
        var subOptVal=$(l).find('select').val();
        var subOpt=$(l).find('select > option:selected').text();
        $.each($(element).find('option'),function(ii,opt){
            if(index==ii) {
                //datas.push("("+subOpt+") "+$(opt).text())
                values.push({
                    status:subOpt,
                    statusId:subOptVal,
                    value:$(opt).text(),
                    valueId:$(opt).val(),
                    catelog:$(l).jqmData('group'),
                    catelogId:$(l).jqmData('group-id')
                });
                //if(isSetData2MainSelect) $(opt)
            }
        });
    });
    //console.log("getValue values",values);
    return values;
    //button_span.find('span').text(datas.join(','));

}
function formatSuperValue(element,format){//"[{catelog}] {value} ({status})"
    //console.log('formatSuperValue setSuperLabel format',format);
    setSuperLabel(getSuperValue($(element)),element,format);
}
function setSuperLabel(datas,element,format){
    var collector=[];
    //console.log('setSuperMultiselect setSuperLabel format',format);
   if(datas==undefined) return;
    datas.forEach((data)=>{
        var label=format;
        var catelog=data.catelog;
        var value=data.value;
        var status=data.status;
        if(format!=undefined){
            if(label.indexOf('{catelog}')>-1) label=label.replace('{catelog}',catelog);
            if(label.indexOf('{value}')>-1) label=label.replace('{value}',value);
            if(label.indexOf('{status}')>-1) label=label.replace('{status}',status);
        }else{
            label=`[${data.catelog}] ${data.value} (${data.status})`;
        }
        //console.log('formatSuperValue data',data);
        
        //console.log('formatSuperValue format',label);
        collector.push(label);
    });
    //console.log('formatSuperValue values',collector)
    if(collector.length>0){
        $(element+'-button').find('span').first().text(collector.join(','));
        $(element+'-button').find('span').last().text(collector.length);
    }else{
        $(element+'-button').find('span').first().html('&nbsp;');
        $(element+'-button').find('span').last().text(collector.length);
    }
}
function checkIfMainSelectChecked(element,id4check){
    var val=false;
    $.each($(element).find('option'),function(ii,opt){
        //console.log($(opt).text()+"-->"+ii+"=="+id4check+"---"+$(opt).prop('selected'))
        if($(opt).prop('selected') && ii==id4check) {
            val=true;
            return false;
        }
    });
    return val;
}
$.fn.extend({
    setSuperMultiselect:function(vformat){
        //$(document).on("pagecreate", function () {
        if(vformat==undefined) vformat=value_format;
        var self=this;
        var id=$(self).attr('id');
        var listbox_popup=$('#'+id+'-listbox')
        console.log('setSuperMultiselect format',vformat);
        //console.log('setSuperMultiselect before html',$('#'+id+'-menu').html());
        $(self).parent().parent().find('.sub-selectmenu').remove();
        setSuperValue('#'+id,undefined,vformat);
        //console.log('setSuperMultiselect',id);
        //console.log('listbox',listbox);
        listbox_popup.popup({
            afterclose: function( event, ui ) {
                //console.log("closed");
                //console.log("listbox html"+listbox.html());
                var datas=getSuperValue($(self));
                
                //console.log("listbox html"+listbox.html());
                var options=$(self).find('option');
                options.prop('selected',false);
                datas.forEach((data)=>{
                    $.each(options,function(ii,opt){
                        if(data.valueId==$(opt).val()) {
                            $(opt).prop('selected',true);
                            $(opt).jqmData('statusValue',data.statusId);
                            //console.log($(opt));
                        }
                    });
                });
                //console.log("setSuperMultiselect parent",$(self).parent().parent().html());
                
            },
            afteropen: function( event, ui ) {
                /*
                $(self).filterable({
                    input: $(listbox).find("form > div > input"),
                    children: "> optgroup option[value]"
                })
                */
            }
        });
        //console.log(_this.html());
        
        var search_form=$(listbox_popup).find("form");
        search_form.find('div > input').attr('id',id+"-search");
        //var title=$(listbox).find('.ui-header.ui-bar-inherit');
        //aList.find('li').remove();
        var listbox = listbox_popup.find("ul")
        var aList=$(listbox).find("li");
        
        listbox.remove();
        listbox=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+id+'-menu" role="listbox" aria-labelledby="'+id+'-button" data-filter="true" data-input="#'+id+'-search"></ul>');
        listbox_popup.append(listbox);
        //listbox.append(title);
        //listbox.append(search);
        //listbox.jqmData('input','#'+id+"-search");
        //listbox.jqmData('filter',"true");
        
        var count=0;
        var catelog_count=-1;
        var catelog="";
        //console.log('aList',aList);
        aList.each(function () {
            var listItem = $(this);
            //console.log('aList',listItem.html());
            if(listItem.hasClass('ui-li-divider')){
                listbox.append(listItem);
                catelog=listItem.text();
                catelog_count++;
            }else{
                var a=listItem.find('a');
                var li=$('<li data-option-index="'+count+'" data-group="'+catelog+'" data-group-id="'+catelog_count+'" data-icon="false" class="" role="option" aria-selected="'+checkIfMainSelectChecked('#'+id,count)+'"></li>');
                var controlgroup=$('<div class="ui-controlgroup ui-m-controlgroup" ></div>');
                var select=$('<select data-option-index="'+count+'" class="sub-selectmenu" data-corners="false"></select>');
                casePersonnelStatus.forEach((s,idx)=>{
                    var opt=$('<option class="sub-option" value='+idx+(idx==0?" selected":"")+'>'+s+'</option>');
                    select.append(opt);
                })
                controlgroup.append(select);
                
                select.trigger('create').selectmenu().selectmenu('refresh');
                controlgroup.append(a);
                if(checkIfMainSelectChecked('#'+id,count)){
                    $(a).removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
                    select.prop('disabled',false);
                }else{
                    $(a).removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
                    select.prop('disabled',true);
                }
                li.append(controlgroup);
                //console.log('listbox',listbox.html())
                listbox.append(li);
                a.on('click',function(e){
                   
                   //_this.trigger('create').listview().listview( "refresh" );
                   $(self).selectmenu().trigger('create');
                   //console.log(li.attr("aria-selected"));
                    //$('#multiselect-button > span').text();
                    if($(this).hasClass('ui-checkbox-on')){
                        $(this).removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
                        li.attr("aria-selected" , false);

                        select.prop('disabled',true);
                    }else{
                        $(this).removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
                        select.prop('disabled',false);
                        li.attr("aria-selected" , true);
                    }
                    //console.log($('#multiselect').find(':selected').text().join(","));
                    formatSuperValue('#'+id,vformat);
                    
                })
                select.change(function () {
                    var optionSelected = $(this).find('option:selected');
                    //var optTextSelected = optionSelected.text();
                    var optValueSelected = optionSelected.val();
                    //console.log(listbox.find('li[data-option-index="'+$(this).jqmData('option-index')+'"]'));
                    if(listbox.find('li[data-option-index="'+$(this).jqmData('option-index')+'"]').attr('aria-selected')){
                        formatSuperValue('#'+id,vformat);
                    }
                    //console.log(optValueSelected);
                });
                count++;
            }
            
        });
        listbox.attr("aria-labelledby" ,id+"-button");
        formatSuperValue('#'+id,undefined,vformat);
        listbox.trigger('create').listview().listview( "refresh" );
        //console.log(listbox.html());
        
        //console.log('setSuperMultiselect after html',$(listbox_popup).html());
        $(self).trigger('create');
        
//});
    }
});

function tableColumnToggle(columnTemplate,container,target){
    var ids=Object.keys(columnTemplate);
    var filterables={};
    var hiddenList={};

    var filterBtn=$('<a href="#'+target+'-columnFilter" data-rel="popup" data-position-to="origin" class="ui-btn-right footerBtn ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-bullets ui-btn-icon-left ui-btn-a" data-transition="pop">列</a>');
    var filterPopup=$('<div data-role="popup" id="'+target+'-columnFilter" data-theme="a" class="ui-corner-all"></div>');
    
    var filterForm=$('<form></form>');
    var filterFielset=$('<fieldset data-role="controlgroup" style="margin:0px;"></fieldset>');
    filterForm.append(filterFielset);
    filterPopup.append(filterForm);
    
    $("#"+container).append(filterBtn);
    $("#"+container).append(filterPopup);

    $.each(ids,function(index,id){
        var columnData=columnTemplate[id];
        if(columnData.isFilterable){
            filterables[id]=columnData.label;
            hiddenList[id]=columnData.isHidden;
            var checked=!columnData.isHidden?" checked='checked'":"";
            var input=$('<input type="checkbox" name="'+id+'" id="'+id+'-column'+'"'+checked+'>');
            var label=$('<label for="'+id+'-column'+'">'+columnData.label+'</label>');
            filterFielset.append(input);
            filterFielset.append(label);
            input.on("click",function(e){
                //console.log( $('td[name="'+input.prop('name')+'"]'));
                if(!input.prop('checked')){
                    $("#"+target).find('th[name="'+input.prop('name')+'"]').hide(1000);
                    $("#"+target).find('td[name="'+input.prop('name')+'"]').hide(1000);
                }else{
                    $("#"+target).find('th[name="'+input.prop('name')+'"]').show(1000);
                    $("#"+target).find('td[name="'+input.prop('name')+'"]').show(1000);
                }
            });
            if(columnData.isHidden){
                $("#"+target).find('th[name="'+id+'"]').hide(1000);
                $("#"+target).find('td[name="'+id+'"]').hide(1000);
            }
        }
        //hiddenList[columnData.label]=columnData.isHidden;
        //th.jqmData('isHidden',columnData.isHidden);
    });
    filterPopup.trigger('create');filterPopup.trigger('change');
    $("#"+container).trigger('create');
}
function pageTable(arg){
    this.opt={
        data:undefined,
        template:undefined,
        containerId:undefined,
        rowButtons:undefined,
    }
    this.init(arg)
}

pageTable.prototype.init=function(arg){
    var _this=this;
    extend(this.opt,arg);
    if(_this.opt.containerId==undefined || _this.opt.template==undefined) {
        console.log("args [data, template and containerId] have to be defined...");
        return;
    }
    
    _this.buildTableColumns(_this.opt.template);
    //console.log($("#"+_this.opt.containerId).html());
    
    if(_this.opt.data!=undefined) _this.addTableData(_this.opt.data);
    $("#"+_this.opt.containerId).table().table("refresh");
    $("#"+_this.opt.containerId).trigger("create");

    function extend(opt1,opt2){
        for(var attr in opt2){
            //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
            opt1[attr] = opt2[attr];
        }
    }
}
pageTable.prototype.buildTableColumns=function(){
    var _this=this;
    var columnTemplate=_this.opt.template;
    if(!(columnTemplate instanceof Array)){
        var thead=$('<thead></thead>');
        var tr=$('<tr></tr>');
        thead.append(tr);
        var ids=Object.keys(columnTemplate);
        $.each(ids,function(index,id){
            var columnData=columnTemplate[id];
            var ws=columnData.width!=undefined?" style='width:"+(Number(columnData.width)?columnData.width+"px;'":columnData.width+"'"):"";
            var th;
            if(columnData.type=="checkbox"){
                th=$('<th'+ws+'><input class="reg-checkbox-all" type="checkbox" data-mini="true"></th>');
            }else{
                if(columnData.isFilterable){
                    th=$(`<th${ws} name="${id}" data-priority="1">${columnData.label}</th>`);
                }else{
                    th=$(`<th name="${id}">${columnData.label}</th>`);
                }
    
            }
            
            tr.append(th);
            //th.jqmData('isHidden',columnData.isHidden);
        });
        
        $("#"+_this.opt.containerId).append(thead);
    }else{
        var thead=$('<thead></thead>');
        var tr=$('<tr></tr>');
        tr.hide();
        thead.append(tr);
        $("#"+_this.opt.containerId).append(thead);
    }
    

}
pageTable.prototype.addTableData=function(data){
    var _this=this;
    var columnTemplate=_this.opt.template;
    var tbody=$('<tbody></tbody>');
    if(!(columnTemplate instanceof Array)){
        var ids=Object.keys(columnTemplate);
    
        $.each(data,function(i,d){
            var tr=$('<tr></tr>');
            $.each(ids,function(index,id){
                var td;
                if(d.hasOwnProperty(id)){
                    td=getTdElement(columnTemplate[id],d[id],id);
                    
                }else{
                    console.log("id.........."+d.id);
                    td=getTdElement(columnTemplate[id],d.id,id);
                }
                tr.append(td);
            })
            tbody.append(tr);
        });
    }else{
        $.each(data,function(i,d){
            var tr=$('<tr></tr>');
            columnTemplate.forEach(template => {
                if(template.hasOwnProperty('data')){
                    var ids=Object.keys(template.data);
                
                    var td=$('<td></td>');
                    $.each(ids,function(index,id){
                        var labelValueContainer=$('<div style="display:grid;grid-template-columns: auto auto ;"></div>');
                        td.append(labelValueContainer);
                        if(template.data[id].hasOwnProperty('label')){
                            labelValueContainer.append($('<label>'+template.data[id].label+'</label>'));
                        }
                        if(d.hasOwnProperty(id)){
                            console.log('d.hasOwnProperty');
                            console.log(template.data[id]);
                            console.log(d[id]);
                            
                            labelValueContainer.append($(getTdElement(template.data[id],d[id],id).html()));
                        }else{

                            labelValueContainer.append($(getTdElement(template.data[id],d.id,id).html()));
                        }
                    });
                    
                    tr.append(td);
                };
            });
            tbody.append(tr);
        });
    }
    
    //console.log(tbody);
    $("#"+_this.opt.containerId).append(tbody);
    
    function getTdElement(columnSettings,value,key){
        var td=$('<td name="'+key+'"></td>');
        if(columnSettings.type=="checkbox"){
            var item=$('<input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item='+value+'>');
            console.log('<input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item='+value+'>');
            td.append(item);
        }else if(columnSettings.type=="buttons"){
            if(_this.opt.rowButtons!=undefined){
                td.append($(formatString(_this.opt.rowButtons,value)));
            }
        }else if(columnSettings.type=="date"){
            console.log(value);
            val=getDateTime(value);
            if(columnSettings.dateFormat!=null) val=formatDateTime(new Date(value),columnSettings.dateFormat);
            var label=$('<label>'+val+'</label>')
            td.append(label);
        }else{ //if(columnSettings.type=="label"){
            var val=value;
            if(columnSettings.data!=undefined){
                if(columnSettings.valueKey!=undefined && 
                    columnSettings.matchKey!=undefined){
                        //console.log(columnSettings.data);
                        var itemD=columnSettings.data.filter((_itemD)=>{return _itemD.hasOwnProperty(columnSettings.matchKey) && _itemD[columnSettings.matchKey]==val});
                        if(itemD.length>0 && itemD[0].hasOwnProperty(columnSettings.valueKey)){
                            val=itemD[0][columnSettings.valueKey];
                        }
                    
                }else{
                    val=columnSettings.data[val];
                }
                
            }
            var label=$('<label>'+val+'</label>')
            td.append(label);
        }
        return td;
    }
}
pageTable.prototype.pageTable=function(command){
    var _this=this;
    if(command=="refresh"){
        $("#"+_this.opt.containerId).table().table("refresh");
        $("#"+_this.opt.containerId).trigger("create");
    }
}
function _createNewCaseForm(template, constainerId){
    
    console.log("_createNewCaseForm template");
    console.log(template);
    var main_form= new mform({template:template});
    var form=main_form.instance;
    
    const popup_form = document.getElementById(constainerId);
    $(popup_form).append(form);
    $(constainerId).trigger('create');


    return main_form;
}
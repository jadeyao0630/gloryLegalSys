function tableColumnToggle(columnTemplate,container,target){
    var ids=Object.keys(columnTemplate);
    var filterables={};
    var hiddenList={};

    var filterBtn=container;
    var filterPopup=$('<div data-role="popup" id="'+target+'-columnFilter" data-theme="a" class="ui-corner-all"></div>');
    if(container instanceof String){
        filterBtn=$('<a href="#'+target+'-columnFilter" data-rel="popup" data-position-to="origin" class="ui-btn-right footerBtn ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-bullets ui-btn-icon-left ui-btn-a" data-transition="pop">列</a>');
        $("#"+container).append($(filterBtn));
        $("#"+container).append(filterPopup);
    }else{
        filterPopup.insertAfter(filterBtn);
        $(filterBtn).on('click',function(e){
            console.log(e);
            $('#'+target+'-columnFilter').popup('open');
            $('#'+target+'-columnFilter').popup('reposition',{x:e.pageX,y:e.pageY});
        })
    }
    
    var filterForm=$('<form></form>');
    var filterFielset=$('<fieldset data-role="controlgroup" style="margin:0px;"></fieldset>');
    filterForm.append(filterFielset);
    filterPopup.append(filterForm);
    
    
    filterPopup.popup({
        afterclose: function( event, ui ) {
            console.log(getGlobal('currentPage'));
        }
      });

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
                    
                    $("#"+target+"-fixed").find('th[name="'+input.prop('name')+'"]').hide(1000);
                    $("#"+target).find('td[name="'+input.prop('name')+'"]').hide(1000);
                }else{
                    $("#"+target).find('th[name="'+input.prop('name')+'"]').show(1000);
                    $("#"+target+"-fixed").find('th[name="'+input.prop('name')+'"]').show(1000);
                    $("#"+target).find('td[name="'+input.prop('name')+'"]').show(1000);
                }
            });
            if(columnData.isHidden){
                $("#"+target).find('th[name="'+id+'"]').hide(1);
                $("#"+target+"-fixed").find('th[name="'+id+'"]').hide(1);
                $("#"+target).find('td[name="'+id+'"]').hide(1);
            }
        }
        //hiddenList[columnData.label]=columnData.isHidden;
        //th.jqmData('isHidden',columnData.isHidden);
    });
    filterPopup.trigger('create');filterPopup.trigger('change');
    if(container instanceof String){
        $("#"+container).trigger('create');
    }
    return filterPopup;
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
    $("#"+_this.opt.containerId).find('thead').remove();
    if(!(columnTemplate instanceof Array)){
        //console.log('buildTableColumns...........');
        var thead=$('<thead></thead>');
        var tr=$('<tr></tr>');
        thead.append(tr);
        var ids=Object.keys(columnTemplate);
        $.each(ids,function(index,id){
            var columnData=columnTemplate[id];
            var ws=columnData.width!=undefined?" style='width:"+(Number(columnData.width)?columnData.width+"px;'":columnData.width+"'"):"";
            var th;
            //console.log(id+": "+ws);
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
    console.log('add new tbody: ',$("#"+_this.opt.containerId).find('tbody'))
    $("#"+_this.opt.containerId).find('tbody').remove();
    var tbody=$('<tbody></tbody>');
    
    //console.log('data instanceof Array');
    //console.log(data instanceof Array);
    //console.log(data);
    //console.log('data instanceof Array');
    if(!(data instanceof Array)){
        //console.log('data instanceof Array');
        //console.log(data);
        var collect={};
        var mergedData=[];
        $.each(data,(index,d)=>{
            $.each(d,(id,val)=>{
                if(!collect.hasOwnProperty(id)) collect[id]=[];
                collect[id].push(val);
            })
            //mergedData=Object.assign({}, mergedData,d);
        });
        //console.log(collect);
        $.each(collect,(id,vals)=>{
            var merge={};
            $.each(vals,(index,val)=>{
                merge=Object.assign({}, merge,val);
            });
            mergedData.push(merge);
        })
        //console.log('mergedData');
        //console.log(mergedData);
        data=mergedData;
    }
    
    if(!(columnTemplate instanceof Array)){
        var ids=Object.keys(columnTemplate);
    
        $.each(data,function(i,d){
            var tr=$('<tr></tr>');
            $.each(ids,function(index,id){
                var td;
                if(d.hasOwnProperty(id)){
                    td=getTdElement(columnTemplate[id],d[id],id);
                    
                }else{
                    //console.log("id.........."+d.id);
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
                    var ws=template.width!=undefined?" style='width:"+(Number(template.width)?template.width+"px;'":template.width+"'"):"";
                    
                    var td=$('<td'+ws+'></td>');
                    var columnTemplate=[];
                    $.each(ids,function(index,id){
                        if(index==ids.length-1){
                            columnTemplate.push("1fr");
                        }else{
                            columnTemplate.push("auto");
                        }
                        
                    });
                    var gridStyle=' style="display:grid;grid-template-columns:'+columnTemplate.join(" ")+';"';
                    if(ids.length==1) gridStyle="";
                    var labelValueContainer=$('<div'+gridStyle+'></div>');
                    td.append(labelValueContainer);
                    $.each(ids,function(index,id){
                        
                        
                        if(template.data[id].type=="backgroundColorLabel" && template.data[id].hasOwnProperty('backgroundData') && template.data[id].backgroundData!=undefined){
                            //console.log(id,template.data[id]);

                            //console.log('backgroundData: '+template.data[id].backgroundData[template.data[id].data[d[id]]]+"--"+template.data[id].data[d[id]]);
                            td.css(template.data[id].backgroundData[template.data[id].data[d[id]]])
                        }
                        if(template.data[id].hasOwnProperty('label')){
                            var label=$('<label>'+template.data[id].label+'</label>');
                            if(template.data[id].style!=undefined) label.css(template.data[id].style);
                            labelValueContainer.append(label);
                        }
                        if(d.hasOwnProperty(id)){
                            //console.log('d.hasOwnProperty');
                            //console.log(template.data[id]);
                            //console.log(d[id]);
                            
                            labelValueContainer.append($(getTdElement(template.data[id],d[id],id).html()));
                        }else{
                            //console.log(template.data[id]);
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
        if(columnSettings.style!=undefined) td.css(columnSettings.style);
        if(columnSettings.type=="checkbox"){
            var item=$('<input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item='+value+'>');
            //console.log('<input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item='+value+'>');
            td.append(item);
        }else if(columnSettings.type=="buttons"){
            if(_this.opt.rowButtons!=undefined){
                td.append($(formatString(_this.opt.rowButtons,value)));
            }else{
                if(columnSettings.data!=undefined){
                    var container=$('<div data-role="controlgroup" data-mini="true" data-type="horizontal"></div>');
                    columnSettings.data.forEach(but=>{
                        var cls="";
                        var text="";
                        if(but.hasOwnProperty('clss')){
                            cls=but.clss;
                        }
                        if(but.hasOwnProperty('label')){
                            text=but.label;
                        }
                        var href=but.hasOwnProperty('href')?but.href:"#";
                        var btn=$('<a href="'+href+'" data-index="'+value+'" class="table-fn-btn ui-btn ui-corner-all ui-shadow '+cls+'">'+text+'</a>');
                        container.append(btn);
                        
                        //console.log(container.html());
                    })
                    td.append(container);
                }
            }
        }else if(columnSettings.type=="date"){
            //console.log(value);
            val=getDateTime(value);
            if(columnSettings.dateFormat!=null) val=formatDateTime(new Date(value),columnSettings.dateFormat);
            var label=$('<label>'+val+'</label>')
            td.append(label);
        }else if(columnSettings.type=="backgroundColorLabel"){
            var val=value;
            if(columnSettings.data!=undefined){
                val=columnSettings.data[val];
            }
            var label=$('<label>'+val+'</label>')
            td.append(label);
        }else if(columnSettings.type=="supermulticombobox"){
            var vals=value.split(',');
            var multiValues=[];
            vals.forEach(_v=>{
                var _values=formatSuperMultiSelectOptionValue(_v);
                //console.log('setSumList',_values);
                if(columnSettings.hasOwnProperty('displayFormat')){
                    var displayFormat=columnSettings.displayFormat;
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
            var label=$('<label>'+multiValues.join("<br/>")+'</label>')
            td.append(label);
        }else if(columnSettings.type=="supermultiinput"){
            var vals=value.split(',');
            var multiValues=[];
            vals.forEach(_v=>{
                var _values=formatSuperMultiSelectData(_v);
                console.log('setSumList',_values);
                if(columnSettings.hasOwnProperty('displayFormat')){
                    var displayFormat=columnSettings.displayFormat;
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
            var label=$('<label>'+multiValues.join("<br/>")+'</label>')
            td.append(label);
        }else if(columnSettings.type=="progresses"){
            var val=value;
            if(columnSettings.data!=undefined){
                var index=formatIndex(val);
                //console.log('val....');
                val=columnSettings.data[index.main];
                //console.log(columnSettings.data);
                if(val instanceof Array){
                    val=val[index.sub];
                    //console.log(val);
                }
            }
            if(val==undefined) val='未开始流程';
            var label=$('<label>'+val+'</label>')
            td.append(label);
        }else if(columnSettings.type=="progressesButton"){
            var but=new ProgressesButton({
                steps:progresses,
                deadSteps:deads,
                showLabel:true,
                //containerId:'#'+pbut.id,
                currentPosition:Number(value),
                fontSize:12,
                line_size:4,
                size:12,
                width:240,
                isViewMode:true,
                verticalGap:2,
                labelPosition:"bottom",
                showSubSteps:false,
                readOnly:true,
              });
              td.append(but.instance);
              but.instance.css({'margin-top':"-25px"})
        }
        else{ //if(columnSettings.type=="label"){
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
        if(columnSettings.style!=undefined) td.children().css(columnSettings.style);
        return td;
    }
}
pageTable.prototype.pageTable=function(command,data){
    var _this=this;
    if(command=="refresh"){
        $("#"+_this.opt.containerId).table().table("refresh");
        $("#"+_this.opt.containerId).trigger("create");
    }else if(command=="create"){
        _this.buildTableColumns();
        _this.addTableData(data);
        tableColumnToggle(_this.opt.template,"mainFooter",_this.opt.containerId);
        //console.log('pageTable data:',data);
        //$("#"+_this.opt.containerId).find('tbody').remove();
        $("#"+_this.opt.containerId).table().table("refresh");
        $("#"+_this.opt.containerId).trigger("create");
        
        $("#"+_this.opt.containerId).hpaging({ limit: 10 });
       // console.log($("#"+_this.opt.containerId).html());
    }
}
function _createNewCaseForm(template, constainerId){
    
    //console.log("_createNewCaseForm template");
    //console.log(template);
    var main_form= new mform({template:template});
    var form=main_form.instance;
    
    const popup_form = document.getElementById(constainerId);
    $(popup_form).append(form);
    $(constainerId).trigger('create');


    return main_form;
}
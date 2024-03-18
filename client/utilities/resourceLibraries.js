function resourceLibraries(parent){
    console.log('parent',parent);
    $(parent).css({'max-height':'100%'});
    $('.show-hasInactived').hide();
    $('.show-ItemActived').hide();
    parent.empty();
    var resourcesDBtemplate={
        settings:{
            hasLabel:true,
            hasPlaceHolder:true,
            labelPosition:"left",
            isCollapsibleGrouping:false,
          },
          template:{
            id:{label:'编号(不建议修改)',type:'number',width:'50px',
            isAdminOnly:true},
            name:{label:'名称',type:'text'},
            contact:{label:'联系方式',type:'text',isOptional:true},
            isInactived:{label:'状态',type:'radio',data:['启用','禁用']},
            title:{label:'职位',type:'combobox',data:resourceDatas.counselTitles_,isOptional:true,valueKey:'id',
            displayFormat:'{label}',},
            institution:{label:'法院',type:'combobox',data:resourceDatas.legalInstitution_,isOptional:true,valueKey:'id',
            displayFormat:'{name}',},
            address:{label:'地址',type:'text',isOptional:true},
            region:{label:'区域',type:'text',isOptional:true},
            lawFirm:{label:'律所',type:'combobox',data:resourceDatas.lawFirms_,isOptional:true,valueKey:'id',
            displayFormat:'{name}',},
            label:{label:'标签',type:'text'},
            rating:{label:'评分',type:'combobox',data:[{id:0,label:'未知'},{id:1,label:'不好'},{id:2,label:'一般'},{id:3,label:'好'},{id:4,label:'优秀'}],isOptional:true,valueKey:'id',
            displayFormat:'{label}',},
            expertise:{label:'专长',type:'multiCombobox',data:resourceDatas.expertises,valueKey:'id',
            displayFormat:'{name}',},
            fee:{label:'费用',type:'text',isOptional:true,defaultValue:'0.0'},
            descriptions:{label:'描述',type:'textarea',isOptional:true},
          }
    }
    var options={
        resourceDBNone:{label:"请选择库"},
        corporate_companies:{label:"我方公司",data:resourceDatas.corporateCompanies},
        corporate_partners:{label:'我方自然人',data:resourceDatas.corporatePartners},
        legal_institution:{label:'法院',data:resourceDatas.legalInstitution_},
        legal_counsels:{label:'法官',data:resourceDatas.legalCounsels_},
        law_firms:{label:"律所",data:resourceDatas.lawFirms_},
        attorneys:{label:"律师",data:resourceDatas.attorneys_},
        projects:{label:"项目",data:resourceDatas.projects_},
        caseCause:{label:"案由",data:resourceDatas.caseCauses_},
        caseReason:{label:"案发原因",data:resourceDatas.caseReason_},
    }
    var container=$('<div></div>')
    var selectorFrame=$('<div class="ui-field-contain"></div>')
    var slectorLabel=$('<label for="databaseType" style="width:80px">选择库</label>')
    var databaseSelector=$('<select id="databaseType"></select>');
    $.each(options,(key,data)=>{
        var databaseOptions=$('<option value="'+key+'">'+data.label+'</option>')
        databaseSelector.append(databaseOptions);
    })
    //selectorFrame.append(slectorLabel);
    //selectorFrame.append(databaseSelector);
    container.append(databaseSelector);
    tableContainer=$('<div style="overflow:auto;max-height:'+($(window).height()-83-94)+'px;-webkit-border-radius: .3125em;border-radius: .3125em;box-shadow: 0 0 5px rgba(0,0,0,.3)"></div>');
    var MainTable=$('<table data-role="table" id="resurcesDBTable" class="ui-body-d ui-shadow table-stripe ui-responsive" ></table>');
    tableContainer.append(MainTable);
    container.append(tableContainer);
    parent.append(container);
    var thead=$('<thead style="position:sticky;top:0;background-color:white"></thead>');
    var headTr=$('<tr></tr>');
    thead.append(headTr);
    MainTable.append(thead);
    var tbody=$('<tbody></tbody>');
    MainTable.append(tbody);
    var template=resourcesDBtemplate.template
    $('.resourcesDatabase_but').jqmData('template',resourcesDBtemplate);
    $('.resourcesDatabase_but').jqmData('item',undefined)
    $('.resourcesDatabase_but').jqmData('columns',undefined);
    $('.resourcesDatabase_but').jqmData('table',undefined);
    $('.resourcesDatabase_but').jqmData('options',undefined);
    databaseSelector.on('change',(e)=>{
        var key=$(e.target).val();
        $('.show-ItemActived').hide();
        tableContainer.css({'border':'0px solid rgba(0,0,0,.05)'});
        headTr.empty();
        tbody.empty();
        if(options.hasOwnProperty(key)&&key!="resourceDBNone"){
            console.log($(e.target).val(),options[$(e.target).val()].data)
            if(options[key].data!=undefined && options[key].data.length>0){
                
                tableContainer.css({'border':'1px solid rgba(0,0,0,.05)'});
                var columns=Object.keys(options[key].data[0]);
                $('.resourcesDatabase_but').jqmData('columns',columns);
                $('.resourcesDatabase_but').jqmData('table',key);
                $('.resourcesDatabase_but').jqmData('options',options);
                headTr.empty();
                var checkTh=$('<th style="width:50px"></th>');
                var checkbox=$('<input type="checkbox">')
                checkTh.append(checkbox)
                //headTr.append(checkTh);

                columns.forEach(column=>{
                    var label=template.hasOwnProperty(column)?template[column].label.replace('(不建议修改)',''):column;
                    console.log(template,column)
                    var th=$('<th name="'+column+'"'+(template[column].width?'style="width:'+template[column].width+'"':'')+'>'+label+'</th>');
                    th.css({'user-select':'none'});
                    headTr.append(th)
                })
                if(columns.includes('isInactived')) $('.show-hasInactived').hide();
                else $('.show-hasInactived').show();
                
                $.each(options[key].data,(index,data)=>{
                    var addTr=true;
                    var tr=$('<tr></tr>');
                    var checkbox=$('<input type="checkbox">');
                    tr.jqmData('item',data);
                    var checkTd=$('<td name="checkbox"></td>');
                    checkTd.append(checkbox);
                    
                    //tr.append(checkTd);
                    columns.forEach(column=>{
                        var value=data[column];
                        var style="";
                        if(template[column].type=='text' || template[column].type=='textarea'){
                            if(value==null || value.length==0) value="无";
                            if(column=="name" && value=="无") addTr=false;
                        }
                        else if(template[column].type=='combobox'){
                            if(template[column].data){
                                var val=template[column].data.find(d=>d.id.toString()==value);
                                value=val.hasOwnProperty('label')?val.label:val.name;
                            }
                        }
                        else if(template[column].type=='multiCombobox'){
                            if(template[column].data){
                                var val=template[column].data.filter(d=>value.split(',').includes(d.id.toString())).map(d=>d.hasOwnProperty('label')?d.label:d.name);
                                value=val.length>0?val.join(','):'未设定';
                            }
                        }
                        else if(template[column].type=='radio'){
                            if(template[column].data){
                                
                                if(Number(value)!=0) style='color:red';
                                value=template[column].data[Number(value)];
                            }
                        }
                        var td=$(`<td name="${column}"${style.length>0?' style="'+style+'"':''}>${value}</td>`);
                        td.addClass('textOverflow');
                        tr.append(td);
                    });
                    if(addTr) {
                        tbody.append(tr);
                        tr.on('click',(e)=>{
                            //console.log(e);
                            $('.resourcesDatabase_but').jqmData('item',tr.jqmData('item'))
                            tbody.find('tr').removeClass('actived-row');
                            $(tr).addClass('actived-row');
                            $('.show-ItemActived').show();
                        })
                        tr.on('dblclick',(e)=>{
                            //console.log(e);
                            $('.resourcesDatabase_but').jqmData('item',tr.jqmData('item'))
                            tbody.find('tr').removeClass('actived-row');
                            $(tr).addClass('actived-row');
                            $('.resourcesDatabase_but').trigger('click');
                        })
                    }
                })
            }

        }
        
    })

}
function resourceDBDetails(parent,target){
    $(parent).find('.ui-content').empty();
    var columns=$(target).jqmData('columns');
    var table=$(target).jqmData('table');
    var template=$(target).jqmData('template');
    var options=$(target).jqmData('options');
    var isAdd=$(target).hasClass('ui-icon-plus');
    var data=isAdd?undefined:$(target).jqmData('item');
    if(!isAdd) {
        if(data==undefined){
            $().minfo('show',{title:"提示",message:"请选择一个项。"},function(){});
            return false;
        }
        
    }else{
        //console.log('currentDB',$(target).jqmData('currentDB'));
        const maxItem = options[table].data.filter(d=>d.id!=999).reduce((prev, current) => (prev.id > current.id) ? prev : current).id+1;
        console.log('maxItem',maxItem);
        data={id:maxItem}
    }
    var title=`[${isAdd?
        options[table].label:
        ($(target).jqmData('item').hasOwnProperty('label')?
            $(target).jqmData('item').label:
            $(target).jqmData('item').name
        )
    }] ${$(target).text()}`;
    $('.resourcesDatabaseDetailsTitle').text(title)

    
    //template.template=template.template.filter(t=>t)
    var newTemplate={}
    $.each(template.template,(key,item)=>{
        console.log(item)
        if(columns.includes(key)){
            newTemplate[key]=item
        }
    })
    template.template=newTemplate;
    console.log(data,$(parent).find('.ui-content'));

    var main_form= new mform({template:template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    var form=main_form.instance;
    
    //const popup_form = document.getElementById(constainerId);
    $(parent).find('.ui-content').append(form);
    $(parent).find('.ui-content').trigger('create');
    
    if(data!=undefined) main_form.setValues(data)
    else{
        main_form.setValueById("id",data.id)
        main_form.setValueById("fee",0.0)
    }
    // columns.forEach(column=>{
    //     if(column=='id' && isAdd){
            
    //     }else{
            
    //         console.log(column=='id',getGlobalJson('currentUser').level!=adminLevel)
    //         $(parent).find('.ui-content').append(formItem(
    //             column,
    //             template.template,
    //             data?data[column]:undefined,
    //             column=='id' && getGlobalJson('currentUser').level!=adminLevel));
    //     }
        
    // })
    $(parent).find('.resourcesDBDetails-save-btn').off('click');
    $(parent).find('.resourcesDBDetails-save-btn').on('click',function(ee){
        //console.log(e.target,isAdd)
        main_form.getFormValues(function(e){
            console.log(e)
            if(e.success){
                // var orginal=options[table].data.find(d=>d.id.toString()==e.values.id.toString());
                // var isAdd=orginal==undefined;
                // if(!isAdd){
                //    var diffs=findDifferingKeys(e.values,orginal);
                    // if(diffs.includes('isInactived')){
                    //     var active=e.values.isInactived===0?"激活":"禁用";
                    // }
                // }
                // var details={
                //     table:table,
                //     id:Number(e.values.id),
                //     type:isAdd?'add':'update',
                //     descriptions:isAdd?`添加 ${e.values.id} 项`:`修改 ${e.values.id} 项`,
                // }
                // console.log(e.success,table,details)
                e.values.id=Number(e.values.id);
                insert(table,e.values,function(res){
                    console.log(res.success);
                    if(res.success){
                        $().minfo('show',{title:"提示",message:"保存完毕。请强制刷新页面使修改生效！"},function(){});
                        options[table].data=updateOriginalData(options[table].data,e.values,"id");
                        console.log(resourceDatas.attorneys_);
                        $('#databaseType').trigger('change')
                    }else{
                        $().minfo('show',{title:"提示",message:"保存出错。"+res.error},function(){});
                    }
                })
            }
        });
    });
    return true;
}
function formItem(id,template,value,isDisabled){
    console.log('isDisabled',isDisabled,id)
    value=value==null?'':value;
    console.log(value)
    var label=template[id].label;
    var type=template[id].type;
    var formItemContainer=$('<div class="ui-field-contain"></div>');
    var labelItem=$('<label for="'+id+'">'+label+(template[id].isOptional?'':'<span class="optionMark">*</span>')+'</label>');
    formItemContainer.append(labelItem);
    var item;
    if(type=="text"||type=="textarea"){
        item=$('<input type="text" name="'+id+'" id="'+id+'" placeholder="'+label+'" value="'+(value!=undefined?value:'')+'">');
    }else if(type=="radio"){
        var item=$('<fieldset data-role="controlgroup" data-type="horizontal"></fieldset>')
        if(template[id].data){
            template[id].data.forEach((d,i)=>{
                var _item=$('<input type="radio" name="'+id+"_"+i+'" id="'+id+"_"+i+'" value='+i+'>');
                var labelItem=$('<label for="'+id+"_"+i+'">'+d+'</label>');
                _item.prop('checked',Number(value)==i)
                item.append(_item);
                item.append(labelItem);
            })
            
        }
    }else if(type=="combobox"){
        item=$('<select name="'+id+'" id="'+id+'"></select>');
        if(template[id].data){
            $.each(template[id].data,(k,d)=>{
                var opt=$('<option value="'+d.id+'">'+(d.hasOwnProperty('label')?d.label:d.name)+'</option>');
                item.append(opt);
                opt.prop('selected',Number(value)==d.id)
            });
        }
    }else if(type=="multiCombobox"){
        item=$('<select name="'+id+'" id="'+id+'" multiple="multiple" data-native-menu="false"></select>');
        if(template[id].data){
            $.each(template[id].data,(k,d)=>{
                var opt=$('<option value="'+d.id+'">'+(d.hasOwnProperty('label')?d.label:d.name)+'</option>');
                item.append(opt);
                opt.prop('selected',value.split(',').includes(d.id.toString()));
            });
        }
    }
    if(item!=undefined){

        formItemContainer.append(item);
        if(isDisabled) item.prop('disabled','disabled')
    }
    
    return formItemContainer;
}

function stringFormatResources(parent){
    $(parent).empty();
    var template={
        settings:{
            hasLabel:true,
            hasPlaceHolder:true,
            labelPosition:"left",
            isCollapsibleGrouping:false,
          },
          template:{
          }
    }
    console.log(resourceDatas.string_format_,$(parent).find('.stringFormatsDBDetails-save-btn'))
    var formData={};
    $.each(resourceDatas.string_format_,(index,value)=>{
        template.template[value.id]={label:value.descriptions,type:'text'}
        formData[value.id]=value.displayFormat;
        //formData['displayFormat']=value.displayFormat;
        //formData['id']=value.id;
    })
    
    console.log(template,$(parent))
    var main_form= new mform({template:template,isAdmin:getGlobalJson('currentUser').level==adminLevel});
    var form=main_form.instance;
    
    //const popup_form = document.getElementById(constainerId);
    $(parent).append(form);
    $(parent).trigger('create');
    if(formData!=undefined) main_form.setValues(formData);
    $('#stringFormatesDatabasePage').find('.stringFormatsDBDetails-save-btn').off('click');
    $('#stringFormatesDatabasePage').find('.stringFormatsDBDetails-save-btn').on('click',function(e){
        //console.log(e.target,isAdd)
        main_form.getFormValues(function(e){
            console.log(e)
            $().mloader("show",{message:"提交中...."});
            if(e.success){
                $.each(e.values,(key,val)=>{
                    resourceDatas.string_format_.find(sf=>sf.id==key).displayFormat=val;
                });
                insertRows('string_format', resourceDatas.string_format_,function(res){
                    //result.push({success:res.success,id:sf.id});
                    console.log(res);
                    $().mloader("hide");
                    if(!res.success){
                        $().minfo('show',{title:"提示",message:"保存出错。"},function(){});
                    }else{
                        $().minfo('show',{title:"提示",message:"保存完毕。请强制刷新页面使修改生效！"},function(){});
                    }
                    
                })
                //var result=[];
                // resourceDatas.string_format_.forEach(sf=>{
                //     insert('string_format', sf,function(res){
                //         result.push({success:res.success,id:sf.id});
                //     })
                // })
                // const intervalId = setInterval(() => {
                //     if (result.length==resourceDatas.string_format_.length) {
                //         clearInterval(intervalId);
                //         $().mloader("hide");
                //         var error=result.filter(r=>!r.success).map(r=>r.id);
                //         if(error.length>0){
                //             $().minfo('show',{title:"提示",message:"保存出错。"+error.join(',')},function(){});
                //         }else{
                //             $().minfo('show',{title:"提示",message:"保存完毕。"},function(){});
                //         }
                        
                //     }
                // }, 100);
                
            }
        });
    });
}
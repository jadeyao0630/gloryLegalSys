const formatString = (template, ...args) => {
    return template.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] === 'undefined' ? match : args[index];
    });
}
function formatIndex(position){
    if(position==null) position=Number(_this.opt.currentPosition);
    var main=Math.floor(position);
    var sub=Math.round((position-main)*10);
    return {main:main,sub:sub};
}
var FormTemplate={
    settings:{
        templateColumn:"50% 50%",
        hasLabel:true,
        hasPlaceHolder:true,
        labelPosition:"left",
        width:"100%",
        textareaHeight:90,
    },
    template:{
        baseInfo:{
            label:"基础信息",
            data:{
                caseNo:{
                    placeholder:"案件编号",
                    label:"案件编号:",
                    type:"text",
                    isOptional:false,
                },
                caseName:{
                    placeholder:"案件名称",
                    label:"案件名称:",
                    type:"text",
                    isOptional:false,
                },
                caseLabel:{
                    placeholder:"案件标签",
                    label:"案件标签:",
                    type:"combobox",
                    isOptional:false,
                    data:case_labels
                },
                caseProject:{
                    placeholder:"所属项目",
                    label:"所属项目:",
                    type:"combobox",
                    isOptional:false,
                    data:projects
                },
                casePersonnel:{
                    placeholder:"我方当事人",
                    label:"我方当事人:",
                    type:"text",
                    isOptional:false,
                },
                case2ndParty:{
                    placeholder:"对方当事人",
                    label:"对方当事人:",
                    type:"text",
                    isOptional:false,
                },
                caseCatelog:{
                    placeholder:"案件类别",
                    label:"案件类别:",
                    type:"radio",
                    isOptional:false,
                    data:case_catelogs
                },
                caseType:{
                    placeholder:"案件类型",
                    label:"案件类型:",
                    type:"radio",
                    isOptional:false,
                    data:case_types
                },
                caseAttachments:{
                    placeholder:"上传文件",
                    label:"附件:",
                    type:"file",
                    isOptional:true,
                    data:"支持扩展名：rar. zip. doc. docx. pdf. jpg… 单个文件不超过200MB"
                }
            }
            
        },
        caseInfo:{
            label:"案件信息",
            data:{
                caseCause:{
                    placeholder:"案由",
                    label:"案由:",
                    type:"combobox",
                    isOptional:false,
                    data:case_causes
                },
                caseDate:{
                    placeholder:"立案日期",
                    label:"立案日期:",
                    type:"date",
                    isOptional:false,
                },
                caseOrgnization:{
                    placeholder:"受理机构",
                    label:"受理机构:",
                    type:"text",
                    isOptional:false,
                },
                caseReason:{
                    placeholder:"案发原因",
                    label:"案发原因:",
                    type:"combobox",
                    isOptional:false,
                    data:case_reason
                },
                caseLawsuit:{
                    placeholder:"本诉金额",
                    label:"本诉金额(万元);",
                    type:"text",
                    isOptional:true,
                    numberOnly:true
                },
                caseCounterclaim:{
                    placeholder:"反诉金额",
                    label:"反诉金额(万元):",
                    type:"text",
                    isOptional:true,
                    numberOnly:true
                },
                caseLawsuitRequest:{
                    placeholder:"本诉请求",
                    label:"本诉请求:",
                    type:"textarea",
                    isOptional:true,
                },
                caseCounterclaimRequest:{
                    placeholder:"反诉请求",
                    label:"反诉请求:",
                    type:"textarea",
                    isOptional:true,
                },
                caseSum:{
                    placeholder:"案件摘要",
                    label:"案件摘要:",
                    type:"textarea",
                    isOptional:true,
                },
            }
        }
    }
}
function loadCssCode(code) {
    var style = document.createElement('style')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    try {
      //for Chrome Firefox Opera Safari
      style.appendChild(document.createTextNode(code))
    } catch (ex) {
      //for IE
      style.styleSheet.cssText = code
    }
    var head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
}
function getFormItemsId(template){
    form_item_ids={};
    var catelogs=Object.keys(template.template);
    catelogs.forEach((catelog_key)=>{
        var catelog=template.template[catelog_key];
        
        if(catelog.data!=undefined && Object.keys(catelog.data).length>0){
            var catelog_item_keys=Object.keys(catelog.data);
            catelog_item_keys.forEach((item_key)=>{
                form_item_ids[item_key]=catelog.data[item_key];
            });
        }
    });
    return form_item_ids;
}
function generateForm(template,buttons){
    if(template.settings.textareaHeight != undefined){
        loadCssCode('textarea.ui-input-text {min-height: '+template.settings.textareaHeight+'px;}')
    }
    var form_width="";
    if(template.settings.textareaHeight != undefined && template.settings.textareaHeight!=Number.NaN){
        form_width=' style="width:'+template.settings.width+';"'
    }
    
    //var formItemIds=[];
    var form_container=$('<form'+form_width+'></form>');
    var catelogs=Object.keys(template.template);
    catelogs.forEach((catelog_key)=>{
        var catelog=template.template[catelog_key];
        //console.log(catelog);
        catelog_title_bar=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"></div>');

        catelog_title_bar.append($('<h4>'+catelog.label+'</h4>'));
        var catelog_item_keys=Object.keys(catelog.data);
        if(catelog.data!=undefined && catelog_item_keys.length>0){
            
            var columns=template.settings.templateColumn.split(" ");
            var row_grid=$('<div class="form_grid"></div>');
            row_grid.css({'gridTemplateColumns':template.settings.templateColumn,'padding-right':(20*(columns.length-1))+"px"});
            
            var stepControler=0;
            
            catelog_item_keys.forEach((item_key)=>{
                console.log(item_key);
                var item=catelog.data[item_key];
                //console.log(item.type);
                if(item.type!=undefined){
                    
                    var item_container=$('<div class="form_item_panel_tb"></div>');
                    if(template.settings.labelPosition != undefined && template.settings.labelPosition=="left"){
                        item_container=$('<div class="form_item_panel"></div>');
                    }
                    switch(item.type.toLowerCase()){
                        case "text":
                            generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "textarea":
                            generateTextAreaItem(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "date":
                           generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "datetime":
                            generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "time":
                            generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "tel":
                            generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "email":
                            generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "password":
                            generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                            break;
                        case "combobox":
                            generateComboBoxItem(item_container,item,item_key);
                            break;
                        case "radio":
                            generateRadioItem(item_container,item,item_key);
                            break;
                        case "file":
                            generateFileItem(item_container,item,item_key);
                            break;
                    }
                    row_grid.append(item_container);
                }
                stepControler++;
            });
        }
        catelog_title_bar.append(row_grid);
        form_container.append(catelog_title_bar);
    });
    form_container.append(buttons);
    return form_container;
}
function setOptionMark(item){
    if(item.isOptional){
        return "";
    }else{
        return '<span class="optionMark">*</span>';
    }
}
function getDateTime(dateTimeStr){
    if (dateTimeStr==undefined)
        return new Date().toISOString().substr(0,10);
    else
        return new Date(dateTimeStr).toISOString().substr(0,10);
}
function setRequired(isOptional,message){
    return isOptional?"":"required oninvalid='setCustomValidity(\""+message+"\")' oninput='setCustomValidity(\"\")'";
}
function generateInputTypeBase(item_container,item,id,hasPlaceHolder){
    //var item_container=$('<div class="form_item_panel"></div>');
    var placeholder="";
    if(hasPlaceHolder) placeholder=' placeholder="'+item.placeholder+'"';
    var val="";
    if(item.type.toLowerCase()=="date"||item.type.toLowerCase()=="time"||item.type.toLowerCase()=="datetime") val=getDateTime();
    item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'+
            '<input type="'+item.type+'" name="'+id+'" id="'+id+'"'+placeholder+'" value="'+val+'" '+setRequired(item.isOptional,"此项必须填写")+'>'));
    //return item_container;
}
function generateTextAreaItem(item_container,item,id,hasPlaceHolder){
    //var item_container=$('<div class="form_item_panel"></div>');
    var placeholder="";
    if(hasPlaceHolder) placeholder=' placeholder="'+item.placeholder+'"';
    var textarea=$('<textarea cols="40" rows="18" name="'+id+'" id="'+id+'"'+placeholder+'" '+setRequired(item.isOptional,"此项必须填写")+'></textarea>');
    
    item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
    item_container.append(textarea);
    item_container.find(".ui-input-text").css({"min-height":"90px"});
    //console.log(item_container);
    //return item_container;
}
function generateFileItem(item_container,item,id){
    //var item_container=$('<div class="form_item_panel"></div>');
    item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'+
            '<input type="file" name="'+id+'" id="'+id+'" value="" '+setRequired(item.isOptional,"此项必须填写")+'>'));
    //return item_container;
}
function generateRadioItem(item_container,item,id){
    var radio_container=$('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true"></fieldset>');
    if(item.data){
        item.data.forEach((d,counter)=>{
            var check="";
            if(counter==0){
                check='checked="checked"';
            }
            radio_container.append($('<input type="radio" name="'+id+'" id="'+id+'-'+counter+'" value="'+d+'" '+check+'>'+
                        '<label for="'+id+'-'+counter+'">'+d+'</label>'));
        });
    }
    //var item_container=$('<div class="form_item_panel"></div>');
    item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
    item_container.append(radio_container);
    //return item_container;
}
function generateComboBoxItem(item_container,item,id){
    var selectItem=$('<select name="'+id+'" id="'+id+'" '+setRequired(item.isOptional,"此项必须选择")+'></select>');
    if(item.data){
        item.data.forEach((d,counter)=>{
            selectItem.append($('<option value="'+counter+'">'+d+'</option>'));
        });
    }
    //var item_container=$('<div class="form_item_panel"></div>');
    item_container.append($('<label for="'+id+'" class="select">'+setOptionMark(item)+item.label+'</label>'));
    item_container.append(selectItem);
    //return item_container;
}
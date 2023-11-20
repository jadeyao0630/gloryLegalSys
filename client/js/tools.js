const formatString = (template, ...args) => {
    return template.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] === 'undefined' ? match : args[index];
    });
}
function formatDateTime(date, format) {
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
      a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
      A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return format;
  }
function formatIndex(position){
    if(position==null) position=Number(_this.opt.currentPosition);
    var main=Math.floor(position);
    var sub=Math.round((position-main)*10);
    return {main:main,sub:sub};
}
//#region 关于生成表单的功能
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
function collectFormValues(template,dataId,res){
    const values={"id":dataId};
    var hasError=false;
    var catelogs=Object.keys(template.template);
    catelogs.forEach((catelog_key)=>{
        var catelog=template.template[catelog_key];
        
        if(catelog.data!=undefined && Object.keys(catelog.data).length>0){
            var catelog_item_keys=Object.keys(catelog.data);
            catelog_item_keys.forEach((item_key)=>{
                //form_item_ids[item_key]=catelog.data[item_key];
                if(catelog.data[item_key].type.toLowerCase()=='radio'){
                    values[item_key]=parseInt(document.querySelector('input[name="'+item_key+'"]:checked').id.replace(item_key+"-",""));
                }else{
                    var element=document.getElementById(item_key);
                    values[item_key]=dataValidation(element,catelog.data[item_key],function(he){
                        hasError=he;
                    });
                }
            });
        }
    });
    values["caseCreateDate"]=getDateTime();
    //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
    if(sessionStorage.getItem("currentUser")==undefined && sessionStorage.getItem("currentUser").id){
        console.log("currentUser-- has error value");
        hasError=true;
    }
    values["caseApplicant"]=JSON.parse(sessionStorage.getItem("currentUser")).id;
    res(hasError,values);
}
function dataValidation(element,itemTemplate,res){
    switch (element.nodeName.toUpperCase()){
        case "INPUT":
            var val=element.value;
            //console.log(element.type);
            if(element.type.toLowerCase()=="date"||element.type.toLowerCase()=="time"||element.type.toLowerCase()=="datetime"){
                val=new Date(val).toISOString().slice(0, 19).replace('T', ' ');
            }else if(itemTemplate.numberOnly){
                if(eval.length==0) val=0;
                else val=parseInt(val);
            }
            if(val.length==0 && !itemTemplate.isOptional){
                console.log(itemTemplate.label+"-- has error value"+val);
                res(true);
            }
            return val;
        case "SELECT":
            return element.value.length==0?0:parseInt(element.value);
        case "TEXTAREA":
            return element.value;
    }
    
    res(false);
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
                //console.log(item_key);
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
//#region 创建表单元素

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
//#endregion

//#endregion 
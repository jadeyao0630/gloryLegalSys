$(function(){
    if(sessionStorage.getItem("currentUser") && JSON.parse(sessionStorage.getItem("currentUser")).name){
        let user = document.getElementById("name");
        user.innerHTML=JSON.parse(sessionStorage.getItem("currentUser")).name;
        
    }else{
        //document.body.innerHTML="没有登录。。。"
        //window.location.href = 'index.html';
    }
    
    
});


var form_item_ids={};
_createNewCaseForm(regTemplate);
function _createNewCaseForm(data){
    form_item_ids={};
    var main_catelogs=Object.keys(data);
    var main_catelogs_html="<h3>新增案件</h3>";
    main_catelogs.forEach((main_catelog)=>{
        main_catelogs_html+='<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false">';
        var catelog=data[main_catelog];
        main_catelogs_html+='<h4>'+catelog.label+'</h4>';
        if (catelog.data){
            main_catelogs_html+='<div class="ui-grid-2">';
            var item_keys=Object.keys(catelog.data);
            item_keys.forEach((item_key)=>{
                var item=catelog.data[item_key];
                form_item_ids[item_key]=item;
                if(item.type){
                    switch(item.type){
                        case "text":
                            main_catelogs_html+=_createTextItem(item,item_key);
                            break;
                        case "textarea":
                            main_catelogs_html+=_createTextAreaItem(item,item_key);
                            break;
                        case "date":
                            main_catelogs_html+=_createDateItem(item,item_key);
                            break;
                        case "combobox":
                            main_catelogs_html+=_createComboBoxItem(item,item_key);
                            break;
                        case "radio":
                            main_catelogs_html+=_createRadioItem(item,item_key);
                            break;
                        case "file":
                            main_catelogs_html+=_createFileItem(item,item_key);
                            break;
                    }
                }
            });
        }
        main_catelogs_html+='</div></div>';
    });
    main_catelogs_html+='<fieldset class="ui-grid-a">'+
                        '<div class="ui-block-a"><button type="submit" id="caseReg_but" class="ui-btn ui-corner-all ui-shadow ui-icon-check" data-rel="back">提交</button></div>'+
                        '<div class="ui-block-b"><a id="caseReg_but_cancel" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back" data-rel="back">取消</a></div>';
    const popup_form = document.getElementById("popup_form_main");
    popup_form.innerHTML=main_catelogs_html;



    const regist_but = document.getElementById("caseReg_but");
    const result={};
    regist_but.addEventListener('click', async function() {
        const dateAdded = new Date();
        var hasError=false;
        Object.keys(form_item_ids).forEach((id)=>{
            console.log(id);
            if(form_item_ids[id].type=='radio'){
                result[id]=parseInt(document.querySelector('input[name="'+id+'"]:checked').id.replace(id+"-",""));
            }else{
                
                var item=document.getElementById(id);
                //items.forEach((item)=>{
                //console.log(item.nodeName);
                switch (item.nodeName.toUpperCase()){
                    case "INPUT":
                        var val=item.value;
                        if(form_item_ids[id].type=="date"){
                            val=new Date(item.value).toISOString().slice(0, 19).replace('T', ' ');
                        }else if(form_item_ids[id].numberOnly==true){
                            if(item.value.length==0){
                                val=0;
                            }
                            else{
                                val=parseInt(item.value);
                            }
                        }
                        result[id]=val;
                        if(item.value.length==0){
                            //item.parentElement.classList.add('error-input');
                            //console.log(id+" error "+item.parentElement.dataset.isOptional);
                            
                        }
                        hasError=item.value.length==0 && form_item_ids[id].isOptional==false;
                        break;
                    case "SELECT":
                        result[id]=item.value.length==0?0:parseInt(item.value);
                        console.log(result[id]);
                        if(item.options.length>0){
                            //console.log(item.options[item.selectedIndex].text);
                        }
                        break;
                    case "TEXTAREA":
                        result[id]=item.value;
                        break;
                }
            }
                
            //});
        });
        
        result["caseCreateDate"]=dateAdded.toISOString().slice(0, 19).replace('T', ' ');
        result["caseApplicant"]=JSON.parse(sessionStorage.getItem("currentUser")).id;;
        Object.keys(form_item_ids).forEach((id)=>{
            console.log(id+": "+result[id]);
        });
        console.log("caseApplicant: "+result["caseApplicant"]);
        console.log("caseCreateDate: "+result["caseCreateDate"]);
        console.log("update to table...."+hasError);
        if(hasError){

        }else{
            await fetch("http://"+ip+":5555/insertCase",{
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ table: "cases", data:result})
            })
            .then(response => response.json())
            .then(data => {});
            history.back();
        }
        
    });
    
}
function _setOptionMark(item){
    if(item.isOptional){
        return "";
    }else{
        return '<span class="option-mark">*</span>';
    }
}
function _createTextItem(item,id){
    var required=item.isOptional?"":"required oninvalid='setCustomValidity(\"此项必须填写\")' oninput='setCustomValidity(\"\")'";
    return '<div class="ui-grid-sub2">'+
            '<label for="'+id+'">'+_setOptionMark(item)+item.label+'</label>'+
            '<input type="text" name="'+id+'" id="'+id+'" placeholder="'+item.placeholder+'" value="" '+required+'>'+
            '</div>';
}
function _createTextAreaItem(item,id){
    var required=item.isOptional?"":"required oninvalid='setCustomValidity(\"此项必须填写\")' oninput='setCustomValidity(\"\")'";
    return '<div class="ui-grid-sub2-textarea">'+
            '<label for="'+id+'">'+_setOptionMark(item)+item.label+'</label>'+
            '<textarea cols="40" rows="8" name="'+id+'" id="'+id+'" placeholder="'+item.placeholder+'" '+required+'></textarea>'+
            '</div>';
}
function _createDateItem(item,id){
    var required=item.isOptional?"":"required oninvalid='setCustomValidity(\"此项必须填写\")' oninput='setCustomValidity(\"\")'";
    return '<div class="ui-grid-sub2">'+
            '<label for="'+id+'">'+_setOptionMark(item)+item.label+'</label>'+
            '<input type="date" name="'+id+'" id="'+id+'" placeholder="'+item.placeholder+'" value="" '+required+'>'+
            '</div>';
}
function _createFileItem(item,id){
    var required=item.isOptional?"":"required oninvalid='setCustomValidity(\"此项必须填写\")' oninput='setCustomValidity(\"\")'";
    return '<div class="ui-grid-sub2">'+
            '<label for="'+id+'">'+_setOptionMark(item)+item.label+'</label>'+
            '<input type="file" name="'+id+'" id="'+id+'" value="" '+required+'>'+
            '</div>';
}
function _createRadioItem(item,id){
    var radio_html='<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">';
    var l_index=['a','b','c','d','e','f','g']
    if(item.data){
        var counter=0;
        item.data.forEach((d)=>{
            var check="";
            if(counter==0){
                check='checked="checked"';
            }
            radio_html+='<input type="radio" name="'+id+'" id="'+id+'-'+counter+'" value="'+d+'" '+check+'>'+
                        '<label for="'+id+'-'+counter+'">'+d+'</label>';
            counter++;
        });
    }
    radio_html+='</fieldset>';
    return '<div class="ui-grid-sub2">'+
            '<label for="'+id+'">'+_setOptionMark(item)+item.label+'</label>'+radio_html+
            '</div>';
}
function _createComboBoxItem(item,id){
    var required=item.isOptional?"":"required oninvalid='setCustomValidity(\"此项必须选择\")' oninput='setCustomValidity(\"\")'";
    var options_html="";
    if(item.data){
        var counter=0;
        item.data.forEach((d)=>{
            options_html+='<option value="'+counter+'">'+d+'</option>';
            counter++;
        });
    }
    return '<div class="ui-grid-sub2">'+
            '<label for="'+id+'" class="select">'+_setOptionMark(item)+item.label+'</label>'+
            '<select name="'+id+'" id="'+id+'" '+required+'>'+options_html+'</select>'+
            '</div>';
}

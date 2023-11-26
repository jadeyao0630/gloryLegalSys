function _initRegTable(table_data,table_columns,containerId){
    //console.log("table created: "+table_data);
    const container = document.getElementById(containerId);
    container.innerHTML=_getTableHTML(table_data,table_columns);
    $(container).trigger('create');
    
    //#region 操作按钮
    
    
//#endregion
}
function _getTableHTML(data,columnData){
    //if(data.length==0) return "";
    var keys=data.length==0?Object.keys(columnData):Object.keys(data[0]);
    var columns_keys=Object.keys(columnData);
    var hasHeaderSet=false;
    var table_body_str="";
    var body_row_str="";
    var body_str="";
    
    var function_buts='<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
                    '<button name="fn_btn_details" class="btn-icon-green" data-icon="eye" data-iconpos="notext" data-item={0}>查看</button>'+
                    '<button href="#fullscreenPage" name="fn_btn_edit" class="btn-icon-blue" data-icon="edit" data-iconpos="notext" data-item={0}>修改</button>'+
                    '<button name="fn_btn_delete" class="btn-icon-red" data-icon="delete" data-iconpos="notext" data-item={0}>删除</button>'+
                '</div>';
    var offset=keys.length-columns_keys.length;
    let header_str="";
    columns_keys.forEach((column,counter)=>{
        var ws=column.width!=undefined?" style='width:"+column.width+"px;'":"";
            if(counter<2){
                if(counter==0){
                    header_str+=`<th${ws}><input class="reg-checkbox-all" type="checkbox" data-mini="true"></th>`;
                }
                header_str+=`<th${ws}>${columnData[column].label}</th>`;
            }else{
                header_str+=`<th${ws} data-priority="${counter-1}">${columnData[column].label}</th>`;
            }
            if (counter==keys.length-1-offset){
                header_str+=`<th${ws}>操作</th>`;
            }
        
    });
    table_body_str+='<thead><tr>'+header_str+'</thead></tr>';
    data.forEach((item)=>{
        body_row_str="";
        var counter=0;
        columns_keys.forEach((column)=>{
            console.log(column+"---"+keys.includes(column));
            console.log(columnData[column]);
            if(keys.includes(column)){
                
                if (counter==0){
                    body_row_str+=`<td><input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item=${item["id"]}></td>`;
                } 
                if(columnData[column].data){
                    if(column=="caseApplicant"){
                        console.log(columnData[column].data[parseInt(item[column])]);
                        body_row_str+=`<td>${columnData[column].data[parseInt(item[column])].name}</td>`;
                    }else
                        body_row_str+=`<td>${columnData[column].data[parseInt(item[column])]}</td>`;
                }else{
                    if(column=="caseCreateDate")
                        body_row_str+=`<td>${formatDateTime(new Date(item[column]),'yyyy年MM月dd日')}</td>`;
                    else if(column=="caseApplicant"){
                        console.log(parseInt(item[column]));
                        var user=getGlobalJson("userList").filter((user)=>user.id==parseInt(item[column]));
                        if(user.length>0)
                            body_row_str+=`<td>${user[0].name}</td>`;
                    }
                    else
                        body_row_str+=`<td>${item[column]}</td>`;
                }
                //console.log(keys);
                //console.log(counter+"=="+(keys.length-1));
                if (counter==keys.length-1-offset){
                    //console.log(formatString(function_buts,item["id"]));
                    body_row_str+=`<td>${formatString(function_buts,item["id"])}</td>`;
                }
                counter++;
            }
    
            
        }); 
        body_str+='<tr>'+body_row_str+'</tr>';
        counter=0;
    });
    table_body_str+='<tbody>'+body_str+'</tbody>';
    return table_body_str;
}
function _createNewCaseForm(template, constainerId){
    var main_form= new mform({template:template});
    var form=main_form.instance;
    
    const popup_form = document.getElementById(constainerId);
    //popup_form.innerHTML+=form.html();
    /*
    form.append($('<fieldset class="ui-grid-a">'+
    '<div class="ui-block-a"><button type="submit" id="caseReg_but" class="ui-btn ui-corner-all ui-shadow ui-icon-check case-reg-but">提交</button></div>'+
    '<div class="ui-block-b"><a id="caseReg_but_cancel" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back case-reg-but">取消</a></div></fieldset>'));
    */
    //form.css({padding:"10px 20px"});
    //$("#add_case_popup").children().remove();
    //$(popup_form).html('<h3 id="reg_form_title">新增案件</h3>');
    $(popup_form).append(form);
    /*
    $(popup_form).append($('<div class="progress_lock edit-info hide">'+
                            '<div class="ui-input-btn ui-btn ui-icon-lock ui-btn-icon-notext ui-corner-all ui-shadow btn-icon-red ui-but-lock-edit">'+
                                '<input type="button" data-enhanced="true" value="锁">'+
                            '</div></div>'));
                            */
    //$("#add_case_popup").css({"min-width":"1000px"});

    $(constainerId).trigger('create');

    //#region 按钮点击事件

/*
    //表格 提交 和 取消 按钮
    $('.case-reg-but').on('click',function(e){
        //console.log(e.currentTarget);
        if(e.currentTarget.id=="caseReg_but_cancel"){
            //_setBlurBackgroundVisibility(false);
        }else if(e.currentTarget.id=="caseReg_but"){
            /*
            main_form.instance.getValues(sessionStorage.getItem("currentId"),FormTemplate.template,function(message,values){
                if(values.success){
                    console.log(message.message);
                    values.data["caseCreateDate"]=getDateTime();
                    //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
                    if(getGlobalJson("currentUser")==null || getGlobalJson("currentUser")==undefined){
                        SendMessage("错误: "+error.FORM_INVALID_USER.message,"是否跳转到登录页面？",function(){
                            //HideMessage();
                            window.location.href = 'index.html';
                        });
                    }else{
                        values.data["caseApplicant"]=getGlobalJson("currentUser").id;
                        values.data["isReadOnly"]=_isReadOnlyCurrentForm();
                        
                        showLoading("保存中...");
                        //console.log(values);
                        insertCase(values.data,function(r){
                            //console.log(r);
                            if(r.success){
                                console.log("修改添加成功。");
                                SendMessage("提示","保存完成。",function(){
                                    _setBlurBackgroundVisibility(false);
                                    location.reload();
                                },true);
                                
                            }else{
                                console.log(r);
                                SendMessage("错误",r.error,function(){},true);
                            }
                            hideLoading();
                        });
                    }
                    
                    
                }else{
                    console.log(message.message+(message.id==0?" 但是有错误。":""));
                }
            });
            
        
        }
    });
    */
    //表格 编辑锁按钮
    $('.ui-but-lock-edit').on('click',function(e){
        requestPassword("提示",'这里是需要管理员密码的。',function(e){
            //HideMessage();
            console.log(e==auth_code);
            if(e==auth_code){
                var id=sessionStorage.getItem("currentId");
                var datas=baseData.filter(d=>d.id==id);
                if(datas.length>0){
                    var data=datas[0];
                    data.isReadOnly=!Boolean(data.isReadOnly);
                    $().mloder("show",{message:"保存中..."});
                    _setFormReadOnly(data.isReadOnly);
                    data['caseCreateDate']=getDateTime();
                    data['caseDate']=getDateTime(data.caseDate);
                    insertCase(data,function(r){
                        //console.log(r);
                        if(r.success){
                            console.log("修改isReadOnly为"+data.isReadOnly);
                        }else{
                            console.log(r);
                            $().minfo("show",{title:"错误",message:r.error});
                        }
                        $().mloder("hide");
                    });
                }
            }else{
                console.log("密码无效。");
                setTimeout(function() {
                    SendMessage("错误","密码无效。",function(){
                        //HideMessage();
                        
                    },true);
                  }, 100);
            }
            
        },true);
        
        
    });
      //#endregion
    return main_form;
}
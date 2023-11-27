function addClickEvents(main_form,r){
    var checkboxes = document.querySelectorAll("input[type=checkbox][name=item_checkbox]")
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {

            console.log(checkbox.dataset.item);

        
        })
    });

    var checkbox_main = document.querySelector(".reg-checkbox-all")
    checkbox_main.addEventListener('change', function() {

        console.log(document.querySelectorAll("input[type=checkbox][name=item_checkbox]:checked"));


    });
    $("#reg_form_title").on('click',function(e){
        console.log(e);
        $().requestDialog({
            title:'提示',
            message:'这里是需要管理员密码的。',
            content:$('<input type="password" value="" placeholder="请输入密码">')
        },function(form){
            if($(form).find('input').val()==auth_code){
                console.log("登陆成功。。")
                var id=getGlobal("currentId");
                var datas=r.filter(d=>d.id==id);
                if(datas.length>0){
                    console.log(Boolean(datas[0].isReadOnly));
                    datas[0].isReadOnly=!Boolean(datas[0].isReadOnly);
                    console.log(datas[0].isReadOnly);
                    if(datas[0].isReadOnly) $("#reg_form_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+"查看档案");
                    else $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                    $().mloader("show",{message:"保存中..."});
                    //_setFormReadOnly(data.isReadOnly);
                    console.log(getGlobalJson('mainData'));
                    main_form.readOnly(datas[0].isReadOnly);
                    datas[0]['caseCreateDate']=getDateTime();
                    datas[0]['caseDate']=getDateTime(datas[0].caseDate);
                    insertCase(datas[0],function(r){
                        //console.log(r);
                        if(r.success){
                            console.log("修改isReadOnly为"+datas[0].isReadOnly);
                        }else{
                            console.log(r);
                            //SendMessage("错误",r.error,function(){
                                //HideMessage();
                                
                            //},true);
                        }
                        $().mloader("hide");
                    });
                }
            }else{
                $().minfo("show",{message:'密码无效。'});
            }
        });
    })
    var fn_buts = document.querySelectorAll("button[name^=fn_btn]")
    fn_buts.forEach(function(fn_but) {
        fn_but.addEventListener('click', function(but) {

            console.log(but.currentTarget.dataset.item+"--"+but.currentTarget.name);
            //console.log(table_data[fn_but.dataset.item]);
            var matchItems=r.filter((item) =>item.id == but.currentTarget.dataset.item);
            var caseNos=[];
            matchItems.forEach(_item=>{
                caseNos.push(_item.caseNo);
            });
            if(but.currentTarget.name=="fn_btn_delete"){
                //console.log(table_data);
                /*
                SendMessage('提醒',"确认删除案件编号[ "+caseNos.join(',')+" ]吗？",function(e){
                    if(e.currentTarget.id=="message_confirm_but"){
                        if(matchItems.length>0){
                            table_data.splice(table_data.indexOf(matchItems[0]),1);
                        }
                        
                        _initRegTable(table_data,table_columns);
                        $(document.getElementById("table1")).trigger('create');
                    }
                    HideMessage();
                });
                */
                
            }else if(but.currentTarget.name=="fn_btn_edit"){
                if(matchItems.length>0){
                    var loader=$().mloader("show",{message:"读取中...."});
                    //_showEditForm(matchItems[0]);//naviation.js
                    
                    $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                    setGlobal("currentId", matchItems[0].id);
                    //_setBlurBackgroundVisibility(true);
                    $.mobile.navigate( $(this).attr( "href" ));
                    setTimeout(function() {
                        main_form.readOnly(matchItems[0].isReadOnly).setData(matchItems[0]);
                        if(matchItems[0].isReadOnly) $("#reg_form_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+"查看档案");
                        else $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                        $().mloader("hide");
                    }, 500);
                    
                    //$('.progress_lock.edit-info').removeClass('hide');
                    //_setFormReadOnly(data.isReadOnly);
                    //_setBlurBackgroundVisibility(true);
                    
                }
                //console.log($("#popup_form_main"));
            }else if(but.currentTarget.name=="fn_btn_details"){
                if(matchItems.length>0){
                    //_setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,matchItems[0].id);
                }
                //console.log($("#popup_form_main"));
            }
        
        })
    });
    $('.case_reg_but').on('click',async function(e){
        e.preventDefault();
        if(this.id=="case_reg_but_add"){
            $().mloader("show",{message:"读取中...."});
            await getCaseLatestIndex().then(id=>{
                
                sessionStorage.setItem("currentId", id+1);
                
                //main_form.readOnly(false);
                //main_form.instance.setEmptyData(FormTemplate.template);
                //main_form.readOnly(false).setEmptyData();
                //main_form.instance.setEmptyData()
                //
                
                //main_form.readOnly(false).setEmptyData();
                $('.progress_lock.edit-info').addClass('hide');
                //console.log($('.progress_lock.edit-info'));
                $("#reg_form_title").html("新增档案");
                
                //_setBlurBackgroundVisibility(true);
                $.mobile.navigate( $(this).attr( "href" ));
                setTimeout(function() {
                    main_form.readOnly(false).setEmptyData();
                    $().mloader("hide");
                }, 500);
                //main_form.setData(getGlobalJson("mainData")[0]);
                //$("#fullscreenPage").trigger('create');
                //main_form.instance.trigger('create');
            });
            
        }
    })
}

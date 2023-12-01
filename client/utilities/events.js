function addClickEvents(main_form,r){
    var progressInfoForm;
    var currentProgress={};
    //#region 全局功能按钮
    var list=['corporateCompanies'];
    //list=undefined;
    $('.popup-add-table').on('click',function(e){
        createBasicDatabase();
    });
    $('.popup-read-table').on('click', function(e){
        //getBasicDatabaseData(list).then(res=>console.log(res));

    });
    $('.popup-add-row').on('click', function(e){
        insertBasicDatabaseData(list);
    });
    //#endregion

    //#region page 1 table 的 checkbox 和 按钮 事件
    setCheckAllBox($('.reg-checkbox-all'),'pageOneTable');
    //#endregion

    //#region page 2 checkbox
    setCheckAllBox($('#mainFooter').find('input[type="checkbox"]'),'pageSecondTable');
    $('#progress_popupMenu').find('a').on('click',function(e){
        $('#progress_popupMenu').popup('close');
        switch($(this).text()){
            case '查看':
                $( "#update_panel" ).panel( "open" );
                break;
        }
    })
    $('#pageSecondTable').find('.table-fn-btn').on('click',function(e){
        console.log($(this).jqmData('index')+"---"+$(this).text());
        var index=$(this).jqmData('index');
        var matchedData=getGlobalJson("mainDataStatus").filter((d)=>d.id==index);
        var matchedMainData=r.filter((d)=>d.id==index);
        switch($(this).text()){
            case '编辑':
                $().mloader("show",{message:"读取中...."});
                $("#progress_details").empty();
                $("#progress_diagram").empty();
                setGlobal("currentId",index);
                progressInfoForm=_createNewCaseForm(progress_form_template,"progress_details");
                
                $.mobile.navigate( '#progress');
                if(matchedMainData.length>0){
                    console.log(matchedMainData[0].caseNo);
                    if(matchedMainData[0].isReadOnly) {
                        $("#progress_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+matchedMainData[0]['caseNo']);
                        $('.edit-header-btn[name="save_btn"').hide();
                    }
                    else {
                        $("#progress_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+matchedMainData[0]['caseNo']);
                        $('.edit-header-btn[name="save_btn"').show();
                    }
                    var status_val=-1;
                    var data3=[{}];
                    var data4=[{}];
                    if(matchedData.length>0){
                        progressInfoForm.setData(matchedData[0]).readOnly(matchedMainData[0].isReadOnly);
                        data3=table_progress_executes.filter((d)=>d.id==index);
                        data4=table_progress_updates.filter((d)=>d.id==index);
                        //$("#progress_diagram").empty();
                        status_val=Number(matchedData[0].caseStatus);
                        
                    }else{
                        progressInfoForm.setEmptyData();
                    }
                    var but=new ProgressesButton({
                        steps:progresses,
                        deadSteps:deads,
                        showLabel:true,
                        containerId:'#progress_diagram',
                        currentPosition:status_val,
                        fontSize:15,
                        line_size:4,
                        size:30,
                        width:840,
                        hasShadow:true,
                        isViewMode:true,
                        //verticalGap:2,
                        //labelPosition:"bottom",
                        showSubSteps:true,
                        readOnly:matchedMainData[0].isReadOnly,
                        showCounter:true,
                        counterData:data3.concat(data4),
                    });
                    currentProgress['currentDiagramButton']=but;
                    $(but.instance).on("itemOnClicked",  function (e){
                        console.log(e);
                        currentProgress['targetPosition']=e.position;
                        currentProgress['originalPosition']=formatIndex(but.opt.currentPosition);
                        currentProgress['isReadOnly']=matchedMainData[0].isReadOnly;
                        

                        //$( "#update_panel" ).panel( "open" );
                        var title=progresses[e.Position.main] instanceof Array?progresses[e.Position.main][e.Position.sub]:progresses[e.Position.main];
                        $("#progress_popupMenu_title").text('请选择对 '+title+' 的操作');
                        if(matchedMainData[0].isReadOnly) $('#progress_popupMenu_add').hide();
                        else $('#progress_popupMenu_add').show();
                        $("#progress_popupMenu").trigger('create');
                        $("#progress_popupMenu").popup('open');
                        $("#progress_popupMenu").popup('reposition',{x:e.event.pageX,y:e.event.pageY});
                        console.log($("#progress_popupMenu"));
                    });
                    $("#progress_diagram").trigger('create');
                    $("#progress_details").trigger('create');
                }
                //setTimeout(function() {
                    $().mloader("hide");
                //},5000);
                $("#progress_details").trigger('create');
                

                
                break;
            case '查看':
                console.log('查看');
                console.log(matchedData);
                showProgressDetails(matchedMainData,matchedData);
                break;
        }
    });
    //#endregion
    //表格内每行的功能按钮事件
    var fn_buts = document.querySelectorAll("[name^=fn_btn]")
    fn_buts.forEach(function(fn_but) {
        //console.log($(fn_but));
        //if(fn_but.name=="fn_btn_details") $(fn_but).jqmData('transition','slidefade');
        fn_but.addEventListener('click', function(but) {

            console.log(but.currentTarget.dataset.item+"--"+but.currentTarget.name);
            //console.log(table_data[fn_but.dataset.item]);
            var matchItems=r.filter((item) =>item.id == but.currentTarget.dataset.item);
            var matchedData=getGlobalJson("mainDataStatus").filter((d)=>d.id==but.currentTarget.dataset.item);
            var caseNos=[];
            matchItems.forEach(_item=>{
                caseNos.push(_item.caseNo);
            });
            if(but.currentTarget.name=="fn_btn_delete"){
                $().requestDialog({
                    title:'提示',
                    message:"确认删除案件编号[ "+caseNos.join(',')+" ]吗？",
                },function(form){
                    console.log("删除");
                    if(matchItems.length>0){
                        $('#pageOneTable').removeTableItem(r,matchItems[0]);
                        removeCase(matchItems[0].id,'cases',(r)=>{console.log});
                    }
                    
                    //_initRegTable(r,firstPageTableColumns,"pageOneTable");
                    
                    //$("#pageOneTable").hpaging({ limit: 5 });
                    //$("#pageOneTable").trigger('create');
                });
                
            }else if(but.currentTarget.name=="fn_btn_edit"){
                if(matchItems.length>0){
                    var loader=$().mloader("show",{message:"读取中...."});
                    //_showEditForm(matchItems[0]);//naviation.js
                    var _this=this;
                    $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                    setGlobal("currentId", matchItems[0].id);
                    //_setBlurBackgroundVisibility(true);
                    $.mobile.navigate( $(_this).attr( "href" ));
                    setTimeout(function() {
                        //console.log(matchItems[0]);
                        //main_form.setData(matchItems[0]);
                        //main_form.readOnly(false);
                        //
                        //console.log("data-role------"+$('.edit-header-btn[name="save_btn"').jqmData('role'));
                        main_form.setData(matchItems[0]);
                        main_form.readOnly(matchItems[0].isReadOnly);
                        if(matchItems[0].isReadOnly) {
                            $("#reg_form_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+"查看档案");
                            $('.edit-header-btn[name="save_btn"').hide();
                        }
                        else {
                            $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                            $('.edit-header-btn[name="save_btn"').show();
                        }
                        
                        $().mloader("hide");
                    }, 500);
                    //$('.progress_lock.edit-info').removeClass('hide');
                    //_setFormReadOnly(data.isReadOnly);
                    //_setBlurBackgroundVisibility(true);
                    
                }
                //console.log($("#popup_form_main"));
            }else if(but.currentTarget.name=="fn_btn_details"){
                showProgressDetails(matchItems,matchedData);
                
            }
        
        })
    });
    //表格上添加删除按钮事件
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
                $('.edit-header-btn[name="save_btn"').show();
                //_setBlurBackgroundVisibility(true);
                $.mobile.navigate( $(this).attr( "href" ));
               // main_form.readOnly(false).setEmptyData();
                    //$().mloader("hide");
                setTimeout(function() {
                    main_form.readOnly(false).setEmptyData();
                    
                    $().mloader("hide");
                }, 500);
                //main_form.setData(getGlobalJson("mainData")[0]);
                //$("#fullscreenPage").trigger('create');
                //main_form.instance.trigger('create');
            });
            
        }else if(this.id=="case_reg_but_remove"){
            //console.log($('#pageOneTable').find('input[type="checkbox"][name="item_checkbox"]:checked'));
            var checked=$('#pageOneTable').find('input[type="checkbox"][name="item_checkbox"]:checked');
            if(checked.length>0){
                $().requestDialog({
                    title:'提示',
                    message:"确认删除所选案件吗？",
                },function(form){
                    console.log("删除");
                    var matcheds=[];
                    $.each($('#pageOneTable').find('input[type="checkbox"][name="item_checkbox"]:checked'),function(index,check){
                        //console.log($(check).data('item'));
                        var matched=r.filter((d)=>{return d.id==$(check).data('item')});
                        if(matched.length>0){
                            matcheds.push(matched[0]);
                        }
                        
                    });
                    if(matcheds.length>0){
                        $('#pageOneTable').removeTableItems(r,matcheds);
                        $('.reg-checkbox-all').prop("checked",false);

                    }
                    //_initRegTable(r,firstPageTableColumns,"pageOneTable");
                    
                    //$("#pageOneTable").hpaging({ limit: 5 });
                    //$("#pageOneTable").trigger('create');
                });
            }
            
           
        }
    })
    //#endregion

    //#region 查看信息页面的按钮事件
    function showProgressDetails(datas,stauts){
        if(datas.length>0){
            //window.location="./test/timeline.html"
            $("#summary_list").children().remove();
            if(datas.length>0){
                _data.basic=datas[0];
            }
            if(datas[0].id>30){
                if(stauts.length>0){
                    _data.progressStatus=stauts[0];
                }
                _data.excuteStatus=[];
                _data.propertyStatus=[];
                _data.attachments=[];
            }
            
            var canvas=document.getElementById('myCanvas');
            eventManager.setCanvas(canvas);
            var _ctx=canvas.getContext('2d');
            _ctx.clearRect(0, 0, canvas.width, canvas.height);
            new timelinePage({template:_summary_template,data:_data,summaryListContainer:"#summary_list",canvas:canvas});
            $("#summary_list").trigger('create');
            $.mobile.navigate( "#timeline");
            //$("#page4").removeClass('hide');
            //$(getGlobal('currentPage')).addClass('hide');
            //_setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,matchItems[0].id);
        }
    }
    //只读锁按钮事件
    function lockEvent(e){
        var _this=this;
        $().requestPassword(function(res){
            if(res.success){
                console.log("登陆成功。。")
                var id=getGlobal("currentId");
                var datas=r.filter(d=>d.id==id);
                if(datas.length>0){
                    //console.log(Boolean(datas[0].isReadOnly));
                    datas[0].isReadOnly=!Boolean(datas[0].isReadOnly);
                    //console.log(datas[0].isReadOnly);
                    if(datas[0].isReadOnly) {
                        if(_this.id=="reg_form_title"){
                            $("#reg_form_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+"查看档案");
                        }else if(_this.id=="progress_title"){
                            $("#progress_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+$("#progress_title").text());
                            
                        }
                        $('.edit-header-btn[name="save_btn"').hide();
                    }
                    else {
                        if(_this.id=="reg_form_title"){
                            $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                        }else if(_this.id=="progress_title"){
                            $("#progress_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+$("#progress_title").text());
                            
                        }
                        $('.edit-header-btn[name="save_btn"').show();
                    }
                    
                    //_setFormReadOnly(data.isReadOnly);
                    //console.log(getGlobalJson('mainData'));
                    if(_this.id=="reg_form_title"){
                        main_form.readOnly(datas[0].isReadOnly);
                    }else{
                        progressInfoForm.readOnly(datas[0].isReadOnly);
                        currentProgress['currentDiagramButton'].switchReadyOnly();
                    }
                    /*
                    $().mloader("show",{message:"保存中..."});
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
                    */
                }
            }else{
                $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
            }
            
        });
    }
    $("#reg_form_title").on('click',lockEvent);
    $("#progress_title").on('click',lockEvent);
    //保存按钮事件
    $('.edit-header-btn').on('click',function(e){
        if($(this).text()=="保存"){
            //console.log("保存");
            console.log($(pageOnTable).html())
            main_form.instance.getValues(getGlobal("currentId"),FormTemplate3.template,function(message,values){
                if(values.success){
                    console.log(message.message);
                    console.log(values.data);
                    values.data.values["caseCreateDate"]=getDateTime();
                    //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
                    if(getGlobalJson("currentUser")==null || getGlobalJson("currentUser")==undefined){
                        $().minfo('show',{title:"错误: "+error.FORM_INVALID_USER.message,message:"是否跳转到登录页面？"},function(){
                            //HideMessage();
                            window.location.href = 'index.html';
                        });
                    }else{
                        values.data.values["caseApplicant"]=getGlobalJson("currentUser").id;
                        values.data.values["isReadOnly"]=_isReadOnlyCurrentForm();
                        
                        $().mloader('show',{message:"保存中..."});
                        //console.log(values.data);
                        insertCase(values.data.values,function(r){
                            //console.log(r);
                            if(r.success){
                                console.log("修改添加成功。");
                                $().minfo('show',{title:"提示",message:"保存完成。"},function(){
                                    $.mobile.navigate('#');
                                });
                                
                            }else{
                                console.log(r);
                                $().minfo('show',{title:"错误",message:r.error});
                            }
                            $().mloader('hide');
                        });
                    }
                    
                    
                }else{
                    console.log(message.message+(message.id==0?" 但是有错误。":""));
                }
            });
        
        }
    })
    //#endregion
    //$('#pageOneTable-columnFilter"')
    function _isReadOnlyCurrentForm(){
        var datas=r.filter(d=>d.id==getGlobal("currentId"));
        if(datas.length>0)
            return datas[0].isReadOnly;
        return true;
    }
    function _reactiveCurrentTab(){

    }
    function setCheckAllBox(checkboxAll,targetTable){
        var _this=checkboxAll;
        var tr=$('#'+targetTable+' > tbody > tr');
        $.each($('#'+targetTable).find("input[type=checkbox][name=item_checkbox]"),function(index,checkbox) {
            //console.log()
            $(checkbox).on('change', function() {
                
                $(_this).prop("checked",
                tr.not(':hidden').length==tr.not(':hidden').find('input[type="checkbox"]:checked').length);
            
            })
        });
        $(_this).on('change',function() {
            //console.log('change');
            tr.not(':hidden').find('input[type="checkbox"]').prop( "checked", $(this).prop('checked') );
    
        });
    }
    
}

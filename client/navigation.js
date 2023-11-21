var tableColumns={
    id:{
       label: "序号",
       width:50,
    },
    caseNo:{
        label:"案件编号"
    },
    caseName:{label:"案件名称"},
    caseReason:{label:"案由",data:case_causes},
    caseType:{label:"案件类型",data:case_types},
    caseBelong:{label:"所属项目",data:projects},
    caseApplicant:{label:"申请人",},
    caseCreateDate:{label:"创建时间"},
    }
$(function(){
    $.mobile.loading( "show", {
        text: "读取中",
        textVisible: true,
        textonly :true,
        theme: $.mobile.loader.prototype.options.theme,
        html: ""
      });
    if(sessionStorage.getItem("currentUser") && JSON.parse(sessionStorage.getItem("currentUser")).name){
        let user = document.getElementById("name");
        user.innerHTML=JSON.parse(sessionStorage.getItem("currentUser")).name;
        
    }else{
        //document.body.innerHTML="没有登录。。。"
        //window.location.href = 'index.html';
    }
    getUserList(function(r){
        console.log('getUserList........'+(r.length));
        sessionStorage.setItem("userList",r);
        userList=r;
        console.log(userList);
        console.log('getUserList........');
        getCasesData(function(r){
            console.log('getCasesData');
            console.log(r);
            _initRegTable(r,tableColumns);
            $.mobile.loading( "hide");
            //$.mobile.hidePageLoadingMsg(); 
        });
    });
    console.log($('#popup_form_main'));
    $('#add_case_popup').resize(function(){
        console.log("size changed...");
    })
});


var form_item_ids=getFormItemsId(FormTemplate);
_createNewCaseForm(FormTemplate);

function _createNewCaseForm(template){
   
    var form=generateForm(template);
    
    const popup_form = document.getElementById("popup_form_main");
    //popup_form.innerHTML+=form.html();
    form.append($('<fieldset class="ui-grid-a">'+
    '<div class="ui-block-a"><button type="submit" id="caseReg_but" class="ui-btn ui-corner-all ui-shadow ui-icon-check case-reg-but">提交</button></div>'+
    '<div class="ui-block-b"><a id="caseReg_but_cancel" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back case-reg-but">取消</a></div></fieldset>'));
    //form.css({padding:"10px 20px"});
    //$("#add_case_popup").children().remove();
    $(popup_form).html('<h3 id="reg_form_title">新增案件</h3>'+form.html());
    $("#add_case_popup").css({"min-width":"1000px"});
    //console.log($(popup_form).html());
    $('#add_case_but').on('click',async function(e){
        //console.log("add......................");
        
        await _addEmptyData();
        _setBlurBackgroundVisibility(true);
        //console.log('currentId...................'+sessionStorage.getItem("currentId"));
    });
    $('.case-reg-but').on('click',function(e){
        //console.log(e.currentTarget);
        if(e.currentTarget.id=="caseReg_but_cancel"){

            _setBlurBackgroundVisibility(false);
        }
        //
    });
    const regist_but = document.getElementById("caseReg_but");
    const result={};
    regist_but.addEventListener('click', async function() {
        
        const dateAdded = new Date();
        var hasError=false;
        result['id']=sessionStorage.getItem("currentId");
        collectFormValues(FormTemplate,sessionStorage.getItem("currentId"),function(hasError,values){
			//console.log("hasError...."+hasError)
			
			//console.log(values)
            if(hasError){

            }else{
                $.mobile.loading( "show", {
                    text: "保存中",
                    textVisible: true,
                    textonly :true,
                    theme: $.mobile.loader.prototype.options.theme,
                    html: ""
                  });
                //console.log(values);
                insertCase(values,function(r){
                    //console.log(r);
                    if(r.success){
                        console.log("修改添加成功。");
                        _setBlurBackgroundVisibility(false);
                        location.reload();
                        $.mobile.loading( "hide");
                    }else{
                        console.log(r.error);
                    }
                });
            }
		});
    });
    
}
function _setData(data){
    sessionStorage.setItem("currentId", data.id);
    $("#reg_form_title").text("修改档案");
    var dataKeys=Object.keys(data);
    Object.keys(form_item_ids).forEach((id)=>{
        if(dataKeys.includes(id)){
            $("#"+id).val(data[id]);
            if(form_item_ids[id].type=="radio")  {
                $("#"+id+"-"+parseInt(data[id])).prop( "checked", true ).checkboxradio( "refresh" );
            }else if(form_item_ids[id].type=="multicombobox"){
                if(data[id]==null) data[id]="";
                $("#"+id).val(data[id].split(","));
                $("#"+id).selectmenu("refresh");
            }else if(form_item_ids[id].type=="combobox"){
                $("#"+id).selectedIndex =parseInt(data[id]);
                $("#"+id).selectmenu("refresh");
            }else if(form_item_ids[id].type=="date"||form_item_ids[id].type=="datetime"||form_item_ids[id].type=="time")  {
                $("#"+id).val(getDateTime(data[id]));
            }
        }
    });
}
async function _addEmptyData(){
    await getCaseLatestIndex().then(id=>{
        //console.log(id);
        sessionStorage.setItem("currentId", id+1);
        $("#reg_form_title").text("新增档案");
        Object.keys(form_item_ids).forEach((id)=>{
            $("#"+id).val("");
            if(form_item_ids[id].type=="date"||form_item_ids[id].type=="datetime"||form_item_ids[id].type=="time")  $("#"+id).val(getDateTime());
            else if(form_item_ids[id].type=="combobox"||form_item_ids[id].type=="radio")  $("#"+id).val(0);
        });
    });
    
}
function _setBlurBackgroundVisibility(isVisible){
    if(isVisible) {
        
        $('.popup-background.popup-a').css({"height":$("#add_case_popup").css('height')});
        $("#popup_form_main").trigger('create');
        //console.log("calc(50%+"+($(document).height()-$("#add_case_popup").height())+"px)");
        
        //console.log($(window).height());
        $("#add_case_popup").css({'top':"calc(50% + "+($("#add_case_popup").height()-$(window).height())/2+"px)"})
        //console.log($("#add_case_popup").height());
        $('.popup-background.popup-a').removeClass('popup-hide');
        //$("#add_case_popup").popup();
        //$("#add_case_popup").popup("open");
        $("#add_case_popup").removeClass('popup-hide');
        $('#add_case_popup').removeClass('popout').addClass('popin');
        //$('.popup-background.popup-b').css({height:"100%"})
        //$('.popup-background.popup-b').trigger('create');
        //console.log($('.popup-background.popup-a'));
    }
    else {
        $('.popup-background.popup-a').css({"height":"100%"});
        $('#add_case_popup').removeClass('popin').addClass('popout');
        $('.popup-background.popup-a').addClass('popup-hide');
        //$("#add_case_popup").addClass('popup-hide');
        //$("#add_case_popup").popup("close");
    }
}
function SendMessage(title,message,res){
    $("#message_title").text(title);
    $(".message_content").children().remove();
    $(".message_content").append($('<div>'+message+'</div>'));
    $("#message_popup").removeClass('popup-hide');
    
    $('.popup-background.popup-c').removeClass('popup-hide');
    $('#message_popup').removeClass('popout').addClass('popin');
    //$('.popup_message_but').removeAttr("click");
    
    
    $('#message_popup').append($('<fieldset class="ui-grid-a popup_message_buts">'+
            '<div class="ui-block-a"><a id="message_confirm_but" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_message_but">确认</a></div>'+
            '<div class="ui-block-b"><a id="message_cancel_but" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back popup_message_but">取消</a></div>'+
        '</fieldset>'));
    $('.popup_message_but').on('click',res);
    //$('.popup_message_but').off('click',"**");
}
function HideMessage(){
    $('#message_popup').removeClass('popin').addClass('popout');
    
    $('.popup-background.popup-c').addClass('popup-hide');
    $('.popup_message_buts').remove();
    
}

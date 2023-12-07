var lockeventListener=[];

$('.popup-add-table').on('click',function(e){
    //createBasicDatabase();
    //createTable('caseUpdates',caseUpdates);
    //createTable('caseExcutes',caseExcutes);
    //createTable('caseProperties',properties);
    //createTable('caseAttachments',attachments);
});
$('.popup-read-table').on('click', function(e){
    //getBasicDatabaseData(list).then(res=>console.log(res));

});
$('.popup-add-row').on('click', function(e){
    console.log('add row');
    //formatCasesData(DataList.casesDb);
    //insertBasicDatabaseData(list);
    //insertRows('caseUpdates',caseStatus_,(r)=>{})
    //insertRows('caseExcutes',caseExcutes_,(r)=>{})
    //insertRows('caseProperties',caseProperties_,(r)=>{})
    //insertRows('caseAttachments',caseAttachments_,(r)=>{})
});
$('#popupMenu').find('a').on('click',function(e){
    e.preventDefault();
    switch($(this).text()){
        case '设置':
            $.mobile.navigate( $(this).attr( "href" ));
            break;
        case '退出':
            //$.mobile.navigate( $(this).attr( "href" ));
            setGlobal("currentUser",undefined);
            window.location.href = 'index.html';
            break;
    }
    
})
var currentProgress={};
function setTableFunctionButonClickedEvent(){
    $.each($("[name^='fn_btn']"),(index,btn)=>{
        $(btn).on('click', function(but) {
            
            var index=but.currentTarget.dataset.item;
            var matchItems=DataList.combinedData.filter((item) =>item.id == index);
            var matchedUpdates=DataList.caseUpdates.filter((d)=>d.id==index);
            var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==index);
            var matchedProperties=DataList.caseProperties.filter((d)=>d.id==index);
            var matchedAttachments=DataList.caseAttachments.filter((d)=>d.id==index);
            console.log(index+"--"+but.currentTarget.name);

            if(but.currentTarget.name=="fn_btn_delete"){//主表里的删除按钮

            }
            else if(but.currentTarget.name=="fn_btn_edit"){//主表里的编辑按钮
                if(matchItems.length>0){
                    $().mloader("show",{message:"读取中...."});
                    //_showEditForm(matchItems[0]);//naviation.js
                    var _this=this;
                    //$("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                    setGlobal("currentId", matchItems[0].id);
                    //_setBlurBackgroundVisibility(true);
                    $.mobile.navigate( $(_this).attr( "href" ));
                    setTimeout(function() {
                        //console.log(matchItems[0]);
                        //main_form.setData(matchItems[0]);
                        //main_form.readOnly(false);
                        //
                        //console.log("data-role------"+$('.edit-header-btn[name="save_btn"').jqmData('role'));
                        caseForm.setData(matchItems[0]);
                        caseForm.readOnly(matchItems[0].isReadOnly);
                        _setTitleBar("reg_form_title");
                        $().mloader("hide");
                    }, 500);
                    //$('.progress_lock.edit-info').removeClass('hide');
                    //_setFormReadOnly(data.isReadOnly);
                    //_setBlurBackgroundVisibility(true);
                    
                }
            }
            else if(but.currentTarget.name=="fn_btn_details"){//主表里的信息按钮
                $().mloader("show",{message:"读取中...."});
                $("#progress_details").empty();
                $("#progress_diagram").empty();
                setGlobal("currentId",index);
                var progressInfoForm=_createNewCaseForm(progress_form_template,"progress_details");
                progressInfoForm.instance.find('#attorney').parent().css({"width": "250px"});
                $.mobile.navigate( '#progress');
                if(matchItems.length>0){
                    
                    _setTitleBar("progress_title",'caseNo');
                    var status_val=-1;
                    if(matchItems.length>0){
                        progressInfoForm.setData(matchItems[0]).readOnly(matchItems[0].isReadOnly);
                        //$("#progress_diagram").empty();
                        status_val=Number(matchItems[0].caseStatus);
                        
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
                        readOnly:matchItems[0].isReadOnly,
                        showCounter:true,
                        counterData:matchItems.concat(matchedExcutes,matchedProperties,matchedAttachments),
                    });
                    console.log("caseNo",matchItems[0].caseNo);
                    currentProgress['currentDiagramButton']=but;
                    $(but.instance).on("itemOnClicked",  function (e){
                        console.log('targetPosition...e',e);
                        currentProgress['targetPosition']=e.Position;
                        currentProgress['originalPosition']=formatIndex(but.opt.currentPosition);
                        currentProgress['isReadOnly']=matchItems[0].isReadOnly;
                        
                    //console.log('targetPosition...',currentProgress['targetPosition']);

                        //$( "#update_panel" ).panel( "open" );
                        var title=progresses[e.Position.main] instanceof Array?progresses[e.Position.main][e.Position.sub]:progresses[e.Position.main];
                        
                        $("#progress_popupMenu_title").text('请选择对 '+title+' 的操作');
                        if(matchItems[0].isReadOnly) $('.progress_popupMenu_add_group').hide();
                        else {
                            $('.progress_popupMenu_add_group').show();
                            
                        }
                        var exeBtn=$.grep($($('#progress_popupMenu_add_group').find('a')),(a)=>{
                            //console.log('setMainForm', $(a).text()=="执行");
                            return $(a).text()=="执行";
                        });
                        //console.log('setMainForm',e.Position.main);
                        if((e.Position.main==3||e.Position.main==2)&&!matchItems[0].isReadOnly){
                            $(exeBtn).show();
                            $(exeBtn).css({'display':'block'});
                        }else{
                            $(exeBtn).hide();
                        }
                        //$('#progress_popupMenu_add').find('ul').trigger('create').listview().listview('refresh');
                       // $('#progress_popupMenu_add').find('div').trigger('create');
                        //$('#progress_popupMenu_add').find('div').
                        //console.log('progress_popupMenu_add',$('#progress_popupMenu_add').find('ul'));
                        //console.log('progress_popupMenu_add',$("#progress_popupMenu").find('ul'));
                        $("#progress_popupMenu").trigger('create');
                        
                        $("#progress_popupMenu").popup('open');
                        $("#progress_popupMenu").popup('reposition',{x:e.event.pageX,y:e.event.pageY});
                        $("#progress_popupMenu_add_group").listview().listview('refresh');
                        //console.log($("#progress_popupMenu"));
                    });
                    $("#progress_diagram").trigger('create');
                    $("#progress_details").trigger('create');
                }
                //setTimeout(function() {
                    $().mloader("hide");
                //},5000);
                $("#progress_details").trigger('create');
            }
        });
    })
}
//流程图节点点击弹出菜单
$('#progress_popupMenu').find('a').on('click',function(e){
    $('#progress_popupMenu').popup('close');
    switch($(this).text()){
        case '查看':
            //$( "#update_panel" ).panel( "open" );
            //$( "#progress_details_info" ).removeClass('hide');
            $().mloader('show',{message:"读取中..."});
            setTimeout(() => {
                //console.log('查看...',sessionStorage.getItem("currentId"));
                var index=Number(sessionStorage.getItem("currentId"));
                _setTitleBar("progress_details_info_title",'caseNo');
                var caseStatus=currentProgress['targetPosition'].main+1+currentProgress['targetPosition'].sub/10;
                console.log('查看...',index,caseStatus,DataList.caseUpdates);
                var matchedUpdates=$.grep(DataList.caseUpdates,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                var matchedExcutes=$.grep(DataList.caseExcutes,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                var matchedProperties=$.grep(DataList.caseProperties,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                var matchedAttachments=$.grep(DataList.caseAttachments,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                var greatMatched=matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments);
                console.log('查看...',greatMatched);
                $('#progress_details_info_body').empty();
                greatMatched.forEach((ite)=>{
                    var _data=getEventsDetails(ite);
                    var date_bar=$('<li data-role="list-divider">'+_data.date+'</li>');
                    var item_container=$('<li></li>');
                    if(ite.hasOwnProperty('evidenceId')){
                        var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+_data.description+'</h3>');
                        
                        item_container=$('<li style="padding:0px;"></li>');
                        var group=$('<div style="display: grid;grid-template-columns: 1fr auto auto;grid-gap: 0px;margin:-8px 0px;"></div>');
                        var view_btn=$('<a href="#" class="ui-btn ui-icon-eye ui-btn-icon-notext btn-icon-green" style="padding:10px 5px;border-top: none;border-bottom: none;">查看</a>')
                        var del_btn=$('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red" style="padding:10px 5px;border: none;">删除</a>')
                        group.append(list_item);
                        group.append(view_btn);
                        group.append(del_btn);
                        item_container.append(group);
                    }else{
                        var list_item=$('<a href="#">'+_data.description+'</a>');
                        
                        item_container.append(list_item);
                        var del_btn=$('<a href="#" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-right ui-btn-icon-notext btn-icon-red">删除</a>');
                        item_container.append(del_btn);
                    }
                    
                    $('#progress_details_info_body').append(date_bar);
                    
                    $('#progress_details_info_body').append(item_container);
                });
                //$('#progress_details_info_body').trigger('create');
                $('#progress_details_info_body').listview().listview('refresh');
                $.mobile.navigate( "#progress_details_info");
                $().mloader('hide');
            }, 200);
            //$.mobile.navigate( "#progress_details_info");
            break;
        case '进展':
            console.log("进展");
            setTimeout(() => {
                var form= new mform({template:add_update_template});
                $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的进展");
                $('#progress_popup_add_form').empty();
                $('#progress_popup_add_form').append(form.instance);
                $('#progress_popup_add_form').trigger('create');
                $('#progress_popup_add').popup('open');
            }, 200);
            break;
        case '执行':
            console.log("执行");
            setTimeout(() => {
                var form= new mform({template:add_execute_template});
                $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的执行");
                $('#progress_popup_add_form').empty();
                $('#progress_popup_add_form').append(form.instance);
                $('#progress_popup_add_form').trigger('create');
                $('#progress_popup_add').popup('open');
            }, 200);
            break;
        case '财产':
            console.log("财产");
            setTimeout(() => {
                var form= new mform({template:add_property_template});
                $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的财产变更");
                $('#progress_popup_add_form').empty();
                $('#progress_popup_add_form').append(form.instance);
                $('#progress_popup_add_form').trigger('create');
                $('#progress_popup_add').popup('open');
            }, 200);
            break;
        case '附件':
            console.log("附件");
            setTimeout(() => {
                var form= new mform({template:add_evidence_template});
                $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的附件证明");
                $('#progress_popup_add_form').empty();
                $('#progress_popup_add_form').append(form.instance);
                $('#progress_popup_add_form').trigger('create');
                $('#progress_popup_add').popup('open');
            }, 200);
            break;
    }
})

function _setTitleBar(titlebarId,displayKey){
    var lockedTitle="查看案件";
    var unlockedTitle="修改案件";
    titlebarId=titlebarId.replace("#","");
    var matched=DataList.combinedData.filter((d)=>{return d.id==sessionStorage.getItem("currentId")});
    if(matched.length>0){
        if(displayKey!=undefined){
            lockedTitle=matched[0][displayKey];
            unlockedTitle=matched[0][displayKey];
        }
        if(matched[0].isReadOnly) {
            $("#"+titlebarId).html('<i class="fa fa-lock text-red edit-lock"></i>'+lockedTitle);
            $('.edit-header-btn[name="save_btn"').hide();
        }
        else {
            $("#"+titlebarId).html('<i class="fa fa-unlock text-green edit-lock"></i>'+unlockedTitle);
            $('.edit-header-btn[name="save_btn"').show();
        }
    }
    if(!lockeventListener.includes(titlebarId)){
        console.log(titlebarId+"没有注册锁按钮事件。。");
        $("#"+titlebarId).on('click',lockEvent);
        lockeventListener.push(titlebarId);
    }
        

}
function lockEvent(e){
    var _this=this;
    $().requestPassword(function(res){
        if(res.success){
            console.log("登陆成功。。")
            var id=getGlobal("currentId");
            var datas=DataList.combinedData.filter(d=>d.id==id);
            if(datas.length>0){
                //console.log(Boolean(datas[0].isReadOnly));
                datas[0].isReadOnly=!Boolean(datas[0].isReadOnly);
                //console.log(datas[0].isReadOnly);
                if(datas[0].isReadOnly) {
                    if(_this.id=="reg_form_title"){
                        $("#reg_form_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+"查看档案");
                    }else if(_this.id=="progress_title"){
                        $("#progress_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+$("#progress_title").text());
                        
                    }else if(_this.id=="progress_details_info_title"){
                        $("#progress_details_info_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+$("#progress_details_info_title").text());
                        
                    }
                    $('.edit-header-btn[name="save_btn"').hide();
                }
                else {
                    if(_this.id=="reg_form_title"){
                        $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                    }else if(_this.id=="progress_title"){
                        $("#progress_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+$("#progress_title").text());
                        
                    }else if(_this.id=="progress_details_info_title"){
                        $("#progress_details_info_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+$("#progress_details_info_title").text());
                        
                    }
                    $('.edit-header-btn[name="save_btn"').show();
                }
                
                //_setFormReadOnly(data.isReadOnly);
                //console.log(getGlobalJson('mainData'));
                if(_this.id=="reg_form_title"){
                    caseForm.readOnly(datas[0].isReadOnly);
                }else if(_this.id=="progress_details_info_title"){
                    
                }else if(_this.id=="progress_title"){
                    progressInfoForm.readOnly(datas[0].isReadOnly);
                    currentProgress['currentDiagramButton'].switchReadyOnly();
                }
            }
        }else{
            $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
        }
        
    });
}
function formatCasesData(data){
	$.each(data,(index,cas)=>{
		var personnel=cas['casePersonnel'];
		var case2ndParty=cas['case2ndParty'];
		var val=[];
		var case2ndPartyVal=[];
		//case2ndPartyVal=convertOldData(case2ndParty,casePersonnelStatus);
		if(case2ndParty.indexOf('；')>-1 || case2ndParty.indexOf('、')>-1|| case2ndParty.indexOf('(')>-1|| case2ndParty.indexOf('（')>-1){
			var sencodParty=[];
			if(case2ndParty.indexOf('；')>-1)
				sencodParty=case2ndParty.split('；');
			else if(case2ndParty.indexOf('、')>-1)
				sencodParty=case2ndParty.split('、');
			else
				sencodParty=[case2ndParty];
			
			$.each(sencodParty,(index,party)=>{
				if(party.length>0){
					var party_data=party.split('(');
					if(party.indexOf('（')>-1){
						party_data=party.split('（');
					}
					var party_name="";
					var party_status="无";
					var party_status_id=0;
					if(party_data.length>1){
						party_name=party_data[0];
						party_status=party_data[1].replace(')','').replace('）','');
						party_status_id=casePersonnelStatus.indexOf(party_status);
	
					}else if(party_data.length==1){
						party_name=party_data[0];
					}
					
					if(party.indexOf('（')>-1){
						//console.log('format data special',party_status_id+party_name,party_data);
					}
					case2ndPartyVal.push(party_status_id+party_name);
				}
				
			});
		}else{
			if(isNaN(parseInt(case2ndParty[0]))){
				case2ndPartyVal.push(0+case2ndParty);
			}
		}
		if(personnel.indexOf('；')>-1 || personnel.indexOf('、')>-1 || personnel.indexOf('(')>-1|| personnel.indexOf('（')>-1){
			//console.log("format data special--------------",cas['id'],personnel);
			personnel=personnel.replace('（北京）','');
			var peronnels=[];
			if(personnel.indexOf('；')>-1)
				peronnels=personnel.split('；');
			else if(personnel.indexOf('、')>-1)
				peronnels=personnel.split('、');
			else
				peronnels=[personnel];
			$.each(peronnels,(index,peronnel)=>{
				if(peronnel.length>0){
					var _data=peronnel.split('(');
					if(peronnel.indexOf('（')>-1){
						_data=peronnel.split('（');
					}
					var _name="";
					var _nameId=0;
					var _status="无";
					var _status_id=0;
					var _group="";
					var _group_id=0;
					
					if(_data.length>1){
						if(!isNaN(parseInt(_data[0]))){

						}else{
							_name=_data[0];
							_status=_data[1].replace(')','').replace('）','');
							_status_id=casePersonnelStatus.indexOf(_status);
							

						}
	
					}else if(_data.length==1){
						//console.log("format data special--------------",cas['id'],_status_id);
						_name=_data[0];
					}
					$.each(corporate_companies,(index,company)=>{
						if(_name.indexOf(company)>-1){
							_group='公司';
							_nameId=index;
							_group_id=0;
						}
						
					});
					$.each(corporate_partners,(index,partner)=>{
						if(_name.indexOf(partner)>-1){
							_group='个人';
							_nameId=index;
							_group_id=1;
						}
						
					});
					
					val.push(_status_id+_group+_nameId);
				}
			});
			/*
			//console.log(peronnels);
			$.each(corporate_companies,(index,company)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
				peronnels.forEach((p)=>{
					if(p.indexOf(company)>-1){
						//console.log(index+"--"+company);
						val.push('公司'+index);
					}
				})
			});
			$.each(corporate_partners,(index,partner)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
				peronnels.forEach((p)=>{
					if(p.indexOf(partner)>-1){
						//console.log(index+"--"+partner);
						val.push('个人'+index);
					}
				})
			});
			*/
		}
		
		//console.log("format data",cas['id'],cas['casePersonnel'],val.join(','));
		if(val.length>0){
			cas['casePersonnel']=val.join(',');
		}
		if(case2ndPartyVal.length>0){
			cas['case2ndParty']=case2ndPartyVal.join(',');
		}
		//cas['isReadOnly']=true;
		//cas['isReadOnly']=true;
		//console.log('caseDate',cas['id'],cas['caseDate']);
		cas['caseDate']=getDateTime(cas['caseDate']);
		cas['caseCreateDate']=getDateTime(cas['caseCreateDate']);
		cas['appealAmount']=0.00;
		cas['requestAmount']=0.00;
		cas['caseCounterclaimRequest']="";
		cas['caseLawsuitRequest']="";
		console.log("format data",cas['id']+"---"+case2ndPartyVal.join(','),val.join(','));
		//insert('cases',cas,(e)=>{
			//console.log(e);
		//})	
		if(cas.id>30){
			//delete cas.caseStatus;
			delete cas.lawFirm;
			delete cas.legalAgencies;
			delete cas.legalCounsel;
			delete cas.legalInstitution;
			delete cas.paidAmount;
			delete cas.penalty;
			delete cas.requestAmount;
			delete cas.attorney;
			delete cas.FirstInstance;
			delete cas.SecondInstance;
			var status_data={
				id:cas.id,
				caseNo:cas.caseNo,
				//caseStatus:cas.id<67?1.0:3.1,
				caseStatus:cas.caseStatus==2||cas.caseStatus==4.1?cas.caseStatus-1:cas.caseStatus,
				//legalAgencies:1,
				//lawFirm:0,
				//attorney:"无0",
				FirstInstance:'0000-00-00 00:00:00',
				SecondInstance:'0000-00-00 00:00:00',
				//legalCounsel:"无0",
				//legalInstitution:1
			}
			//insert('cases',cas,(e)=>{
				//console.log("format data",cas);
				//console.log(e);
			//})
			insert('caseStatus',status_data,(e)=>{
				console.log(e);
			})	
		}
		
	});
	return data;
}
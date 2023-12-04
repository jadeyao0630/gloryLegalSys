var main_form,pageOnTable,pageSeTable;
//$.mobile.page.prototype.options.domCache = true;
//$.mobile.changePage.defaults.reloadPage = true
$.mobile.navigate('#');
var canvas=document.getElementById('myCanvas');
eventManager.setCanvas(canvas);
setGlobal('currentPage',"#page1");
//window.location.href = 'text.html';
$('body').on(preload_completed_event_name,function(){

	main_form=_createNewCaseForm(FormTemplate3,"case_reg_page");
	//console.log("datalist: ",getGlobalJson("datalist"));
	_firstPageTableColumns.caseApplicant.data=DataList.userList;

	pageOnTable=new pageTable({
		containerId:"pageOneTable",
		template:_firstPageTableColumns,
		data:DataList.combinedData,
		//filterParent:"mainFooter",
		rowButtons:'<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
			'<a href="#timeline" name="fn_btn_details" class="ui-btn btn-icon-green ui-icon-eye ui-btn-icon-notext" data-transition="slidefade" data-item={0}>查看</a>'+
			'<button href="#fullscreenPage" name="fn_btn_edit" class="btn-icon-blue" data-icon="edit" data-iconpos="notext" data-item={0}>修改</button>'+
			'<button name="fn_btn_delete" class="btn-icon-red" data-icon="delete" data-iconpos="notext" data-item={0}>删除</button>'+
		'</div>'
	});
	//添加表格的索引按钮
	tableColumnToggle(_firstPageTableColumns,"mainFooter","pageOneTable");

	pageSeTable=new pageTable({
		containerId:"pageSecondTable",
		template:_progressTableTemplate,
		data:DataList.combinedData
		//filterParent:"mainFooter",
	});

	addClickEvents();

	$("#pageOneTable").hpaging({ limit: 10 });
	$("#pageSecondTable").hpaging({ limit: 10 });
	
	$.each($("#pageOneTable-popup [type=checkbox]"),function(index,checkbox){
		if(index<2){
			$(checkbox).prop("checked", false)            /* uncheck it */
						.checkboxradio("refresh")          /* refresh UI */
						.trigger("change");
								}
	});

	$('#main-container').addClass('hide');
	$('#mainFooter').show();
	logingStatus();
});


$(".nav-but").on("click",function(e){
	//e.preventDefault();
	if(getGlobal('currentPage') == $(this).attr( "href" )) return;
	$(getGlobal('currentPage')).addClass('hide');
	$($(this).attr( "href" )).removeClass('hide');
	$(getCurrentPageTabBtn(getGlobal('currentPage'))).removeClass('tab-active');
	$(this).addClass('tab-active');
	$(this).find('h2').css({'font-szie':'30px','font-weight':"700"})
	//$(this).parent().addClass('tab-active');
	//currentPage=$(this).attr( "href" );
	setGlobal('currentPage',$(this).attr( "href" ));
	if(getGlobal('currentPage')!="#page1"){
		$('#searchbar1').animate({'margin-left':"120px",'margin-right':"10px"});
		$('.footerBtn').hide();
		$('#mainFooter').find('input[type="checkbox"]').removeClass('hide');
		$('.ui-footer-btns').animate({'margin-left':'38px'});
	}else{
		$('#searchbar1').animate({'margin-left':"160px",'margin-right':"80px"},function(){
			$('.footerBtn').show();
			$('#mainFooter').find('input[type="checkbox"]').addClass('hide');
			$('.ui-footer-btns').animate({'margin-left':'10px'},function(){
				
			});
		});
		
	}
	$("#pageSecondTable").jqmData('filter',getGlobal('currentPage')=="#page2");
	$("#pageOneTable").jqmData('filter',getGlobal('currentPage')=="#page1");			
});
$("#progress_popupMenu").popup({
	afterclose:function(event,ui){
		$(this).find('[data-role="collapsible"]').collapsible({
			collapsed: true
			});
	}
})
function getCurrentPageTabBtn(pageId){
	var btns=$('#main_nav').find('button[href="'+pageId+'"]');
	if(btns.length>0) return btns[0];
	return undefined;
}
function logingStatus(){
	//setGlobalJson("currentUser","{}");
	if(getGlobalJson("currentUser") && getGlobalJson("currentUser").name){
		$('#name').text(getGlobalJson("currentUser").name);
		
	}else{
		$().minfo('show',{title:"错误",message:"自动跳转到登录页面？"});
		setTimeout(function() {
			window.location.href = 'index.html';
		}, 2000);
	}
}
function formatCasesData(data){
	$.each(data,(index,cas)=>{
		var personnel=cas['casePersonnel'];
		var val=[];
		if(personnel.indexOf('；')>-1 || personnel.indexOf('、')>-1){
			var peronnels=[];
			if(personnel.indexOf('；')>-1)
				peronnels=personnel.split('；');
			else
			peronnels=personnel.split('、');
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
		}
		if(val.length==0){
			//console.log(cas['id']+"---"+cas['casePersonnel']);
			$.each(corporate_companies,(index,company)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
					if(cas['casePersonnel'].indexOf(company)>-1){
						//console.log(index+"--"+company);
						val.push('公司'+index);
					}
			});
			$.each(corporate_partners,(index,partner)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
					if(cas['casePersonnel'].indexOf(partner)>-1){
						//console.log(index+"--"+partner);
						val.push('个人'+index);
					}
			});
		}
		if(val.length==0){
			console.log(cas['id']+"---"+cas['casePersonnel']);
		}else{
			cas['casePersonnel']=val.join(',');
			
		}
		//cas['isReadOnly']=true;
		//cas['isReadOnly']=true;
		cas['caseDate']=getDateTime(cas['caseDate']);
		cas['caseCreateDate']=getDateTime(cas['caseCreateDate']);
		cas['appealAmount']=0.00;
		cas['requestAmount']=0.00;
		cas['caseCounterclaimRequest']="";
		cas['caseLawsuitRequest']="";
		//console.log(cas['id']+"---"+val.join(','));
		insert('cases',cas,(e)=>{
			console.log(e);
		})	
		if(cas.id>30){
			var status_data={
				id:cas.id,
				caseNo:cas.caseNo,
				caseStatus:cas.id<67?2.0:4.1,
				legalAgencies:1,
				lawFirm:0,
				attorney:"无0",
				FirstInstance:getDateTime(),
				SecondInstance:getDateTime(),
				legalCounsel:"无0",
				legalInstitution:1
			}
			insert('caseStatus',status_data,(e)=>{
				console.log(e);
			})	
		}
		
	});
	return data;
}
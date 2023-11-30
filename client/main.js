var main_form,pageOnTable,pageSeTable;
		//$.mobile.page.prototype.options.domCache = true;
		//$.mobile.changePage.defaults.reloadPage = true
		$.mobile.navigate('#');
		//window.location.href = 'text.html';
		$('body').on('completed',function(){
			//console.log(FormTemplate3.template.caseInfo.data.caseOrgnizationPersonnel.data);
			//console.log(_progressTableTemplate[1].data.caseLabel.backgroundData);
			console.log(resourceDatas)
			getCasesStatus(function(r){
				setGlobalJson("mainDataStatus",r);
				//console.log(r);
				
			});
			getCasesData(function(r){
				output('getCasesData: ');
				//r=formatCasesData(r);
				output(r);
				
				//console.log(r);
				setGlobalJson("mainData",r);
				//console.log(FormTemplate3);
				main_form=_createNewCaseForm(FormTemplate3,"case_reg_page");
				getUserList(function(ul){
					//console.log('getUserList........'+(ul.length));
					
					//sessionStorage.setItem("userList",JSON.stringify(r));
					setGlobalJson("userList",ul);
					_firstPageTableColumns.caseApplicant.data=getGlobalJson("userList");
					//_initRegTable(r,firstPageTableColumns,"pageOneTable");
					//console.log(getGlobalJson("userList"));
					pageOnTable=new pageTable({
						containerId:"pageOneTable",
						template:_firstPageTableColumns,
						data:r,
						//filterParent:"mainFooter",
						rowButtons:'<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
							'<a href="#timeline" name="fn_btn_details" class="ui-btn btn-icon-green ui-icon-eye ui-btn-icon-notext" data-transition="slidefade" data-item={0}>查看</a>'+
							'<button href="#fullscreenPage" name="fn_btn_edit" class="btn-icon-blue" data-icon="edit" data-iconpos="notext" data-item={0}>修改</button>'+
							'<button name="fn_btn_delete" class="btn-icon-red" data-icon="delete" data-iconpos="notext" data-item={0}>删除</button>'+
						'</div>'
					});
					//console.log('mainDataStatus');
					//console.log(getGlobalJson('mainDataStatus'));
					pageSeTable=new pageTable({
						containerId:"pageSecondTable",
						template:_progressTableTemplate,
						data:{0:r,1:getGlobalJson("mainDataStatus")}
						//filterParent:"mainFooter",
					});
					tableColumnToggle(_firstPageTableColumns,"mainFooter","pageOneTable");
					$('#main-container').addClass('hide');
					//$.mobile.hidePageLoadingMsg(); 
					addClickEvents(main_form,r);
					$("#pageOneTable").hpaging({ limit: 10 });
					$("#pageSecondTable").hpaging({ limit: 10 });
					logingStatus();
					$.each($("#pageOneTable-popup [type=checkbox]"),function(index,checkbox){
						if(index<2){
							//console.log($(checkbox).prev().text())
							$(checkbox).prop("checked", false)            /* uncheck it */
										.checkboxradio("refresh")          /* refresh UI */
										.trigger("change");
												}
					});
				});
				
				var canvas=document.getElementById('myCanvas');
				eventManager.setCanvas(canvas);
				//var _ctx=canvas.getContext('2d');
				new timelinePage({template:_summary_template,data:_data,summaryListContainer:"#summary_list",canvas:canvas});
				//$("#frame").removeClass('hide');
				
			
				//console.log($("#pageOneTable .ui-checkbox"));
			});
			
		});
		
		setGlobal('currentPage',"#page1");
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
					cas['caseDate']=getDateTime();
					cas['caseCreateDate']=getDateTime();
					//console.log(cas['id']+"---"+val.join(','));
					insert('cases',cas,(e)=>{
						console.log(e);
					})	
				}
				
			});
			return data;
		}
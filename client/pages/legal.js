//global variations
var form,//header filter form
pageOnTable,//main table
caseForm,
progressInfoForm;
var currentData;
//getGlobal("currentId")
//getGlobal("currentUser")

//document.body.style.fontSize = "16px";

$('body').on(main_load_completed_event_name,function(){
    const intervalId = setInterval(() => {
        if (pageOnTable!=undefined) {
            clearInterval(intervalId);
            currentData=DataList.combinedData;
            pageOnTable.addTableData(DataList.combinedData);
            setTableFunctionButonClickedEvent();
            //$('#pageOneTable').trigger('create');
            
            setCheckAllBox($('.reg-checkbox-all'),'pageOneTable');
            
            resizeTables();
            resizeColumnFilter();
            //$('#header-filter-container').trigger('create')
            $().mloader("hide");
            $('#mainFooter').show();
        }
    }, 100);
});
$('body').on(preload_completed_event_name,function(){
    //console.log('resourceDatas',getGlobalJson('resourceDatas'));
    var tb=$('.header-search-container').togglebuttonicon(form,function(e,isbefore){
        if(e){
            if(isbefore){
                form.slideDown();
                //form.animate({'height':"200px"});
                $('#pageOneTable').animate({'margin-top':"198px"})
            }
        }else{
            //$('#header-filter-container').empty();
            if(isbefore){
                form.slideUp();
                $('#pageOneTable').animate({'margin-top':"0px"})
            }
        }
    },{distance:200});
    //$('#case_reg_but_restore').hide();
    $('.admin-ui').hide();
    if(getGlobalJson('currentUser').level==1){
        FormTemplate3.template.baseInfo.data.legalAgencies.isDisabled=true;
        FormTemplate3.template.baseInfo.data.legalAgencies.defaultValue=getGlobalJson('currentUser').id;
        progress_form_template.template.legalAgencies_p.isDisabled=true;
        header_filter_template.template.legalAgencies_f.isDisabled=true;
        header_filter_template.template.legalAgencies_f.defaultValue=getGlobalJson('currentUser').id;
    }else if(getGlobalJson('currentUser').level==adminLevel){
        //$('#case_reg_but_restore').show();
        $('.admin-ui').show();
        header_filter_template.template['isInactived']={
            label:"文档状态:",
            type:"multicombobox",
            data:['正常','删除'],
            isOptional:true,
            span:'3/3'
        }
    }
    caseForm=_createNewCaseForm(FormTemplate3,"case_reg_page");

    pageOnTable=new pageTable({
		containerId:"pageOneTable",
		template:_firstPageTableColumns,
		//data:DataList.combinedData,
		//filterParent:"mainFooter",
		rowButtons:'<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
			'<a href="#" name="fn_btn_details" class="ui-btn btn-icon-green ui-icon-info ui-btn-icon-notext btn-tooltip" data-tooltip="案件总览" data-transition="slidefade" data-item={0}>查看</a>'+
			'<button href="#casePage" name="fn_btn_edit" class="btn-icon-blue btn-tooltip" data-icon="edit" data-iconpos="notext" data-tooltip="案件编辑修改" data-item={0}>修改</button>'+
			'<button name="fn_btn_update" class="btn-icon-red btn-tooltip" data-icon="calendar" data-iconpos="notext" data-tooltip="更新案件进展" data-item={0}>更新</button>'+
		'</div>'
	});

    $("#pageOneTable").on('sort',function(columnData){
        //console.log(columnData.value);
        $(window).trigger('waiting');
        pageOnTable.sortColumn(currentData,columnData.value);
        //setTimeout(() => {
            
        setAvailableColumns('pageOneTable',1);
        setTableFunctionButonClickedEvent();
        
        $(window).trigger('hidepopup');
            //syncHeaderCloneWidth();
        //}, 100);
        //$().mloader("hide");
    })
    //设置主表格头固定顶部位置，需要克隆主表格的原有头
    var t1Header=$('#pageOneTable').find('thead').clone();
    $('#pageOneTable-fixed').append(t1Header);
    pageOnTable.setSort($('#pageOneTable-fixed').find('th'));
    
    $('#header-filter-container').css({top:$('#main-header').css('height')});
    //添加头部过滤表格
    var filter_form= new mform({template:header_filter_template});
    form=filter_form.instance;
    form.addClass('header-filter-from')
    var container=$('<div class="header-filter-container-div"></div>')
    container.append(form);
    $('#header-filter-container').prepend(container);
    form.hide();
    filter_form.setEmptyData();
    form.trigger('create');
    $("#pageOneTable").trigger('create');
    //在过滤表格后同步表格头和身的宽度
    
    
   
    $('.header-filter-btn').on('click',function(e){
        switch($(this).text()){
            case "复位":
                
                
                filter_form.setEmptyData();
                currentData=DataList.combinedData;
                //pageOnTable.sortColumn(currentData,pageOnTable.currentSort);
                //setAvailableColumns('pageOneTable',1);
                break;
            case "查询":
                //console.log("filter...",$(form).find('select,input'));
                $(window).trigger('waiting');
                setTimeout(() => {
                    var matched=DataList.combinedData;
                    var penalty={};
                    var caseDate={};
                    $.each($(form).find('select,input'),(index,ele)=>{
                        console.log("filter...",ele.nodeName,ele.id.replace('_f',''),$(ele).val());
                        if($(ele).val()!=undefined && $(ele).val().length>0){
                            var id=ele.id.replace('_f','');
                            if(id=="penalty_0"){
                                penalty['from']=$(ele).val();
                            }else if(id=="penalty_1"){
                                penalty['to']=$(ele).val();
                            }else if(id=="caseDate_0"){
                                caseDate['from']=new Date($(ele).val()+" 00:00:00");
                            }else if(id=="caseDate_1"){
                                caseDate['to']=new Date($(ele).val()+" 23:59:00");
                            }else if(id=="caseStatus"){
                                //if($(ele).val().constructor !== String){
                                    //console.log('数子');
                                    matched=$.grep(matched,(item)=>{
                                        return $.grep($(ele).val(),(v)=>{
                                            if(parseFloat(v)>2){
                                                return Math.round(parseFloat(v))==Math.round(parseFloat(item[id]));
                                            }else{
                                                return parseFloat(v)==parseFloat(item[id]);
                                            }
                                            
                                        }).length>0;
                                    });
                                //}
                            }
                            else{
                                matched=$.grep(matched,(item)=>{
                                    //console.log(item[id]);
                                    if(item[id].constructor !== String){
                                        //console.log('数子');
                                        return $(ele).val().includes(item[id]+"");
                                    }else{
                                        //console.log('数组');
                                        return item[id].split(',').some(itm => $.grep($(ele).val(),(it)=>{
                                            console.log(itm,it);
                                            return itm.indexOf(it)>-1;
                                        }));
                                    }
                                    //$(ele).val().includes(item[id]+"")
                                    //$.each($(ele).val(),(i,val)=>{
                                        //if(item[id]==Number(val)) return true;
                                    //})
        
                                })
                            }
                            
                            
                        }
                        
                        
                    });
                    
                    if(Object.keys(penalty).length==2){
                        console.log('penalty',penalty,Object.keys(penalty).length);
                        matched=$.grep(matched,(item)=>{
                            console.log(parseFloat(item['penalty']),parseFloat(penalty.from),parseFloat(penalty.to));
                            return parseFloat(item['penalty'])<=parseFloat(penalty.to) && parseFloat(item['penalty'])>=parseFloat(penalty.from);
                        });
                    }
                    if(Object.keys(caseDate).length==2){
                        console.log('caseDate',caseDate,Object.keys(caseDate).length);
                        matched=$.grep(matched,(item)=>{
                            console.log(new Date(item['caseDate']),caseDate.from,caseDate.to);
                            var valDate=new Date(item['caseDate']);
                            return valDate.getTime()<=caseDate.to.getTime() && valDate.getTime()>=caseDate.from.getTime();
                        });
                    }
                    //console.log(matched);
                    currentData=matched;
                    pageOnTable.addTableData(matched);
                    pageOnTable.sortColumn(matched,pageOnTable.currentSort);
                    tb.instance.isTargetToggle=false;
                    setTableFunctionButonClickedEvent();
                    
                    setCheckAllBox($('.reg-checkbox-all'),'pageOneTable');
                    form.slideUp();
                    $('#pageOneTable').animate({'margin-top':"0px"})
                    $('#pageOneTable').trigger('create');
                    setAvailableColumns('pageOneTable',1);
                    $('#header-filter-container').css({height:$('#pageOneTable-fixed').css('height')});
                    $('#header-filter-container').trigger('create');
                    //resizeTables();
                    //console.log('togglebuttonicon',);
                    $(window).trigger('hidepopup');
                }, 10);
        
                
                break;
        }
    });
    
})
$(window).on('waiting',function(e){
    $().mloader('show',{message:"请稍等..."});
})
$(window).on('saving',function(e){
    $().mloader('show',{message:"保存中..."});
})
$(window).on('hidepopup',function(e){
    $().mloader('hide');
})
$(window).resize(function(e){
    //console.log('高度',window.innerHeight,'宽度',window.innerWidth)
    resizeTables();
    resizeColumnFilter();
});
$.mobile.document.one( "filterablecreate", "#pageOneTable", function() {
    $('#pageOneTable').filterable({
        filter: function( event, ui ) {
            console.log('create');
            syncHeaderCloneWidth();
        }
    });
});
function setToolTip(element){
    
    //console.log($(element).position(),$(element).offset(),$(element).offsetParent().hasClass('ui-popup'));
    
    //console.log($(element));
    $(element).on('mouseover',function(e){
        //$('body').append(tooltip);
        $('.ui-tooltip').text($(this).data('tooltip')!=undefined?$(this).data('tooltip'):$(this).text());
        var position=$(this).offsetParent().hasClass('ui-popup')?$(this).position():$(this).offset();
        $('.ui-tooltip').css({visibility: 'visible',
        opacity: 1,
        left:position.left,
        top:(position.top+$(this).height()+10)+'px'});
    })
    $(element).on('mouseout',function(e){
        $('.ui-tooltip').css({visibility: 'hidden',
        opacity: 0});
    })
}
function syncHeaderCloneWidth(){//同步表格头和身的宽度
    var columnToggler=$('<i class="fa fa-gear"></i>');
    var ref_ths=$('#pageOneTable').find('th');
    var ths=$('#pageOneTable-fixed').find('th');
    var left=0;
    $.each(ths,(index,th)=>{
        var border={};
        //if(index==index==ths.length-1) border={'text-align':"right"};
        $(th).css(Object.assign(border,{width:$(ref_ths[index]).outerWidth()+"px",left:left+"px"}));
        //console.log(index,$(ref_ths[index]).outerWidth());
        if(index==ths.length-1) {
            $(th).empty();
            $(th).removeClass('table-column-toggle');
            $(th).append(columnToggler);
            $(th).addClass('table-column-toggle');
            //console.log('isNormal',($(ref_ths[index]).outerWidth()/window.innerWidth>0.1),$(ref_ths[index]).outerWidth(),window.innerWidth);
            //resizeTables($(ref_ths[index]).outerWidth()/window.innerWidth>0.1,true);
        }
        left+=$(ref_ths[index]).outerWidth();
    })
    //var th_column_filter;
    
    if($('#pageOneTable-columnFilter').length==0){
        if(getGlobalJson('currentUser').columns!=undefined && getGlobalJson('currentUser').columns!=null){
            var user_cols=getGlobalJson('currentUser').columns.split(',');
            $.each(_firstPageTableColumns,(k,v)=>{
                v.isHidden=!(user_cols.includes(k)&&v.isFilterable);
            });
            $('#pageOneTable').trigger('create');
            $('#pageOneTable-fixed').trigger('create'); 
        }
        //console.log('tableColumnToggle',$('.table-column-toggle'));
        var columnFilter=tableColumnToggle(_firstPageTableColumns,$('.table-column-toggle'),'pageOneTable');
        columnFilter.on('columnChanged',function(){
            $('#pageOneTable').trigger('create');
            var ref_ths=$('#pageOneTable').find('th');
            if(ref_ths.length>0){
                resizeTables($(ref_ths[ref_ths.length-1]).outerWidth()/window.innerWidth>0.14);
            };
        })
        setTimeout(() => {
            resizeTables();
        }, 100);
    }else{
        
    }
    
    $('#pageOneTable-fixed').trigger('create');    
    //resizeColumnFilter();
}
function resizeTables(isNormal){//按照窗口尺寸调整表格字体尺寸
    if(window.innerWidth<=1280){
        //console.log('高度',$('#pageOneTable').find('label'));
        //$('#pageOneTable').find('label').css({'font-size':"8px"});
        //$('#pageOneTable').find('td,th').css({'font-size':"8px"});
        if(isNormal){
            $('#pageOneTable').removeClass('table-smallFont').removeClass('table-regularFont');
            $('#pageOneTable-fixed').removeClass('table-smallFont').removeClass('table-regularFont');
        }else{
            $('#pageOneTable').removeClass('table-regularFont').addClass('table-smallFont');
            $('#pageOneTable-fixed').removeClass('table-regularFont').addClass('table-smallFont');
        //$('#header-filter-container').removeClass('table-regularFont').addClass('table-smallFont');
        }
    }else{
        //console.log('isNormal',isNormal);
        if(isNormal){
            $('#pageOneTable').removeClass('table-smallFont').removeClass('table-regularFont');
            $('#pageOneTable-fixed').removeClass('table-smallFont').removeClass('table-regularFont');
        }else{
            $('#pageOneTable').removeClass('table-smallFont').addClass('table-regularFont');
            $('#pageOneTable-fixed').removeClass('table-smallFont').addClass('table-regularFont');
        }
        
        //$('#header-filter-container').removeClass('table-smallFont').addClass('table-regularFont');
    }
    $('#pageOneTable').trigger('create');
    //$('#pageOneTable-fixed').trigger('create');
    
    syncHeaderCloneWidth();
    $('#header-filter-container').css({height:$('#pageOneTable-fixed').css('height')});
    $('#header-filter-container').trigger('create');
}
function resizeColumnFilter(){//按照窗口尺寸调整列过滤弹窗字体尺寸
    
    if(window.innerWidth<=1280){
        $('#pageOneTable-columnFilter').removeClass('table-regularFont').addClass('table-smallFont');
    }else{
        $('#pageOneTable-columnFilter').removeClass('table-smallFont').addClass('table-regularFont');
    }
    $('#pageOneTable-columnFilter').trigger('create');
}
function setCheckAllBox(checkboxAll,targetTable){
    var _this=checkboxAll;
    
    $.each($('#'+targetTable).find("input[type=checkbox][name=item_checkbox]"),function(index,checkbox) {
        //console.log()
        $(checkbox).on('change', function() {
            var tr=$('#'+targetTable+' > tbody > tr');
            $(_this).prop("checked",
            tr.not(':hidden').length==tr.not(':hidden').find('input[type="checkbox"]:checked').length);
        
        })
    });
    $(_this).on('change',function() {
        var tr=$('#'+targetTable+' > tbody > tr');
        //console.log('change');
        tr.not(':hidden').find('input[type="checkbox"]').prop( "checked", $(this).prop('checked') );

    });
}
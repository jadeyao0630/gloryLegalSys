var form;
//document.body.style.fontSize = "16px";


$('body').on(preload_completed_event_name,function(){
    var tb=$('.header-search-container').togglebuttonicon('header-filter-container',function(e,isbefore){
        if(e){
            if(isbefore){
                form.slideDown();
                $('#pageOneTable').animate({'margin-top':"200px"})
            }
        }else{
            //$('#header-filter-container').empty();
            if(isbefore){
                form.slideUp();
                $('#pageOneTable').animate({'margin-top':"0px"})
            }
            
        }
    },{distance:200});
    $('#main-container').addClass('hide');
    var main_form= new mform({template:header_filter_template});
    form=main_form.instance;
    form.addClass('header-filter-from')

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
    var t1Header=$('#pageOneTable').find('thead').clone();
    $('#pageOneTable-fixed').append(t1Header);
    resizeTables();
    //var trs_clone=$('#pageOneTable-fixed').find('thead > tr');
    //if (trs_clone.length>0){
        //$(trs_clone[0]).append($('<td style="width:20px;font-szie:16px;"><i class="fa fa-gear"></i></td>'));
    //}
    //$('#pageOneTable-fixed').trigger('create');
    $('#header-filter-container').css({height:$('#pageOneTable-fixed').css('height'),top:$('#main-header').css('height')});
    $('#header-filter-container').prepend(form);
    form.hide();
    
    
    resizeColumnFilter();

    form.trigger('create');

    setCheckAllBox($('.reg-checkbox-all'),'pageOneTable');
    $(window).resize(function(e){
        console.log('高度',window.innerHeight,'宽度',window.innerWidth)
        resizeTables();
        resizeColumnFilter();
    });
    $('.header-filter-btn').on('click',function(e){
        switch($(this).text()){
            case "复位":
                
                
                main_form.setEmptyData();
                break;
            case "查询":
                $.each($(form).find('select,input'),(index,ele)=>{
                    console.log($(ele).val());
                });
                tb.instance.togglebutton('close')
                form.hide();
                //console.log('togglebuttonicon',);
                break;
        }
    });
})
function syncHeaderCloneWidth(){//同步表格头和身的宽度
    /*
    var columnToggler=$('<i class="fa fa-gear"></i>');
    var cloneHeader=$('#pageOneTable-fixed').find('th');
    var ths=$('#pageOneTable').find('th');
    if(ths.length>0){
        $.each(ths,(index,td)=>{
            
            $(cloneHeader[index]).css({'width':$(td).css('width')})
            if(index==ths.length-1) {
                if($(cloneHeader[index]).find('i').length==0){
                    $(cloneHeader[index]).empty();
                    $(cloneHeader[index]).append(columnToggler);
                    $(cloneHeader[index]).addClass('table-column-toggle');
                }
                
            }

            
        })
        
    }
    */
    var cloneHeader=$('#pageOneTable').find('th');
    var trs=$('#pageOneTable').find('tbody > tr');
    if(trs.length>0){
        var left=0;
        $.each($(trs[0]).find('td'),(index,td)=>{
            $(cloneHeader[index]).css({left:left+"px",top:"181px"});
            left+=parseFloat($(td).css('width').replace('px',''));
            console.log("set clone header",index,left)
        });
    }
    $('#pageOneTable').trigger('create');
    $('#pageOneTable-fixed').trigger('create');
    if($('#pageOneTable-columnFilter').length==0){
        //tableColumnToggle(_firstPageTableColumns,columnToggler,'pageOneTable');
    }
    //resizeColumnFilter();
}
function resizeTables(){//按照窗口尺寸调整表格字体尺寸
    if(window.innerWidth<=1280){
        console.log('高度',$('#pageOneTable').find('label'));
        //$('#pageOneTable').find('label').css({'font-size':"8px"});
        //$('#pageOneTable').find('td,th').css({'font-size':"8px"});
        $('#pageOneTable').removeClass('table-regularFont').addClass('table-smallFont');
        $('#pageOneTable-fixed').removeClass('table-regularFont').addClass('table-smallFont');
        //$('#header-filter-container').removeClass('table-regularFont').addClass('table-smallFont');
    }else{
        $('#pageOneTable').removeClass('table-smallFont').addClass('table-regularFont');
        $('#pageOneTable-fixed').removeClass('table-smallFont').addClass('table-regularFont');
        //$('#header-filter-container').removeClass('table-smallFont').addClass('table-regularFont');
    }
    $('#pageOneTable').trigger('create');
    //$('#pageOneTable-fixed').trigger('create');
    
    syncHeaderCloneWidth();
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
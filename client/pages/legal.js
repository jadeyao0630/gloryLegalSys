var form;
//document.body.style.fontSize = "16px";


$('body').on(preload_completed_event_name,function(){
    console.log('resourceDatas',getGlobalJson('resourceDatas'));
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
    /*
    var ths=$('#pageOneTable').find('thead > tr >th');
    var tr=$('<tr></tr>');
    $.each(ths,(index,th)=>{
        tr.append('<td class="ref-td">'+$(th).html()+'</td>');
    })
    ths.addClass('fixed-th');
    $('#pageOneTable').find('tbody').prepend(tr);
    //$('#pageOneTable').append(t1Header);
    */
    resizeTables();
    //var trs_clone=$('#pageOneTable-fixed').find('thead > tr');
    //if (trs_clone.length>0){
        //$(trs_clone[0]).append($('<td style="width:20px;font-szie:16px;"><i class="fa fa-gear"></i></td>'));
    //}
    //$('#pageOneTable-fixed').trigger('create');
    $('#header-filter-container').css({height:$('#pageOneTable-fixed').css('height'),top:$('#main-header').css('height')});
    var container=$('<div class="header-filter-container-div"></div>')
    container.append(form);
    $('#header-filter-container').prepend(container);
    
    //form.css({'height':"0px"});
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
                console.log("filter...",$(form).find('select,input'));
                var matched=DataList.combinedData;
                var penalty={};
                var caseDate={};
                $.each($(form).find('select,input'),(index,ele)=>{
                    console.log("filter...",ele.nodeName,ele.id,$(ele).val());
                    if($(ele).val()!=undefined && $(ele).val().length>0){
                        
                        if(ele.id=="penalty_0"){
                            penalty['from']=$(ele).val();
                        }else if(ele.id=="penalty_1"){
                            penalty['to']=$(ele).val();
                        }else if(ele.id=="caseDate_0"){
                            caseDate['from']=new Date($(ele).val()+" 00:00:00");
                        }else if(ele.id=="caseDate_1"){
                            caseDate['to']=new Date($(ele).val()+" 23:59:00");
                        }else if(ele.id=="caseStatus"){
                            //if($(ele).val().constructor !== String){
                                //console.log('数子');
                                matched=$.grep(matched,(item)=>{
                                    return $.grep($(ele).val(),(v)=>{
                                        if(parseFloat(v)>2){
                                            return Math.round(parseFloat(v))==Math.round(parseFloat(item[ele.id]));
                                        }else{
                                            return parseFloat(v)==parseFloat(item[ele.id]);
                                        }
                                        
                                    }).length>0;
                                });
                            //}
                        }
                        else{
                            matched=$.grep(matched,(item)=>{
                                console.log(item[ele.id]);
                                if(item[ele.id].constructor !== String){
                                    //console.log('数子');
                                    return $(ele).val().includes(item[ele.id]+"");
                                }else{
                                    //console.log('数组');
                                    return item[ele.id].split(',').some(itm => $.grep($(ele).val(),(it)=>{
                                        console.log(itm,it);
                                        return itm.indexOf(it)>-1;
                                    }));
                                }
                                //$(ele).val().includes(item[ele.id]+"")
                                //$.each($(ele).val(),(i,val)=>{
                                    //if(item[ele.id]==Number(val)) return true;
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
                console.log(matched);
                pageOnTable.addTableData(matched);
                tb.instance.isTargetToggle=false;
                form.slideUp();
                $('#pageOneTable').animate({'margin-top':"0px"})
                $('#pageOneTable').trigger('create');
                //console.log('togglebuttonicon',);
                break;
        }
    });
})
$.mobile.document.one( "filterablecreate", "#pageOneTable", function() {
    $('#pageOneTable').filterable({
        filter: function( event, ui ) {
            syncHeaderCloneWidth();
            //console.log('create');
        }
      });
});
function syncHeaderCloneWidth(){//同步表格头和身的宽度
    var columnToggler=$('<i class="fa fa-gear"></i>');
    var ref_ths=$('#pageOneTable').find('th');
    var ths=$('#pageOneTable-fixed').find('th');
    var left=0;
    $.each(ths,(index,th)=>{
        var border={};
        //if(index==index==ths.length-1) border={'text-align':"right"};
        $(th).css(Object.assign(border,{width:$(ref_ths[index]).outerWidth()+"px",left:left+"px"}));
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
        var columnFilter=tableColumnToggle(_firstPageTableColumns,$('.table-column-toggle'),'pageOneTable');
        columnFilter.on('columnChanged',function(){
            //console.log("columnChanged");
            
            
            $('#pageOneTable').trigger('create');
                var ref_ths=$('#pageOneTable').find('th');
                if(ref_ths.length>0){
                    resizeTables($(ref_ths[ref_ths.length-1]).outerWidth()/window.innerWidth>0.14);
                    
                };
                //syncHeaderCloneWidth();
            
        })
    }
        
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
        console.log('isNormal',isNormal);
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
    $('#pageOneTable-fixed').trigger('create');
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
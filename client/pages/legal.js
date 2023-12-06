var form;
//document.body.style.fontSize = "16px";


$('body').on(preload_completed_event_name,function(){
    var tb=$('.header-search-container').togglebuttonicon('header-filter-container',function(e){
        if(e){
            form.slideDown();
            
        }else{
            //$('#header-filter-container').empty();
            form.slideUp();
        }
    },{distance:200});
    $('#main-container').addClass('hide');
    var main_form= new mform({template:header_filter_template});
    form=main_form.instance;
    $('#header-filter-container').css({height:"0px",top:$('#main-header').css('height')});
    $('#header-filter-container').prepend(form);
    form.hide();
    form.trigger('create');

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
    console.log('高度',window.innerHeight,'宽度',window.innerWidth)
    var t1Header=$('#pageOneTable').find('thead').clone();
    $('#pageOneTable-fixed').append(t1Header);
   
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
            
    $('#header-filter-container').trigger('create');
            var cloneHeader=$('#pageOneTable-fixed').find('thead > tr >th');
            var trs=$('#pageOneTable').find('tbody > tr');
            if(trs.length>0){
                $.each($(trs[0]).find('td'),(index,td)=>{
                    
                    $(cloneHeader[index]).css({'width':$(td).css('width')})
                    console.log("set clone header",index,$(td).css('width'),$(cloneHeader[index]))
                })
            }
            
            $('#pageOneTable-fixed').trigger('create');
        $(window).resize(function(e){
            console.log('高度',window.innerHeight,'宽度',window.innerWidth)
            if(window.innerWidth<=1280){
                console.log('高度',$('#pageOneTable').find('label'));
                //$('#pageOneTable').find('label').css({'font-size':"8px"});
                //$('#pageOneTable').find('td,th').css({'font-size':"8px"});
                $('#pageOneTable').removeClass('table-regularFont').addClass('table-smallFont');
                $('#pageOneTable-fixed').removeClass('table-regularFont').addClass('table-smallFont');
            }else{
                $('#pageOneTable').removeClass('table-smallFont').addClass('table-regularFont');
                $('#pageOneTable-fixed').removeClass('table-smallFont').addClass('table-regularFont');
            }
            $('#pageOneTable').trigger('create');
            var cloneHeader=$('#pageOneTable-fixed').find('thead > tr >th');
            var trs=$('#pageOneTable').find('tbody > tr');
            if(trs.length>0){
                $.each($(trs[0]).find('td'),(index,td)=>{
                    
                    $(cloneHeader[index]).css({'width':$(td).css('width')})
                    console.log("set clone header",index,$(td).css('width'),$(cloneHeader[index]))
                })
            }
            
            $('#pageOneTable-fixed').trigger('create');
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
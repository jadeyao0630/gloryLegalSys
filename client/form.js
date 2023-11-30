class error{
    static FORM_VALIDATION_COMPLETED={message:"表格检查完毕。",id:0}
    static FORM_INVALID_USER={message:"您还没有登录。",id:1}
    static FORM_EMPTY_VALUE={message:"信息没有填写完整。",id:2}
}

function mform(arg){
    this.opt = {
        template:FormTemplate,
        buttons:undefined,
    }
    this.replacementIndexs={};
    this.orginalIndexs={};
    this.typeIndexs={};
    this.isReadOnly;
    this.init(arg)
    
}
mform.prototype={
    init:function(arg){
        var _self=this;
        _self.elements={};
        for(var attr in arg){
            //console.log(attr+": "+_self.opt[attr]+"-->"+arg[attr]);
            _self.opt[attr] = arg[attr];
        }
        var template=_self.opt.template;
        //console.log(_self.opt.template);
        if(template.settings.textareaHeight != undefined){
            loadCssCode('textarea.ui-input-text {min-height: '+template.settings.textareaHeight+'px;}')
        }
        var form_width="";
        if(template.settings.textareaHeight != undefined && template.settings.textareaHeight!=Number.NaN){
            form_width=' style="width:'+template.settings.width+';"'
        }
        
        //var formItemIds=[];
        _self.instance=$('<form'+form_width+' onsubmit="javascript:return false;"></form>');
        _self.instance.template=template.template;
        if(template.settings.isCollapsibleGrouping){
            var catelogs=Object.keys(template.template);
            catelogs.forEach((catelog_key)=>{
                var catelog=template.template[catelog_key];
                //console.log(catelog);
                catelog_title_bar=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"></div>');
        
                catelog_title_bar.append($('<h4>'+catelog.label+'</h4>'));
                //var catelog_item_keys=Object.keys(catelog.data);
                
                catelog_title_bar.append(setMainForm(catelog.data));
                _self.instance.append(catelog_title_bar);
            });
        }else{
            _self.instance.append(setMainForm(template.template));
        }
        //_self.instance.find('.ui-input-text').addClass('form-original');
        //_self.instance.find('.ui-select').addClass('form-original');
        /*
        $.each(_self.elements,(k,v)=>{
            console.log(k+"------------------------");
            console.log(v);
        });
        */
        if (_self.opt.buttons!=undefined) _self.instance.append(_self.opt.buttons);
        //_self.readOnly(true);
        function setMainForm(data){
            var catelog_item_keys=Object.keys(data);
            if(data!=undefined && catelog_item_keys.length>0){
                
                var row_grid=$('<div class="form_grid"></div>');
                if(template.settings.templateColumn!=undefined){
                    var columns=template.settings.templateColumn.split(" ");
                    row_grid.css({'gridTemplateColumns':template.settings.templateColumn,'padding-right':(20*(columns.length-1))+"px"});
                }
                
                
                var stepControler=0;
                
                catelog_item_keys.forEach((item_key)=>{
                    //console.log(item_key);
                    var item=data[item_key];
                    //console.log(item.type);
                    if(item.type!=undefined){
                        
                        var item_container=$('<div class="form_item_panel_tb"></div>');
                        if(template.settings.labelPosition != undefined && template.settings.labelPosition=="left"){
                            item_container=$('<div class="form_item_panel"></div>');
                        }
                        _self.typeIndexs[item_key]=item.type.toLowerCase();
                        switch(item.type.toLowerCase()){
                            case "text":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "textarea":
                                _self.elements[item_key]=generateTextAreaItem(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "date":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "datetime":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "time":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "tel":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "email":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "password":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "combobox":
                                _self.elements[item_key]=generateComboBoxItem(item_container,item,item_key);
                                break;
                            case "multicombobox":
                                //console.log("multicombobox..............................");
                                _self.elements[item_key]=generateMultiComboBoxItem(item_container,item,item_key);
                                break;
                            case "radio":
                                _self.elements[item_key]=generateRadioItem(item_container,item,item_key);
                                break;
                            case "file":
                                _self.elements[item_key]=generateFileItem(item_container,item,item_key);
                                break;
                        }
                        var replacement=replacementOfInput(item_key);
                        item_container.append(replacement);
                        replacement.hide();
                        row_grid.append(item_container);
                    }
                    stepControler++;
                });
            }
            return row_grid;
        }
        function setOptionMark(item){
            if(item.isOptional){
                return "";
            }else{
                return '<span class="optionMark form-original">*</span>';
            }
        }
        function setRequired(isOptional,message){
            return isOptional?"":"required oninvalid='setCustomValidity(\""+message+"\")' oninput='setCustomValidity(\"\")'";
        }
        //#region 创建表单元素
        function replacementOfInput(id){
            
            var input=$('<label class="form-replacement" id="_'+id+'" style="min-height:25px;">test</label>');
            return input;
        }
        function generateInputTypeBase(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholder="";
            if(hasPlaceHolder&&item.placeholder!=undefined) placeholder=' placeholder="'+item.placeholder+'"';
            var val="";
            if(item.type.toLowerCase()=="date"||item.type.toLowerCase()=="time"||item.type.toLowerCase()=="datetime") val=getDateTime();
            item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
            var input=$('<input type="'+item.type+'" class="form-original" name="'+id+'" id="'+id+'"'+placeholder+'" value="'+val+'" '+setRequired(item.isOptional,"此项必须填写")+'>');
            item_container.append(input);
            return input;
            //return item_container;
        }
        function generateTextAreaItem(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholder="";
            if(hasPlaceHolder&&item.placeholder!=undefined) placeholder=' placeholder="'+item.placeholder+'"';
            var textarea=$('<textarea class="form-original" cols="40" rows="4" name="'+id+'" id="'+id+'"'+placeholder+'" '+setRequired(item.isOptional,"此项必须填写")+'></textarea>');
            
            item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
            item_container.append(textarea);
            //item_container.find(".ui-input-text").css({"min-height":"60px"});
            return textarea;
            //console.log(item_container);
            //return item_container;
        }
        function generateFileItem(item_container,item,id){
            //var item_container=$('<div class="form_item_panel"></div>');
            item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
            var input=$('<input class="form-original" type="file" name="'+id+'" id="'+id+'" value="" '+setRequired(item.isOptional,"此项必须填写")+'>');
            item_container.append(input);
            return input;
            //return item_container;
        }
        function generateRadioItem(item_container,item,id){
            var radio_container=$('<fieldset class="form-original" id="'+id+'" data-role="controlgroup" data-type="horizontal" data-mini="true"></fieldset>');
            if(item.data){
                item.data.forEach((d,counter)=>{
                    var check="";
                    if(counter==0){
                        check='checked="checked"';
                    }
                    radio_container.append($('<input type="radio" name="'+id+'" id="'+id+'-'+counter+'" value="'+d+'" '+check+'>'+
                                '<label for="'+id+'-'+counter+'">'+d+'</label>'));
                });
            }
            //var item_container=$('<div class="form_item_panel"></div>');
            item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
            item_container.append(radio_container);
            return radio_container;
            //return item_container;
        }
        function generateComboBoxItem(item_container,item,id){
            var selectItem=$('<select class="form-original" name="'+id+'" id="'+id+'"'+
            (item.isFilterable?"class=\"filterSelect\" data-native-menu=\"false\"":"")+'" '+setRequired(item.isOptional,"此项必须选择")+'></select>');
            if(item.data){
                item.data.forEach((d,counter)=>{
                    selectItem.append($('<option value="'+counter+'">'+d+'</option>'));
                });
            }
            //var item_container=$('<div class="form_item_panel"></div>');
            item_container.append($('<label for="'+id+'" class="select">'+setOptionMark(item)+item.label+'</label>'));
            item_container.append(selectItem);
            //selectItem.selectmenu().selectmenu('refresh');
            return selectItem;
            //return item_container;
        }
        function generateMultiComboBoxItem(item_container,item,id){
            var selectItem=$('<select class="form-original" name="'+id+'[]" id="'+id+'" '+setRequired(item.isOptional,"此项必须选择")+' class="multiSelect'+
            (item.isFilterable?" filterSelect":"")+'" multiple="multiple" data-native-menu="false"></select>');
            if(item.data){
                if(item.data instanceof Array){
                    item.data.forEach((d,counter)=>{
                        //console.log(d)
                        selectItem.append($('<option value="'+counter+'">'+d+'</option>'));
                    });
                }else{
                    var opt_tip=$('<option></option>');
                    var tips=[];
                    $.each(item.data,function (key,value) {
                        tips.push(key);
                        var grounp=$('<optgroup label="'+key+'"></optgroup>')
                        value.forEach((d,counter)=>{
                            //console.log(d)
                            grounp.append($('<option value="'+key+counter+'">'+d+'</option>'));
                        });
                        selectItem.append(grounp);
                    })
                    opt_tip.text("选择 "+tips.join(" 或 "));
                }
                
            }
            item_container.append($('<label for="'+id+'" class="select">'+setOptionMark(item)+item.label+'</label>'));
            item_container.append(selectItem);
            //selectItem.selectmenu().selectmenu('refresh');
            return selectItem;
            //console.log('item_container');
            //console.log(item_container.html());
            //return item_container;
        }
        function pageIsSelectmenuDialog( page ) {
            var isDialog = false,
            id = page && page.attr( "id" );
            $( ".filterable-select" ).each( function() {
                if ( $( this ).attr( "id" ) + "-dialog" === id ) {
                    isDialog = true;
                    return false;
                }
            });
            return isDialog;
        }
        $.mobile.document
            // Upon creation of the select menu, we want to make use of the fact that the ID of the
            // listview it generates starts with the ID of the select menu itself, plus the suffix "-menu".
            // We retrieve the listview and insert a search input before it.
            .on( "selectmenucreate", ".filterSelect", function( event ) {
                var input,
                    selectmenu = $( event.target ),
                    list = $( "#" + selectmenu.attr( "id" ) + "-menu" ),
                    form = list.jqmData( "filter-form" );
                // We store the generated form in a variable attached to the popup so we avoid creating a
                // second form/input field when the listview is destroyed/rebuilt during a refresh.
                //$("#searchInput").remove();
                console.log("listview.......................");
                
                if ( !form ) {
                    //$("#filterForm").remove();
                    input = $( "<input data-type='search'></input>" );
                    form = $( "<form id='searchInput'></form>" ).append( input );
                    input.textinput();
                    list
                        .before( form )
                        .jqmData( "filter-form", form ) ;
                    form.jqmData( "listview", list );
                    list.jqmData('theme','a');
                    //list.listview( "refresh" );
                }
                
                // Instantiate a filterable widget on the newly created selectmenu widget and indicate that
                // the generated input form element is to be used for the filtering.
                //console.log($(form).html());
                var isOptgroup=$(selectmenu).find('optgroup').length>0;
                selectmenu
                    .filterable({
                        input: input,
                        children: "> "+(isOptgroup?"optgroup":"")+" option[value]"
                    })
                    // Rebuild the custom select menu's list items to reflect the results of the filtering
                    // done on the select menu.
                    .on( "filterablefilter", function() {
                        selectmenu.selectmenu( "refresh" );
                    });
            })
            // The custom select list may show up as either a popup or a dialog, depending on how much
            // vertical room there is on the screen. If it shows up as a dialog, then the form containing
            // the filter input field must be transferred to the dialog so that the user can continue to
            // use it for filtering list items.
            .on( "pagecontainerbeforeshow", function( event, data ) {
                //console.log("pagecontainerbeforeshow.............");
                var listview, form;
                if ( !pageIsSelectmenuDialog( data.toPage ) ) {
                    //return;
                }
                listview = data.toPage.find( "ul" );
                form = listview.jqmData( "filter-form" );
                // Attach a reference to the listview as a data item to the dialog, because during the
                // pagecontainerhide handler below the selectmenu widget will already have returned the
                // listview to the popup, so we won't be able to find it inside the dialog with a selector.
                data.toPage.jqmData( "listview", listview );
                // Place the form before the listview in the dialog.
                if($(listview).parent().find('#searchInput').length==0)
                    listview.before( form );
            })
            // After the dialog is closed, the form containing the filter input is returned to the popup.
            .on( "pagecontainerhide", function( event, data ) {
                //console.log("pagecontainerhide.............");
                var listview, form;
                if ( !pageIsSelectmenuDialog( data.toPage ) ) {
                    return;
                }
                listview = data.prevPage.jqmData( "listview" ),
                //console.log(data);
                form = listview.jqmData( "filter-form" );
                // Put the form back in the popup. It goes ahead of the listview.
                if($(listview).parent().find('#searchInput').length==0)
                    listview.before( form );
            });
            //#endregion
    },
    readOnly:function(isReadOnly){
        //if(isReadOnly) this.replacementIndexs={};
        console.log("isReadOnly........................."+isReadOnly+"--"+this.isReadOnly);
        if(isReadOnly==1) isReadOnly=true;
        if(this.isReadOnly==isReadOnly) return this;
        this.isReadOnly=isReadOnly;
        var _self=this;
        if(isReadOnly){
            $.each(_self.instance.find('.form-original'),(i,ele)=>{
                //console.log(ele.nodeName+"-->"+ele.id);
                //console.log(ele);
                var id=ele.id;
                switch(ele.nodeName.toUpperCase()){
                    case "INPUT":
                        //console.log($(ele).prop('type'));
                        _self.instance.find('#_'+id).text($(ele).val());
                        break;
                    case "TEXTAREA":
                        _self.instance.find('#_'+id).text($(ele).val());
                        break;
                    case "SELECT":
                        _self.instance.find('#_'+id).html(getSelectValue(ele).join('<br/>'));
                        break;
                    case "FIELDSET":
                        _self.instance.find('#_'+id).html(getRadioValue(ele).join('<br/>'));
                        break;
                }
            });
        }
        
        if(this.isReadOnly){
            _self.instance.find(".form-replacement").show();
            _self.instance.find('.form-original').hide();
            _self.instance.find('.ui-input-text').hide();
            _self.instance.find('.ui-select').hide();
        }else{
            _self.instance.find(".form-replacement").hide();
            _self.instance.find('.form-original').show();
            _self.instance.find('.ui-input-text').show();
            _self.instance.find('.ui-select').show();
        }
        
        //if(this.isReadOnly) _self.instance.find('.optionMark').addClass('hide');
        //else _self.instance.find('.optionMark').removeClass('hide');
        _self.instance.trigger('create');

        function getSelectValue(element){
            var val=[];
            $.each($(element).find(":selected"),function(index,opt){
                //console.log(itemTemplate.label+"--------->"+opt.value);
                val.push(opt.text);
            });
            return val;
        }
        function getRadioValue(element){
            var val=[];
            $.each($(element).find(":checked"),function(index,opt){
                //console.log(itemTemplate.label+"--------->"+opt.value);
                val.push(opt.value);
            });
            return val;
        }
        return _self;
    },
    setEmptyData:function(template){
        var _self=this;
        if(template==undefined) template=_self.instance.template;
        _self.instance.setEmptyData(template);
        return _self;
    },
    setData:function(data,template){
        var _self=this;
        
        this.data=data;
        //console.log(data);
        if(template==undefined) template=_self.instance.template;
        _self.instance.setData(data,template);
        return _self;
    }
}
$.fn.extend({
    setEmptyData:function(template){
        var _self=this;
        if(template==undefined) template=_self.template;
        
        $.each(template,(k,v)=>{
            var val=undefined;
            if(v.hasOwnProperty('type')){
                if(v.defaultValue!=undefined) val=v.defaultValue;
                _self.addData(v.type,k,val);
            }else{
                if(v.hasOwnProperty('data')){
                    
                    $.each(v.data,(kk,vv)=>{
                        var _val=undefined;
                        if(vv.hasOwnProperty('type')){
                            if(vv.defaultValue!=undefined) _val=vv.defaultValue;
                            _self.addData(vv.type,kk,_val);
                            
                        }
                    })
                }
            }
        });
    },
    setData:function(data,template){
        
        console.log("setData....")
        
        var data_keys=Object.keys(data);
        var _self=$(this);
        if(template==undefined) template=_self.template;
        console.log(data)
        $.each(template,(k,v)=>{
            if(v.hasOwnProperty('type')){
                var val=data[k];
                if(data_keys.includes(k)){
                    if(v.defaultValue!=undefined && (val==undefined || val.length==0)) val=v.defaultValue;
                    _self.addData(v.type,k,val);
                }
            }else{
                if(v.hasOwnProperty('data')){
                    $.each(v.data,(kk,vv)=>{
                        if(vv.hasOwnProperty('type')){
                            var _val=data[kk];
                            if(data_keys.includes(kk)){
                                if(vv.defaultValue!=undefined && (_val==undefined || _val.length==0)) _val=vv.defaultValue;
                                _self.addData(vv.type,kk,_val);
                            }
                        }
                    })
                }
            }
        });
        //_self.trigger('create');
    },
    addData:function(type,id,value,element){
        if(value==undefined) value="";
        var _self=$(this);
        if(element==undefined) element=_self.find('#'+id);
        if(element.length>0){
            if(type=="radio")  {
                if(value=="") value=0;
                var ele=_self.find("#"+id+"-"+parseInt(value)).prop( "checked", true );
                ele.checkboxradio().checkboxradio( "refresh" ).trigger("change");
                if(ele.length>0){
                    _self.find("#_"+id).text(ele.val());
                }
                    
            }else if(type=="multicombobox"){
                var _values=[];
                $(element).find("option").prop('selected',false);
                if(value!=null&&value!=undefined&&value.length>0){
                    value.split(",").forEach((v)=>{
                        var ele=$(element).find("option[value="+v+"]");
                        ele.prop('selected',true);
                        _values.push(ele.text());
                    });
                }
                _self.find("#_"+id).html(_values.join("<br/>"));
                element.selectmenu().selectmenu("refresh").trigger("change");
            }else if(type=="combobox"){
                
                if(value=="") value=0;
                var ele=$(element).find("option[value="+value+"]");
                ele.prop('selected',true);
                if(ele.length>0)
                    _self.find("#_"+id).text(ele.text());
                element.selectmenu().selectmenu("refresh").trigger("change");
            }else if(type=="date"||type=="datetime"||type=="time")  {
                if(value=="") value=new Date();
                element.val(getDateTime(value));
                _self.find("#_"+id).text(getDateTime(value));
            }else{
                element.val(value);
                _self.find("#_"+id).text(value);
            }
        }
    },
    getValues:function(dataId,template,response){
        
        if(template==undefined) template=this.template;
        var _Self=$(this);
        const values={"id":dataId};
        var catelogs=Object.keys(template);
        var _hasError=false;
        loop1:
        for(var catelog_key of catelogs){
            var catelog=template[catelog_key];
            
            if(catelog.data!=undefined && Object.keys(catelog.data).length>0){
                var catelog_item_keys=Object.keys(catelog.data);
                loop2:
                for(var item_key of catelog_item_keys){
                    //form_item_ids[item_key]=catelog.data[item_key];
                    var hasError=false;
                    if(catelog.data[item_key].type.toLowerCase()=='radio'){
                        //console.log(item_key);
                        //console.log(_Self.find('input[name="'+item_key+'"]:checked'));
                        values[item_key]=parseInt(_Self.find('input[name="'+item_key+'"]:checked').prop('id').replace(item_key+"-",""));
                    }else{
                        var element=document.getElementById(item_key);
                        values[item_key]= dataValidation(element,catelog.data[item_key],function(he){
                            if(he) {
                                response(error.FORM_EMPTY_VALUE,{data:values,success:!he});
                                _hasError=true;
                                hasError=true;
                                return;
                            }
                            //console.log(item_key+"-->"+hasError);
                        });
                    }
                    console.log(item_key+"-->"+hasError);
                    if(hasError) {
                        break loop1;
                    }
                };
            }
            //if(_hasError) return false;
        };
        /*
        values["caseCreateDate"]=getDateTime();
        //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
        if(getGlobal("currentUser")==null || getGlobal("currentUser")==undefined){
            console.log("currentUser-- has error value");
            response(error.FORM_INVALID_USER,values);
            return;
        }else{
            values["caseApplicant"]=JSON.parse(getGlobal("currentUser")).id;
        }
        */
        //response(hasError,values);
        
        response(error.FORM_VALIDATION_COMPLETED,{data:values,success:!_hasError});
        function dataValidation(element,itemTemplate,res){
            var hasError=false;
            switch (element.nodeName.toUpperCase()){
                case "INPUT":
                    
                    var val=element.value;
                    //console.log(element.type);
                    if(element.type.toLowerCase()=="date"||element.type.toLowerCase()=="time"||element.type.toLowerCase()=="datetime"){
                        val=new Date(val).toISOString().slice(0, 19).replace('T', ' ');
                    }else if(itemTemplate.numberOnly){
                        if(eval.length==0) val=0;
                        else val=parseInt(val);
                    }
                    if(val.length==0 && !itemTemplate.isOptional){
                        console.log(itemTemplate.label+"-- has error value"+val);
                        hasError=true;
                    }
                    res(hasError);
                    return val;
                case "SELECT":
                    //console.log(itemTemplate.label+"-->"+$(element).find(":selected").length);
                    var val=[];
                    $.each($(element).find(":selected"),function(index,opt){
                        //console.log(itemTemplate.label+"--------->"+opt.value);
                        val.push(opt.value);
                    });
                    if(val.length==0 && !itemTemplate.isOptional) {
                        console.log(itemTemplate.label+"-- has empty value"+val);
                        hasError=true;
                    }
                    res(hasError);
                    //console.log(itemTemplate.label+"("+val.length+")--------->"+val.join(","));
                    return val.join(",");
                case "TEXTAREA":
                    var val=element.value;
                    if(val.length==0 && !itemTemplate.isOptional){
                        console.log(itemTemplate.label+"-- has error value"+val);
                        hasError=true;
                    }
                    res(hasError);
                    return element.value;
            }
            
            
        }
    }

});
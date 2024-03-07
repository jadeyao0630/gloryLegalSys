function mform(arg){
    this.opt = {
        template:{},
        buttons:undefined,
        isAdmin:false,
    }
    this.init(arg);
    return this;
}
//获取数据
//getFormValues(vailidCallback)

//按Id获取数据
//getValeById(id,optional template)

//添加数据
//setValues(data)

//按Id添加数据
//setValueById(id,data)

//清空表格数据
//setEmptyValues()

mform.prototype={
    init:function(arg){
        var _self=this;
        this.self=this;
        for(var attr in arg){
            console.log(attr+": "+_self.opt[attr]+"-->"+arg[attr]);
            _self.opt[attr] = arg[attr];
        }
        var template=_self.opt.template;
        //console.log('template',template);
        _self.instance=$('<form onsubmit="javascript:return false;"></form>');
        _self.instance.jqmData('template',template.template);
        
        if(template.settings.width != undefined){
            _self.instance.css({width:template.settings.width});
        }
        if(template.settings.isCollapsibleGrouping){
            var catelogs=Object.keys(template.template);
            catelogs.forEach((catelog_key)=>{
                var catelog=template.template[catelog_key];
                //console.log(catelog);
                catelog_title_bar=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"></div>');
        
                catelog_title_bar.append($('<h4>'+catelog.label+'</h4>'));
                //var catelog_item_keys=Object.keys(catelog.data);
                
                catelog_title_bar.append(_self.setForm(catelog.data));
                _self.instance.append(catelog_title_bar);
            });
        }else{
            //console.log('setMainForm',template);
            _self.instance.append(_self.setForm(template.template));
        }
        _self.instance.trigger('create');
        //#region 
        function pageIsSelectmenuDialog( page ) {
            var isDialog = false,
            id = page && page.attr( "id" );
            $( ".filterSelect" ).each( function() {
                if ( $( this ).attr( "id" ) + "-dialog" === id ) {
                    isDialog = true;
                    return false;
                }
            });
            return isDialog;
        }
        $.mobile.document
            .on("selectmenucreate", '.multiSelect', function (event) {
                //console.error('selectmenucreate1');
                // var selectmenu = $( event.target ),
                //     list = $( "#" + selectmenu.attr( "id" ) + "-menu" );
                //     list.listview().listview('refresh');
                //     list.trigger('create'); 
                
                var selectmenu = $( event.target ),
                list = $( "#" + selectmenu.attr( "id" ) + "-listbox-popup" );
                var closeBtn=$(list).find('.ui-header .ui-icon-delete');
                closeBtn.removeClass('ui-icon-delete').addClass('ui-icon-check').addClass('btn-icon-green').removeClass('ui-btn-left').addClass('ui-btn-right');

                $('body').trigger('create');
            }).on( "pagecontainerbeforeshow", function( event, data ) {
                var _this=$(this);
                console.log('pagecontainerbeforeshow',_this);
                $(_this).trigger('create');
                var closeBtn=$(data.toPage).find('.ui-header .ui-icon-delete');
                    //console.error('selectmenucreate2',closeBtn);
                    //console.log('pagecontainerbeforeshow',data.toPage,closeBtn);
                closeBtn.removeClass('ui-icon-delete').addClass('ui-icon-check').addClass('btn-icon-green').removeClass('ui-btn-left').addClass('ui-btn-right');
                    
            }),
        
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
                
                if ( !form ) {
                    //$("#filterForm").remove();
                    input = $( "<input data-type='search'></input>" );
                    form = $( "<form></form>" ).append( input );
                    input.textinput();
                    list
                        .before( form )
                        .jqmData( "filter-form", form ) ;
                    form.jqmData( "listview", list );
                    
                    //list.listview( "refresh" );
                }
                var listbox=$( "#" + selectmenu.attr( "id" ) + "-listbox" );
                listbox.addClass('filterable-select-listbox');
                list.addClass('filterable-select-option');
                
                var isOptgroup=$(selectmenu).find('optgroup').length>0;
                selectmenu
                    .filterable({
                        input: input,
                        children: "> "+(isOptgroup?"optgroup":"")+" option[value]"
                    })
                    // Rebuild the custom select menu's list items to reflect the results of the filtering
                    // done on the select menu.
                    .on( "filterablefilter", function() {
                        selectmenu.selectmenu().selectmenu( "refresh" );
                    });
            })
            // The custom select list may show up as either a popup or a dialog, depending on how much
            // vertical room there is on the screen. If it shows up as a dialog, then the form containing
            // the filter input field must be transferred to the dialog so that the user can continue to
            // use it for filtering list items.
            .on( "pagecontainerbeforeshow", function( event, data ) {
                
                
                //console.log('pagecontainerbeforeshow',$( event.target ),$(data.toPage).attr('id').replace('-dialog',''));
                var listview, form;
                if ( !pageIsSelectmenuDialog( data.toPage ) ) {
                    
                    return;
                }
                
                var id=$(data.toPage).attr('id').replace('-dialog','');
                var closeBtn=$(data.toPage).find('.ui-header .ui-icon-delete');
                console.log('pagecontainerbeforeshow',data.toPage,closeBtn);
                closeBtn.removeClass('ui-icon-delete').addClass('ui-icon-check').addClass('btn-icon-green').removeClass('ui-btn-left').addClass('ui-btn-right');
                //closeBtn.on('click',function(e){
                    //e.preventDefault();
                    //history.back();
                //})
                data.toPage.find('a.ui-icon-check').on('click',function(e){
                    console.log('pagecontainerhide',$(data.toPage).find('input[data-type="search"]'),$(data.toPage));
                    if ( pageIsSelectmenuDialog( data.toPage ) ) {
                        $(data.toPage).find('input[data-type="search"]').val('');
                        $(data.toPage).find('input[data-type="search"]').trigger('keyup');
                        
                    }
                    
                })
                listview = data.toPage.find( "ul[id^="+id+"]" );
                
                form = listview.jqmData( "filter-form" );
                data.toPage.jqmData( "listview", listview );
                // Place the form before the listview in the dialog.
                //if($('#'+id+'-searchInput').length==0)
                    listview.before( form );
            })
            // After the dialog is closed, the form containing the filter input is returned to the popup.
            .on( "pagecontainerhide", function( event, data ) {
                
                var listview, form;
                if ( !pageIsSelectmenuDialog( data.toPage ) ) {
                    return;
                }
                console.log('data.prevPage',data.prevPage);
                if(listview==undefined) return;
                listview = data.prevPage.jqmData( "listview" ),
                form = listview.jqmData( "filter-form" );
                // Put the form back in the popup. It goes ahead of the listview.
                //if($('#'+id+'-searchInput').length==0)
                    listview.before( form );
            })
            //#endregion
    },
    setForm:function(data){
        var _this=this;
        var template=_this.opt.template;
        if(data instanceof Array || data==undefined) throw 'template format is wrong';
        var form_item_keys=Object.keys(data);//获取每个栏内元素id
        var form_row=_this.getFormRow();
        if(form_item_keys.length>0){
            form_item_keys.forEach((item_key,index)=>{
                form_row.append(_this.getFormItem(data,item_key));
            });
        }
        return form_row;
    },
    getFormRow:function(){
        var _this=this;
        var template=_this.opt.template;
        var form_row=$('<div class="form_grid"></div>');
        var form_row_style={};
        if(template.settings.templateColumn!=undefined){
            var columns=template.settings.templateColumn.split(" ");
            form_row_style=$.extend({}, form_row_style, {'gridTemplateColumns':template.settings.templateColumn,'padding-right':(20*(columns.length-1))+"px"});
        }
        if(template.settings.gridStyle!=undefined){
            form_row_style=$.extend({}, form_row_style,template.settings.gridStyle);
        }
        form_row.css(form_row_style);
        return form_row;
    },
    getFormItem:function(rowTemplate,key){
        var _this=this;
        var seetings=_this.opt.template.settings;
        var item_container=$('<div class="form_item_panel_tb"></div>');//标签在上方
        if(seetings.labelPosition != undefined && seetings.labelPosition=="left"){//标签在左边
            item_container=$('<div class="form_item_panel"></div>');
        }
        //console.log(key,_this.opt.isAdmin,rowTemplate[key].isAdminOnly)
        
        //if(key=='caseDate_f') console.log('span',rowTemplate);
        
        //console.log(key,rowTemplate);
        if(rowTemplate[key]!=undefined){
            var form_item_template =rowTemplate[key];
            if(form_item_template.hasOwnProperty('span')){
                item_container.css({'grid-column':form_item_template.span})
            }
            var form_item_type= form_item_template.type.toLowerCase() || 'text';
            var label;
            if(form_item_type=='label') {
                item_container=$('<div></div>');
                label=$('<label>'+(form_item_template.label || '')+'</label>')
                item_container.append(label);
            }else{
                label=_this.generateLabel(key,form_item_template);
                item_container.append(label);
            } 
            switch(form_item_type){
                case "text":
                    item_container.append(_this.generateInput(key,form_item_template));
                    break;
                case "password":
                    item_container.append(_this.generatePasswordInput(key,form_item_template));
                    break;
                case "number":
                    item_container.append(_this.generateInput(key,form_item_template));
                    break;
                case "checkbox":
                    label.prop('for',key)
                    item_container.append(_this.generateCheckbox(key,form_item_template));
                    break;
                case "date":
                    item_container.append(_this.generateInput(key,form_item_template));
                    break;
                case "datetime":
                    item_container.append(_this.generateInput(key,form_item_template));
                    break;
                case "time":
                    item_container.append(_this.generateInput(key,form_item_template));
                    break;
                case "email":
                    item_container.append(_this.generateInput(key,form_item_template));
                    break;
                case "tel":
                    item_container.append(_this.generateInput(key,form_item_template));
                    break;
                case "textrange":
                    item_container.append(_this.generateInputRange(key,form_item_template));
                    break;
                case "textarea":
                    item_container.append(_this.generateTextAreaItem(key,form_item_template));
                    break;
                case "radio":
                    item_container.append(_this.generateRadioItem(key,form_item_template));
                    break;
                case "file":
                    item_container.append(_this.generateFileInput(key,form_item_template));
                    break;
                case "checkgroup":
                    item_container.append(_this.generateCheckgroup(key,form_item_template));
                    break;
                case "combobox":
                    item_container.append(_this.generateComboBoxItem(key,form_item_template));
                    break;
                case "multicombobox":
                    form_item_template.isMultiple=true;
                    item_container.append(_this.generateComboBoxItem(key,form_item_template));
                    break;
                case "supermultiinput":
                    item_container.append(_this.generateSuperMultiInputItem(key,form_item_template));
                    break;
                case "supermulticombobox":
                    item_container.append(_this.generateSuperMultiSelectItem(key,form_item_template));
                    break;
                case "custom":
                    item_container.empty();
                    item_container.append(_this.generateCustomItem(form_item_template));
                    item_container.css({'grid-template-columns':'auto'})
                    break;
            }
            //console.log('mform 1',key,_this.opt.isAdmin,rowTemplate[key].isAdminOnly,(!_this.opt.isAdmin && rowTemplate[key].isAdminOnly))
            if(!_this.opt.isAdmin && rowTemplate[key].isAdminOnly){
                //console.log('mform 1',key,_this.opt.isAdmin,rowTemplate[key].isAdminOnly)
                item_container.addClass('admin-ui');
                //item_container.trigger('create')
            }   
        }
        return item_container;
    },
    setOptionMark:function(itemTemplate){
        if(itemTemplate.isOptional){
            return itemTemplate.label;
        }else{
            return '<span class="optionMark form-original">*</span>'+itemTemplate.label;
        }
    },
    setLabelStyle:function(label){
        var _this=this;
        var settings=_this.opt.template.settings;
        if(settings['labelStyle']){
            $(label).css(settings.labelStyle);
        }
    },
    setRequired:function(isOptional,message){
        return isOptional?"":" data-message='"+message+"' oninvalid='setCustomValidity(\""+message+"\")' oninput='setCustomValidity(\"\")' required";
    },
    setPlaceholder:function(itemTemplate){
        var _this=this;
        var settings=_this.opt.template.settings;
        if(settings['hasPlaceHolder']&&itemTemplate.placeholder!=undefined){
            return ' placeholder="'+itemTemplate.placeholder+'"';
        }
        else return '';
    },
    setPlaceHolders:function(itemTemplate){
        var _this=this;
        var settings=_this.opt.template.settings;
        var placeholders=['',''];
        
        
        if(settings['hasPlaceHolder']&&itemTemplate.placeholders instanceof Array){
            placeholders=[];
            itemTemplate.placeholders.forEach(placeholder=>{
                console.log(placeholder);
                placeholders.push(' placeholder="'+placeholder+'"');
            })
        }
        return placeholders;
    },
    setFiltableSelect:function(itemTemplate){
        var clss=["form-original"];
        if(itemTemplate.isFilterable) clss.push('filterSelect');
        if(itemTemplate.isMultiple) clss.push('multiSelect');
        if(itemTemplate.type.toLowerCase()=="supermultiinput") clss.push('supermultiInput');
        return 'class="'+clss.join(' ')+'"'+
                (itemTemplate.isFilterable||itemTemplate.isMultiple||itemTemplate.type.toLowerCase()=="supermultiinput"?' data-native-menu="false"':' data-native-menu="true"')+
                (itemTemplate.isMultiple?' multiple="multiple"':'');
    },
    generateCustomItem:function(itemTemplate){
        return $(itemTemplate.data);
    },
    generateLabel:function(itemId,itemTemplate){
        var _this=this;
        //console.log(itemTemplate,itemId);
        var label=$('<label>'+_this.setOptionMark(itemTemplate)+'</label>');
        _this.setLabelStyle(label);
        return label;
    },
    generateCheckbox:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || '';
        
        var input=$('<input type="'+itemTemplate.type.toLowerCase()+'" class="form-original" data-iconpos="right" name="'+itemId+'"'+' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+
                    ' value="'+value+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须正确填写")+'>');
        var subContainer=$('<div class="form-original"></div>');
        if(itemTemplate.isDisabled){
            input.attr("disabled",true);
        }
        subContainer.append(input);
        return subContainer;
    },
    generateInput:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || '';
        
        var input=$('<input type="'+itemTemplate.type.toLowerCase()+'" class="form-original" name="'+itemId+'"'+' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+
                    ' value="'+value+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须正确填写")+'>');
        var subContainer=$('<div class="form-original"></div>');
        if(itemTemplate.isDisabled){
            input.attr("disabled",true);
        }
        subContainer.append(input);
        return subContainer;
    },
    generatePasswordInput:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || '';
        var input=$('<input type="password" class="form-original" name="'+itemId+'"'+' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+
                    'data-wrapper-class="controlgroup-textinput ui-btn" style=""'+
                    ' value="'+value+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须正确填写")+'>');
        var subContainer=$('<div id="'+itemId+'_controlgroup" data-role="controlgroup" data-type="horizontal" class="form-original"></div>');
        if(itemTemplate.isDisabled){
            input.attr("disabled",true);
        }
        subContainer.append(input);
        var showHideBtn=$('<a herf="#" class="ui-btn ui-btn-icon-notext ui-icon-eye btn-eye">显示关闭</a>');
        showHideBtn.on('click',showHideBtnEvent);
        var changePassBtn=$('<a herf="#" class="ui-btn ui-btn-icon-notext btn-icon-blue ui-icon-edit btn-edit">修改</a>');
        changePassBtn.on('click',changePasswordBtnEvent);
        subContainer.append(showHideBtn);
        if(itemTemplate.isChangeable) {
            subContainer.append(changePassBtn);
            input.addClass("ui-state-disabled");
        }
        return subContainer;
        function changePasswordBtnEvent(e){
            if(changePassBtn.hasClass('ui-icon-edit')){
                if(!showHideBtn.hasClass('btn-icon-green')){
                    $().requestPasswordToChange(function(res){
                        if(res.success){
                            setChangeBtnState(changePassBtn,input,true);
                        }else{
                            $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
                        }
                    },'需要输入您的密码以进行下一步。')
                }else{
                    setChangeBtnState(changePassBtn,input,true);
                }
                
            }else{
                setChangeBtnState(changePassBtn,input,false);
            }
        }
        function showHideBtnEvent(e){
            if($(input).attr('type')=="text"){
                    
                setShowHideBtnState(showHideBtn,input,true);
            }
            else{
                if(!changePassBtn.hasClass('ui-icon-check')&&itemTemplate.isChangeable){
                    $().requestPasswordToChange(function(res){
                        if(res.success){
                            console.log("登陆成功。。")
                            setShowHideBtnState(showHideBtn,input,false);
                        }else{
                            $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
                        }
                    },'需要输入您的密码以进行下一步。')
                }else{
                    setShowHideBtnState(showHideBtn,input,false);
                }
                
                
            }
            //console.log(input.type)
            input.trigger('create')
            //input.val("changed")
            subContainer.trigger('create');
        }
        function setChangeBtnState(btn,input,isActived){
            if(isActived){
                input.removeClass("ui-state-disabled");
                input.trigger('create')
                //input.val("changed")
                //subContainer.trigger('create');
                btn.removeClass('ui-icon-edit').addClass('ui-icon-check');;
                btn.removeClass('btn-icon-blue').addClass('btn-icon-green');
                btn.trigger('create');
                //subContainer.trigger('create');
            }else{
                input.addClass("ui-state-disabled");
                input.trigger('create')
                //input.val("changed")
                //subContainer.trigger('create');
                btn.removeClass('ui-icon-check').addClass('ui-icon-edit');;
                btn.removeClass('btn-icon-green').addClass('btn-icon-blue');
                btn.trigger('create');
                //subContainer.trigger('create');
            }
        }
        function setShowHideBtnState(btn,input,isShown){
            if(isShown){
                $(input).attr('type',"password");
                $(btn).removeClass('btn-icon-green');
            }else{
                $(input).attr('type',"text");
                $(btn).addClass('btn-icon-green');
            }
            
        }
    },
    generateInputRange:function(itemId,itemTemplate){
        var _this=this;
        //var value=itemTemplate.defaultValue || '';
        var placeholders=_this.setPlaceHolders(itemTemplate);
        var subContainer=$('<div class="form-original" name="'+itemId+'" id="'+itemId+'" style="display:grid;grid-template-columns: 1fr auto 1fr;grid-gap:0px;" '+
                        _this.setRequired(itemTemplate.isOptional,"此项必须填写完整")+'></div>');
        var type='text';
        if(itemTemplate['subType']) type=itemTemplate.subType;
        for(var i=0;i<2;i++){
            //console.log(placeholders[i]);
            var input=$('<input type="'+type+'" class="form-original" name="'+itemId+'_'+i+'"'+' id="'+itemId+'_'+i+'"'+
                        _this.setRequired(itemTemplate.isOptional,"此项必须填写完整")+placeholders[i]+'" value="">');
            if(itemTemplate.isDisabled){
                input.attr("disabled",true);
            }
            if(i==0) {
                subContainer.prepend(input);
                var dash=$('<label style="text-align: center;min-width:40px;"> 到 </label>');
                subContainer.append(dash);
            }
            else subContainer.append(input);
        }
        return subContainer;
    },
    generateTextAreaItem:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || '';
        var textarea=$('<textarea class="form-original" cols="40" rows="2" name="'+itemId+'"'+' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须填写")+'>'+value+'</textarea>');
        var subContainer=$('<div class="form-original"></div>');
        
        if(itemTemplate.isDisabled){
            textarea.attr("disabled",true);
        }
        subContainer.append(textarea);
        return subContainer;
    },
    generateRadioItem:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || 0;
        var radio_container=$('<fieldset class="form-original" name="'+itemId+'" id="'+itemId+'" data-role="controlgroup" data-type="horizontal" data-mini="true"></fieldset>');
            if(itemTemplate.data){
                itemTemplate.data.forEach((d,counter)=>{
                    var check="";
                    if(counter==value){
                        check='checked="checked"';
                    }
                    if(d instanceof Object){
                        var textAndValue=_this.getDisplayTextAndValue(d,itemTemplate);
                        if(textAndValue.value==value){
                            check='checked="checked"';
                        }else{
                            check='';
                        }
                        textAndValue.value=(textAndValue.value==undefined?counter:textAndValue.value);
                        radio_container.append($('<input type="radio" name="'+itemId+'" id="'+itemId+'-'+textAndValue.value+
                                                    '" data-label="'+textAndValue.text+'" value="'+textAndValue.value+'" '+check+'>'+
                        '<label for="'+itemId+'-'+textAndValue.value+'">'+textAndValue.text+'</label>'));
                    }else{
                        radio_container.append($('<input type="radio" name="'+itemId+'" id="'+itemId+'-'+counter+'" data-label="'+d+'" value="'+counter+'" '+check+'>'+
                        '<label for="'+itemId+'-'+counter+'">'+d+'</label>'));
                    }
                });
            }
            if(itemTemplate.isDisabled){
                radio_container.attr("disabled",true);
            }
            
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(radio_container);
            //radio_container.find('input[type="radio"]').checkboxradio().checkboxradio('refresh');
            return subContainer;
    },
    generateCheckgroup:function(itemId,itemTemplate){
            
        var fieldset=$('<fieldset class="form-controlgroup" data-role="controlgroup" data-type="horizontal" id="'+itemId+'" style="border-radius: 0;"></fieldset>');
        
        var subContainer=$('<div class="form-original"></div>');
        if(itemTemplate.data){
            itemTemplate.data.forEach((value,index)=>{
                //if(displayFormat)
                //console.log('generateCheckgroup',value);
                var id=(itemTemplate.valueKey?value[itemTemplate.valueKey]:index);
                var label=value;
                if(itemTemplate.hasOwnProperty('displayFormat')){
                    label=itemTemplate.displayFormat;
                    $.each(value,(k,v)=>{
                        label=label.replace("{"+k+"}",v);
                    })
                }
                //console.log('generateCheckgroup',label);
                var input = $('<input type="checkbox" name="'+id+'" id="'+id+'" class="controlGroup-checkbox">');
                var label = $('<label for="'+id+'" class="controlGroup-checkbox">'+label+'</label>');
                fieldset.append(input);
                fieldset.append(label);
            })
        }
        if(itemTemplate.isDisabled){
            fieldset.attr("disabled",true);
        }
        subContainer.append(fieldset);
        return subContainer;
    },
    generateFileInput:function(itemId,itemTemplate){
        var accept=itemTemplate.accept?' accept="'+itemTemplate.accept+'"':'';
            
        var input=$('<input class="form-original" type="file" name="'+itemId+'" id="'+itemId+'" value=""'+accept+' '+this.setRequired(itemTemplate.isOptional,"此项必须选择")+'>');
        //item_container.append(input);
        
        var subContainer=$('<div class="form-original"></div>');
        
        if(itemTemplate.isDisabled){
            input.attr("disabled",true);
        }
        if(itemTemplate.isMultiple){
            input.prop("multiple", true);
        }
        subContainer.append(input);
        return subContainer;
    },
    getDisplayTextAndValue:function(data,itemTemplate,key){
        var text='';
        var value;
        if(itemTemplate.hasOwnProperty('displayFormat')){
            text=itemTemplate.displayFormat;
            $.each(data,(k,v)=>{
                text=text.replace("{"+k+"}",v);
            })
        }else{
            var collector=[];
            $.each(data,(k,v)=>{
                collector.push(v);
            })
            text=collector.join(" ");
        }
        if(itemTemplate['valueKey']!=undefined && data[itemTemplate.valueKey]!=undefined){
            value=data[itemTemplate.valueKey]
        }
        if(itemTemplate['valueFormat']&&key.length>0){
            value=itemTemplate.valueFormat;
            //console.log();
            if(value.indexOf('key')>-1){
                value = value.replace('{key}',key)
            }
            $.each(data,(k,v)=>{
                value = value.replace('{'+k+'}',v)
            });
            
            //d.hasOwnProperty(item.matchKey)?d[item.matchKey]:)
        }
        return {text:text,value:value};
    },
    generateComboBoxItem:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || 0;
        var selectItem=$('<select name="'+itemId+'" id="'+itemId+'"'+
                            this.setFiltableSelect(itemTemplate)+'" '+this.setRequired(itemTemplate.isOptional,"此项必须选择")+'></select>');
        if(itemTemplate.data){
            if(itemTemplate.data instanceof Array){
                itemTemplate.data.forEach((d,counter)=>{
                    //console.log()
                    if(d==null) d="";
                    var option=setOptionItem(counter,d,itemTemplate);
                    if(d instanceof Object) {
                        if(!d.isInactived) selectItem.append(option);
                    }else{
                        selectItem.append(option);
                    }
                });
            }else{
                $.each(itemTemplate.data,function(key,value){
                    if(key=="无"){
                        selectItem.append($('<option value="'+key+0+'">'+key+'</option>'));
                    }else{
                        var grounp=$('<optgroup label="'+key+'"></optgroup>')
                        value.forEach((d,counter)=>{
                            var option=setOptionItem(counter,d,itemTemplate,key);
                            if(!d.isInactived) {
                                grounp.append(option);
                            }
                        });
                        selectItem.append(grounp);
                    }
                })
            }
        }
        var subContainer=$('<div class="form-original" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"></div>');
        subContainer.append(selectItem);
        
        console.log('generateComboBoxItem',itemId,itemTemplate,itemTemplate.isDisabled);
        if(itemTemplate.isDisabled){
            selectItem.prop("disabled",true);
        }
        $(selectItem).on('change',function(){
            console.log('change',$(this).find('option.emptyOption'));
            if($(this).children('option:selected').text()!='无'){
                $($.grep($(this).find('option'),option=>$(option).text()==="无")).prop('selected',false);;
            }
        });
        selectItem.trigger('create');
        //selectItem.selectmenu().selectmenu('refresh')
        subContainer.trigger('create');
        return subContainer;
        function setOptionItem(index,data,itemTemplate,key){
            key=key||'';
            var selected='';
            if(data.constructor === Object){//'{name} {contact} {institution}'
                var textAndValue=_this.getDisplayTextAndValue(data,itemTemplate,key);
                textAndValue.value=(textAndValue.value==undefined?index:textAndValue.value);
                if(textAndValue.value==value) selected=' selected';
                return $('<option value="'+textAndValue.value+'"'+selected+'>'+textAndValue.text+'</option>');
            }else{
                if(index==value) selected=' selected';
                return $('<option value="'+key+index+'"'+selected+'>'+data+'</option>');
            }
        }
        
    },
    generateSuperMultiInputItem:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || 0;
        var subContainer=$('<div class="form-original" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" ></div>');
        var select=$('<div id="'+itemId+'" class="ui-select" data-placeholder="'+itemTemplate.placeholder+'"'+
                        _this.setRequired(itemTemplate.isOptional,"此项必须选择")+
                        ' data-displayFormat="'+itemTemplate.displayFormat+'"'+
                        ' data-optionFormat="'+itemTemplate.optionFormat+'"'+
                        ' data-valueKey="'+itemTemplate.valueKey+'"'+
                        ' data-matchKey="'+itemTemplate.matchKey+'"'+
                        ' data-valueFormat="'+itemTemplate.valueFormat+'"></div>');

        select.superMultiInput(itemTemplate);
        
        if(itemTemplate.isDisabled){
            select.attr("disabled",true);
        }
        subContainer.append(select);
        select.on('multiselectChanged',function(e){
            console.log('multiselectChanged',e);
            //this.currentData[e.id]=e.values.join();
        })
        //select.setSuperMultiInputValues('2公司');
        //console.log('SuperMultiInput',select.getSuperFormValue());
        return subContainer;
        
    },
    generateSuperMultiSelectItem:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || 0;
        var subContainer=$('<div class="form-original" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" ></div>');
        var select=$('<div id="'+itemId+'" class="ui-select" data-placeholder="'+itemTemplate.placeholder+'"'+
                    _this.setRequired(itemTemplate.isOptional,"此项必须选择")+
                    ' data-displayFormat="'+itemTemplate.displayFormat+'"'+
                    ' data-optionFormat="'+itemTemplate.optionFormat+'"'+
                    ' data-valueKey="'+itemTemplate.valueKey+'"'+
                    ' data-matchKey="'+itemTemplate.matchKey+'"'+
                    ' data-valueFormat="'+itemTemplate.valueFormat+'"></div>')
        select.superMultiSelect(itemTemplate);
        
        if(itemTemplate.isDisabled){
            select.attr("disabled",true);
        }
        subContainer.append(select);
        
        //select.setSuperMultiSelectValues('4公司21',casePersonnel,itemTemplate.valueKey,itemTemplate.matchKey);
        select.on('multiselectChanged',function(e){
            console.log('multiselectChanged',e);
            //this.currentData[e.id]=e.values.join();
        })
        //select.setSuperMultiSelectValues('2公司25',casePersonnel,itemTemplate.valueKey,itemTemplate.matchKey);
        //console.log('SuperMultiSelect',select.getSuperFormValue(true));
        return subContainer;
        
    },
    getItemTemplate:function(id){
        var template=this.opt.template.template;
        //console.log('getItemTemplate 1',id,template);
        var _itemTemplate;
        $.each(template,(key,itemTemplate)=>{
            if(itemTemplate.data!=undefined && itemTemplate.type==undefined){
                $.each(itemTemplate.data,(subKey,subItemTemplate)=>{
                    if(subKey==id) {
                        _itemTemplate = subItemTemplate
                        return false;
                    }
                });
                if(_itemTemplate!=undefined) return false;
            }else{
                if(key==id) {
                    _itemTemplate = itemTemplate
                    return false;
                }
            }
        })
        return _itemTemplate;
    },
    setValues:function(data,prefix){
        console.log('setValues',data,prefix);
        prefix=prefix||'';
        //var template=this.opt.template.template;
        this.currentData=data;
        var _this=this;
        //var templateKeys=Object.keys(template);
        if (data instanceof Object){
            $.each(data,(id,val)=>{
                _this.setValueById(id+prefix,val);
                
            })
        }
    },
    setEmptyValues:function(){
        var template=this.opt.template.template;
        //this.currentData=data;
        var _this=this;
        //var templateKeys=Object.keys(template);
        $.each(template,(key,itemTemplate)=>{
            console.log(key,itemTemplate);
            if(itemTemplate.data!=undefined && itemTemplate.type==undefined){
                $.each(itemTemplate.data,(subKey,subItemTemplate)=>{
                    _this.setValueById(subKey,undefined);
                });
            }else{
                _this.setValueById(key,undefined);
            }
        })
    },
    setValueById:function(id,val){
        var _this=this;
        var itemTemplate=_this.getItemTemplate(id);
        //console.log('itemTemplate type',id,itemTemplate,this.opt.template.template);
        var element=$(_this.instance).find('#'+id);
        
        if(itemTemplate==undefined) return;
        if(val==undefined || val == null || val=="undefined"){
            if (itemTemplate.defaultValue!=undefined) val=itemTemplate.defaultValue;
        }
        //console.log('setValues',id,val,itemTemplate);
        if(itemTemplate.type.toLowerCase()=="supermulticombobox"){
            if (val==null) val="";
            element.setSuperMultiSelectValues(val,itemTemplate.data,itemTemplate.valueKey,itemTemplate.matchKey);
        }else if(itemTemplate.type.toLowerCase()=="supermultiinput"){
            if (val==null) val="";
            element.setSuperMultiInputValues(val);
        }else if(itemTemplate.type.toLowerCase()=="checkbox"){
            element.prop('checked',val);
        }else if(itemTemplate.type.toLowerCase()=="checkgroup"){
            if(val.constructor == String) {
                if(val.indexOf(',')>-1)
                    val=val.split(',');
                else
                    val=[val];
            }
            console.log('checkgroup',val);
            $.each(element.find('input'),(index,input)=>{
                result.push($(input).prop('checked',val.includes($(input).attr('id'))));
            });
        }else if(itemTemplate.type.toLowerCase()=="combobox"){
            if (val==null) val=-1;
            if(val.constructor ==String){
                val=getNumbers(val)
                if(val!=null && val.length>0){
                    val=val[0];
                }else{
                    console.error("combobox value 有问题",id,val)
                }
            }
            element.find('option').prop('selected',false);
            element.find('option[value="'+val+'"]').prop('selected',true);
            element.selectmenu().selectmenu('refresh');
        }else if(itemTemplate.type.toLowerCase()=="multicombobox"){
            element.find('option').prop('selected',false);
            if (val==undefined) val=-1;
            if(val.constructor ==String){
                /*
                val=getNumbers(val)
                if(val==null || val.length==0){
                    console.error("multi combobox value 有问题",id,val);
                }
                */
                val=val.split(',');
            }
            if(val instanceof Array){
                val.forEach(v=>{
                    element.find('option[value="'+v+'"]').prop('selected',true);
                })
            }else{
                element.find('option[value="'+val+'"]').prop('selected',true);
            }
            element.selectmenu().selectmenu('refresh');
        }else if(itemTemplate.type.toLowerCase()=="date" || itemTemplate.type.toLowerCase()=="datetime" || itemTemplate.type.toLowerCase()=="time") {
            console.log('日期 set 1',id,val);
            if(val!='0000-00-00 00:00:00' && val!='0000-00-00' && val!='00:00:00' && val!='1999-11-29T16:00:00.000Z' && val!='1999-11-30T00:00:00.000Z'){
                if( itemTemplate.type.toLowerCase()=="date") val=formatDateTime(new Date(val),'yyyy-MM-dd');
                if( itemTemplate.type.toLowerCase()=="datetime") val=formatDateTime(new Date(val),'yyyy-MM-dd');
                if( itemTemplate.type.toLowerCase()=="time") val=formatDateTime(new Date(val),'HH:mm:ss');
                if(itemTemplate.dateFormate!=undefined){
                    val=formatDateTime(new Date(val),itemTemplate.dateFormate);
                }
            }
            console.log('日期 set 2',id,val);
            element.val(val);
        }else if(itemTemplate.type.toLowerCase()=="radio")  {
            var eles=element.find("input[id^="+id+"]");
            val=val||0;
            console.log('radio',id,val,eles);
            eles.prop( "checked", false );
            if(eles.length>0){
                $.each(eles,(index,ele)=>{
                    if($(ele).val()==val){
                        $(ele).prop( "checked", true );
                        
                        //console.log("radio",$(ele).data('label'));
                        element.find("#_"+id).text($(ele).data('label'));
                    }else{
                        $(ele).prop( "checked", false );
                    }
                    $(ele).checkboxradio().checkboxradio( "refresh" ).trigger("change");
                })
            }
                
        }else if(itemTemplate.type.toLowerCase()=="textrange"){
            var inputs=element.find('input[id^='+id+']');
            if(val==undefined) val=",";
            var rangeVals= val.split(',');
            if(inputs.length!=rangeVals.length) {
                console.error("textrange 值 和 元素数量不匹配",id,val)
            }else{
                rangeVals.forEach((v,index)=>{
                    //console.log('textrange',v,index)
                    $(inputs[index]).val(v);
                })
            }
        }else if(itemTemplate.type.toLowerCase()=="file"){
        }else{
            element.val(val);
        }
    },
    getValeById:function(id,itemTemplate,prefix){
        var _this=this;
        if(itemTemplate==undefined) itemTemplate=_this.getItemTemplate(id);
        var element=$(_this.instance).find('#'+id);
        if(element.length==0) {
            console.error('未能找到表格元素id:'+id+", 从而获取它的值.")
            return undefined;
        }
        if(itemTemplate.type.toLowerCase()=="supermulticombobox"){
            var values=element.getSuperFormValue(true);
            if(!itemTemplate.isOptional && values.length==0){
                return null;
            }
            return values.join();
        }else if(itemTemplate.type.toLowerCase()=="supermultiinput"){
            var values=element.getSuperFormValue(false);
            if(!itemTemplate.isOptional && values.length==0){
                return null;
            }
            return values.join();
        }else if(itemTemplate.type.toLowerCase()=="checkbox"){
            return element.prop('checked');
        }else if(itemTemplate.type.toLowerCase()=="checkgroup"){
            var result=[];
            $.each(element.find('input:checked'),(index,input)=>{
                result.push($(input).attr('id'));
            });
            //console.log('generateCheckgroup',result);
            return result;
        }else if(itemTemplate.type.toLowerCase()=="combobox"){
            var selected=element.find('option:selected');
            console.log('combobox',id,selected.val());
            if(!itemTemplate.isOptional && (selected.val().length==0 || selected.text()=="无")){
                return null;
            }
            return selected.val();
        }else if(itemTemplate.type.toLowerCase()=="multicombobox"){
            var selected=element.find('option:selected');
            console.log('multicombobox',id,selected.val());
            var values=[];
            $.each(selected,(index,option)=>{
                values.push($(option).val());
            });
            if(!itemTemplate.isOptional && values.length==0){
                return null;
            }
            return values.join();
        }else if(itemTemplate.type.toLowerCase()=="textrange"){
            var inputs=element.find('input[id^='+id+']');
            //console.log('multicombobox',id,inputs.val(),inputs);
            var values=[];
            $.each(inputs,(index,input)=>{
                values.push($(input).val());
            });
            if(!itemTemplate.isOptional){
                var isVailid=true;
                values.forEach(v=>{
                    if(v.length==0) {
                        isVailid=false;
                        return false;
                    }
                })
                if (!isVailid) return null;
                
            }
            return values.join();
        }else if(itemTemplate.type.toLowerCase()=="date" || itemTemplate.type.toLowerCase()=="datetime" || itemTemplate.type.toLowerCase()=="time") {
            
            var val=element.val();
            console.log('日期 get1',id,val);
            if(element.val().length==0){
                
                if(!itemTemplate.isOptional){
                    return null;
                }
                if( itemTemplate.type.toLowerCase()=="date") val="0000-00-00 00:00:00";
                if( itemTemplate.type.toLowerCase()=="datetime") val="0000-00-00 00:00:00";
                if( itemTemplate.type.toLowerCase()=="time") val="00:00:00";
                //val='NULL';
            }else{
                if( itemTemplate.type.toLowerCase()=="date") val=formatDateTime(new Date(val),'yyyy-MM-dd HH:mm:ss');
                if( itemTemplate.type.toLowerCase()=="datetime") val=formatDateTime(new Date(val),'yyyy-MM-dd HH:mm:ss');
                if( itemTemplate.type.toLowerCase()=="time") val=formatDateTime(new Date(val),'HH:mm:ss');
            }
            
            console.log('日期 get2',id,val);
            //console.log('日期',id,val);
            return val;
        }else if(itemTemplate.type.toLowerCase()=="radio")  {
            var eles=element.find("input[id^="+id+"]:checked");
            //console.log('radio',id,eles.val());
            if(!itemTemplate.isOptional && eles.length==0){
                return null;
            }
            return eles.val();
        }else if(itemTemplate.type.toLowerCase()=="file"){
            console.log('file',id,$(element).prop('files').length);
            if(!itemTemplate.isOptional && $(element).prop('files').length==0){
                return null;
            }
            return $(element).prop('files');
        }else{
            if(!itemTemplate.isOptional && element.val().length==0){
                return null;
            }
            return element.val();
        }
    },
    getFormValues:function(valiationCallback){
        var template=this.opt.template.template;
        console.log('getFormValues',template,this);
        var _this=this;
        var values={};
        var unSuccess=[];
        console.log(this.opt.template,template);
        $.each(template,(key,itemTemplate)=>{
            if(itemTemplate.data!=undefined && itemTemplate.type==undefined){
                $.each(itemTemplate.data,(subKey,subItemTemplate)=>{
                    if(subKey=="__formLabel" || subKey=="custom") return;
                    var value=_this.getValeById(subKey,subItemTemplate);
                    if(value==null) unSuccess.push(subKey);
                    values[subKey]=value;
                });
            }else{
                if(key=="__formLabel" || key=="custom") return;
                var value=_this.getValeById(key,itemTemplate);
                if(value==null) unSuccess.push(key);
                values[key]=value;
            }
        });
        if(unSuccess.length>0){
            _this.showValiationTooltip(unSuccess[0]);
        }
        if(valiationCallback!=undefined) valiationCallback({success:unSuccess.length==0,values:values,valiation:unSuccess});
        return values;
    },
    showValiationTooltip:function(id){
        $('#'+id).tooltipWithId('show', $('#'+id).jqmData('message'));
        $('#'+id).on('click keyup',function(e){
            $('#'+id).tooltipWithId('hide');
        })
    },
}
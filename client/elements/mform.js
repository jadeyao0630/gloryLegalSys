function mform(arg){
    this.opt = {
        template:{},
        buttons:undefined,
    }
    this.init(arg);
}
mform.prototype={
    init:function(arg){
        var _self=this;
        for(var attr in arg){
            console.log(attr+": "+_self.opt[attr]+"-->"+arg[attr]);
            _self.opt[attr] = arg[attr];
        }
        var template=_self.opt.template;
        console.log('template',template);
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
                    list.jqmData('theme','a');
                    
                    //list.listview( "refresh" );
                }
                selectmenu.jqmData('theme','a');
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
                data.toPage.find('a.ui-icon-delete').on('click',function(e){
                    //console.log('pagecontainerhide',$(data.toPage).find('input[data-type="search"]').val());
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
            .on("pagecreate", function () {
                //$(".smlFontForm .ui-select.ui-mini").selectmenu().selectmenu("widget").addClass("ui-mini");
                
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
        //console.log(key,rowTemplate);
        if(rowTemplate[key]!=undefined){
            var form_item_template =rowTemplate[key];
            var form_item_type= form_item_template.type.toLowerCase() || 'text';
            
            if(form_item_type=='label') {
                item_container=$('<div></div>');
                var label=$('<label>'+(form_item_template.label || '')+'</label>')
                item_container.append(label);
            }else
                item_container.append(_this.generateLabel(key,form_item_template));
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
        return isOptional?"":" data-message='"+message+"' required oninvalid='setCustomValidity(\""+message+"\")' oninput='setCustomValidity(\"\")'";
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
    generateLabel:function(itemId,itemTemplate){
        var _this=this;
        //console.log(itemTemplate,itemId);
        var label=$('<label>'+_this.setOptionMark(itemTemplate)+'</label>');
        _this.setLabelStyle(label);
        return label;
    },
    generateInput:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || '';
        
        var input=$('<input type="'+itemTemplate.type.toLowerCase()+'" class="form-original" name="'+itemId+'"'+' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+
                    ' value="'+value+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须正确填写")+'>');
        var subContainer=$('<div class="form-original"></div>');
        subContainer.append(input);
        return subContainer;
    },
    generatePasswordInput:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || '';
        var input=$('<input type="password" class="form-original" name="'+itemId+'"'+' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+
                    'data-wrapper-class="controlgroup-textinput ui-btn"'+
                    ' value="'+value+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须正确填写")+'>');
        var subContainer=$('<div id="'+itemId+'_controlgroup" data-role="controlgroup" data-type="horizontal" class="form-original"></div>');
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
        var subContainer=$('<div class="form-original" name="'+itemId+'" style="display:grid;grid-template-columns: 1fr auto 1fr;grid-gap:0px;"></div>');
        var type='text';
        if(itemTemplate['subType']) type=itemTemplate.subType;
        for(var i=0;i<2;i++){
            console.log(placeholders[i]);
            var input=$('<input type="'+type+'" class="form-original" name="'+itemId+'_'+i+'"'+' id="'+itemId+'_'+i+'"'+
                        placeholders[i]+'" value="" '+_this.setRequired(itemTemplate.isOptional,"此项必须填写")+'>');
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
        var textarea=$('<textarea class="form-original" cols="40" rows="1" name="'+itemId+'"'+' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须填写")+'>'+value+'</textarea>');
        var subContainer=$('<div class="form-original"></div>');
        
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
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(radio_container);
            return subContainer;
    },
    generateFileInput:function(itemId,itemTemplate){
        var accept=itemTemplate.accept?' accept="'+itemTemplate.accept+'"':'';
            
        var input=$('<input class="form-original" type="file" name="'+itemId+'" id="'+itemId+'" value=""'+accept+' '+this.setRequired(itemTemplate.isOptional,"此项必须填写")+'>');
        //item_container.append(input);
        var subContainer=$('<div class="form-original"></div>');
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
            if(_value.indexOf('key')>-1){
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
                    selectItem.append(setOptionItem(counter,d,itemTemplate));
                });
            }else{
                $.each(item.data,function(key,value){
                    if(key=="无"){
                        selectItem.append($('<option value="'+key+0+'">'+key+'</option>'));
                    }else{
                        var grounp=$('<optgroup label="'+key+'"></optgroup>')
                        value.forEach((d,counter)=>{
                            grounp.append(setOptionItem(counter,d,itemTemplate,key));
                        });
                        selectItem.append(grounp);
                    }
                })
            }
        }
        var subContainer=$('<div class="form-original"></div>');
        subContainer.append(selectItem);
        $(selectItem).on('change',function(){
            console.log('change',$(this).find('option.emptyOption'));
            if($(this).children('option:selected').text()!='无'){
                $($.grep($(this).find('option'),option=>$(option).text()==="无")).prop('selected',false);;
            }
        });
        return subContainer;
        function setOptionItem(index,data,itemTemplate,key){
            key=key||'';
            var selected='';
            if(data.constructor === Object){//'{name} {contact} {institution}'
                var textAndValue=_this.getDisplayTextAndValue(data,itemTemplate);
                textAndValue.value=(textAndValue.value==undefined?index:textAndValue.value);
                if(textAndValue.value==value) selected=' selected';
                return $('<option value="'+key+textAndValue.value+'"'+selected+'>'+textAndValue.text+'</option>');
            }else{
                if(index==value) selected=' selected';
                return $('<option value="'+key+index+'"'+selected+'>'+d+'</option>');
            }
        }
        
    },
    generateSuperMultiInputItem:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || 0;
        var subContainer=$('<div class="form-original"></div>');
        var select=$('<div id="'+itemId+'" class="ui-select" data-placeholder="'+itemTemplate.placeholder+'"></div>')

        select.superMultiInput();
        subContainer.append(select);
        return subContainer;
        
    },
}
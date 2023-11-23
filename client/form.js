
function mform(arg){
    this.opt = {
        template:FormTemplate,
        buttons:undefined,
    }
    this.replacementIndexs={};
    this.init(arg)
    
}
mform.prototype={
    init:function(arg){
        var _self=this;
        _self.elements={};
        for(var attr in arg){
            console.log(attr+": "+_self.opt[attr]+"-->"+arg[attr]);
            _self.opt[attr] = arg[attr];
        }
        var template=_self.opt.template;
        if(template.settings.textareaHeight != undefined){
            loadCssCode('textarea.ui-input-text {min-height: '+template.settings.textareaHeight+'px;}')
        }
        var form_width="";
        if(template.settings.textareaHeight != undefined && template.settings.textareaHeight!=Number.NaN){
            form_width=' style="width:'+template.settings.width+';"'
        }
        
        //var formItemIds=[];
        _self.instance=$('<form'+form_width+'></form>');
        var catelogs=Object.keys(template.template);
        catelogs.forEach((catelog_key)=>{
            var catelog=template.template[catelog_key];
            //console.log(catelog);
            catelog_title_bar=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"></div>');
    
            catelog_title_bar.append($('<h4>'+catelog.label+'</h4>'));
            var catelog_item_keys=Object.keys(catelog.data);
            if(catelog.data!=undefined && catelog_item_keys.length>0){
                
                var columns=template.settings.templateColumn.split(" ");
                var row_grid=$('<div class="form_grid"></div>');
                row_grid.css({'gridTemplateColumns':template.settings.templateColumn,'padding-right':(20*(columns.length-1))+"px"});
                
                var stepControler=0;
                
                catelog_item_keys.forEach((item_key)=>{
                    //console.log(item_key);
                    var item=catelog.data[item_key];
                    //console.log(item.type);
                    if(item.type!=undefined){
                        
                        var item_container=$('<div class="form_item_panel_tb"></div>');
                        if(template.settings.labelPosition != undefined && template.settings.labelPosition=="left"){
                            item_container=$('<div class="form_item_panel"></div>');
                        }
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
                        row_grid.append(item_container);
                    }
                    stepControler++;
                });
            }
            catelog_title_bar.append(row_grid);
            _self.instance.append(catelog_title_bar);
        });
        /*
        $.each(_self.elements,(k,v)=>{
            console.log(k+"------------------------");
            console.log(v);
        });
        */
        if (_self.opt.buttons!=undefined) _self.instance.append(_self.opt.buttons);
        //_self.readOnly(true);
        function setOptionMark(item){
            if(item.isOptional){
                return "";
            }else{
                return '<span class="optionMark">*</span>';
            }
        }
        function setRequired(isOptional,message){
            return isOptional?"":"required oninvalid='setCustomValidity(\""+message+"\")' oninput='setCustomValidity(\"\")'";
        }
        //#region 创建表单元素
        
        function generateInputTypeBase(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholder="";
            if(hasPlaceHolder) placeholder=' placeholder="'+item.placeholder+'"';
            var val="";
            if(item.type.toLowerCase()=="date"||item.type.toLowerCase()=="time"||item.type.toLowerCase()=="datetime") val=getDateTime();
            item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
            var input=$('<input type="'+item.type+'" name="'+id+'" id="'+id+'"'+placeholder+'" value="'+val+'" '+setRequired(item.isOptional,"此项必须填写")+'>');
            item_container.append(input);
            return input;
            //return item_container;
        }
        function generateTextAreaItem(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholder="";
            if(hasPlaceHolder) placeholder=' placeholder="'+item.placeholder+'"';
            var textarea=$('<textarea cols="40" rows="4" name="'+id+'" id="'+id+'"'+placeholder+'" '+setRequired(item.isOptional,"此项必须填写")+'></textarea>');
            
            item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
            item_container.append(textarea);
            item_container.find(".ui-input-text").css({"min-height":"90px"});
            return textarea;
            //console.log(item_container);
            //return item_container;
        }
        function generateFileItem(item_container,item,id){
            //var item_container=$('<div class="form_item_panel"></div>');
            item_container.append($('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>'));
            var input=$('<input type="file" name="'+id+'" id="'+id+'" value="" '+setRequired(item.isOptional,"此项必须填写")+'>');
            item_container.append(input);
            return input;
            //return item_container;
        }
        function generateRadioItem(item_container,item,id){
            var radio_container=$('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true"></fieldset>');
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
            var selectItem=$('<select name="'+id+'" id="'+id+'"'+
            (item.isFilterable?"class=\"filterSelect\" data-native-menu=\"false\"":"")+'" '+setRequired(item.isOptional,"此项必须选择")+'></select>');
            if(item.data){
                item.data.forEach((d,counter)=>{
                    selectItem.append($('<option value="'+counter+'">'+d+'</option>'));
                });
            }
            //var item_container=$('<div class="form_item_panel"></div>');
            item_container.append($('<label for="'+id+'" class="select">'+setOptionMark(item)+item.label+'</label>'));
            item_container.append(selectItem);
            return selectItem;
            //return item_container;
        }
        function generateMultiComboBoxItem(item_container,item,id){
            var selectItem=$('<select id="'+id+'" '+setRequired(item.isOptional,"此项必须选择")+' class="multiSelect'+
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
            return selectItem;
            //console.log('item_container');
            //console.log(item_container.html());
            //return item_container;
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
            
                if ( !form ) {
                    //$("#filterForm").remove();
                    input = $( "<input data-type='search'></input>" );
                    form = $( "<form id='searchInput'></form>" ).append( input );
                    input.textinput();
                    list
                        .before( form )
                        .jqmData( "filter-form", form ) ;
                    form.jqmData( "listview", list );
                }
                
                console.log(form.parent().html());
                /*
                else{
                    $(form).remove();
                    input = $( "<input data-type='search'></input>" );
                    form = $( "<form id='searchInput'></form>" ).append( input );
                    input.textinput();
                    list
                        .before( form )
                        .jqmData( "filter-form", form ) ;
                    form.jqmData( "listview", list );
                }
                */
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
                var listview, form;
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
                var listview, form;
                listview = data.prevPage.jqmData( "listview" ),
                form = listview.jqmData( "filter-form" );
                // Put the form back in the popup. It goes ahead of the listview.
                if($(listview).parent().find('#searchInput').length==0)
                    listview.before( form );
            });
    },
    readOnly:function(isReadOnly){
        //if(isReadOnly) this.replacementIndexs={};
        console.log("isReadOnly........................."+isReadOnly);
        if(isReadOnly==1) isReadOnly=true;
        var _self=this;
        $.each(_self.elements,(k,v)=>{
            switch ($(v).prop("tagName").toLowerCase()){
                case "input":
                    if(!_self.replacementIndexs.hasOwnProperty(k)) _self.replacementIndexs[k]=replacementOfInput($(v));
                    if(isReadOnly) {
                        var source=$("#"+k);
                        var parent=source.parent();
                        _self.replacementIndexs[k].text(source.val());
                        _self.elements[k]=source;
                        replaceElement(source,_self.replacementIndexs[k]);
                        parent.trigger('create');
                    }else {
                        var parent=$("#_"+k).parent();
                        replaceElement($("#_"+k),_self.elements[k]);
                        parent.trigger('create');
                    }
                    break;
                case "select":
                    if(!_self.replacementIndexs.hasOwnProperty(k)) _self.replacementIndexs[k]=replacementOfInput($(v));
                    if(isReadOnly) {
                        var source=$("#"+k);
                        var parent=source.parent();
                        console.log(getSelectValue(source).join(","));
                        _self.replacementIndexs[k].text(getSelectValue(source).join(","));
                        _self.elements[k]=source;
                        replaceElement(source,_self.replacementIndexs[k]);
                        console.log(getSelectValue(source).join(","));
                        parent.trigger('create');
                    }else {
                        var parent=$("#_"+k).parent();
                        replaceElement($("#_"+k),_self.elements[k]);
                        parent.trigger('create');
                    }
                    break;
                
            }
        });
        _self.instance.trigger('create');
        function replaceElement(from,to){
            
            from.after(to);
            from.remove();
        }
        function replacementOfSelect(sourceElement){

        }
        function replacementOfInput(sourceElement){
            
            var input=$('<label id="_'+sourceElement.attr('id')+'">test</label>');
            return input;
        }
        function getSelectValue(element){
            var val=[];
            $.each($(element).find(":selected"),function(index,opt){
                //console.log(itemTemplate.label+"--------->"+opt.value);
                val.push(opt.text);
            });
            return val;
        }
    }
}
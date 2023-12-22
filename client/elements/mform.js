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
        
        var input=$('<input type="'+itemTemplate.type.toLowerCase()+'" class="form-original" name="'+itemId+'"'+//' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+
                    ' value="'+value+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须正确填写")+'>');
        var subContainer=$('<div class="form-original"></div>');
        subContainer.append(input);
        return subContainer;
    },
    generatePasswordInput:function(itemId,itemTemplate){
        var _this=this;
        var value=itemTemplate.defaultValue || '';
        var input=$('<input type="password" class="form-original" name="'+itemId+'"'+//' id="'+itemId+'"'+
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
            var input=$('<input type="'+type+'" class="form-original" name="'+itemId+'_'+i+'"'+//' id="'+itemId+'_'+i+'"'+
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
        var textarea=$('<textarea class="form-original" cols="40" rows="1" name="'+itemId+'"'+//' id="'+itemId+'"'+
                    _this.setPlaceholder(itemTemplate)+'" '+_this.setRequired(itemTemplate.isOptional,"此项必须填写")+'>'+value+'</textarea>');
        var subContainer=$('<div class="form-original"></div>');
        
        subContainer.append(textarea);
        return subContainer;
    },
    generateRadioItem:function(itemId,itemTemplate){
        var value=itemTemplate.defaultValue || 0;
        var radio_container=$('<fieldset class="form-original" id="'+itemId+'" data-role="controlgroup" data-type="horizontal" data-mini="true"></fieldset>');
            if(itemTemplate.data){
                itemTemplate.data.forEach((d,counter)=>{
                    var check="";
                    if(counter==value){
                        check='checked="checked"';
                    }
                    if(d instanceof Object){
                        var text=d;
                        var valueIndex=counter;
                        if(itemTemplate.hasOwnProperty('displayFormat')){
                            text=itemTemplate.displayFormat;
                            $.each(d,(k,v)=>{
                                text=text.replace("{"+k+"}",v);
                            })
                        }
                        if(itemTemplate.hasOwnProperty('valueKey')){
                            $.each(d,(k,v)=>{
                                if(k==itemTemplate.valueKey) {
                                    valueIndex=v;
                                    return false;
                                }
                            })
                        }
                        if(valueIndex==value){
                            check='checked="checked"';
                        }else{
                            check='';
                        }
                        radio_container.append($('<input type="radio" name="'+itemId+'" id="'+itemId+'-'+valueIndex+'" data-label="'+text+'" value="'+valueIndex+'" '+check+'>'+
                        '<label for="'+itemId+'-'+valueIndex+'">'+text+'</label>'));
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
            
        var input=$('<input class="form-original" type="file" name="'+itemId+'" id="'+itemId+'" value=""'+accept+' '+setRequired(itemTemplate.isOptional,"此项必须填写")+'>');
        //item_container.append(input);
        var subContainer=$('<div class="form-original"></div>');
        subContainer.append(input);
        item_container.append(subContainer);
        return input;
    }
}
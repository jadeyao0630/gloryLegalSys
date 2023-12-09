function output(message){
    if (enableConsoleLog) console.log(message);
}
function extendOpt(opt1,opt2){
    for(var attr in opt2){
        //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
        opt1[attr] = opt2[attr];
    }
}
function waitTask(condition, callback){
    const intervalId = setInterval(() => {
        if (condition) {
            clearInterval(intervalId);
            if(callback!=undefined) callback();
        }
    }, 100);
}
const formatString = (template, ...args) => {
    return template.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] === 'undefined' ? match : args[index];
    });
}
String.prototype.format = function(...args) {
    console.log(this);
    
    return this.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] === 'undefined' ? match : args[index];
    });
}
function getElementId(target){
    if(target.constructor === String){
        return target.replace('#','');
    }else{
        return $(target).attr('id');
    }
}
function getCurrentUserSaved(){
    if(getGlobalJson("currentUser") && getGlobalJson("currentUser").name){
        return getGlobalJson("currentUser");
	}else{
		showAutoLogin();
        return undefined;
	}
}
function saveNewData2List(sourceData,newData,indexName){
    
    var index = sourceData.findIndex(function(item) {
        return item[indexName] === Number(newData[indexName]);
      });
      if (index !== -1) {
        sourceData[index] = newData;
        console.log('saveNewData2List','保存新数据成功。。。');
      }else{
        sourceData.push(newData);
        console.log('saveNewData2List','无法找到新数据匹配。。。',sourceData,newData);
      }
      return sourceData;
}
function formatDateTime(date, format) {
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
      a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
      A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return format;
  }
  function getDateTime(dateTimeStr){
      if (dateTimeStr==undefined||dateTimeStr=='0000-00-00 00:00:00')
          return new Date().toISOString().substr(0,10);
      else
          return new Date(dateTimeStr).toISOString().substr(0,10);
  }
  function formatDateTimeStr2Mysql(dateTimeStr){
    return new Date(dateTimeStr).toISOString().substr(0,10);
  }
function formatIndex(position){
    var main=Math.floor(position);
    var sub=Math.round((position-main)*10);
    return {main:main,sub:sub};
}

function getKeyValues(object,key){
    var collector=[];
    if(object instanceof Array){
        object.forEach((value)=>{
            if(value.hasOwnProperty(key)){
                collector.push(value[key]);
            }else{
                var _collector=[];
                if(value instanceof Array){
                    value.forEach((_value)=>{
                        if(_value.hasOwnProperty(key)){
                            _collector.push(_value[key]);
                        }
                    });
                }
                collector.push(_collector);
            }
        });
    }else{

    }
    
    return collector;
}
$.fn.extend({
    removeTableItem:function(sourceData,itemData,res){
        var index=sourceData.indexOf(itemData);
        var trs=$(this).find('tbody tr[data-item='+itemData.id+']');
        var _this=this;
        if(trs.length>0){
            //console.log('width: '+parseInt($(trs[index]).css('width'))*-1);
            $(trs[0]).find('td').animate({
                padding: 0
                }).wrapInner('<div />').children().slideUp(500,function() {
                    $(this).closest('tr').remove();
                    sourceData=$.grep(sourceData,function(val){
                        return itemData!=val;
                    });
                    //console.log(sourceData);
                    //sourceData=sourceData.splice(index,1);
                    $(_this).trigger('create');
                    //console.log('sourceDate:',sourceDate);
                    if(res!=undefined) res(sourceData);
                    return sourceData;
                });
            }
        
    },
    removeTableItems:function(sourceData,itemDatas,res){
        var _self=this;
        var counter=0;
        var duration=500;
        $.each(itemDatas,function(index,data){
            var _index=sourceData.indexOf(data);
            var trs=$(_self).find('tbody tr');
            //console.log($(_self));
            if(trs.length>0){
                
                setTimeout(function() {
					$(trs[_index]).find('td').animate({
                        'padding-top': 0,
                        'padding-bottom':0,
                        }).wrapInner('<div />').children().slideUp(duration,function() {
                            $(this).closest('tr').remove();
                            //sourceData.splice(_index,1);
                            //console.log('removeTableItems:'+_index+' ',sourceData);
                            
                        });
				}, duration*counter);
                counter++;
                //console.log('width: '+parseInt($(trs[index]).css('width'))*-1);
                
            }
                
                
        });
        setTimeout(function() {
            $(this).trigger('create');
            
            sourceData=$.grep(sourceData,function(val){
                return itemDatas.indexOf(val)<0;
            });
            if(res!=undefined) res(sourceData);
            return sourceData;
        },duration*itemDatas.length);
        
    }
})
$.fn.extend({
    popIn:function(overlay){
        if(overlay!=undefined) $(overlay).removeClass('popup-hide');
        $(this).removeClass('popup-hide');
        $(this).removeClass('popout').addClass('popin');
    },
    popOut:function(overlay){
        $(this).removeClass('popin').addClass('popout');
        if(overlay!=undefined) $(overlay).addClass('popup-hide');
    },
    fullscreenPopup:function(visibility,arg){
        if(visibility.toLowerCase()=="show"){
            var title="";
            var popup_style=' style="padding:10px 15px;text-align:center;min-width:100px;"';
            var content="";
            if (arg!=undefined){
                if(arg.hasOwnProperty('title')){
                    title='<h4><i class="fa fa-info-circle text-green"></i> '+arg.title+'</h4>';
                    popup_style='';
                }
                if(arg.hasOwnProperty('content')){
                    content=arg.content;
                }
            }
            var popup=$('<div class="popup-fullscreen"'+popup_style+'>'+content+'</div>');
            $('body').append(popup);
            popup.trigger('create');
            var index=$('div[data-position="fixed"][data-role="header"]').css('z-index');
            if(index=="auto") index=1001;
            popup.css("z-index",index+1);
            popup.popIn();
            return popup;
            //console.log($('div[data-position="fixed"][data-role="header"]').css('z-index'));
        }else{
            $().hideMessage("popup-fullscreen");
        }
    },
    requestPassword:function(response){
        $().requestDialog({
            title:'提示',
            message:'此操作需要管理员密码的。',
            content:$('<input type="password" data-theme="a" value="" placeholder="请输入密码">')
        },function(form){
            if($(form).find('input').val()==auth_code){
                console.log("登陆成功。。")
                response({success:true});
            }else{

                response({success:false});
            }
        });
    },
    requestDialog:function(arg,response){
        
            var title="";
            var popup_style=' style="padding:10px 15px;text-align:center;min-width:100px;"';
            var content=$('<form></form>');
            var message="";
            if (arg!=undefined){
                if(arg.hasOwnProperty('title')){
                    title=$('<h4><i class="fa fa-info-circle text-green"></i> '+arg.title+'</h4>');
                    popup_style='';
                }
                if(arg.hasOwnProperty('content')){
                    content.append(arg.content);
                }
                if(arg.hasOwnProperty('message')){
                    message=arg.message;
                }
            }
            
            var popup=$('<div class="popup-message popup-window"'+popup_style+'></div>');
            if(title.length>0) popup.append(title);
            if(message.length>0) popup.append($('<div>'+message+'</div>'));
            popup.append(content);
            var popup_buts=$('<fieldset class="ui-grid-a" style="margin-top:10px;">'+
            '<div class="ui-block-a"><a href="#" class="ui-btn ui-corner-all ui-btn-icon-left ui-shadow ui-btn-a ui-icon-check popup_message_but btn-icon-green">确认</a></div>'+
            '<div class="ui-block-b"><a href="#" class="ui-btn ui-corner-all ui-btn-icon-left ui-shadow ui-btn-b ui-icon-delete popup_message_but btn-icon-red">取消</a></div>'+
            '</fieldset>');
            popup.append(popup_buts);
            var popup_background=$('<div class="popup-background popup-c"></div>');
            $('body').append(popup_background);
            $('body').append(popup);
            
            var index=$('div[data-position="fixed"][data-role="header"]').css('z-index');
            if(index=="auto") index=1001;
            popup_background.css("z-index",index);
            popup.css("z-index",parseInt(popup_background.css('z-index'))+1);
            popup.popIn(popup_background);
            popup.trigger('create');
            popup_buts.find('a').on('click',function(e){
                if($(this).text()=='确认'){
                    response(content);
                }
                $().hideMessage(popup,popup_background);
            });
            return [popup,popup_background];
        
    },
    mloader:function(visibility,arg){
        //console.log(visibility);
        //console.log(arg);
        if(visibility.toLowerCase()=="show"){
            var title="";
            var popup_style=' style="padding:10px 15px;text-align:center;min-width:100px;"';
            var overlay=true;
            if (arg!=undefined){
                if(arg.hasOwnProperty('title')){
                    title='<h4><i class="fa fa-info-circle text-green"></i> '+arg.title+'</h4>';
                    popup_style='';
                }
                if(arg.hasOwnProperty('message')){
                    arg.message='<div style="display: inline;">'+
                    '<div class="fa fa-spinner fa-spin" style="font-size: 30px;color:steelblue;vertical-align:middle;"></div>'+
                    '<div style="display: inline;margin-left: 15px;vertical-align:middle;font-szie:16px;">'+arg.message+'</div>'+
                    '</div>';
                }
                if(arg.hasOwnProperty('overlay')){
                    overlay=arg.overlay;
                }
            }
            var index=$('div[data-position="fixed"][data-role="header"]').css('z-index');
            if(index=="auto") index=1001;
            var popup=$('<div class="popup-message popup-loader"'+popup_style+'>'+title+arg.message+'</div>');
            var popup_background=$('<div class="popup-background popup-c popup-loader-background"></div>');
            popup_background.css("z-index",index);
            popup.css("z-index",index+1);
            if(overlay){
                $('body').append(popup_background);
            }
            

            $('body').append(popup);
            popup.trigger('create');
            popup.popIn(popup_background);
            //console.log($('div[data-position="fixed"][data-role="header"]').css('z-index'));
            return [popup,popup_background];
        }else{
            $().hideMessage();
        }
        
    },
    minfo:function(visibility,arg){
        if(visibility.toLowerCase()=="show"){
            var title="";
            var popup_style=' style="padding-top:40px;"';
            var message="";
            var icon='<i class="fa fa-info-circle text-green"></i>';
            if (arg!=undefined){
                if(arg.hasOwnProperty('type')){
                    if(arg.type=="alert") icon='<i class="fas fa-exclamation-triangle text-red" />';
                }
                if(arg.hasOwnProperty('title')){
                    title='<h4>'+icon+' '+arg.title+'</h4>';
                    popup_style='';
                }
                if(arg.hasOwnProperty('message')){
                    message=arg.message;
                }
            }
            var popup=$('<div class="popup-message popup-window"'+popup_style+'>'+title+message+'</div>');
            var popup_background=$('<div class="popup-background popup-c"></div>');
            var popup_but=$('<button class="ui-btn ui-btn-a ui-corner-all ui-icon-check" style="margin-top:30px;">确认</button>');
            $('body').append(popup_background);
            $('body').append(popup);
            popup.append(popup_but);
            popup.trigger('create');

            popup_but.on("click",function(e){
                $().hideMessage(popup,popup_background);
            });
            
            popup_background.css("z-index",parseInt($('div[data-position="fixed"][data-role="header"]').css('z-index'))+1);
            popup.css("z-index",parseInt(popup_background.css('z-index'))+1);
            popup.popIn(popup_background);
            console.log($('div[data-position="fixed"][data-role="header"]').css('z-index'));
            return [popup,popup_background];
        }else{
            $().hideMessage();
        }
    },
    hideMessage:function(popupWindow,background){
        var popup=$('body').find('.popup-loader');
        if(popupWindow!=undefined) popup=popupWindow;
        var popup_background=$('body').find('.popup-loader-background');
        if(background!=undefined) popup_background=background;
        popup.popOut(popup_background);
        setTimeout(function() {
            popup_background.remove();
            popup.remove();
        }, 500);
        
    }
});
function setGlobal(key,value){
    sessionStorage.setItem(key,value);
}
function getGlobal(key){
    return sessionStorage.getItem(key);
}
function setGlobalJson(key,value){
    sessionStorage.setItem(key,JSON.stringify(value));
}
function getGlobalJson(key){
    //console.log(key,sessionStorage.getItem(key));
    if(sessionStorage.getItem(key)=='[object Object]' || sessionStorage.getItem(key)=='undefined') return undefined;
    return JSON.parse(sessionStorage.getItem(key))
}
function showLoading(message){
    $.mobile.loading( "show", {
        text: message,
        textVisible: true,
        textonly :true,
        theme: "b",
        html: ""
      });
}
function hideLoading(){
    $.mobile.loading( "hide");
}
//#region 关于生成表单的功能
function loadCssCode(code) {
    var style = document.createElement('style')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    try {
      //for Chrome Firefox Opera Safari
      style.appendChild(document.createTextNode(code))
    } catch (ex) {
      //for IE
      style.styleSheet.cssText = code
    }
    var head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
}
function getFormItemsId(template){
    form_item_ids={};
    var catelogs=Object.keys(template.template);
    catelogs.forEach((catelog_key)=>{
        var catelog=template.template[catelog_key];
        
        if(catelog.data!=undefined && Object.keys(catelog.data).length>0){
            var catelog_item_keys=Object.keys(catelog.data);
            catelog_item_keys.forEach((item_key)=>{
                form_item_ids[item_key]=catelog.data[item_key];
            });
        }
    });
    return form_item_ids;
}

//#endregion 
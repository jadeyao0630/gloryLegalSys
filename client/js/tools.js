const formatString = (template, ...args) => {
    return template.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] === 'undefined' ? match : args[index];
    });
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
      if (dateTimeStr==undefined)
          return new Date().toISOString().substr(0,10);
      else
          return new Date(dateTimeStr).toISOString().substr(0,10);
  }
function formatIndex(position){
    var main=Math.floor(position);
    var sub=Math.round((position-main)*10);
    return {main:main,sub:sub};
}
$.fn.extend({
    popIn:function(overlay){
        if(overlay!=undefined) $(overlay).removeClass('popup-hide');
        $(this).removeClass('popup-hide');
        $(this).removeClass('popout').addClass('popin');
    },
    popOut:function(overlay){
        $(this).removeClass('popin').addClass('popout');
        if(overlay!=undefined) $(overlay).addClass('popup-hide');
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
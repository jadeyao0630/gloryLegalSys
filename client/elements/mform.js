function mfomr(arg){
    this.opt = {
        template:{},
        buttons:undefined,
    }
}
mform.prototype={
    init:function(arg){
        var _self=this;
        for(var attr in arg){
            //console.log(attr+": "+_self.opt[attr]+"-->"+arg[attr]);
            _self.opt[attr] = arg[attr];
        }
        var template=_self.opt.template;
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
                
                catelog_title_bar.append(setMainForm(catelog.data));
                _self.instance.append(catelog_title_bar);
            });
        }else{
            //console.log('setMainForm',template);
            _self.instance.append(setMainForm(template.template));
        }
    },
    setForm:function(data){
        
    }
    
}
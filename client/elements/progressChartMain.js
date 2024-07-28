function getProgressEvents(datas,index){
    return $.grep(datas,(data=>{
        //console.log(parseInt(data.caseStatus),index,Number(data.caseStatus)==index);
        if(data.caseStatus.toString().indexOf('.')>-1){
            if(data.caseStatus=='3.1' && index==4) return true;
            else if(data.caseStatus=='3.2' && index==5) return true;
            else{
                if(parseInt(data.caseStatus)==4 && index==6) return true;
                else if(parseInt(data.caseStatus)==5 && index==7) return true;
                else if(parseInt(data.caseStatus)==6 && index==8) return true;
            }
        }else
        /*
            if (parseInt(data.caseStatus)>3){
                if(parseInt(data.caseStatus)==4 && index==6) return true;
                else if(parseInt(data.caseStatus)==5 && index==7) return true;
                else if(parseInt(data.caseStatus)==6 && index==8) return true;
            }else
            */
           //console.log('updateIndicator',Number(data.caseStatus),index,(Number(data.caseStatus)==index));
                return Number(data.caseStatus)==index;
    }));
}

$.fn.progressChart = function(options){
    var _this=this;
    const defaults = {
        size:60,
        width:1000,
        pathSize:4,
        hasShadow:true,
        steps:6,
        hideInactived:true,
        eventsData:[],
        mainEventData:[],
        status:[0],
        data:[{id:0,name:'立案'},{id:1,name:'一审'},{id:2,name:'二审'},{id:4,name:'正常执行'},{id:3,name:'强制执行'},{id:5,name:'无需执行'},{id:6,name:'结案'},{id:7,name:'再审'},{id:8,name:'监督'}]
    }
    const settings = $.extend({}, defaults, options);
    settings.distance=(settings.width-settings.size)/(settings.status.length-1);
    
    settings.topOffset=settings.size*0.4/3;
    $(this).jqmData('settings',settings);
    const init = function() {

        _this.empty();
        var main_path=$('<div class="progress_path deactived_point" style="width:'+(settings.width-settings.size)+'px;height:'+settings.pathSize+'px;"></div>');
        main_path.css({
            left:settings.size/2+"px",
            top:(settings.size/2-settings.pathSize/2+settings.topOffset)+"px"
        })
        $(_this).append(main_path);
        var path=$('<div class="progress_path actived_point" style="width:0px;height:'+settings.pathSize+'px;"></div>');
        path.css({
            left:(settings.size/2)+"px",
            top:(settings.size/2-settings.pathSize/2+settings.topOffset)+"px"
        })
        $(_this).append(path);
        for(var i=0;i<settings.status.length;i++){
            $(_this).append(addPoint(i));
        }
        $(_this).trigger('create')
        $(_this).css({'width':settings.width+"px",height:(settings.topOffset+settings.size+20+210)+"px"})
    }
    const addPoint=function(index){
        settings.distance=(settings.width-settings.size)/(settings.status.length);
        var point=$('<div data-index='+index+' class="progress_point" style="left:'+index*settings.distance+'px; top:'+settings.topOffset+'px;width:'+settings.size+'px;height:'+settings.size+'px;border-radius:'+settings.size/2+'px"></div>');
        var span=$('<span><span>');
        var indicator=$('<div class="progress_num_indicator" ><div>');
        indicator.css({
            right:-settings.size*0.4/3,
            top:-settings.size*0.4/3,
            width:settings.size*0.4,
            height:settings.size*0.4,
            "line-height":settings.size*0.4+"px",
            "fontSize":14*0.9+'px',
            "fontWeight":700,
            "borderRadius":(settings.size*0.4*0.5)+"px",

        });
        span.css({width:settings.size-20})
        point.append(span);
        
        point.append(indicator);
        
        var mainInfo=$('<ul data-role="listview" data-inset="true" class="main-info-panel"></ul>');
        mainInfo.css({'top':(settings.topOffset+settings.size+20)+"px",width:(settings.distance-40)+"px","max-height":190,"overflow-y": "auto"});

        point.append(mainInfo);
        if(settings.status.hasOwnProperty(index)) {
            var id=settings.status[index];
            var matched=$.grep(settings.data,(d)=>d.id==id);
            
            var events=getProgressEvents(settings.eventsData,id);
            indicator.text(events.length);
            if(matched.length>0) span.text(matched[0].name);
            point.addClass('actived_point');
            point.jqmData('index',index)
            point.jqmData('id',id)
            $(_this).find('.progress_path.actived_point').css({
                width:(index)*settings.distance
            })
            console.log('mainEventData',settings.mainEventData);
            setMainEventList(mainInfo,id);
        }
        else point.addClass('deactived_point');
        if(index==settings.status.length-1){
            point.addClass('last_point');
        }else{
            point.removeClass('last_point');
        }
        if(settings.hasShadow) point.addClass('progress_point_shadow');
        point.css({
            left:settings.distance*index,
        });
        if(indicator.text()=="0") indicator.hide();
        if(settings.hideInactived && point.hasClass('deactived_point')){
            point.hide();
        }
        return point;
        
    }
    const setMainEventList=function(listview,id){
        var list={'title':{label:'标签'},
            'date':{label:'日期'},
            'caseNo':{label:'案件号'},
            'legalInstitution':{label:'法院'},
            'sum':{label:'概要'},
            'requestAmount':{label:'金额（万）'}};
        listview.empty();
        settings.mainEventData.forEach(element => {
            console.log('updateMainEvent',element.index,id)
            if(element.index==id){
                Object.keys(list).forEach((l)=>{
                    if(element.hasOwnProperty(l)){
                        var label=$("<label style='font-weight:700;margin:auto 0px;'>"+list[l].label+"</label>");
                        var content=$('<div>'+element[l]+"</div>");
                        if(element[l]==null || element[l].length==0||element[l]=="无"||element[l]=="null") content='&nbsp;';
                        
                        if(l=="date" && (element[l]=='1999年11月30日' || element[l]=='N下午N年aN月aN日' || element[l]=='0000-00-00 00:00:00')){
                            console.log(l,element[l],(l=="date" && element[l]=='1999年11月30日'))
                            content.text('暂无');
                        }
                        var li=$('<li class="listview-item" style="word-wrap: break-word;overflow-wrap: break-word;hyphens: auto;white-space: normal;padding:0.3rem 0.5rem;display: grid;grid-template-columns: 80px 1fr;"></li>');
                        
                        if(l=="title") {
                            //li.css({'font-weight':700})
                            content=$('<h3>'+element[l]+"</h3>");
                            li=$('<li data-role="list-divider" style="position:sticky;top:0;z-index:1000;padding:0.3rem 0.5rem;"></li>');
                        }else{

                            li.append(label)
                        }
                        li.append(content)
                        listview.append(li);
                        //li.setTooltip(";");
                    }
                    
                })
                listview.trigger('create').listview().listview('refresh');
                //mainInfo.append(listview);
            }
        });
    }
    const attachEvent=function(){
        $(_this).off();
        $('.progress_point').off();
        $('.progress_point').on('click',function(e){
            $(_this).trigger({type:'pointClick',event:e,source:$(this),index:$(this).data('index'),steps:settings.steps});
        })
        $(_this).on('updatePoint',function(e){
            settings.status=e.status;
            console.log("updatePoint",settings.status)

            init();
            $('.progress_point').off();
            $('.progress_point').on('click',function(e){
                $(_this).trigger({type:'pointClick',event:e,source:$(this),index:$(this).data('index'),steps:settings.steps});
            })
        });
        $(_this).on('updateIndicator',function(e){
            settings.eventsData=e.eventsData;
            var exsited=$(_this).find('.progress_point.actived_point');
            console.log('updateIndicator',exsited.length,settings.status,settings.eventsData,e.eventsData);
            $.each(exsited,(i,point)=>{
                var indicator=$(point).find('.progress_num_indicator');
                var id=settings.status[$(point).jqmData('index')];
                var events=getProgressEvents(settings.eventsData,id);
                console.log('updateIndicator',events,id,$(point).jqmData('index'),settings.eventsData);
                indicator.text(events.length);
                if(events.length>0) indicator.show();
                else indicator.hide();
            })
        });
        $(_this).on('updateMainEvent',function(e){
            var targetIndex=e.targetIndex;
            var targetMainEvent=e.mainEventData;
            settings.mainEventData=updateOriginalData(settings.mainEventData,targetMainEvent,'index')
            var point=_this.find('.progress_point.actived_point[data-index="'+targetIndex+'"]');
            
            if(point.length>0){
                var listview=$(point[0]).find('ul');
                console.log('updateMainEvent',settings.mainEventData,point,listview);
                setMainEventList(listview,$(point[0]).jqmData('id'));
            }
        });
        $(_this).on('moveNext',function(e){
            var preDistance=settings.distance;
            var currentIndex=e.sourceIndex;
            var exsited=$(_this).find('.progress_point.actived_point');
            settings.status.push(e.sourceData.id);
            settings.mainEventData.push(e.mainEventData);
            console.log('moveNext',settings.status,settings.mainEventData,exsited)
            var next=addPoint(currentIndex+1)//$(_this).find('.progress_point[data-index='+(e.sourceData.id)+']');
            next.jqmData('index',currentIndex+1)
            next.jqmData('id',e.sourceData.id)
            next.hide();
            $(_this).append(next);
            settings.distance=(settings.width-settings.size)/(exsited.length+1);
            $.each(exsited,(index,excistedPoint)=>{
                $(excistedPoint).animate({
                    left:settings.distance*index,
                },500);
                var listview=$(excistedPoint).find('ul');
                listview.animate({width:(settings.distance-50)+"px"},500);
                setMainEventList(listview,$(excistedPoint).jqmData('id'));
                $(excistedPoint).removeClass('last_point');
                listview.trigger('create').listview().listview('refresh');
            });
            //console.log(e);
            
            next.on('click',function(e){
                $(_this).trigger({type:'pointClick',event:e,source:$(this),index:$(this).data('index'),steps:settings.steps});
            })
            //next.jqmData('id',e.sourceData.id)
            //next.jqmData('index',currentIndex+1)
            next.find('span').text(e.sourceData.name);
            console.log('moveNext',settings.distance,(settings.width-settings.size)/(exsited.length+1),currentIndex)
            next.find('.progress_num_indicator').text(e.eventsData.length);
            if(next.find('.progress_num_indicator').text()=="0") next.find('.progress_num_indicator').hide();
            else next.find('.progress_num_indicator').show();
            $(_this).find('.progress_path.actived_point').css({
                width:(currentIndex)*preDistance
            });
            $(_this).find('.progress_path.actived_point').animate({
                width:(currentIndex+1)*settings.distance
            },500,function(){
                next.css({left:settings.distance*(currentIndex+1)})
                next.removeClass('deactived_point').addClass('actived_point').show();
            })
            $(_this).jqmData('status',settings.status);
            $(_this).trigger({type:'newPointAdded',status:settings.status})
            $(_this).trigger('create');
        })
    }
    init();
    attachEvent();
}


export default function progressChart(options) {
    var _this=this;
    const defaults = {
        size:60,
        width:1000,
        pathSize:4,
        hasShadow:true,
        labels:['立案','一审','二审','执行','结案'],
        hideInactived:true,
    }
    const settings = $.extend({}, defaults, options);
    settings.steps=settings.labels.length;
    settings.distance=(settings.width-settings.size)/(settings.steps-1);
    const init = function() {

        var main_path=$('<div class="progress_path deactived_point" style="width:'+(settings.width-settings.size)+'px;height:'+settings.pathSize+'px;"></div>');
        main_path.css({
            left:settings.size/2+"px",
            top:settings.size/2-settings.pathSize/2+"px"
        })
        $(_this).append(main_path);
        var path=$('<div class="progress_path actived_point" style="width:0px;height:'+settings.pathSize+'px;"></div>');
        path.css({
            left:(settings.size/2)+"px",
            top:settings.size/2-settings.pathSize/2+"px"
        })
        $(_this).append(path);
        for(var i=0;i<settings.steps;i++){
            var point=$('<div data-index='+i+' class="progress_point" style="width:'+settings.size+'px;height:'+settings.size+'px;border-radius:'+settings.size/2+'px"></div>');
            var span=$('<span>'+settings.labels[i]+'<span>');
            point.append(span);
            if(i==0) {
                point.addClass('actived_point');
            }
            else point.addClass('deactived_point');
            if(i==settings.steps-1){
                point.addClass('last_point');
            }
            if(settings.hasShadow) point.addClass('progress_point_shadow');
            point.css({
                left:settings.distance*i,
            });
            
            if(settings.hideInactived && point.hasClass('deactived_point')){
                point.hide();
            }
            $(_this).append(point);
        }
    }
    const attachEvent=function(){
        
        $('.progress_point').on('click',function(e){
            console.log($(this).data('index'));
            if($(this).hasClass('last_point')) return;

            var currentIndex=$(this).data('index');
            var next=$('#container').find('.progress_point[data-index='+(currentIndex+1)+']');

            $('#container').find('.progress_path.actived_point').animate({
                width:(currentIndex+1)*settings.distance
            },500,function(){
                next.removeClass('deactived_point').addClass('actived_point').show();
            })
            
        })
    }
    init();
}
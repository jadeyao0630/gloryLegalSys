
function extend(opt1,opt2){
    for(var attr in opt2){
        //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
        opt1[attr] = opt2[attr];
    }
}
const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));
function formatIndex(position){
    var main=Math.floor(position);
    var sub=Math.round((position-main)*10);
    return {main:main,sub:sub};
}
function ProgressesButton(arg){
    this.body=document.body;
    this.opt = {
        normal_color : "lightgray",
        actived_color:"#1362B7",
        currentPosition:0,
        currentSubPosition:0,
        width:440,
        steps:[],
        deadSteps:[],
        size:10,//节点半径大小
        fontSize:12,
        line_size:4,
        containerId:undefined,
        showLabel:true,
        dataId:-1,
        duration:300,
        isViewMode:false,
        verticalGap:Number.NaN,
        labelPosition:"center",
        showSubSteps:true,
        readOnly:false,
        hasShadow:false,
        showCounter:false,
        counterData:[],
    }
    this.init(arg)
}
ProgressesButton.prototype.init=function(arg){
    //console.log("init.............."+this.opt.labelPosition);
    
  console.log('初始变量');
    var _this=this;
    extend(this.opt,arg);
    console.log('当前位置',this.opt.currentPosition)
    if (_this.opt.containerId!=undefined) this.parent=$(_this.opt.containerId);
    var steps=_this.opt.steps;//节点数据

    

    this.breakpoint=[];//分支点
    this.items=[];
  //建立容器
  console.log('建立容器');
    if(this.instance==null){
        this.instance=$('<div class="ProgressesButton-container"></div>');
        this.instance.css({
            'width':_this.opt.width+'px',
        });
    }else{
        this.instance.empty();
    }


    
  console.log('设定初始位置');

    var v_dist=_this.opt.size*1.5;//节点垂直间隔
    var step=parseInt((_this.opt.width-_this.opt.size*2)/(steps.length-1));//根据宽度判断每个节点距离-节点横向间隔
    this.step=step;

    var h_dist=parseInt((_this.opt.width-(_this.opt.size)*2)/(steps.length-1));//根据宽度判断每个节点距离-节点横向间隔

    var tops=[];
    var lefts=[]

    var v_gap=Number.isNaN(_this.opt.verticalGap)?(step-_this.opt.size*2):_this.opt.verticalGap;//节点垂直间隔

    var v_dist=_this.opt.size*2+v_gap;
    
    //["立案","一审","二审",{label:"正在执行",data:["强制执行","正常执行","无需执行"]},"结案","再审"]; 

    
    var points=[];
    _this.opt.steps.forEach(function(stepPointName,index){
        //if(index==0) offset=0;
        
        lefts.push(h_dist*(index)+_this.opt.size);
        
        
        if(stepPointName instanceof Object){
            var breakpointData={'id':index,'name':stepPointName.name,'sub':[],'isMain':true};
            _this.breakpoint=index;
            if(stepPointName.hasOwnProperty('data')){
                if(stepPointName.data instanceof Array){
                    stepPointName.data.forEach(function(subStepPointName,subIndex){
                        breakpointData.sub.push({'id':subIndex,'name':subStepPointName,'isMain':false});
                        //var prev_top=tops[tops.length-1];
                        tops.push(_this.opt.size+v_dist*subIndex);
                    });
                }
            }
            points.push(breakpointData);
        }else{
            points.push({'id':index,'name':stepPointName,'isMain':true});
        }
    }); 
    var m_line=(tops[tops.length-1]+(_this.opt.size))/2;  
    console.log("tops",tops);
    console.log('lefts',lefts);
    
    console.log('middle line',m_line);


    this.instance.css({height:tops[tops.length-1]+(_this.opt.size)})
    var NextCombineLines=[];
    _this.pointMap={};
    points.forEach(function(stepPoint,index){
        var lines=[];
        var point=setStepPoint(stepPoint.name,lefts[index],m_line,index,stepPoint.isMain);
        if(index>0)lines=setStepLine(lefts[index],m_line,index,stepPoint.isMain,h_dist);
        if(index==0) point.addClass('stepPoint-selectable');
        if(lines.length>0)lines[1].jqmData('stepoint',point);
        if(point!=undefined){
            point.on('click',clickedEvent);
            point.jqmData('stepoint',lines[1]);
            _this.pointMap[index]={
                self:point,
                isMain:true,
                line:lines[1]==undefined?[]:[lines[1]],
                isSelectable:index<=_this.opt.currentPosition+1,
                isActived:index<=_this.opt.currentPosition,
            }
            if(index<points.length-1){
                var subPoints=[];
                if(points[index+1].hasOwnProperty('sub')){
                    
                    points[index+1].sub.forEach((subStepPoint,subIndex)=>{
                        subPoints.push((index+1)+subIndex/10);
                    })
                    
                }else{
                    subPoints.push(index+1);
                }
                _this.pointMap[index]['nextPointIndex']=subPoints;
                point.jqmData('nextPoint',subPoints);
            }
            if(index>0){
                var subPoints=[];
                if(points[index-1].hasOwnProperty('sub')){
                    
                    points[index-1].sub.forEach((subStepPoint,subIndex)=>{
                        subPoints.push((index-1)+subIndex/10);
                    })
                    
                }else{
                    subPoints.push(index-1);
                }
                _this.pointMap[index]['prevPointIndex']=subPoints;
                point.jqmData('prevPoint',subPoints);
            }
        }
        if(NextCombineLines.length>0){
            if(lines.length>0){
                lines[0].hide();
                lines[1].hide();
            }
            NextCombineLines.forEach(line=>{
                $(line).jqmData('stepoint',point);
            })
            $(point).jqmData('stepoint',NextCombineLines);
            _this.pointMap[index]['line']=NextCombineLines;
            //console.log("stepoint--",$(point),$(point).jqmData('stepoint'));
            NextCombineLines=[];
        }
        
        if(stepPoint.hasOwnProperty('sub')){
            if(_this.opt.showSubSteps){
                point.hide();
                if(lines.length>0){
                    lines[0].hide();
                    lines[1].hide();
                }
                stepPoint.sub.forEach((subStepPoint,subIndex)=>{
                    var p_index=Math.round(Math.abs(m_line-(tops[subIndex]-_this.opt.line_size/2))/v_dist);
                    var height=v_dist*p_index;
                    var long_edge=Math.sqrt(height**2+h_dist**2);
                    var angle=-parseInt(bevel(height,long_edge));
                    if((tops[subIndex])>m_line) angle=angle*-1;
                    var subLines=setStepLine(lefts[index],m_line-_this.opt.line_size,index+subIndex/10,subStepPoint.isMain,long_edge,angle);//开始线
                    var subPoint=setStepPoint(subStepPoint.name,lefts[index],tops[subIndex],index+subIndex/10,subStepPoint.isMain);
                    subPoint.on('click',clickedEvent);
                    subLines[1].jqmData('stepoint',subPoint);
                    subPoint.jqmData('stepoint',subLines[1]);
                    _this.pointMap[index+subIndex/10]={
                        self:subPoint,
                        isMain:false,
                        line:[subLines[1]],
                        isSelectable:index<=formatIndex(_this.opt.currentPosition+1).main,
                        isActived:index==formatIndex(_this.opt.currentPosition).main&&subIndex==formatIndex(_this.opt.currentPosition).sub||index<formatIndex(_this.opt.currentPosition).main,
                    }
                    if(index<points.length-1){
                        var subPoints=[];
                        if(points[index+1].hasOwnProperty('sub')){
                            
                            points[index+1].sub.forEach((subStepPoint,subIndex)=>{
                                subPoints.push((index+1)+subIndex/10);
                            })
                            
                        }else{
                            subPoints.push(index+1);
                        }
                        subPoint.jqmData('nextPoint',subPoints);
                        _this.pointMap[index+subIndex/10]['nextPointIndex']=subPoints;
                    }
                    angle=-parseInt(bevel(h_dist,long_edge)-90);
                    if((tops[subIndex])>m_line) angle=angle*-1;
                    if(!_this.opt.deadSteps.includes(subStepPoint.name)) {
                        
                        NextCombineLines.push(setStepLine(lefts[index+1],tops[subIndex]-_this.opt.line_size,index+subIndex/10,false,long_edge,angle)[1]);//结束线
                    }else{
                        _this.pointMap[index+subIndex/10]['nextPointIndex']=[];
                    }
                    
                    if(index>0){
                        var subPoints=[];
                        if(points[index-1].hasOwnProperty('sub')){
                            
                            points[index-1].sub.forEach((subStepPoint,subIndex)=>{
                                subPoints.push((index-1)+subIndex/10);
                            })
                            
                        }else{
                            subPoints.push(index-1);
                        }
                        _this.pointMap[index]['prevPointIndex']=subPoints;
                        subPoint.jqmData('prevPoint',subPoints);
                    }
                });
            }
            
            
        
        }
        //if(lines.length>0)console.log(lines[1].jqmData('stepoint'));
    });
    _this.parent.append(_this.instance);
    _this.parent.trigger('create');
    console.log('map',_this.pointMap);
    console.log(_this.parent.html());
    //var middle_line=(tops[tops.length-2]+top_offset)/2

    function setStepLine(left,top,index,isMain,width,angle){
        
        var angleCss={};
        if(angle!=undefined){
            angleCss={'transform':"rotate("+(angle)+"deg)",
            "transform-origin": "left center"}
        }
        var lineCss=Object.assign({
            left:left-h_dist,
            top:top,
            width:width,
            height:_this.opt.line_size*2,
        },angleCss)
        var subClass=isMain?"":" subPoint";
        var bkLine=$('<div class="stepLine'+subClass+'" data-index='+index+'></div>');
        bkLine.css(lineCss);
        _this.instance.append(bkLine);
        var fgLine=$('<div class="foregroundStepLine'+subClass+'" data-index='+index+' data-width="'+width+'"></div>');
        lineCss=Object.assign({
            left:left-h_dist,
            top:top,
            width:0+"px",
            height:_this.opt.line_size*2,
            'background-color':_this.opt.actived_color
        },angleCss)
        fgLine.css(lineCss);
        _this.instance.append(fgLine);
        return [bkLine,fgLine];
    }
    function setStepPoint(label,left,top,index,isMain){
        var _label=$('<span>'+label+'</span>');
        var subClass=isMain?"":" subPoint";
        var point=$('<div class="stepPoint'+subClass+'" data-index='+index+'></div>');
        var _top="calc(100% + 15px)";
        if(_this.opt.labelPosition=="center") _top="50%";
        _label.css({width:_this.opt.size*2,top:_top});
        point.append(_label);
        point.css({
            left:left,
            top:top,
            width:_this.opt.size*2-_this.opt.line_size*2,
            height:_this.opt.size*2-_this.opt.line_size*2,
            border: _this.opt.line_size+"px solid lightgray",
            borderRadius:(_this.opt.size)+"px",
        });
        _this.instance.append(point);
        return point;
    }
    async function clickedEvent(e){
        if($(this).hasClass('stepPoint-selectable') || $(this).hasClass('setpPoint-actived')){
            console.log(this);
            setPointState(this,$(this).hasClass('setpPoint-actived'));
        }
    }
    function activePoint(point,nextPointIndexs){
        $(point).addClass('setpPoint-actived');
        if(nextPointIndexs!=undefined && nextPointIndexs.length>0){
            nextPointIndexs.forEach(idx=>{
                $('.stepPoint[data-index="'+idx+'"]').addClass('stepPoint-selectable');
            })
        }
        var pointPosition=formatIndex($(point).data('index'));
        var currentPosition=formatIndex(_this.opt.currentPosition);
        //console.log('currentPosition active b',_this.opt.currentPosition,currentPosition,pointPosition,$(point).data('index'));
        if(pointPosition.main<=_this.breakpoint)
            _this.opt.currentPosition=$(point).data('index');
        else
            _this.opt.currentPosition=pointPosition.main+currentPosition.sub/10;
        //console.log('currentPosition active a',_this.opt.currentPosition,currentPosition,pointPosition);
      
    }
    
    function deactivePoint(point,nextPointIndexs){
        $(point).removeClass('setpPoint-actived');
        if(nextPointIndexs!=undefined && nextPointIndexs.length>0){
            nextPointIndexs.forEach(idx=>{
                $('.stepPoint[data-index="'+idx+'"]').removeClass('stepPoint-selectable');
            });
        }
        var pointPosition=formatIndex($(point).data('index'));
        var currentPosition=formatIndex(_this.opt.currentPosition);
        //console.log('currentPosition deactive b',currentPosition,pointPosition);
        if(pointPosition.main<_this.breakpoint)
            _this.opt.currentPosition=pointPosition.main-1;
        else
            _this.opt.currentPosition=pointPosition.main-1+currentPosition.sub/10;
        //console.log('currentPosition deactive a',_this.opt.currentPosition);
      
    }
    function isSameMainIndex(index){
        return formatIndex(_this.opt.currentPosition).main==formatIndex(index).main;
    }
    function getPointByIndex(index){//这里牵扯到分离点，就这个案例只有一个，如果有多个可能需要改进
        if(index>=_this.breakpoint+1) index=formatIndex(index).main;
        console.log(index,_this.pointMap);
        return _this.pointMap[index].self;
    }
    async function setPointState(point,isActived){
        //console.log($(point));
        //nextPointIndex 下一个的编号 array[int]
        //prevPointIndex 前一个的编号 array[int]
        //self 自己元素 object
        //line 相关联的线 array[object]
        var clickedIndex=$(point).data('index');
        var pointData=_this.pointMap[clickedIndex];
        if(!isActived){//激活节点
            console.log('激活节点');
            if(isSameMainIndex(clickedIndex)){
                var currentPoint=getPointByIndex(_this.opt.currentPosition);
                await setPointState(currentPoint,true);
                if(pointData.line.length==1){//如果当前节点不是交汇点
                    var line=pointData.line[0];
                    await $(line).animate({
                        width: $(line).data('width')+"px",
                          }, 500 ,function(){
                            activePoint(point,pointData.nextPointIndex);
                          })
                }
            }else if(formatIndex(clickedIndex).main==_this.breakpoint && _this.opt.currentPosition>_this.breakpoint){
                
                /*
                var currentPoint=getPointByIndex(_this.opt.currentPosition);
                var currentPointData=_this.pointMap[$(currentPoint).data('index')];
                await setPointState(currentPoint,true);

                if(currentPointData.line.length==1){//如果当前节点不是交汇点
                    var line=currentPointData.line[0];
                    await $(line).animate({
                        width: 0+"px",
                          }, 500 , function(){
                            //activePoint(point,pointData.nextPointIndex);
                          })
                    */
                }else if(currentPointData.line.length==2){
                    var line=$.grep(currentPointData.line,(ln)=>{
                        //console.log($(ln).data('index'),_this.opt.currentPosition);
                        return $(ln).data('index')==_this.opt.currentPosition;
                    });
                    //console.log(line);
                    if(line.length>0){
                        line=line[0];
                        await $(line).animate({
                        width: 0+"px",
                          }, 500 ,function(){
                            //activePoint(point,pointData.nextPointIndex);
                          })
                    }
                }
                await delay(500-100);
            }
            else if(pointData.line.length==1){//如果当前节点不是交汇点
                var line=pointData.line[0];
                await $(line).animate({
                    width: $(line).data('width')+"px",
                      }, 500 ,function(){
                        activePoint(point,pointData.nextPointIndex);
                      })
            }else if(pointData.line.length==2){//如果当前节点是交汇点
                //获取前一节点的位置来判断选那条线
                var line=$.grep(pointData.line,(ln)=>$(ln).data('index')==_this.opt.currentPosition);
                if(line.length>0){
                    line=line[0];
                    await $(line).animate({
                    width: $(line).data('width')+"px",
                      }, 500 ,function(){
                        activePoint(point,pointData.nextPointIndex);
                      })
                }
            }else{//当前节点无线连接，比如第一节点
                activePoint(point,pointData.nextPointIndex);
            }
        }else{//取消激活节点
            //$(point).removeClass('setpPoint-actived');
            console.log('取消激活节点');
            if(isSameMainIndex(clickedIndex)){
                deactivePoint(point,pointData.nextPointIndex)
                if(pointData.line.length==1){
                    var line=pointData.line[0];
                    await $(line).animate({
                        width: 0+"px",
                        }, 500 ,function(){
                        })
                }
            }else{
                var currentPosition=formatIndex(_this.opt.currentPosition);
                for(var i=currentPosition.main;i>formatIndex(clickedIndex).main;i--){
                    console.log(currentPosition);
                    var subIndex=currentPosition.sub/10;
                    if(i!=_this.breakpoint) subIndex=0;
                    //console.log();
                    var currentPoint=getPointByIndex(i+subIndex);
                    var pointData=_this.pointMap[i+subIndex];
                    console.log(i+subIndex,_this.opt.currentPosition,pointData,currentPoint)
                    deactivePoint(currentPoint,pointData.nextPointIndex)
                    if(pointData.line.length==1){
                        var line=pointData.line[0];
                        await $(line).animate({
                            width: 0+"px",
                            }, 500 ,function(){
                            })
                    }else if(pointData.line.length==2){
                        var line=$.grep(pointData.line,(ln)=>{
                            //console.log($(ln).data('index'),_this.opt.currentPosition);
                            return $(ln).data('index')==_this.opt.currentPosition;
                        });
                        //console.log(line);
                        if(line.length>0){
                            line=line[0];
                            await $(line).animate({
                            width: 0+"px",
                              }, 500 ,function(){
                                //activePoint(point,pointData.nextPointIndex);
                              })
                        }
                    }
                    await delay(500-100);
                }
            }
            
           
                
        }
        /*
        var nextPoint=$(point).jqmData('nextPoint');
        if(!isActived){//激活节点
            console.log('stepoint',$(point).jqmData('stepoint'));
            if($(point).jqmData('stepoint')!=undefined){
                var line=$(point).jqmData('stepoint');
                if(line instanceof Array){
                    //var formatedIndex=formatIndex(_this.opt.currentPosition);
                    var _line=$.grep(line,(ln)=>{
                        console.log($(ln).data('index'),_this.opt.currentPosition,($(ln).data('index')==_this.opt.currentPosition));
                        return $(ln).data('index')==_this.opt.currentPosition
                    });
                    
                    if(_line.length>0){
                        console.log($(_line[0]).data('width'),$(_line));
                        await $(_line[0]).animate({
                            width: $(_line[0]).data('width')+"px",
                              }, 500 ,function(){
                                $(point).addClass('setpPoint-actived');
                                if(nextPoint!=undefined){
                                    nextPoint.forEach(idx=>{
                                        $('.stepPoint[data-index="'+idx+'"]').addClass('stepPoint-selectable');
                                    })
                                }
                                _this.opt.currentPosition=$(point).data('index');
                              })
                    }else{
                        $(point).addClass('setpPoint-actived');
                        if(nextPoint!=undefined){
                            nextPoint.forEach(idx=>{
                                $('.stepPoint[data-index="'+idx+'"]').addClass('stepPoint-selectable');
                            })
                        }
                        _this.opt.currentPosition=$(point).data('index');
                    }
                    
                }else{
                    await line.animate({
                        width: $(line).data('width')+"px",
                          }, 500 ,function(){
                            $(point).addClass('setpPoint-actived');
                            if(nextPoint!=undefined){
                                nextPoint.forEach(idx=>{
                                    $('.stepPoint[data-index="'+idx+'"]').addClass('stepPoint-selectable');
                                })
                            }
                            _this.opt.currentPosition=$(point).data('index');
                          })
                }
                
                    
            
            }else{
                $(point).addClass('setpPoint-actived');
                if(nextPoint!=undefined){
                    nextPoint.forEach(idx=>{
                        $('.stepPoint[data-index="'+idx+'"]').addClass('stepPoint-selectable');
                    })
                }
                
                
            }
            
            
            
            //console.log($('.stepPoint[data-index="1"]'),$(point).jqmData('index'));
        }else{//取消激活
            if($(point).jqmData('stepoint')!=undefined){
                var line=$(point).jqmData('stepoint');
                if(nextPoint!=undefined){
                    nextPoint.forEach(async idx=>{
                        if($('.stepPoint[data-index="'+idx+'"]').hasClass('setpPoint-actived')){
                            $('.stepPoint[data-index="'+idx+'"]').removeClass('setpPoint-actived').removeClass('stepPoint-selectable');
                            var _line=$('.stepPoint[data-index="'+idx+'"]').jqmData('stepoint');
                            if(_line instanceof Array){
    
                            }else{
                                //$(point).removeClass('setpPoint-actived');
                                
                                await _line.animate({
                                    width: 0+"px",
                                      }, 500 ,function(){
                                      })
                            }
                        }else{
                            $(point).removeClass('setpPoint-actived');
                            if(nextPoint!=undefined){
                                nextPoint.forEach(idx=>{
                                    $('.stepPoint[data-index="'+idx+'"]').removeClass('stepPoint-selectable');
                                })
                            }
                            if(line instanceof Array){
    
                            }else{
                                //$(point).removeClass('setpPoint-actived');
                                
                                await line.animate({
                                    width: 0+"px",
                                      }, 500 ,function(){
                                      })
                            }
                        }
                        
                    })
                }
                
            }else{
                $(point).removeClass('setpPoint-actived');
                if(nextPoint!=undefined){
                    nextPoint.forEach(idx=>{
                        $('.stepPoint[data-index="'+idx+'"]').removeClass('stepPoint-selectable');
                    })
                }
            }
            
        }
        */
    }
    function setCounterIndecator(left,top,index,sub){
        if(_this.opt.showCounter && _this.opt.counterData.length>0){
            
            var _counter=_this.opt.counterData.filter(value=>{ 
                if(sub==undefined)
                    return formatIndex(value.caseStatus).main==(index);
                else
                    return value.caseStatus==index+sub/10
            });
            console.log('setCounterIndecator',_counter.length,index,_counter);
            if(_counter.length>0){
                if(_this.opt.showCounter){
                    var size=_this.opt.size*2*0.4;
                    var counter=getElement("progress-but-counter",{
                        width:(size)+"px",
                        height:(size)+"px",
                        "line-height":size+"px",
                        "fontSize":_this.opt.fontSize*0.9+'px',
                        "fontWeight":700,
                        "borderRadius":(size*0.5)+"px",
                        'left':(left+_this.opt.size*0.5)+'px',
                        'top':(top-_this.opt.size*1.2)+'px',
                    },_counter.length);
                    $(counter).data('index',(index+(sub==undefined?0:sub)/10));
                    _this.outter_frame.append(counter)
                }
                
            }
        }
    }
    function bevel(straight,oblique){
        const sinOfAngleX = straight / oblique;
        return Math.round((Math.asin(sinOfAngleX)*180)/Math.PI);
    }
}

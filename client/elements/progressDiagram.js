
function extend(opt1,opt2){
    for(var attr in opt2){
        //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
        opt1[attr] = opt2[attr];
    }
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
            _this.breakpoint.push(index);
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
    points.forEach(function(stepPoint,index){
        var lines=[];
        var point=setStepPoint(stepPoint.name,lefts[index],m_line,index,stepPoint.isMain);
        if(index>0)lines=setStepLine(lefts[index],m_line,index,stepPoint.isMain);
        if(index==0) point.addClass('stepPoint-selectable');
        if(lines.length>0)lines[1].jqmData('stepoint',point);
        if(NextCombineLines.length>0){
            if(lines.length>0){
                lines[0].hide();
                lines[1].hide();
            }
            NextCombineLines.forEach(line=>{
                $(line).jqmData('stepoint',point);
            })
            NextCombineLines=[];
        }
        if(point!=undefined){
            point.on('click',clickedEvent);
            point.jqmData('stepoint',lines[1]);
            if(index<points.length-1){
                var subPoints=[];
                if(points[index+1].hasOwnProperty('sub')){
                    
                    points[index+1].sub.forEach((subStepPoint,subIndex)=>{
                        subPoints.push((index+1)+subIndex/10);
                    })
                    
                }else{
                    subPoints.push(index+1);
                }
                point.jqmData('nextPoint',subPoints);
            }
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
                    var subLines=setStepLine(lefts[index],m_line-_this.opt.line_size,index+subIndex/10,subStepPoint.isMain,angle,long_edge);
                    var subPoint=setStepPoint(subStepPoint.name,lefts[index],tops[subIndex],index+subIndex/10,subStepPoint.isMain);
                    subPoint.on('click',clickedEvent);
                    subLines[1].jqmData('stepoint',subPoint);
                    subPoint.jqmData('stepoint',subLines[1]);
    
                    angle=-parseInt(bevel(h_dist,long_edge)-90);
                    if((tops[subIndex])>m_line) angle=angle*-1;
                    if(!_this.opt.deadSteps.includes(subStepPoint.name)) {
                        NextCombineLines.push(setStepLine(lefts[index+1],tops[subIndex]-_this.opt.line_size,index+subIndex/10,false,angle,long_edge));
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
                    }
                });
            }
            
            
        
        }
        //if(lines.length>0)console.log(lines[1].jqmData('stepoint'));
    });
    _this.parent.append(_this.instance);
    _this.parent.trigger('create');
    console.log(_this.parent.html());
    //var middle_line=(tops[tops.length-2]+top_offset)/2

    function setStepLine(left,top,index,isMain,angle,long_edge){
        
        var angleCss={};
        if(angle!=undefined){
            angleCss={'transform':"rotate("+(angle)+"deg)",
            "transform-origin": "left center"}
        }
        var lineCss=Object.assign({
            left:left-h_dist,
            top:top,
            width:angle!=undefined?long_edge:h_dist,
            height:_this.opt.line_size*2,
        },angleCss)
        var subClass=isMain?"":" subPoint";
        var bkLine=$('<div class="stepLine'+subClass+'" data-index='+index+'></div>');
        bkLine.css(lineCss);
        _this.instance.append(bkLine);
        var fgLine=$('<div class="foregroundStepLine'+subClass+'"></div>');
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
            setPointState(this,$(this).hasClass('setpPoint-actived'));
            
        }
            
    }
    function setPointState(point,isActived){
        console.log($(point));
        var nextPoint=$(point).jqmData('nextPoint');
        if(!isActived){
            $(point).addClass('setpPoint-actived');
            if(nextPoint!=undefined){
                nextPoint.forEach(idx=>{
                    $('.stepPoint[data-index="'+idx+'"]').addClass('stepPoint-selectable');
                })
            }
            
            
            //console.log($('.stepPoint[data-index="1"]'),$(point).jqmData('index'));
        }else{
            $(point).removeClass('setpPoint-actived');
            if(nextPoint!=undefined){
                nextPoint.forEach(idx=>{
                    $('.stepPoint[data-index="'+idx+'"]').removeClass('stepPoint-selectable');
                })
            }
        }
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

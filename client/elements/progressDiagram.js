function ProgressesButton(arg){
    this.body=document.body;
    this.opt = {
        background_color : "lightgray",
        selected_color:"#1362B7",
        currentPosition:0,
        currentSubPosition:0,
        width:440,
        steps:[],
        deadSteps:[],
        size:10,
        fontSize:12,
        line_size:4,
        containerId:undefined,
        showLabel:true,
        dataId:-1,
        duration:300,
        isViewMode:false,
        verticalGap:Number.NaN,
        labelPosition:"center",
        //showSubSteps:true,
        readOnly:false,
        hasShadow:false,
        showCounter:false,
        counterData:[],
    }
    this.init(arg)
}
ProgressesButton.prototype.init=function(arg){
    //console.log("init.............."+this.opt.labelPosition);
    var _this=this;
    //extend(this.opt,arg);

    if (_this.opt.containerId!=undefined) this.parent=$(_this.opt.containerId);
    
    var steps=_this.opt.steps;

    var step=parseInt((_this.opt.width-_this.opt.size*2)/(steps.length-1));//根据宽度判断每个节点距离
    this.step=step;

  //建立容器
    if(this.instance==null){
        this.instance=getElement("",{
            'width':_this.opt.width+'px',
        });
    }else{
        this.instance.children().remove();
    }
    
    this.outter_frame=getElement("outter",{
    });

    this.breakpoint=[];
    this.items=[];
    var v_dist=_this.opt.size*1.5;//节点垂直距离

    var top_start=(_this.opt.size+_this.opt.line_size/2);
    var top_offset=_this.opt.size-_this.opt.line_size/2;

    var tops=[top_start];
    var lefts=[top_start]

    var v_gap=Number.isNaN(_this.opt.verticalGap)?(step-_this.opt.size*2):_this.opt.verticalGap;
    var v_step=_this.opt.size*2+v_gap;


    var arrayIndex=[];
        steps.forEach(function(step_item,index){
            if(step_item instanceof Array){
                arrayIndex.push(index);
            }
        });
        steps = $.grep(steps,function (step){
            return !(step instanceof Array);
        });
    
    steps.forEach(function(step_item,index){
        if(index>0){
            //var line_left=_this.opt.size+step*(index-1);
            lefts.push(_this.opt.size+step*(index));
            //console.log(index+"-"+step_item+": "+line_left);
            
        }
        if(step_item instanceof Array){
            _this.breakpoint.push(index);
            step_item.forEach(function(sub_step,i){
                var last_top=tops[tops.length-1];
                tops.push(last_top+v_step);
            });
        }else{

        }
    });   
    //console.log(tops);
    //console.log(tops[tops.length-2]/2);
    //console.log(lefts);
    var v_h=v_step;
    var middle_line=(tops[tops.length-2]+top_offset)/2
    
    if(tops.length==1){
        middle_line=tops[0];
    }
    //this.instance.css({height:(tops[tops.length-2]+_this.opt.size+_this.opt.line_size*2)+"px"});
    //console.log("H: "+(tops[1]-tops[0])+"--W: "+step+"="+Math.sqrt(v_h*v_h+step*step));
    var drawNextLine=true;
    steps.forEach(function(step_item,index){
        if(step_item instanceof Array){
            
            option_index=index;
            step_item.forEach(function(sub_step,i){
                var p_index=Math.round(Math.abs(middle_line-(tops[i]-_this.opt.line_size/2))/v_step);
                var height=v_h*p_index;
                var long_edge=Math.sqrt(height**2+step**2);
                var angle=-parseInt(bevel(height,long_edge));
                if((tops[i]-_this.opt.line_size/2)>middle_line) angle=Math.abs(angle);
                //console.log(sub_step+": "+middle_line+"--->"+(tops[i]-_this.opt.line_size/2)+"---"+angle);
                _this.outter_frame.append(getElement("progress-but-background-line ",{
                    'background':_this.opt.background_color,
                    'width':long_edge+'px',
                    'height':_this.opt.line_size+'px',
                    'left':(lefts[index-1])+'px',
                    'top':(middle_line)+'px',
                    'transform':"rotate("+(angle)+"deg)",
                    "transform-origin": "left center",
                }));

                //#region sub visible pre line
                var sub_selected_line=getElement("progress-but-background-line progress-but-indicator-selected selected-line"+(index)+"-"+(i)+" main-index"+index+" sub-index"+i,{
                    'background':_this.opt.selected_color,
                    'width':(_this.isSelectable(index,i)?long_edge:0)+'px',
                    'height':_this.opt.line_size+'px',
                    'left':(lefts[index-1])+'px',
                    'top':(middle_line)+'px',
                    'transform':"rotate("+(angle)+"deg)",
                    "transform-origin": "left center",
                })
                
                sub_selected_line.attr("id","selected-line"+(index)+"-"+(i));
                sub_selected_line.data("width",long_edge);
                
                sub_selected_line.on('click',async function(e){
                    console.log(e.currentTarget);
                    
                });
                _this.outter_frame.append(sub_selected_line);
                //#endregion
                //console.log(_this.opt.deadSteps);
                if(!_this.opt.deadSteps.includes(sub_step)){
                    angle=-parseInt(bevel(step,long_edge)-90);
                    if((tops[i]-_this.opt.line_size/2)>middle_line) angle=Math.abs(angle);
                    _this.outter_frame.append(getElement("progress-but-background-line ",{
                        'background':_this.opt.background_color,
                        'width':long_edge+'px',
                        'height':_this.opt.line_size+'px',
                        'left':(lefts[index])+'px',
                        'top':(tops[i]-_this.opt.line_size/2)+'px',
                        'transform':"rotate("+(angle)+"deg)",
                        "transform-origin": "left center",
                    }));

                    //#region sub visible next line
                    if((tops[i]-_this.opt.line_size/2)>middle_line) angle=Math.abs(angle);
                    sub_selected_next_line=getElement("progress-but-background-line progress-but-indicator-selected selected-line"+(index+1)+"-"+(i)+" main-index"+(index+1)+" sub-index"+i,{
                        'background':_this.opt.selected_color,
                        'width':(_this.isSelectable(index+1,i)?long_edge:0)+'px',
                        'height':_this.opt.line_size+'px',
                        'left':(lefts[index])+'px',
                        'top':(tops[i]-_this.opt.line_size/2)+'px',
                        'transform':"rotate("+(angle)+"deg)",
                        "transform-origin": "left center",
                    });
                    sub_selected_next_line.attr("id","selected-line"+(index+1)+"-"+(i));
                    sub_selected_next_line.data("width",long_edge);
                    sub_selected_next_line.on('click',async function(e){
                        //console.log(e.currentTarget);
                        
                    });
                    _this.outter_frame.append(sub_selected_next_line);
                    //#endregion

                    drawNextLine=false;
                }
                //#region Sub Indicators
                /*******************************/
               /*       Sub Indicators        */
              /*******************************/
                var frame =getElement("progress-but-frame",{
                    'left':(lefts[index]-_this.opt.size)+'px',
                    'top':(tops[i]-_this.opt.size)+'px',
                });
                var sub_indicator=getElement("progress-but-background-indicator main-indicator-index"+index+" sub-index-"+i,{
                    'background':_this.opt.background_color,
                    'width':_this.opt.size*2+'px',
                    'height':_this.opt.size*2+'px',
                    "borderRadius":(_this.opt.size)+"px",
                    "fontSize":_this.opt.fontSize+'px',
                },_this.opt.showLabel&&_this.opt.labelPosition=="center"?(_this.opt.fontSize+4>=_this.opt.size?sub_step.substring(0,1):sub_step):"");
                //console.log(sub_step+"-->"+sub_step.substring(1));
                sub_indicator.data("sub-index",i);
                sub_indicator.data("main-index",index+i/10);
                //if(_this.opt.readOnly) sub_indicator.css({"cursor":"default"});
                sub_indicator.data("isMainIndicator",false);
                sub_indicator.data("preLineId","selected-line"+(index)+"-"+(i));
                sub_indicator.data("nextLineId","selected-line"+(index+1)+"-"+(i));
                if(_this.opt.hasShadow) sub_indicator.addClass('progress-but-shadow');
                //console.log(index+"<"+(_this.opt.currentPosition+1)+"--"+step_item);
                //setselectable(sub_indicator,index<=_this.opt.currentPosition+1);
                //console.log(Math.floor(_this.opt.currentPosition));
                //var isSelectable=Math.round((_this.opt.currentPosition-Math.floor(_this.opt.currentPosition))*10)==i
                _this.setState(sub_indicator,index,i);
                _this.items.push(sub_indicator);
                sub_indicator.on('click',clickedEvent);
                frame.append(sub_indicator)

                var label =getElement("progress-but-label",{
                    "fontSize":_this.opt.fontSize+'px',
                },_this.opt.showLabel&&_this.opt.labelPosition!="center"?sub_step:"");
                frame.append(label)
                _this.outter_frame.append(frame);
                
                setCounterIndecator(lefts[index],tops[i],index,i);
                //#endregion
            });
            
            _this.outter_frame.append(getElement("progress-but-background-indicator main-indicator-index"+index,{
                'display':'none',
                'background':_this.opt.background_color,
                'width':_this.opt.size*2+'px',
                'height':_this.opt.size*2+'px',
                "borderRadius":(_this.opt.size)+"px",
                "fontSize":_this.opt.fontSize+'px',
                'left':(lefts[index]-_this.opt.size)+'px',
                'top':(middle_line+_this.opt.line_size/2-_this.opt.size)+'px',
            },step_item));
        }else{
            var realIndex=index;
            if(!_this.opt.showSubSteps){

                    if(realIndex>1)
                        realIndex+=1;
                
            }
            //#region Main Indicators
              /********************************/
             /*       Main Indicators        */
            /********************************/
            var frame =getElement("progress-but-frame",{
                'left':(lefts[index]-_this.opt.size)+'px',
                'top':(middle_line+_this.opt.line_size/2-_this.opt.size)+'px',
            });
            var indicator=getElement("progress-but-background-indicator main-indicator-index"+realIndex+1,{
                'background':_this.opt.background_color,
                'width':_this.opt.size*2+'px',
                'height':_this.opt.size*2+'px',
                "borderRadius":(_this.opt.size)+"px",
                "fontSize":_this.opt.fontSize+'px',
            },_this.opt.showLabel&&_this.opt.labelPosition=="center"?(_this.opt.fontSize+4>=_this.opt.size?step_item.substring(0,1):step_item):"");
            $(indicator).data("main-index",realIndex);
            indicator.data("isMainIndicator",true);
            if(_this.opt.hasShadow) indicator.addClass('progress-but-shadow');
            if(realIndex<=_this.opt.currentPosition && (arrayIndex.includes(realIndex+1)||_this.breakpoint.includes(realIndex+1))) {

            }else{
                //if(_this.opt.readOnly) indicator.css({"cursor":"default"});
            }
            indicator.data("preLineId","selected-line"+(realIndex));
            //setselectable(indicator,index<=_this.opt.currentPosition+1);
            _this.setState(indicator,realIndex,-1);
            
            _this.items.push(indicator);
            indicator.on('click',clickedEvent);
            frame.append(indicator)

            var label =getElement("progress-but-label",{
                "fontSize":_this.opt.fontSize+'px',
            },_this.opt.showLabel&&_this.opt.labelPosition!="center"?step_item:"");
            frame.append(label)
            
            _this.outter_frame.append(frame);
            setCounterIndecator(lefts[index],middle_line,realIndex);
            
            //#endregion
        }
        if(index+1<steps.length && drawNextLine){
            //var line_left=_this.opt.size+step*(index-1);
            //lefts.push(_this.opt.size+step*(index-1));
            //console.log(index+"-"+step_item+": "+lefts[index]);
            
            if(_this.breakpoint.includes(index+1)){
                var selected_line=getElement("progress-but-background-line progress-but-indicator-selected main-index"+realIndex,{
                    'display':'none',
                    'background':_this.opt.selected_color,
                    'height':_this.opt.line_size+'px',
                    'width':'0px',
                    'left':lefts[index]+'px',
                    'top':(middle_line)+'px',
                });
                _this.outter_frame.append(selected_line);
            }else{
                _this.outter_frame.append(getElement("progress-but-background-line",{
                    'background':_this.opt.background_color,
                    'height':_this.opt.line_size+'px',
                    'width':(step)+'px',
                    'left':lefts[index]+'px',
                    'top':(middle_line)+'px',
                }));
                //#region main visible line
                var selected_line=getElement("progress-but-background-line progress-but-indicator-selected selected-line"+(realIndex+1)+" main-index"+realIndex,{
                    'background':_this.opt.selected_color,
                    'height':_this.opt.line_size+'px',
                    'width':(index+1<=_this.opt.currentPosition?step:0)+'px',
                    'left':lefts[index]+'px',
                    'top':(middle_line)+'px',
                });
                
                selected_line.data("width",step);
                selected_line.attr("id","selected-line"+(realIndex+1));
                selected_line.on('click',async function(e){
                    //console.log(e.currentTarget);
                    
                    
                });
                //#endregion
                _this.outter_frame.append(selected_line);
            }
            
            
        }else{
            var selected_line=getElement("progress-but-background-line progress-but-indicator-selected main-index"+index,{
                'display':'none',
                'background':_this.opt.selected_color,
                'height':_this.opt.line_size+'px',
                'width':'0px',
                'left':lefts[index]+'px',
                'top':(middle_line)+'px',
            });
            _this.outter_frame.append(selected_line);
            
           //console.log(breakpoint);
           //console.log(index);
            drawNextLine=true;
        }
        
    });  
    //console.log("this items length..........."+_this.items.length);
    _this.instance.append(_this.outter_frame); 
    if(this.parent!=undefined) this.parent.append(this.instance);
    //return this;
    async function clickedEvent(e){
        
        if(_this.opt.isViewMode&&$(e.currentTarget).data('canSelect')){
            $(_this.outter_frame).trigger({type:'itemOnClicked', Position:formatIndex($(e.currentTarget).data('main-index')),
                        dataId:_this.dataId, target:$(e.currentTarget),event:e});
        }
        if($(e.currentTarget).data('canSelect')&&!_this.opt.isViewMode){
            //await _this.setProgress($(e.currentTarget).data('index'),_this.opt.duration);
            await _this.setFlow($(e.currentTarget),_this.opt.duration,!$(e.currentTarget).data('isMainIndicator'));
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
    function getElement(className,css,text){
        if(text==null) text="";
        var element=$("<div><span>"+text+"</span></div>");
        element.addClass(className);
        element.css(css);
        return element;
    }
    function bevel(straight,oblique){
        const sinOfAngleX = straight / oblique;
        return Math.round((Math.asin(sinOfAngleX)*180)/Math.PI);
    }
}

function getElement(className,css,text){
    if(text==null) text="";
    var element=$("<div><span>"+text+"</span></div>");
    element.addClass(className);
    element.css(css);
    return element;
}
function extend(opt1,opt2){
    for(var attr in opt2){
        //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
        opt1[attr] = opt2[attr];
    }
}
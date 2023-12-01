
var _data={
    template:["立案","一审","二审","执行","结案","再审","监督"],
    basic:{
        id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseLabel:2,caseReason:0,caseType:0,caseBelong:0,applicant:"张国庆",
        caseCause:6,createDate:"2023-08-11 14:03:19",casePersonnel:"公司1,个人0",case2ndParty:"李四",isReadOnly:true,caseLawsuitRequest:"",caseCounterclaimRequest:"",caseSum:"",caseLawsuit:500,caseCounterclaim:0
    },
    progressStatus:{
        id:1,caseNo:"A202311110005",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-09-11 14:00:00",
        penaltyAmount:500.00,exexuteAmount:243.00,caseStatus:4.1,courtName:1,caseOrgnizationPersonnel:"法官1,其他0"
        ,data:[
            {id:1,subid:0,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.9.28送达一审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00",dateOccur:"2023-09-28 14:00:00"},
            {id:1,subid:1,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.10.13送达判决书",caseDisputed:"",dateUpdated:"2023-11-02 14:00:00",dateOccur:"2023-10-13 14:00:00"},
            {id:1,subid:0,caseStatusId:1,caseNo:"A202311110005",caseUpdated:"23.10.28送达二审判决书",caseDisputed:"",dateUpdated:"2023-12-01 14:00:00",dateOccur:"2023-10-28 14:00:00"}
        ]
    },
    excuteStatus:[
        {id:1,subId:0,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张三",personContact:18612221231,purposeExecute:"财产",exexuteAmount:200,sumExecuted:"",filePath:"",dateExecuted:"2023-12-11 14:00:00"},
        {id:1,subId:1,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张五",personContact:1572312534,purposeExecute:"",exexuteAmount:34,sumExecuted:"",filePath:"",dateExecuted:"2023-12-21 14:00:00"},
    ],
    propertyStatus:[
        {id:1,caseNo:"A202311110005",caseStatusId:3.1,subId:0,propertyName:"未知",propertyStatus:1,dateUpdated:"2023-12-01 14:00:00",dateOccur:"2023-12-01 14:00:00"},

    ],
    attachments:[
        {id:1,evidenceId:0,caseStatusId:0,caseNo:"A202311110005",numFile:2,numCPage:5,numCopy:1,numOriginal:1,fileName:"审判决书",filePath:"",dateUploaded:"2023-11-01 14:00:00"},
    ]
}


var dataList=[
    {
        label:"立案",
        date:_data.basic.createDate,
        id:0
    },
    {
        label:"一审",
        date:_data.progressStatus.courtDate,
        id:1,
        data:[
            {
                date:"2023-09-28 14:00:00",
                label:"送达一审判决书"
            },
            {
                date:"2023-10-13 14:00:00",
                label:"送达修改判决书"
            },
            {
                date:"2023-11-01 14:00:00",
                label:"上传审判决书"
            }

        ]
    },
    {
        label:"二审",
        id:2,
        data:[
            {
                date:"2023-10-28 14:00:00",
                label:"送达二审判决书"
            },
            {
                date:"2023-12-01 14:00:00",
                property:"未知",
                status:"查封",
                type:"property",
                label:"查封 【未知】财产"
            }

        ]
    },
    {
        label:"正常执行",
        id:3,
        data:[
            {
                date:"2023-12-11 14:00:00",
                label:"执行标的【财产】",
                amount:"200",
                personal:"张三",
                type:"execute",
                label:"张三 执行标的【财产】 200万元"
            },
            {
                date:"2023-12-21 14:00:00",
                label:"执行标的【未知】",
                amount:"43",
                personal:"张五",
                type:"execute",
                label:"张五 执行标的【未知】 43万元"
            }

        ]
    }
]
function timelinePage(arg){
    this.opt = {
        template:undefined,
        data:undefined,
        canvas:undefined,
        summaryListContainer:undefined
    }
    extend(this.opt,arg);
    
    if(this.opt.data!=undefined && this.opt.canvas!=undefined){
        this.ctx=this.opt.canvas.getContext('2d');
        this.setTimeline(this.opt.data,this.opt.canvas);
    }
    
    if(this.opt.template!=undefined && this.opt.data!=undefined && this.opt.summaryListContainer!=undefined){
        this.setSumList(this.opt.template,this.opt.data,this.opt.summaryListContainer);
    }
    
    function extend(opt1,opt2){
        for(var attr in opt2){
            //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
            opt1[attr] = opt2[attr];
        }
    }
}
timelinePage.prototype.setTimeline=function(data,canvas){
    if (data==undefined) data=this.opt.data;
    if (canvas==undefined) canvas=this.opt.canvas;
    
    if (this.ctx==undefined) this.ctx=this.opt.canvas.getContext('2d');
    drawTimeline(data,this.ctx).forEach((circle)=>{
        //console.log(Object.getPrototypeOf(circle))
        //console.log(Object.keys(Object.getPrototypeOf(circle)).includes('addListener'));
        circle.addListener('click',function(e){
            console.log(this.sourceData.label+" ["+this.sourceData.index+"]--"+e.type);
            
            var datas=dataList.filter((item)=>item.id==this.sourceData.index);
            if(datas.length>0 && datas[0].data!= undefined){
                $('#event_list').children().remove();
                $('#event_list_title').text(this.sourceData.label);
                datas[0].data.forEach((ite)=>{
                    var date_bar=$('<li data-role="list-divider">'+formatDateTime(new Date(ite.date),"yyyy年MM月dd日 ")+'</li>');
                    var item_container=$('<li></li>');
                    var list_item=$('<label>'+ite.label+'</label>');
                    item_container.append(list_item);
                    $('#event_list').append(date_bar);
                    
                    $('#event_list').append(item_container);
                });
                //$('#event_list').append();
                //$('#event_list').remove();
                //$('#event_panel').append($('#event_list'));
                $( "#event_panel" ).trigger( "updatelayout" );
                $('#event_list').listview('refresh');
                $( "#event_panel" ).panel( "open" );
                //$.mobile.navigate( '#event_panel');
                //$('#popupDialog').popup("open");
            }
            
        })
        circle.addListener('mouseover',function(e){
            console.log(this.sourceData.label+" ["+this.sourceData.index+"]--"+e.type);
            $(canvas).css({cursor:"pointer"});
            e.ctx.globalCompositeOperation = "source-over";
        })
        circle.addListener('mouseout',function(e){
            console.log(this.sourceData.label+" ["+this.sourceData.index+"]--"+e.type);
            $(canvas).css({cursor:"default"});
        })
    });
}
timelinePage.prototype.setSumList=function(_summary_template,_data,containerId){
    
    if (_summary_template==undefined) _summary_template=this.opt.template;
    if (_data==undefined) _data=this.opt.data;
    if (containerId==undefined) containerId=this.opt.summaryListContainer;
    Object.keys(_summary_template).forEach(key=>{
        var collapsibleset=$('<div data-role="collapsible" data-theme="b" data-collapsed="false" ></div>');
        var collapsibleLabel=$('<h3>'+_summary_template[key].label+'</h3>');
        collapsibleset.append(collapsibleLabel);
        var listview=$('<ul data-role="listview" data-theme="a" data-inset="false"></ul>');
        collapsibleset.append(listview);
        $(containerId).append(collapsibleset);
        Object.keys(_summary_template[key].data).forEach(sub_key=>{
            $.each(Object.keys(_data),function(index,data_key){
                    //console.log(data_key+"--"+sub_key);
                if (data_key!="template" && Object.keys(_data[data_key]).includes(sub_key)){
                    var data=_summary_template[key].data[sub_key].data;
                    var label=_summary_template[key].data[sub_key].label;
                    
                    var val=_data[data_key][sub_key];
                    //console.log(_data);
                    
                    var isMultiValue=false;
                    var multiValues=[];
                    if(data!=undefined){
                        //console.log(data);
                        if(data instanceof Array){
                            var v=val.toString().split('.');
                            //console.log(v);
                            if(v.length>1){
                                val=data[v[0]][v[1]];
                            }else if(v.length==1){
                                
                                val=data[v[0]];
                            }
                        }
                        else{
                            isMultiValue=true;
                            var values=val.split(",");
                            $.each(data,(k,v)=>{
                                console.log(v);
                                
                                if(v instanceof Array){
                                    v.forEach((_val,index)=>{
                                        if(_val instanceof Object){
                                            if(values.includes(_val.value)){
                                                multiValues.push(_val.name);
                                            }
                                        }else{
                                            
                                            
                                        }
                                    });
                                    if(multiValues.length==0){
                                        values.forEach(_v=>{
                                            console.log(_v.indexOf(k));
                                            if(_v.indexOf(k)>-1){
                                                multiValues.push(data[k][parseInt(_v.replace(k,""))]);
                                                return false;
                                            }
                                               
                                        });
                                    }
                                    //console.log(values);
                                    
                                }else{
                                    //console.log();
                                    
                                }
                                
                            })
                            
                        }
                    }
                    console.log(data_key+"-->"+sub_key+"--->"+multiValues+"------------------");
                    if(isMultiValue){
                        var _collapsibleset=$('<div data-role="collapsible" data-theme="a" data-iconpos="right" data-inset="false" class="collapsible-listview" style="border:none;margin-right:-45px;" data-collapsed-icon="carat-d" data-expanded-icon="carat-u"></div>');
                        var _collapsibleLabel=$('<h4 class="ui-field-contain" style="margin:0px;border:none;"><div style="display:grid;grid-template-columns: auto 1fr;column-gap: 9px;margin-left:-3px"><label style="margin-top:2px;margin-bottom:-2px;">'+
                            label+'</label><label style="margin-top:2px;margin-bottom:-2px;">'+multiValues.join(",")+'</label></div><span class="ui-li-count">'+multiValues.length+'</span></h4>');
                        _collapsibleset.append(_collapsibleLabel);
                        var _listview=$('<ol data-role="listview" data-theme="b"> </ol>');
                        _collapsibleset.append(_listview);
                        if(multiValues.length>1){
                            multiValues.forEach(v=>{
                                var _li=$('<li class="ui-field-contain"></li>');
                                var _info_ele=$('<label>'+v+'</label>');
                                _li.append(_info_ele);
                                _listview.append(_li);
                            });
                            var label_ele=$('<label>'+label+'</label>');
                            var li=$('<li class="ui-field-contain" style="padding-top:0px;padding-bottom:0px;border:none;"></li>');
                            //li.append(label_ele);
                            li.append(_collapsibleset);
                            listview.append(li);
                        }else{
                            var label_ele=$('<label>'+label+'</label>');
                            var li=$('<li class="ui-field-contain"></li>');
                            li.append(label_ele);
                            li.append('<label>'+multiValues[0]+'</label>');
                            listview.append(li);
                        }
                        
                        //console.log('listview.html()');
                        //console.log(listview.html());
                    }else{
                        //console.log(val);
                        
                        var li=$('<li class="ui-field-contain"></li>');
                        
                        var label_ele=$('<label>'+label+'</label>');
                        var info_ele=$('<label>'+val+'</label>');
                        
                        li.append(label_ele);
                        if(sub_key=="caseLabel"){
                            console.log(val);
                            console.log(resourceDatas['caseLabelsColors']);
                            li.css(resourceDatas['caseLabelsColors'][val]);
                        }else if(sub_key=="caseStatus"){
                            info_ele=$('<div id="'+sub_key+'" style="margin-left:90px;margin-top:-7px;"></div>');
                            
                        }
                        li.append(info_ele);
                        listview.append(li);
                        if(sub_key=="caseStatus"){
                            
                            console.log("caseStatus................."+_data[data_key][sub_key]);
                            var but=new ProgressesButton({
                                steps:progresses,
                                deadSteps:deads,
                                selected_color:"#4B9DCB",
                                showLabel:true,
                                containerId:'#'+sub_key,
                                currentPosition:_data[data_key][sub_key],
                                fontSize:12,
                                line_size:4,
                                size:12,
                                width:240,
                                isViewMode:true,
                                verticalGap:2,
                                labelPosition:"bottom",
                                showSubSteps:false,
                                readOnly:true,
                            });
    
                        }
                    }
                    //console.log(val);
                    
                    //if (sub_key=="caseNo") console.log(data_key);
                    return false;
                }
                
            });
        });
        
    });
}

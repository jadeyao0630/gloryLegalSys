//案件基本数据
const table_progress_data=[
    {id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseLabel:2,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"张国庆",caseCause:6,createDate:"2023-11-11 14:03:19"},
    {id:2,caseNo:"A202311110004",caseName:"产品商标案件",caseLabel:0,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"李晓霞",caseCause:8,courtDate:"2023-12-15 14:00:00",createDate:"2023-11-11 14:03:19"}
];
//案件进展数据
const table_progress_status=[
  {id:1,caseNo:"A202311110005",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-12-11 14:00:00",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:3.1,courtName:"东城法院"},
  {id:2,caseNo:"A202311110004",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-12-11 14:00:00",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:1,courtName:"大兴法院"}
]
//案件进展明细数据
const table_progress_updates=[
  {id:1,subid:0,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.9.28送达一审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00"},
  {id:1,subid:1,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.9.28送达一审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00"},
  {id:1,subid:0,caseStatusId:1,caseNo:"A202311110005",caseUpdated:"23.10.28送达二审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00"},
  {id:2,subid:0,caseStatusId:0,caseNo:"A202311110004",caseUpdated:"一审，尚未收到诉状，对方已申请查封。",caseDisputed:"",dateUpdated:"2023-11-11 14:00:00"}
]
//案件附件数据
const table_progress_updates_attachments=[
  {id:1,evidenceId:0,caseStatusId:0,caseNo:"A202311110005",numFile:2,numCPage:5,numCopy:1,numOriginal:1,fileName:"审判决书",filePath:"",dateUploaded:"2023-11-01 14:00:00"},
]
//案件执行明细数据
const table_progress_executes=[
  {id:1,exeId:0,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张三",personContact:18612221231,purposeExecute:"财产",exexuteAmount:200,sumExecuted:"",filePath:"",dateExecuted:"2023-11-01 14:00:00"},
  {id:1,exeId:1,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张五",personContact:1572312534,purposeExecute:"",exexuteAmount:34,sumExecuted:"",filePath:"",dateExecuted:"2023-12-01 14:00:00"},
]
const clickedTarget = {
  same: 'same',
  sameParent: 'sameParent',
  notSame: 'notSame',
};
var list={
  caseUpdated:{
    label:"进展",
    type:"textarea"
  },caseDisputed:{
    label:"争议",
    type:"textarea"
  },dateUpdated:{
    label:"更新日期",
    type:"date"
  }
}
var list_evidence={
  fileName:{
    label:"证据名",
    type:"text",
  },numFile:{
    label:"份数",
    type:"text",
    width:50,
  },numCPage:{
    label:"页数",
    type:"text",
    width:50,
  },numOriginal:{
    label:"原件",
    type:"text",
    width:50,
  },numCopy:{
    label:"复印件",
    type:"text",
    width:50,
  }
}
var list_executed={
  dateExecuted:{
    label:"执行日期",
    type:"date",
  },personExecuted:{
    label:"执行经办人",
    type:"text",
  },personContact:{
    label:"经办人电话",
    type:"tel",
  },purposeExecute:{
    label:"执行标的",
    type:"text",
  },exexuteAmount:{
    label:"执行金额(万)",
    type:"text",
  },sumExecuted:{
    label:"说明",
    type:"text",
  }
}
var progressButtons={};
var progressUpdateStatus={
  currentProgressButton:undefined,
  currentProgressTarget:undefined,
  clickedPosition:{main:-1,sub:0},
  isUpdateOnly:false,
  currentPopupId:-1,
  clickedTarget:clickedTarget.notSame,
}
const table_progress = document.getElementById("table2");
table_progress.innerHTML= _createProgressTableHTML(table_progress_data,table_progress_status,table_progress_updates);

const progresses=["一审","二审","执行",["强制执行","正常执行","未执行"],"结案","再审","监督"];    
var deads=["未执行"]; 
$('.popup_status_but').on("click",function(e){
  console.log(progressUpdateStatus.currentPopupId);
  if(e.currentTarget.id=='process_save_but'){
    table_progress_status.forEach((item)=>{
      //console.log(item.id);

      //console.log(progressUpdateStatus.currentPopupId);
        //console.log( "item.id==progressUpdateStatus.currentPopupId: "+item.id+"--"+progressUpdateStatus.currentPopupId+"=="+(Number(item.id)==Number(progressUpdateStatus.currentPopupId)));
      if (Number(item.id)==Number(progressUpdateStatus.currentPopupId)){
        item.caseStatus=(progressUpdateStatus.clickedPosition.main+progressUpdateStatus.clickedPosition.sub/10);
        progressButtons[item.id].refresh({currentPosition:item.caseStatus});
        item.penaltyAmount=400.00;
        //_createProgressTableHTML(data,data1,data2)
      }
      
    });
    console.log($(table_progress));
    //table_progress.innerHTML= _createProgressTableHTML(table_progress_data,table_progress_status,table_progress_updates);
    $(table_progress).trigger("create");
  }
  setProgressPopupVisisbility(false);
  
});
$('.popup_update_but').on("click",async function(e){
  //console.log(currentProgressButton);
  
  
  if(e.currentTarget.id=='process_update_save_but'){
    
    if (progressUpdateStatus.clickedTarget!=clickedTarget.same) {
      console.log("isUpdateOnly--"+progressUpdateStatus.clickedTarget);
      if($(progressUpdateStatus.currentProgressTarget).data('isSelected')||progressUpdateStatus.clickedTarget==clickedTarget.sameParent){
        //console.log("确定删除之后的吗？");
        //$('.popup-b').addClass('popup-hide');
        if (!confirm(formatString(Message.PROGRESS_DELETE_WARNING_F,$("#process_updates_title").text()))) {
          return;
        } 
        
      }
      //console.log("last value: "+(progressUpdateStatus.clickedPosition.main+progressUpdateStatus.clickedPosition.sub/10));
      await progressUpdateStatus.currentProgressButton.setStep(progressUpdateStatus.currentProgressTarget);
      
    }
  }
  //history.back();
  
  setUpdatePopupVisisbility(false);
});

document.querySelectorAll("a[name^='popup_progress_']").forEach((pbut)=>{
  

 //设定每个查看按钮对应的流程图预览
  $(pbut).on("click",  function (e){
    //console.log("data-index: "+$(pbut).data("index"));
    _setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,$(pbut).data("index"));
  });
});
document.querySelectorAll("td[name='progress_but']").forEach((pbut)=>{


    var but=new ProgressesButton({
        steps:progresses,
        deadSteps:deads,
        showLabel:true,
        containerId:'#'+pbut.id,
        currentPosition:Number(pbut.dataset.value),
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
      
      progressButtons[$(pbut).data("index")]=but;
      $(but.instance).bind('stepChanged',function (e){
        console.log(e.Position.main+"."+e.Position.sub);

      });
      $(but.instance).on("itemOnClicked",  function (e){
        //console.log(progresses[e.Position.main]+"."+e.Position.sub);
        if(progresses[e.Position.main] instanceof Array){
          console.log(progresses[e.Position.main][e.Position.sub]);
        }else{
          console.log(progresses[e.Position.main]);
        }
        if(progresses[e.Position.main]=="执行")  {
            console.log(but.opt.showSubSteps);
            if(!but.opt.showSubSteps) {
                but.opt.labelPosition="center";
                $(pbut).attr("height","80px")
            }
            else {
                but.opt.labelPosition="bottom";
                $(pbut).attr("height",Number.NaN)
            }
            but.switchSubStepVisibility({});
            //$('#popup_progress_'+$(pbut).data("index")).popup("open",{transition:"slidedown"});
        }
      });
});
function _setFlowChart(data,status,executes,updates,targetId){
  var data1=data.filter(value=>{ return value.id==targetId});
  var data2=status.filter(value=>{ return value.id==targetId});
  var data3=executes.filter(value=>{ return value.id==targetId});
  var data4=updates.filter(value=>{ return value.id==targetId});
  if(data1.length>0 && data2.length>0){
    $("#progress_status_details").html(progressDetailsPopup(data2[0]));
    $("#progress_status_details").trigger("create");
    $("#progress_status_container").empty();
    $('#popup_progress_title').text(data1[0].caseName+"-"+data2[0].caseNo);
    var but=new ProgressesButton({
      steps:progresses,
      deadSteps:deads,
      showLabel:true,
      containerId:'#progress_status_container',
      currentPosition:Number(data2[0].caseStatus),
      fontSize:15,
      line_size:4,
      size:30,
      width:840,
      hasShadow:true,
      isViewMode:true,
      //verticalGap:2,
      //labelPosition:"bottom",
      showSubSteps:true,
      //readOnly:true,
      showCounter:true,
      counterData:data3.concat(data4),
    });
    //设置流程图里每个点的按钮连接任务
    $(but.instance).on("itemOnClicked",  function (e){
      progressUpdateStatus.currentProgressButton=but;
      progressUpdateStatus.clickedPosition=e.Position;
      progressUpdateStatus.currentProgressTarget=but.getItem(e.Position);
      progressUpdateStatus.originalPosition=formatIndex(but.opt.currentPosition);
      if(comparePoistion(e.Position,progressUpdateStatus.originalPosition)){
        progressUpdateStatus.clickedTarget=clickedTarget.same;
      }else{
        if(e.Position.main==progressUpdateStatus.originalPosition.main){
          progressUpdateStatus.clickedTarget=clickedTarget.sameParent;
        }else{
          progressUpdateStatus.clickedTarget=clickedTarget.notSame;
        }
      }
      
      
      console.log($("#process_execute_list"));
      
      //console.log(but.getItem(e.Position)==but.getItem(formatIndex(but.opt.currentPosition)));

      var title=progresses[e.Position.main] instanceof Array?progresses[e.Position.main][e.Position.sub]:progresses[e.Position.main];
      $("#process_updates_title").text(title);
      //$("#progress_step_update_list").html('');
      
      $("#process_update_list").html(addItemsToUpdatePopup(table_progress_updates.filter(value=>{ return value.id==data2[0].id && value.caseNo==data2[0].caseNo})) );
      $("#process_update_list").trigger("create");
      $("#process_update_upload_list").html(addItemsToUploadPopup(table_progress_updates_attachments.filter(value=>{ return value.id==data2[0].id && value.caseNo==data2[0].caseNo})) );
      
      if(e.Position.main==3){
        $("#process_execute_collapset").removeClass('popup-hide');
        $("#process_execute_list").html(addItemsToExecutePopup(table_progress_executes.filter(value=>{ return value.id==data2[0].id && value.caseNo==data2[0].caseNo})) );
        
        //$("#process_update_collapset").data('collapsed',true);
        $("#process_execute_collapset").collapsible( "option", "collapsed", false );
        $("#process_execute_list").trigger("create");
      }else{
        $("#process_execute_collapset").addClass('popup-hide');
        
        $("#process_update_collapset").collapsible( "option", "collapsed", false );
      }
      
      //$("#process_update_list").listview("refresh");
      
      $("#process_update_upload_list").trigger("create");
      setUpdatePopupVisisbility(true);
      
      //$('.popup-main').addClass('blur-background');
      
    });
    //$('#progress_status_details').html(progressDetailsPopup(data1[0],data2[0]));
  }
  progressUpdateStatus.clickedPosition=formatIndex(Number(data2[0].caseStatus));
    progressUpdateStatus.currentPopupId=targetId;
    //$('.popup-background.popup-a').removeClass("popup-hide");
    setProgressPopupVisisbility(true);
}
function _createProgressTableHTML(data,data1,data2){
    var item_html="";
    var progresses=["一审","二审","执行",["强制执行","正常执行","未执行"],"结案","再审","监督"]; 
    data.forEach((item)=>{

        var relatedStatusData=data1.filter(value=>{ return value.id==item.id && value.caseNo==item.caseNo});
        var relatedUpdateData=data2.filter(value=>{ return value.id==item.id && value.caseNo==item.caseNo});
        if (relatedStatusData.length==0 && relatedUpdateData==0) return false;
        //console.log(relatedStatusData);
        //console.log("relatedStatusData....");
        var item_col_html="";
        var style=" style='max-width:100px;{0}'";
        var background="";
        var color="";
        
        if(case_labels_colors[case_labels[item.caseLabel]].background){
            
            background="background:"+case_labels_colors[case_labels[item.caseLabel]].background+";";
        }
        if(case_labels_colors[case_labels[item.caseLabel]].color){
            color="color:"+case_labels_colors[case_labels[item.caseLabel]].color+";";
        }
        if(background.length>0 || color.length>0){
            
            style=formatString(style,(background.length>0?background:"")+(color.length>0?color:""));
            //console.log("color---"+item.caseNo+": "+style);
        }
        else{
            //style="";

        }
        var status=formatSatusIndex(relatedStatusData[0].caseStatus);
        var case_state=progresses[status.main] instanceof Array?progresses[status.main][status.sub]:progresses[status.main];
        //console.log(item.caseNo+": "+style);
        item_col_html+='<td class="text-center" '+style+'><div>'+case_labels[item.caseLabel]+'</div></td>';
        item_col_html+='<td><div><div style="font-size:18px;font-weight:700;">案件编号：'+item.caseNo+'</div><div>案件名称：'+item.caseName+'</div><div></td>';
        item_col_html+='<td><div><div>案发原因：'+case_reason[item.caseReason]+'</div><div>提交日期：'+item.createDate+'</div><div></td>';
        item_col_html+='<td><div><div>案由：'+case_causes[item.caseCause]+'</div><div id="status_text_'+item.id+'">状态：'+case_state+'</div><div></td>';
        item_col_html+='<td><div>判决金额：'+relatedStatusData[0].penaltyAmount+'万</div><div>执行金额：'+relatedStatusData[0].exexuteAmount+'万</div></td>';
        item_col_html+='<td id="progress_funcion_but_'+item.id+'" class="progress_function_but" name="progress_function_but" data-index='+item.id+' data-value='+relatedStatusData[0].caseStatus+'>'+
        '<div class="custom-border-radius">'+
        '<a href="#" data-index="'+item.id+'" name="popup_progress_'+item.id+'" data-transition="fade" class="ui-btn btn-icon-green ui-icon-eye ui-btn-icon-notext ui-corner-all">查看</a></div>'+
        '</td>';
        item_col_html+='<td id="progress_but_'+item.id+'" class="progress_but_container" name="progress_but" data-index='+item.id+' data-value='+relatedStatusData[0].caseStatus+'></td>';
        item_html+='<tr class="table-row">'+item_col_html+'</tr>';
    });
    return '<tbody>'+item_html+'</tbody>';
    
}
var progressTableTemplate=[
  {
    width:Number.NaN,
    data:{
      caseLabel:{

      }
    }
  },
  {
    width:Number.NaN,
    data:{
      caseReason:{
        label:"案发原因：",
        data:case_reason
      },
      createDate:{
        label:"提交日期：",
      }
    }
  },
  {
    width:Number.NaN,
    data:{
      caseCause:{
        label:"案由：",
        data:case_causes
      },
      caseStatus:{
        label:"状态：",
        data:progresses
      }
    }
  },
  {
    width:Number.NaN,
    data:{
      penaltyAmount:{
        label:"判决金额(万)：",
      },
      exexuteAmount:{
        label:"执行金额(万)：",
      }
    }
  }
]



function addItemsToUpdatePopup(data){
var table=$('<table></table>')
  var body=$('<tbody></tbody>');



  //table.append(header);
  //table.append(body);
  
  //console.log('clickedPosition');
 
  var filtedData=data.filter(function(item){ return comparePoistion(formatIndex(item.caseStatusId),progressUpdateStatus.clickedPosition)});
  var keys=[];
  var emptyItem={};
  var th=$('<tr></tr>');
  var thead=$('<thead></thead>');
  thead.append(th);
  $.each(list,function(key,value){
    var w=setColumnWidth(value.width);
    var h=$('<th'+w+'>'+value.label+'</th>');
    th.append(h);
    keys.push(key);
    emptyItem[key]="";
  });
  var h=$('<th></th>');
  th.append(h);
  if(filtedData.length>0){
    filtedData.forEach(function(item){
      var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(item[key]!= undefined){
          emptyItem['subId']=item.subId+1;
        //console.log(key+": "+item[key]);
          tr.append(SetData(list,key,item));
          
        }
      })
      tr.append(SetData({empty:{type:"button"}},"empty",{subid:item.subId,icon:"btn-icon-red ui-icon-minus",label:"删除"}));
      body.append(tr);
      
    });
    
  }
  var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(emptyItem[key]!= undefined){
        //console.log(key+": "+item[key]);
          tr.append(SetData(list,key,emptyItem));
          
        }
      });
      
      tr.append(SetData({empty:{type:"button"}},"empty",{subid:emptyItem.subId,icon:"btn-icon-green ui-icon-plus",label:"添加"}));
      body.append(tr);
  //console.log(table.html());
  table.append(thead);
  table.append(body);
  return table.html();
}
function addItemsToExecutePopup(data){
  var table=$('<table></table>')
  var body=$('<tbody></tbody>');
 
  var filtedData=data.filter(function(item){ return comparePoistion(formatIndex(item.caseStatusId),progressUpdateStatus.clickedPosition)});
 
  //console.log('filtedData');
  //console.log(filtedData);
  var keys=[];
  var emptyItem={};
  var th=$('<tr></tr>');
  var thead=$('<thead></thead>');
  thead.append(th);
  $.each(list_executed,function(key,value){
    var w=setColumnWidth(value.width);
    console.log(w);
    var h=$('<th'+w+'>'+value.label+'</th>');
    th.append(h);
    keys.push(key);
    emptyItem[key]=key=="exexuteAmount"?0:"";
  });
  var h=$('<th></th>');
  th.append(h);
  if(filtedData.length>0){
    filtedData.forEach(function(item){
      var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(item[key]!= undefined){
          emptyItem['subId']=item.subId+1;
        //console.log(key+": "+item[key]);
          tr.append(SetData(list_executed,key,item));
          
        }
      })
      tr.append(SetData({empty:{type:"button"}},"empty",{subid:item.subId,icon:"btn-icon-red ui-icon-minus",label:"删除"}));
      body.append(tr);
      
    });
    
  }
  var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(emptyItem[key]!= undefined){
          //if(key=="fileName"){
          //  tr.append(SetData("file",key,emptyItem));
          //}else{
            tr.append(SetData(list_executed,key,emptyItem));
          //}
        //console.log(key+": "+item[key]);
          
          
        }
      });
      
      tr.append(SetData({empty:{type:"button"}},"empty",{subid:emptyItem.subId,icon:"btn-icon-green ui-icon-plus",label:"添加"}));
      body.append(tr);
  //console.log(table.html());
  table.append(thead);
  table.append(body);
  return table.html();
}
function addItemsToUploadPopup(data){
  var table=$('<table></table>')
  var body=$('<tbody></tbody>');
 
  var filtedData=data.filter(function(item){ return comparePoistion(formatIndex(item.caseStatusId),progressUpdateStatus.clickedPosition)});
 
  var keys=[];
  var emptyItem={};
  var th=$('<tr></tr>');
  var thead=$('<thead></thead>');
  thead.append(th);
  $.each(list_evidence,function(key,value){
    var w=setColumnWidth(value.width);
    console.log(w);
    var h=$('<th'+w+'>'+value.label+'</th>');
    th.append(h);
    keys.push(key);
    emptyItem[key]=key=="fileName"?"":0;
  });
  var h=$('<th></th>');
  th.append(h);
  if(filtedData.length>0){
    filtedData.forEach(function(item){
      var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(item[key]!= undefined){
          emptyItem['subId']=item.subId+1;
        //console.log(key+": "+item[key]);
          tr.append(SetData(list_evidence,key,item));
          
        }
      })
      tr.append(SetData({empty:{type:"buttons"}},"empty",[
        {subid:item.subId,icon:"btn-icon-red ui-icon-minus",width:"50%",label:"删除"},
        {subid:item.subId,icon:"btn-icon-green ui-icon-eye",width:"50%",label:"查看"}
      ]));
      body.append(tr);

      
    });
    
  }
  var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(emptyItem[key]!= undefined){
          //if(key=="fileName"){
          //  tr.append(SetData("file",key,emptyItem));
          //}else{
            tr.append(SetData(list_evidence,key,emptyItem));
          //}
        //console.log(key+": "+item[key]);
          
          
        }
      });
      
      tr.append(SetData({empty:{type:"button"}},"empty",{subid:emptyItem.subId,icon:"btn-icon-green ui-icon-plus",label:"添加"}));
      body.append(tr);
  //console.log(table.html());
  table.append(thead);
  table.append(body);
  return table.html();
}
function setProgressPopupVisisbility(isVisible){
  if (isVisible){
    $('.popup-background.popup-a').removeClass("popup-hide");
    $('#popup_progress_main').removeClass('popup-hide')
    $('#popup_progress_main').removeClass('popout').addClass('popin');
  }else{
    $('#popup_progress_main').removeClass('popin').addClass('popout');
    $('.popup-background.popup-a').addClass("popup-hide");
    //$('#popup_progress_main').delay(10000).addClass('popup-hide')
  }
}
function setUpdatePopupVisisbility(isVisible){
  if (isVisible){
    $("#popupBasic").popup("open");
    $('.popup-background.popup-a').addClass('popup-b');
  }else{
    $('#popupBasic').popup("close");
    $('.popup-background.popup-a').removeClass('popup-b');
  }
}
function setColumnWidth(width){
  return width!=undefined?" style='width:"+width+"px;'":"";
}
function comparePoistion(source,target){
  return source.main==target.main && source.sub==target.sub;
}

function SetData(data,key,item){
  var type=data[key].type;
  var w=setColumnWidth(data[key].width);
  var item_ele;
  if(type=="textarea"){
    item_ele=$("<td"+w+">"+'<textarea cols="40" rows="2" name="'+key+'_'+item.subid+'" id="'+key+'_'+item.subid+'" value="'+item[key]+'">'+item[key]+'</textarea>'+"</td>");

  }else if(type=="date"){
    val=item[key];
    if(val.length==0) val=new Date().toISOString().substr(0,10);
    else val=new Date(item[key]).toISOString().substr(0,10);
    item_ele=$("<td"+w+">"+'<input type="'+type+'" id="'+key+'_'+item.subid+'" value="'+val+'">'+"</td>");
  }else if(type=="text"){
    item_ele=$("<td"+w+">"+'<input type="'+type+'" id="'+key+'_'+item.subid+'" value="'+item[key]+'">'+"</td>");
  }else if(type=="button"){
    item_ele=$("<td"+w+">"+'<div class="custom-border-radius">'+
    '<a href="#" data-index="'+item.subid+'" class="ui-btn '+item.icon+' ui-btn-icon-notext ui-corner-all">'+item.label+'</a></div>'+"</td>");
  }else if(type=="buttons"){
    var but_html="";
    var col_style=[];
    item.forEach((b)=>{
      but_html+='<div class="custom-border-radius">'+
      '<a href="#" data-index="'+b.subid+'" class="ui-btn '+b.icon+' ui-btn-icon-notext ui-corner-all">'+b.label+'</a></div>';
      col_style.push(b.width);
    });
    item_ele=$("<td"+" style='width:"+70+"px;'"+"><div style='display:grid;grid-template-columns:"+col_style.join(" ")+";column-gap:5px;'>"+but_html+"</div></td>");
  }else if(type=="file"){
    item_ele=$("<td"+w+">"+'<input type="'+type+'" id="'+key+'_'+item.subid+'" value="" >'+"</td>");
  }else if(type=="tel"){
    item_ele=$("<td"+w+">"+'<input type="'+type+'" id="'+key+'_'+item.subid+'" value="'+item[key]+'" >'+"</td>");
  }
  return item_ele;
}
function formatSatusIndex(status){
  status=Number(status);
  var main=Math.floor(status);
  var sub=Math.round((status-main)*10);
  return {main:main,sub:sub};
}
function progressDetailsPopup(data){
  
  var container=$('<div></div>');
  Object.keys(progress_status_details_request).forEach(function(key){
    var item=progress_status_details_request[key];
    var item_label=$('<label for="'+key+'">'+item.label+'</label>');
    var val=data[key];
    if(item.type=="date"||item.type=="datetime") val=new Date(val).toISOString().substr(0,10);
    var item_ele=$('<input type="'+item.type+'" name="'+key+'" id="'+key+'" value="'+val+'">');
    container.append(item_label);
    container.append(item_ele);
    
  });
  return container.html();
}



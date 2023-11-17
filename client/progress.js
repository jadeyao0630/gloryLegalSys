let table_progress_data=[
    {id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseLabel:2,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"张国庆",penaltyAmount:500.00,exexuteAmount:300.00,caseCause:6,caseStatus:3.1,createDate:"2023-11-11 14:03:19"},
    {id:2,caseNo:"A202311110004",caseName:"产品商标案件",caseLabel:0,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"李晓霞",penaltyAmount:500.00,exexuteAmount:300.00,caseCause:8,caseStatus:1,courtDate:"2023-12-15 14:00:00",createDate:"2023-11-11 14:03:19"}
];
let table_progress_status=[
  {id:1,caseNo:"A202311110005",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-12-11 14:00:00",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:3.1,courtName:"东城法院"},
  {id:2,caseNo:"A202311110004",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-12-11 14:00:00",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:1,courtName:"大兴法院"}
]
let table_progress_updates=[
  {id:1,caseNo:"A202311110005",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-12-11 14:00:00",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:3.1,courtName:"东城法院"},
  {id:2,caseNo:"A202311110004",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-12-11 14:00:00",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:1,courtName:"大兴法院"}
]
const table_progress = document.getElementById("table2");
table_progress.innerHTML= _createProgressTableHTML(table_progress_data,table_progress_status,table_progress_updates);

let progresses=["一审","二审","执行",["强制执行","正常执行","未执行"],"结案","再审","监督"];    
var deads=["未执行"]; 
$('.popup_status_but').on("click",function(e){
  console.log($(e.currentTarget).data('datas'));
  $('.popup-main').addClass("popup-hide");
});
table_progress_data.forEach(function(item){
    var form_container=$('#popup_progress_view_'+item.id);
    var but=new ProgressesButton({
        steps:progresses,
        deadSteps:deads,
        showLabel:true,
        containerId:'#progress_status_container_'+item.id,
        currentPosition:Number(item.caseStatus),
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
      });
      $(but.instance).on("itemOnClicked",  function (e){
        console.log(progresses[e.Position.main]+"."+e.Position.sub);
        //$('#popup_progress_'+item.id).popup("close",{transition:"slidedown"});
        console.log($('.popup-main'));
        //$('.popup-main').addClass("fadeIn");
        $('.popup-main').removeClass("popup-hide");
        
      });
      form_container.append($('<fieldset class="ui-grid-a progress-popup-buttons">'+
      '<div class="ui-block-a"><button type="submit" id="caseReg_but" class="ui-btn ui-corner-all ui-shadow ui-icon-check" data-rel="back">提交</button></div>'+
      '<div class="ui-block-b"><a id="caseReg_but_cancel" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back" data-rel="back">取消</a></div>'));
});
document.querySelectorAll("td[name='progress_but']").forEach((pbut)=>{


    var but=new ProgressesButton({
        steps:progresses,
        deadSteps:deads,
        showLabel:true,
        containerId:'#'+pbut.id,
        currentPosition:Number(pbut.dataset.value),
        fontSize:12,
        line_size:2,
        size:12,
        width:240,
        isViewMode:true,
        verticalGap:2,
        labelPosition:"bottom",
        showSubSteps:false,
        readOnly:true,
      });
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
      /*
      var but=new ProgressButton({
        steps:["一审","二审","执行","结案"],
        showLabel:true,
        width:140,
        currentPosition:parseInt(pbut.dataset.value),
        containerId:'#'+pbut.id,
        dataId:parseInt(pbut.dataset.index),
      });
      $(but.instance).bind('stepChanged',function (e){
        console.log(e);

        table_progress_data.forEach((item)=>{
            if(item.id == e.dataId){
                item.caseStatus=e.position;
                console.log($("#status_text_"+parseInt(pbut.dataset.index)).text());
                $("#status_text_"+parseInt(pbut.dataset.index)).text('状态：'+case_status[item.caseStatus]);
                return;
            }
        });
      });
      */
});
function _createProgressTableHTML(data,data1,data2){
    var item_html="";
    var progresses=["一审","二审","执行",["强制执行","正常执行","未执行"],"结案","再审","监督"]; 
    data.forEach((item)=>{

        var relatedStatusData=data1.filter(value=>{ return value.id==item.id && value.caseNo==item.caseNo});
        var relatedUpdateData=data2.filter(value=>{ return value.id==item.id && value.caseNo==item.caseNo});
        if (relatedStatusData.length==0 && relatedUpdateData==0) return false;
        console.log(relatedStatusData);
        console.log("relatedStatusData....");
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
            console.log("color---"+item.caseNo+": "+style);
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
        '<div class="custom-border-radius"><a id="progress_view_but" href="#popup_progress_'+item.id+'" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn btn-icon-green ui-icon-eye ui-btn-icon-notext ui-corner-all">查看</a></div>'+
        ProgressStatusPopup(item,relatedStatusData[0],relatedUpdateData[0])+
        '</td>';
        item_col_html+='<td id="progress_but_'+item.id+'" class="progress_but_container" name="progress_but" data-index='+item.id+' data-value='+relatedStatusData[0].caseStatus+'></td>';
        item_html+='<tr class="table-row">'+item_col_html+'</tr>';
    });
    return '<tbody>'+item_html+'</tbody>';
    
}
function ProgressStatusPopup(details,status,updates){
return '<div id="popup_progress_'+details.id+'" data-role="popup" data-theme="a" class="ui-corner-all ui-shadow" data-dismissible="false" >'+
        '<form style="padding:10px 20px;min-height:500px;" id="popup_progress_view_'+details.id+'">'+
        '<h3>'+details.caseName+'-'+details.caseNo+'</h3>'+
        '<div class="progress_popup">'+
              '<div id="progress_status_details_'+details.id+'">'+progressDetailsPopup(details,status)+'</div>'+
              '<div id="progress_status_container_'+details.id+'"></div>'+
        '</div></form></div>';
}
function progressDetailsPopup(details,status){
  let progress_status_details_request={
    courtDate:{
      type:"date",
      label:"开庭日期："
    },
    courtName:{
      type:"text",
      label:"法院："
    },
    caseLegal:{
      type:"text",
      label:"代理法务："
    },
    caseLawfirm:{
      type:"text",
      label:"代理律所："
    },
    penaltyAmount:{
      type:"text",
      label:"判决金额："
    },
  }
  var main_popup=$('<div class="popup-main popup-hide"><form><h4>test</h4></form></div>')
  var mian_popup_buttons=$('<fieldset class="ui-grid-a popup_status_buts">'+
  '<div class="ui-block-a"><a id="process_save_but" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_status_but" data-datas="'+status.id+'">提交</a></div>'+
  '<div class="ui-block-b"><a id="process_quit_cancel" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back popup_status_but">取消</a></div>');
  var container=$('<div></div>');
  main_popup.append(mian_popup_buttons);
  container.append(main_popup);
  Object.keys(progress_status_details_request).forEach(function(key){
    var item=progress_status_details_request[key];
    //console.log(status);
    var val=status[key];
    if(item.type=="date") val=new Date(val).toISOString().substr(0,10);
    var item_label=$('<label for="'+key+'_'+status.id+'">'+item.label+'</label>');
    var item_ele=$('<input type="'+item.type+'" name="'+key+'_'+status.id+'" id="'+key+'_'+status.id+'" value="'+val+'">');
    container.append(item_label);
    container.append(item_ele);
    console.log(container.html());
    
  });
  return '<div>'+container.html()+'</div>';
}

function formatSatusIndex(status){
  status=Number(status);
  var main=Math.floor(status);
  var sub=Math.round((status-main)*10);
  return {main:main,sub:sub};
}
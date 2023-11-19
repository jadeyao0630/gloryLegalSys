
var table_data=[
    {id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseReason:"劳动争议纠纷",caseType:0,caseBelong:0,applicant:"张国庆",attachnebts:"",createDate:"2023-11-11 14:03:19"},
    {id:2,caseNo:"A202311110004",caseName:"产品商标案件",caseReason:"行政诉讼",caseType:0,caseBelong:0,applicant:"李晓霞",attachnebts:"",createDate:"2023-11-11 14:03:19"}
];
var table_columns={
id:{
   label: "序号",
   width:50,
},
caseNo:{
    label:"案件编号"
},
caseName:{label:"案件名称"},
caseReason:{label:"案由"},
caseType:{label:"案件类型"},
caseBelong:{label:"所属项目"},
applicant:{label:"申请人"},
createDate:{label:"创建时间"},
}





_initRegTable(table_data,table_columns);


var checkboxes = document.querySelectorAll("input[type=checkbox][name=item_checkbox]")
checkboxes.forEach(function(checkbox) {
checkbox.addEventListener('change', function() {

        console.log(checkbox.dataset.item);

    
    })
});

var checkbox_main = document.querySelector(".reg-checkbox-all")
checkbox_main.addEventListener('change', function() {

        console.log(document.querySelectorAll("input[type=checkbox][name=item_checkbox]:checked"));

    
});

function _initRegTable(table_data,table_columns){
    const table = document.getElementById("table1");
    table.innerHTML=_getTableHTML(table_data,table_columns);
    //#region 操作按钮
    var fn_buts = document.querySelectorAll("button[name^=fn_btn]")
    fn_buts.forEach(function(fn_but) {
        fn_but.addEventListener('click', function() {

            console.log(fn_but.dataset.item+"--"+fn_but.name);
            //console.log(table_data[fn_but.dataset.item]);
            var matchItems=table_data.filter((item) =>item.id == fn_but.dataset.item);
            if(fn_but.name=="fn_btn_delete"){
                console.log(table_data);
                if(matchItems.length>0){
                    table_data.splice(table_data.indexOf(matchItems[0]),1);
                }
                
                _initRegTable(table_data,table_columns);
                $(document.getElementById("table1")).trigger('create');
            }else if(fn_but.name=="fn_btn_edit"){
                if(matchItems.length>0){
                    _setData(matchItems[0]);
                    //_createNewCaseForm(regTemplate);
                    //const popup_form = document.getElementById("popup_form_main");
                    //$("#popup_form_main").trigger("create");
                    _setBlurBackgroundVisibility(true);
                }
                //console.log($("#popup_form_main"));
            }else if(fn_but.name=="fn_btn_details"){
                if(matchItems.length>0){
                    //var data2=table_progress_status.filter(value=>{ return value.id==matchItems[0].id});
                    //var data3=table_progress_executes.filter(value=>{ return value.id==matchItems[0].id});
                    //var data4=table_progress_updates.filter(value=>{ return value.id==matchItems[0].id});
                    //console.log(matchItems[0].id);
                    _setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,matchItems[0].id);
                    //_createNewCaseForm(regTemplate);
                    //const popup_form = document.getElementById("popup_form_main");
                    //$("#popup_form_main").trigger("create");
                    //_setBlurBackgroundVisibility(true);
                }
                //console.log($("#popup_form_main"));
            }
        
        })
    });
    //#endregion
}
function _getTableHTML(data,columnData){
    //if(data.length==0) return "";
    var keys=data.length==0?Object.keys(columnData):Object.keys(data[0]);
    var columns_keys=Object.keys(columnData);
    var hasHeaderSet=false;
    var table_body_str="";
    var body_row_str="";
    var body_str="";
    
    var function_buts='<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
                    '<button name="fn_btn_details" class="btn-icon-green" data-icon="eye" data-iconpos="notext" data-item={0}>查看</button>'+
                    '<button name="fn_btn_edit" class="btn-icon-blue" data-icon="edit" data-iconpos="notext" data-item={0}>修改</button>'+
                    '<button name="fn_btn_delete" class="btn-icon-red" data-icon="delete" data-iconpos="notext" data-item={0}>删除</button>'+
                '</div>';
    var offset=keys.length-columns_keys.length;
    let header_str="";
    columns_keys.forEach((column,counter)=>{
        var ws=column.width!=undefined?" style='width:"+column.width+"px;'":"";
            if(counter<2){
                if(counter==0){
                    header_str+=`<th${ws}><input class="reg-checkbox-all" type="checkbox" data-mini="true"></th>`;
                }
                header_str+=`<th${ws}>${columnData[column].label}</th>`;
            }else{
                header_str+=`<th${ws} data-priority="${counter-1}">${columnData[column].label}</th>`;
            }
            if (counter==keys.length-1-offset){
                header_str+=`<th${ws}>操作</th>`;
            }
        
    });
    table_body_str+='<thead><tr>'+header_str+'</thead></tr>';
    data.forEach((item)=>{
        body_row_str="";
        var counter=0;
        columns_keys.forEach((column)=>{
            //console.log(column);
            
            if(keys.includes(column)){
                
                if (counter==0){
                    body_row_str+=`<td><input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item=${item["id"]}></td>`;
                } 
                
                if(column=="caseType"){
                    body_row_str+=`<td>${case_types[parseInt(item[column])]}</td>`;
                }else if(column=="caseBelong"){
                    body_row_str+=`<td>${projects[parseInt(item[column])]}</td>`;
                }else{
                    body_row_str+=`<td>${item[column]}</td>`;
                }
                //console.log(keys);
                //console.log(counter+"=="+(keys.length-1));
                if (counter==keys.length-1-offset){
                    console.log(formatString(function_buts,item["id"]));
                    body_row_str+=`<td>${formatString(function_buts,item["id"])}</td>`;
                }
                counter++;
            }
    
            
        }); 
        body_str+='<tr>'+body_row_str+'</tr>';
        counter=0;
    });
    table_body_str+='<tbody>'+body_str+'</tbody>';
    return table_body_str;
}



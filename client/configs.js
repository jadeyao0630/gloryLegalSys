let ip='cn.luyao.site';
let port=5555;
const mainPage="main.html";
class Message{
    static LOGIN_IS_EMPTY='<p style="color:red;">用户名和密码不能为空</p>';
    static LOGIN_ISNOT_MATCH='<p style="color:red;">用户名和密码不匹配</p>';
    static LOGIN_WELCOME_F='<p style="color:red;">欢迎{0}回来</p>';
    static PROGRESS_DELETE_WARNING_F='确定删除此流程点[{0}]后已存在其它流程点吗？';
}

const TextColor="rgb(51, 51, 51)";
const case_types=["被诉","主诉"];
const case_catelogs=["诉讼","仲裁"];
const case_labels=["普通案件","重大案件300万以上","重大案件1000万以上","重大案件 群诉"];
const case_reason=["逾期交付","逾期办证","捆绑销售","逾期付款","断供担保","断供追偿","执行异议"];
const case_causes=["购房合同纠纷","建设工程纠纷","佣金类纠纷","断供担保纠纷","断供担保纠纷",
                "断供追偿纠纷","劳动争议纠纷","金融借款纠纷","行政诉讼","民间借贷纠纷","房屋租赁合同纠纷",
                "拆迁安置纠纷","服务合同纠纷","物业服务合同纠纷","车位使用权转让纠纷","股权转让纠纷","侵权纠纷",
                "建筑物区分所有权","案外人执行异议之诉","票据追索权纠纷",];
const case_status=["一审","二审","执行","结案","再审","审判监督程序",];
const case_execute_status=["未执","强执","结案"];
const case_labels_colors={
    "普通案件":{background:"skyblue"},
    "重大案件300万以上":{background:"orange",color:"white"},
    "重大案件1000万以上":{background:"red",color:"white"},
    "重大案件 群诉":{background:"blue",color:"white"}
}
const columns={
    id:"INT NOT NULL AUTO_INCREMENT,PRIMARY KEY",
    caseNo:"VARCHAR(100) NOT NULL,UNIQUE",
    caseName:"VARCHAR(100) NOT NULL",
    caseLabel:"INT(2) NOT NULL DEFAULT '0'",
    caseDepartment:"INT(2) NOT NULL DEFAULT '0'",
    caseCompany:"INT(2) NOT NULL DEFAULT '0'",
    caseProject:"INT(2) NOT NULL DEFAULT '0'",
    casePersonnel:"VARCHAR(100) NOT NULL",
    case2ndParty:"VARCHAR(100) NOT NULL",
    caseCatelog:"INT(2) NOT NULL DEFAULT '0'",
    caseType:"INT(2) NOT NULL DEFAULT '0'",
    caseAttachments:"varchar(1000)",
    caseCause:"int(2) NOT NULL DEFAULT '0'",
    caseDate:"datetime NOT NULL",
    caseOrgnization:"varchar(100) NOT NULL",
    caseReason:"INT(2) NOT NULL DEFAULT '0'",
    caseLawsuit:"decimal(65)",
    caseCounterclaim:"decimal(65)",
    caseCounterclaimRequest:"varchar(1000)",
    caseLawsuitRequest:"varchar(1000)",
    caseSum:"varchar(1000)",
    caseApplicant:"varchar(100) NOT NULL",
    caseCreateDate:"datetime NOT NULL",
}
var projects=["北七家","大兴"]
var regTemplate={
    baseInfo:{
        label:"基础信息",
        data:{
            caseNo:{
                placeholder:"案件编号",
                label:"案件编号:",
                type:"text",
                isOptional:false,
            },
            caseName:{
                placeholder:"案件名称",
                label:"案件名称:",
                type:"text",
                isOptional:false,
            },
            caseLabel:{
                placeholder:"案件标签",
                label:"案件标签:",
                type:"combobox",
                isOptional:false,
                data:case_labels
            },
            /*
            caseDepartment:{
                placeholder:"所属业务单元",
                label:"所属业务单元:",
                type:"combobox",
                isOptional:false,
                data:["无"]
            },
            caseCompany:{
                placeholder:"所属地区公司",
                label:"所属地区公司:",
                type:"combobox",
                isOptional:false,
                data:["无"]
            },
            */
            caseProject:{
                placeholder:"所属项目",
                label:"所属项目:",
                type:"combobox",
                isOptional:false,
                data:projects
            },
            casePersonnel:{
                placeholder:"我方当事人",
                label:"我方当事人:",
                type:"text",
                isOptional:false,
            },
            case2ndParty:{
                placeholder:"对方当事人",
                label:"对方当事人:",
                type:"text",
                isOptional:false,
            },
            caseCatelog:{
                placeholder:"案件类别",
                label:"案件类别:",
                type:"radio",
                isOptional:false,
                data:case_catelogs
            },
            caseType:{
                placeholder:"案件类型",
                label:"案件类型:",
                type:"radio",
                isOptional:false,
                data:case_types
            },
            caseAttachments:{
                placeholder:"上传文件",
                label:"附件:",
                type:"file",
                isOptional:true,
                data:"支持扩展名：rar. zip. doc. docx. pdf. jpg… 单个文件不超过200MB"
            }
        }
        
    },
    caseInfo:{
        label:"案件信息",
        data:{
            caseCause:{
                placeholder:"案由",
                label:"案由:",
                type:"combobox",
                isOptional:false,
                data:case_causes
            },
            caseDate:{
                placeholder:"立案日期",
                label:"立案日期:",
                type:"date",
                isOptional:false,
            },
            caseOrgnization:{
                placeholder:"受理机构",
                label:"受理机构:",
                type:"text",
                isOptional:false,
            },
            caseReason:{
                placeholder:"案发原因",
                label:"案发原因:",
                type:"combobox",
                isOptional:false,
                data:case_reason
            },
            caseLawsuit:{
                placeholder:"本诉金额",
                label:"本诉金额(万元);",
                type:"text",
                isOptional:true,
                numberOnly:true
            },
            caseCounterclaim:{
                placeholder:"反诉金额",
                label:"反诉金额(万元):",
                type:"text",
                isOptional:true,
                numberOnly:true
            },
            caseLawsuitRequest:{
                placeholder:"本诉请求",
                label:"本诉请求:",
                type:"textarea",
                isOptional:true,
            },
            caseCounterclaimRequest:{
                placeholder:"反诉请求",
                label:"反诉请求:",
                type:"textarea",
                isOptional:true,
            },
            caseSum:{
                placeholder:"案件摘要",
                label:"案件摘要:",
                type:"textarea",
                isOptional:true,
            },
        }
    }
}
const progress_status_details_request={
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
      label:"判决金额(万)："
    },
  }
var isRunLocal=false;
let ip=isRunLocal?'localhost':'cn.luyao.site';
let port=5555;
var auth_code='1234';
var enableConsoleLog=true;
const mainPage="main.html";
class Message{
    static LOGIN_IS_EMPTY='<p style="color:red;">用户名和密码不能为空</p>';
    static LOGIN_ISNOT_MATCH='<p style="color:red;">用户名和密码不匹配</p>';
    static LOGIN_WELCOME_F='<p style="color:red;">欢迎{0}回来</p>';
    static PROGRESS_DELETE_WARNING_F='确定删除此流程点[{0}]后已存在其它流程点吗？';
}
const progresses=["一审","二审","执行",["强制执行","正常执行","未执行"],"结案","再审","监督"];  
var deads=["未执行"]; 
const TextColor="rgb(51, 51, 51)";
const property_status=["查封","冻结"];
const case_types=["被诉","主诉"];
const case_catelogs=["诉讼","仲裁"];
var caseRelatedParty={
    "公司":["国瑞信业建筑工程设计有限公司","国瑞德恒房地产开发有限公司","国瑞信业地产股份有限公司"],
    "个人":["张丽佳","李立","郑智"]
}
var legalAffairs=["无","贺璐璐","李俊峰","王培斯"];
var lawFirms=["无","君合","白朗"];
var Attorneys={"君合":["李海孚"],"白朗":["崔瀚文"]};
const projects=["北七家","大兴"];
const case_orgnization=["大兴法院","东城法院"];
var case_orgnizationPersonnel={
    "法官":["李新亮 57362323","郭艳 57362676","张振 57362300"],
    "其他":["张东莹 57362564","郑少杰 57362579","高新宇 57362335"]
}
const case_labels=["普通案件","重大案件300万以上","重大案件1000万以上","重大案件 群诉"];
const case_reason=["逾期交付","逾期办证","捆绑销售","逾期付款","断供担保","断供追偿","执行异议"];
const case_causes=["购房合同纠纷","建设工程纠纷","佣金类纠纷","断供担保纠纷","断供担保纠纷",
                "断供追偿纠纷","劳动争议纠纷","金融借款纠纷","行政诉讼","民间借贷纠纷","房屋租赁合同纠纷",
                "拆迁安置纠纷","服务合同纠纷","物业服务合同纠纷","车位使用权转让纠纷","股权转让纠纷","侵权纠纷",
                "建筑物区分所有权","案外人执行异议之诉","票据追索权纠纷",];
const case_status=["一审","二审","执行","结案","再审","审判监督程序",];
const case_execute_status=["未执","强执","结案"];
const case_labels_colors={
    "普通案件":{background:"skyblue",'text-shadow': 'none','text-align': 'center','font-weight':'700'},
    "重大案件300万以上":{background:"orange",color:"white",'text-shadow': 'none','text-align': 'center','font-weight':'700'},
    "重大案件1000万以上":{background:"#E25C62",color:"white",'text-shadow': 'none','text-align': 'center','font-weight':'700'},
    "重大案件 群诉":{background:"blue",color:"white",'text-shadow': 'none','text-align': 'center','font-weight':'700'}
}
const columns={//案件主表
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    caseName:"VARCHAR(255) NOT NULL",//案件名称
    caseLabel:"INT NOT NULL DEFAULT '0'",//案件标签->caseLabels*
    //caseDepartment:"INT NOT NULL DEFAULT '0'",
    //caseCompany:"INT NOT NULL DEFAULT '0'",
    caseProject:"INT NOT NULL DEFAULT '0'",//所属项目->projects*
    casePersonnel:"VARCHAR(255) NOT NULL",//我方当事人->corporateCompanies* && corporatePartners*
    case2ndParty:"VARCHAR(255) NOT NULL",//对方当事人
    caseCatelog:"INT NOT NULL DEFAULT '0'",//案件类别->caseCatelogs*
    //caseBelongs:"INT NOT NULL DEFAULT '0'",
    caseType:"INTNOT NULL DEFAULT '0'",//案件类型->caseTypes*
    //caseAttachments:"varchar(1000)",//案件附件->attachments
    caseCause:"INT NOT NULL DEFAULT '0'",//案由->caseCauses*
    caseDate:"datetime NOT NULL",//立案日期
    //legalInstitution:"INT default '0' NOT NULL",//受理机构->legalInstitution*
    //legalCounsel:"varchar(255)",//受理相关人->legalCounsel*
    caseReason:"INT NOT NULL DEFAULT '0'",//案发原因->caseReason*
    requestAmount:"VARCHAR(255) default '0.00'",//本诉金额
    appealAmount:"VARCHAR(255) default '0.00'",//反诉金额
    caseCounterclaimRequest:"varchar(1000)",//本诉请求
    caseLawsuitRequest:"varchar(1000)",//反诉请求
    caseSum:"varchar(1000)",//案件摘要
    caseApplicant:"varchar(255) NOT NULL",//申请人
    caseCreateDate:"datetime NOT NULL",//申请日期
    isReadOnly:"bool NOT NULL",//文档只读
}
const caseStatus={//案件状态
  id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
  caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
  caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
  legalAgencies:"INT NOT NULL",//代理法务->legalAgencies*
  lawFirm:"INT NOT NULL",//代理律所->lawFirms*
  attorney:"INT NOT NULL",//代理律师->attorneys*
  FirstInstance:"datetime",//一审日期
  SecondInstance:"datetime",//二审日期
  //court:"VARCHAR(255)",//法院->courts
  legalInstitution:"INT default '0' NOT NULL",//受理机构->legalInstitution*
  legalCounsel:"varchar(255)",//受理相关人->legalCounsel*
  //appealAmount:"VARCHAR(255) default '0.00'",//反诉金额
  //requestAmount:"VARCHAR(255) default '0.00'",//本诉金额
  penalty:"VARCHAR(255) default '0.00'",//判决金额
  paidAmount:"VARCHAR(255) default '0.00'",//执行金额
}
const caseUpdates={//案件每个状态点对应的更新
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    subId:"INT NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    updateDetails:"VARCHAR(255)",//案件更新事件内容
    dateOccur:"datetime",//案件更新事件发生日期
    dateUpdated:"datetime",//更新提交日期
    caseDisputed:"",//案件争议
}
const caseExcutes={//案件执行数据
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    subId:"INT NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    personExecuted:"VARCHAR(100)",//执行人
    personContact:"INT",//执行人电话
    targetExecuted:"VARCHAR(255)",//执行标的
    exexuteAmount:"VARCHAR(255) default '0.00'",//执行金额
    sumExecuted:"VARCHAR(1000)",//执行概要
    dateExecuted:"datetime",//执行日期
}
const propertyStatus={//资产状态数据
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    subId:"INT NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    propertyName:"VARCHAR(255)",//资产名称
    propertyStatus:"INT NOT NULL default '-1'",//资产状态->propertyStatus*
    dateUpdated:"datetime",//更新提交日期
    dateOccur:"datetime",//案件更新事件发生日期
}
const attachments={//案件相关文件
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    evidenceId:"INT NOT NULL default '0'",//案件序号子附件序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    numFile:"INT NOT NULL default '0'",//附件数
    numCPage:"INT NOT NULL default '0'",//附件页数
    numCopy:"INT NOT NULL default '0'",//附件复印件数
    numOriginal:"INT NOT NULL default '0'",//附件原件件数
    fileLabel:"VARCHAR(255)",//附件名称
    filePath:"VARCHAR(255)",//附件地址
    dateUploaded:"datetime",//上传日期
}
const _caseStatus={//案件状态
    id:"INT NOT NULL,PRIMARY KEY",//案件状态唯一序列号
    name:"VARCHAR(255)",//案件状态名称
    descriptions:"VARCHAR(255)",//案件类型说明
}
const caseLabels={//案件标签
    id:"INT NOT NULL,PRIMARY KEY",//案件标签唯一序列号
    label:"VARCHAR(255)",//案件标签名
    labelStyle:"VARCHAR(255)",//案件标CSS设置数据
    descriptions:"VARCHAR(255)",//案件标签说明
}
const caseTypes={//案件类型
    id:"INT NOT NULL,PRIMARY KEY",//案件类型唯一序列号
    label:"VARCHAR(255)",//案件类型名
    descriptions:"VARCHAR(255)",//案件类型说明
}
const caseCatelogs={//案件类别
    id:"INT NOT NULL,PRIMARY KEY",//案件类别唯一序列号
    label:"VARCHAR(255)",//案件类别名
    descriptions:"VARCHAR(255)",//案件类别说明
}
const caseCauses={//案由
    id:"INT NOT NULL,PRIMARY KEY",//案由唯一序列号
    label:"VARCHAR(255)",//案由名
    descriptions:"VARCHAR(255)",//案由名说明
}
const caseReason={//案发原因
    id:"INT NOT NULL,PRIMARY KEY",//案发原因唯一序列号
    type:"VARCHAR(255)",//案发原因类型
    descriptions:"VARCHAR(255)",//案发原因类型说明
}
const _propertyStatus={//资产列表
    id:"INT NOT NULL,PRIMARY KEY",//资产列表唯一序列号
    name:"VARCHAR(255)",//资产名称
    descriptions:"VARCHAR(255)",//资产说明
}
const project={//项目列表
    id:"INT NOT NULL,PRIMARY KEY",//项目列表唯一序列号
    name:"VARCHAR(255)",//项目名称
    address:"VARCHAR(255)",//项目地址
    region:"VARCHAR(255)",//项目地区
    descriptions:"VARCHAR(255)",//项目说明
}
const corporateCompanies={//案件当事公司
    id:"INT NOT NULL,PRIMARY KEY",//当事公司唯一序列号
    name:"VARCHAR(255)",//当事公司名称
    address:"VARCHAR(255)",//当事公司地址
    region:"VARCHAR(255)",//当事公司地区
    descriptions:"VARCHAR(255)",//当事公司说明
}
const corporatePartners={//案件当事人
    id:"INT NOT NULL,PRIMARY KEY",//当事人唯一序列号
    name:"VARCHAR(255)",//当事人名字
    contact:"VARCHAR(255)",//当事联系方式
    descriptions:"VARCHAR(255)",//当事人说明
}
const legalAgencies={//法务
    id:"INT NOT NULL,PRIMARY KEY",//法务唯一序列号
    name:"VARCHAR(255)",//法务名字
    contact:"VARCHAR(255)",//法务联系方式
    authLevel:"INT NOT NULL default '0'",//法务权限->authLevels*
    descriptions:"VARCHAR(255)",//法务说明
}
const authLevels={//应用权限
    id:"INT NOT NULL,PRIMARY KEY",//应用权限唯一序列号
    descriptions:"VARCHAR(255)",//应用权限说明
}
const legalInstitution={//受理机构
    id:"INT NOT NULL,PRIMARY KEY",//受理机构唯一序列号
    name:"VARCHAR(255)",//受理机构名称
    contact:"VARCHAR(255)",//受理机构联系方式
    address:"VARCHAR(255)",//受理机构地址
    descriptions:"VARCHAR(255)",//受理机构说明
}
const legalCounsel={//受理人
    id:"INT NOT NULL,PRIMARY KEY",//受理人唯一序列号
    name:"VARCHAR(255)",//受理人名字
    contact:"VARCHAR(255)",//受理人联系方式
    title:"INT NOT NULL default '-1'",//受理人职务->counselTitles*
    descriptions:"VARCHAR(255)",//受理人说明
}
const counselTitles={//受理人职务
    id:"INT NOT NULL,PRIMARY KEY",//受理人职务唯一序列号
    type:"VARCHAR(255)",//受理人职务名称
    descriptions:"VARCHAR(255)",//受理人职务说明
}
const lawFirms={//代理律所列表
    id:"INT NOT NULL,PRIMARY KEY",//代理律所唯一序列号
    name:"VARCHAR(255)",//代理律所名称
    contact:"VARCHAR(255)",//代理律所联系方式
    address:"VARCHAR(255)",//代理律所地址
    descriptions:"VARCHAR(255)",//代理律所说明
}
const attorneys={//代理律师列表
    id:"INT NOT NULL,PRIMARY KEY",//代理律师唯一序列号
    name:"VARCHAR(255)",//代理律师名字
    contact:"VARCHAR(255)",//代理律师联系方式
    descriptions:"VARCHAR(255)",//代理律师说明
}
var _firstPageTableColumns={
    checkallbox:{
        width:50,
        type:"checkbox"
    },
    id:{
    label: "序号",
    width:50,
    type:"label"
    },
    caseNo:{
        label:"案件编号",
        type:"label"
    },
    caseName:{label:"案件名称",
    type:"label"},
    caseReason:{label:"案由",
    type:"label",data:case_causes, isFilterable:true},
    caseType:{label:"案件类型",
    type:"label",data:case_types, isFilterable:true},
    caseBelong:{label:"所属项目",
    type:"label",data:projects, isFilterable:true},
    caseApplicant:{label:"申请人",matchKey:"id",valueKey:"name",
    type:"label", isFilterable:true,isHidden:true},
    caseCreateDate:{label:"创建时间",
    type:"date", dateFormat:'yyyy年MM月dd日', isFilterable:true},
    rowButtons:{
        label:"操作",
        type:"buttons"
    }
}
var _progressTableTemplate=[
    {
        width:50,
        data:{
            checkallbox:{
                type:"checkbox"
            },
        }
    },
    {
      width:Number.NaN,
      data:{
        caseLabel:{
            type:"backgroundColorLabel",
            data:case_labels,
            backgroundData:case_labels_colors,
            style:{'font-weight':'700','font-size':'18px'}
        }
      }
    },
    {
      width:Number.NaN,
      data:{
        caseReason:{
          label:"案发原因：",
          data:case_reason,
          style:{'font-weight':'700','font-size':'18px'}
        },
        caseCreateDate:{
          label:"提交日期：", type:"date",dateFormat:'yyyy年MM月dd日'
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
          data:progresses,
          type:"progresses"
        }
      }
    },
    {
        width:Number.NaN,
        data:{
            penalty:{
                label:"判决金额(万)：",
            },
            paidAmount:{
                label:"执行金额(万)：",
            }
        }
    },
    {
        width:240,
        data:{
            caseStatus:{
                type:"progressesButton"
            }
        }
    },
    {
        width:Number.NaN,
        data:{
            rowButtons:{
                type:"buttons",
                data:[
                    {label:'查看',clss:'ui-icon-eye btn-icon-green ui-btn-icon-notext'},
                    {label:'删除',clss:'ui-icon-delete btn-icon-red ui-btn-icon-notext'},
                ]
            }
        }
    }
  ]
var firstPageTableColumns={
    id:{
    label: "序号",
    width:50,
    },
    caseNo:{
        label:"案件编号"
    },
    caseName:{label:"案件名称"},
    caseReason:{label:"案由",data:case_causes},
    caseType:{label:"案件类型",data:case_types},
    caseBelong:{label:"所属项目",data:projects},
    caseApplicant:{label:"申请人",},
    caseCreateDate:{label:"创建时间"},
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
var FormTemplate={
    settings:{
        templateColumn:"50% 50%",
        hasLabel:true,
        hasPlaceHolder:true,
        labelPosition:"left",
        width:"100%",
        textareaHeight:50,
        isCollapsibleGrouping:true
    },
    template:{
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
                    type:"multicombobox",
                    isOptional:false,
                    data:caseRelatedParty,
                    isFilterable:true 
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
                caseDate:{
                    placeholder:"立案日期",
                    label:"立案日期:",
                    type:"date",
                    isOptional:false,
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
                    data:case_causes,
                    isFilterable:true
                },
                caseReason:{
                    placeholder:"案发原因",
                    label:"案发原因:",
                    type:"combobox",
                    isOptional:false,
                    data:case_reason
                },
                caseOrgnization:{
                    placeholder:"受理机构",
                    label:"受理机构:",
                    type:"combobox",
                    isOptional:false,
                    data:case_orgnization
                },
                caseOrgnizationPersonnel:{
                    placeholder:"受理相关人",
                    label:"受理相关人:",
                    type:"multicombobox",
                    isOptional:true,
                    data:case_orgnizationPersonnel,
                    isFilterable:true 
                },
                caseLawsuit:{
                    placeholder:"本诉金额",
                    label:"本诉金额(万元):",
                    type:"text",
                    isOptional:true,
                    numberOnly:true,
                    defaultValue:0.0
                },
                caseCounterclaim:{
                    placeholder:"反诉金额",
                    label:"反诉金额(万元):",
                    type:"text",
                    isOptional:true,
                    numberOnly:true,
                    defaultValue:0.0
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
}
var FormTemplate3={
    settings:{
        templateColumn:"33.3% 33.3% 33.3%",
        hasLabel:true,
        hasPlaceHolder:true,
        labelPosition:"left",
        width:"100%",
        textareaHeight:50,
        isCollapsibleGrouping:true
    },
    template:{
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
                    type:"multicombobox",
                    isOptional:false,
                    data:caseRelatedParty,
                    isFilterable:true 
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
                caseDate:{
                    placeholder:"立案日期",
                    label:"立案日期:",
                    type:"date",
                    isOptional:false,
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
                    data:case_causes,
                    isFilterable:true
                },
                caseReason:{
                    placeholder:"案发原因",
                    label:"案发原因:",
                    type:"combobox",
                    isOptional:false,
                    data:case_reason
                },
                caseOrgnization:{
                    placeholder:"受理机构",
                    label:"受理机构:",
                    type:"combobox",
                    isOptional:false,
                    data:case_orgnization
                },
                caseOrgnizationPersonnel:{
                    placeholder:"受理相关人",
                    label:"受理相关人:",
                    type:"multicombobox",
                    isOptional:true,
                    data:case_orgnizationPersonnel,
                    isFilterable:true 
                },
                caseLawsuit:{
                    placeholder:"本诉金额",
                    label:"本诉金额(万元):",
                    type:"text",
                    isOptional:true,
                    numberOnly:true,
                    defaultValue:0.0
                },
                caseCounterclaim:{
                    placeholder:"反诉金额",
                    label:"反诉金额(万元):",
                    type:"text",
                    isOptional:true,
                    numberOnly:true,
                    defaultValue:0.0
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
}
const progress_form_template={
    settings:{
        hasLabel:true,
        hasPlaceHolder:true,
        labelPosition:"top",
        width:"100%",
        textareaHeight:90,
        isCollapsibleGrouping:false,
    },
    template:{
        courtName:{
            type:"combobox",
            data:case_orgnization,
        label:"法院：",
        isOptional:true,
        },
        caseLegal:{
            type:"combobox",
            data:legalAffairs,
        label:"代理法务：",
        isOptional:true,
        },
        caseLawfirm:{
            type:"combobox",
            data:lawFirms,
        label:"代理律所：",
        isOptional:true,
        },
        caseAttorney:{
            type:"multicombobox",
            data:Attorneys,
        label:"代理律师：",
        isOptional:true,
        },
        penaltyAmount:{
        type:"text",
        label:"判决金额(万)：",
        isOptional:true,
        },
        exexuteAmount:{
        type:"text",
        label:"执行金额(万)：",
        isOptional:true,
        },
    }
  }
const progress_status_details_request={
    /*
    courtDate:{
      type:"date",
      label:"开庭日期："
    },
    */
    courtName:{
      type:"text",
      label:"法院："
    },
    caseLegal:{
      label:"代理法务：",
      type:"combobox",
      data:legalAffairs,
    },
    caseLawfirm:{
      type:"text",
      label:"代理律所："
    },
    penaltyAmount:{
      type:"text",
      label:"判决金额(万)："
    },
    exexuteAmount:{
      type:"text",
      label:"执行金额(万)："
    },
  }

  
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
  var list_proerty={
    propertyName:{
      label:"资产",
      type:"text",
      width:'70%',
    },propertyStatus:{
      label:"状态",
      type:"combobox",
      width:150,
      data:property_status,
    },dateUpdated:{
      label:"更新日期",
      type:"date",
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
      width:150,
    },personExecuted:{
      label:"执行经办人",
      type:"text",
      width:130,
    },personContact:{
      label:"经办人电话",
      type:"tel",
      width:130,
    },purposeExecute:{
      label:"执行标的",
      type:"text",
      width:130,
    },exexuteAmount:{
      label:"执行金额(万)",
      type:"text",
      width:100,
    },sumExecuted:{
      label:"说明",
      type:"text",
    }
  }
  var _summary_template={
    basic:{
        label:"基本信息",
        data:{
            caseNo:{
                label:"案件编号:",
            },
            caseName:{
                label:"案件名称:",
            },
            caseLabel:{
                placeholder:"案件标签:",
                label:"案件标签:",
                type:"combobox",
                isOptional:false,
                data:case_labels
            },
            caseBelong:{
                label:"所属项目:",
                data:projects
            },
            casePersonnel:{
                placeholder:"我方当事人",
                label:"我方当事人:",
                type:"multicombobox",
                isOptional:false,
                data:caseRelatedParty,
                isFilterable:true 
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
            caseStatus:{
                label:"案件状态:",
                data:progresses
            },
        }
        
    },
    legal:{
        label:"法律信息",
        data:{
            caseLegal:{
                label:"代理法务:",
            },
            courtName:{
                label:"受理法院:",
                data:case_orgnization
            },
            caseOrgnizationPersonnel:{
                label:"受理相关人:",
                data:case_orgnizationPersonnel
            }
        }
        
    },
    sum:{
        label:"金额信息",
        data:{
            caseLawsuit:{
                label:"本诉金额:",
            },
            caseCounterclaim:{
                label:"反诉金额:",
            },
            penaltyAmount:{
                label:"判决金额:",
            },
            exexuteAmount:{
                label:"执行金额:",
            },
        }
    },
    summary:{
        label:"详细信息",
        data:{
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
const PopupBottomYesNo='<fieldset class="ui-grid-a popup_message_buts">'+
'<div class="ui-block-a"><a id="{0}" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_message_but">{2}</a></div>'+
'<div class="ui-block-b"><a id="{1}" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back popup_message_but">{3}</a></div>'+
'</fieldset>';
const PopupBottomYes='<div class="popup_message_buts"><a id="{0}" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_message_but">{1}</a></div>';
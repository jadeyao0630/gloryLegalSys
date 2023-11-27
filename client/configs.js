var isRunLocal=true;
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
    "普通案件":{background:"skyblue",'text-shadow': 'none'},
    "重大案件300万以上":{background:"orange",color:"white",'text-shadow': 'none'},
    "重大案件1000万以上":{background:"#E25C62",color:"white",'text-shadow': 'none'},
    "重大案件 群诉":{background:"blue",color:"white",'text-shadow': 'none'}
}
const columns={
    id:"INT NOT NULL,PRIMARY KEY",
    caseNo:"VARCHAR(100) NOT NULL,UNIQUE",
    caseName:"VARCHAR(100) NOT NULL",
    caseLabel:"INT NOT NULL DEFAULT '0'",
    caseDepartment:"INT NOT NULL DEFAULT '0'",
    caseCompany:"INT NOT NULL DEFAULT '0'",
    caseProject:"INT NOT NULL DEFAULT '0'",
    casePersonnel:"VARCHAR(100) NOT NULL",
    case2ndParty:"VARCHAR(100) NOT NULL",
    caseCatelog:"INT NOT NULL DEFAULT '0'",
    caseBelongs:"INT NOT NULL DEFAULT '0'",
    caseType:"INTNOT NULL DEFAULT '0'",
    caseAttachments:"varchar(1000)",
    caseCause:"INT NOT NULL DEFAULT '0'",
    caseDate:"datetime NOT NULL",
    caseOrgnization:"INT default '0' NOT NULL",
    caseOrgnizationPersonnel:"varchar(100)",
    caseReason:"INT NOT NULL DEFAULT '0'",
    caseLawsuit:"decimal(65)",
    caseCounterclaim:"decimal(65)",
    caseCounterclaimRequest:"varchar(1000)",
    caseLawsuitRequest:"varchar(1000)",
    caseSum:"varchar(1000)",
    caseApplicant:"varchar(100) NOT NULL",
    caseCreateDate:"datetime NOT NULL",
    isReadOnly:"bool NOT NULL",
}
var _firstPageTableColumns={
    checkallbox:{
        width:50
    },
    id:{
    label: "序号",
    width:50,
    },
    caseNo:{
        label:"案件编号"
    },
    caseName:{label:"案件名称"},
    caseReason:{label:"案由",data:case_causes, isFilterable:true},
    caseType:{label:"案件类型",data:case_types, isFilterable:true},
    caseBelong:{label:"所属项目",data:projects, isFilterable:true},
    caseApplicant:{label:"申请人", isFilterable:true,isHidden:true},
    caseCreateDate:{label:"创建时间", isFilterable:true},
    rowButtons:{
        label:"操作"
    }
}
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

const PopupBottomYesNo='<fieldset class="ui-grid-a popup_message_buts">'+
'<div class="ui-block-a"><a id="{0}" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_message_but">{2}</a></div>'+
'<div class="ui-block-b"><a id="{1}" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back popup_message_but">{3}</a></div>'+
'</fieldset>';
const PopupBottomYes='<div class="popup_message_buts"><a id="{0}" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_message_but">{1}</a></div>';
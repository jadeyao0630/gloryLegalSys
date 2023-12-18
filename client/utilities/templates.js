var FormTemplate3;
var FormTemplate;
var _progressTableTemplate;
var _firstPageTableColumns;
var firstPageTableColumns;
var progressTableTemplate;
var progress_form_template;
var progress_status_details_request;
var list;
var list_proerty;
var list_evidence;
var list_executed;
var _summary_template;
  $('body').on(preload_completed_event_name,function(data){
    console.log(preload_completed_event_name);
    FormTemplate3={
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
                        data:resourceDatas.caseLabels
                    },
                    caseProject:{
                        placeholder:"所属项目",
                        label:"所属项目:",
                        type:"combobox",
                        isOptional:false,
                        data:$.grep(resourceDatas.projects_,(d)=>d.isInactived==0),
                        valueKey:'id',
                        displayFormat:'{name}'
                    },
                    casePersonnel:{
                        placeholder:"我方当事人",
                        label:"我方当事人:",
                        type:"supermulticombobox",
                        isOptional:false,
                        data:resourceDatas.casePersonnel,
                        isFilterable:true,
                        valueKey:'name',
                        matchKey:'id',
                        valueFormat:'{key}{id}',
                        displayFormat:'{value} ({status})',//'{name} {contact} {institution}'
                        optionFormat:'{name}'//'{name} {contact} {institution}'
                    },
                    case2ndParty:{
                        placeholder:"对方当事人",
                        label:"对方当事人:",
                        type:"supermultiinput",
                        isFilterable:true,
                        isOptional:false,
                    },
                    caseCatelog:{
                        placeholder:"案件类别",
                        label:"案件类别:",
                        type:"radio",
                        isOptional:false,
                        data:resourceDatas.caseCatelogs_,
                        valueKey:'id',
                        displayFormat:'{label}'
                    },
                    caseType:{
                        placeholder:"案件类型",
                        label:"案件类型:",
                        type:"radio",
                        isOptional:false,
                        data:resourceDatas.caseTypes_,
                        valueKey:'id',
                        displayFormat:'{label}'
                    },
                    caseDate:{
                        placeholder:"立案日期",
                        label:"立案日期:",
                        type:"date",
                        isOptional:false,
                    },
                    legalAgencies:{
                      placeholder:"代理法务",
                      label:"代理法务:",
                      type:"combobox",
                      data:resourceDatas.legalAgencies,
                      valueKey:'id',
                      matchKey:"name",
                      displayFormat:'{name}',
                      isFilterable:false,
                    },
                    /*
                    caseAttachments:{
                        placeholder:"上传文件",
                        label:"附件:",
                        type:"file",
                        isMultiple:true,
                        isOptional:true,
                        data:"支持扩展名：rar. zip. doc. docx. pdf. jpg… 单个文件不超过50MB",
                        table:'caseAttachments'
                    }
                    */
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
                        data:resourceDatas.caseCauses_,
                        valueKey:'id',
                        displayFormat:'{label}',
                        isFilterable:true
                    },
                    caseReason:{
                        placeholder:"案发原因",
                        label:"案发原因:",
                        type:"combobox",
                        isOptional:false,
                        data:resourceDatas.caseReason_,
                        valueKey:'id',
                        displayFormat:'{label}',
                    },
                    legalInstitution:{
                        placeholder:"受理机构",
                        label:"受理机构:",
                        type:"combobox",
                        isOptional:false,
                        data:resourceDatas.legalInstitution_,
                        valueKey:'id',
                        matchKey:"name",
                        displayFormat:'{name}',
                        table:'caseStatus'
                    },
                    legalCounsel:{
                        placeholder:"受理相关人",
                        label:"受理相关人:",
                        type:"multicombobox",
                        isOptional:true,
                        data:resourceDatas.legalCounsels,
                        isFilterable:true,
                        table:'caseStatus',
                        valueKey:'id',
                        matchKey:"name",
                        displayFormat:'{name} {contact}',//'{name} {contact} {institution}'
                    },
                    requestAmount:{
                        placeholder:"本诉金额",
                        label:"本诉金额(万元):",
                        type:"text",
                        isOptional:true,
                        numberOnly:true,
                        defaultValue:0.0,
                        table:'caseStatus'
                    },
                    appealAmount:{
                        placeholder:"反诉金额",
                        label:"反诉金额(万元):",
                        type:"text",
                        isOptional:true,
                        numberOnly:true,
                        defaultValue:0.0,
                        table:'caseStatus'
                    },
                    caseLawsuitRequest:{
                        placeholder:"本诉请求",
                        label:"本诉请求:",
                        type:"textarea",
                        isOptional:true,
                        table:'caseStatus'
                    },
                    caseCounterclaimRequest:{
                        placeholder:"反诉请求",
                        label:"反诉请求:",
                        type:"textarea",
                        isOptional:true,
                        table:'caseStatus'
                    },
                    caseSum:{
                        placeholder:"案件摘要",
                        label:"案件摘要:",
                        type:"textarea",
                        isOptional:true,
                        table:'caseStatus'
                    },
                }
            }
        }
    }
      _firstPageTableColumns={
        checkallbox:{
            width:25,
            type:"checkbox"
        },
        id:{
        label: "序号",
        width:50,
        type:"label",
        sortable:{
          type:'number',
          isASC:true,
          id:'id',
        }
        },
        caseLabel:{
          label:"标签",
            type:"backgroundColorLabel",
            data:case_labels,
            backgroundData:resourceDatas.caseLabelsColors,
            //style:{'font-weight':'700','font-size':'18px'},
            isFilterable:true,
        },
        caseNo:{
            label:"案件编号",
            type:"label",
            defaultValue:'尚未设定'
        },
        caseName:{label:"案件名称",
          type:"label", isFilterable:true,isHidden:true,
          defaultValue:'尚未设定'},
        caseCause:{label:"案由",
          type:"label",data:resourceDatas.caseCauses_,
          valueKey:'label',
          matchKey:'id', isFilterable:true},
        caseReason:{
          label:"案发原因",
          data:resourceDatas.caseReason_,
          valueKey:'label',
          matchKey:'id',isFilterable:true
          //style:{'font-weight':'700','font-size':'18px'}
        },
        
        caseCatelog:{
          label:"案件类别",
          type:"label",
          isFilterable:true,
          data:resourceDatas.caseCatelogs_,
          valueKey:'label',
          matchKey:'id'
      },
        caseType:{label:"案件类型",
          type:"label",
          data:resourceDatas.caseTypes_, 
          matchKey:'id',
          valueKey:'label',
          isFilterable:true},
        caseProject:{label:"所属项目",
          type:"label",data:resourceDatas.projects_,
          valueKey:'name',
          matchKey:'id', isFilterable:true},
        
        caseStatus:{
          label:"状态",
          data:resourceDatas.caseStatus,
          type:"progresses", isFilterable:true
        },
        penalty:{
          label:"判决金额(万)",
          type:"label", isFilterable:true,
          displayFormat:'{}万',
          sortable:{
            type:'number',
            isASC:true,
            id:'penalty',
          }
      },
        /*
        caseStatus:{
          label:"状态图",
          data:resourceDatas.caseStatus,
          type:"progressesButton", isFilterable:true
        },
        */
        legalAgencies:{
          label:"代理法务",
          type:"label",
          data:resourceDatas.legalAgencies,matchKey:"id",valueKey:"name",
          isFilterable:true
        },
        casePersonnel:{
            label:"我方当事人",
            type:"supermulticombobox",
            data:resourceDatas.casePersonnel,
            isFilterable:true ,
            displayFormat:'{value} ({status})'
        },
        case2ndParty:{
            label:"对方当事人",
            type:"supermultiinput",
            isFilterable:true ,
            data:{},
            displayFormat:'{value} ({status})'
        },
        caseApplicant:{label:"申请人",matchKey:"id",valueKey:"name",
          data:resourceDatas['users'],matchKey:"id",valueKey:"name",
          type:"label", isFilterable:true,isHidden:true},
        caseDate:{label:"立案日期",
          type:"date", dateFormat:'yyyy年MM月dd日', isFilterable:true,
          defaultValue:'尚未设定',
          sortable:{
            type:'date',
            isASC:true,
            id:'caseDate',
          }},
        rowButtons:{
          width:150,
            label:"操作",
            type:"buttons"
        }
    }
    
    
    
    progress_form_template={
        settings:{
            hasLabel:true,
            hasPlaceHolder:true,
            labelPosition:"left",
            gridStyle:{'row-gap':"5px"},
            width:'350px',
            textareaHeight:90,
            isCollapsibleGrouping:false,
        },
        template:{
          legalInstitution_p:{
                type:"combobox",
                data:resourceDatas.legalInstitution_,
                valueKey:'id',
                displayFormat:'{name}',
                label:"法院：",
                isOptional:true,
            },
            legalAgencies_p:{
                type:"combobox",
                data:resourceDatas.legalAgencies,
                label:"代理法务：",
                isOptional:true,
                valueKey:'id',
                displayFormat:'{name}',
            },
            lawFirm:{
                type:"combobox",
                data:resourceDatas.lawFirms_,
                valueKey:'id',
                displayFormat:'{name}',
                label:"代理律所：",
                isOptional:true,
            },
            attorney:{
                type:"multicombobox",
                data:resourceDatas.attorneys,
                label:"代理律师：",
                isOptional:true,
                valueKey:'id',
                matchKey:"name",
                //table:'caseStatus',
                displayFormat:'{name} {contact}'
            },
            penalty:{
                type:"text",
                label:"判决金额(万)：",
                isOptional:true,
                defaultValue:0.0
            },
                paidAmount:{
                type:"text",
                label:"执行金额(万)：",
                isOptional:true,
                defaultValue:0.0
            },
            FirstInstance:{
                type:"date",
                label:"一审日期：",
                isOptional:true,
                //defaultValue:0.0
            },
            SecondInstance:{
                type:"date",
                label:"二审日期：",
                isOptional:true,
                //defaultValue:0.0
            },
        }
      }
    
    
    
    list={
        updateDetails:{
          label:"进展",
          type:"textarea"
        },caseDisputed:{
          label:"争议",
          type:"textarea",
          isOptional:true,
        },dateUpdated:{
          label:"更新日期",
          type:"date",
          defaultValue:getDateTime()
        }
      }
      list_proerty={
        propertyName:{
          label:"资产",
          type:"text",
        },propertyStatus:{
          label:"状态",
          type:"combobox",
          width:150,
          data:resourceDatas.propertyStatus_,
          value:'id',
          displayFormat:'{label}',
        },dateOccur:{
          label:"发生日期",
          type:"date",
          defaultValue:getDateTime()
        },
      }
      list_evidence={
        fileLabel:{
          label:"证据名",
          type:"text",
        },numFile:{
          label:"份数",
          type:"number",
          numberOnly:true,
        },numCPage:{
          label:"页数",
          type:"number",
          numberOnly:true,
        },numOriginal:{
          label:"原件",
          type:"number",
          numberOnly:true,
        },numCopy:{
          label:"复印件",
          type:"number",
          numberOnly:true,
        },
        filePath:{
          label:"上传文件",
          type:"file",
        }
      }
      list_executed={
        dateExecuted:{
          label:"执行日期",
          type:"date",
          defaultValue:getDateTime()
        },targetExecuted:{
          label:"执行标的",
          type:"text",
        },personExecuted:{
          label:"执行经办人",
          type:"text",
        },personContact:{
          label:"经办人电话",
          type:"tel",
          numberOnly:true,
        },exexuteAmount:{
          label:"执行金额(万)",
          type:"text",
          numberOnly:true,
        },sumExecuted:{
          label:"说明",
          type:"text",
          isOptional:true,
        }
      }
      _summary_template={
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
                    data:resourceDatas.caseLabels
                },
                caseProject:{
                    label:"所属项目:",
                    data:resourceDatas.projects_,
                    valueKey:'id',
                    displayFormat:'{name}'
                },
                casePersonnel:{
                    placeholder:"我方当事人",
                    label:"我方当事人:",
                    type:"supermulticombobox",
                    isOptional:false,
                    data:resourceDatas.casePersonnel,
                    isFilterable:true ,
                    displayFormat:'{value} ({status})'
                },
                case2ndParty:{
                    placeholder:"对方当事人",
                    label:"对方当事人:",
                    type:"supermultiinput",
                    isOptional:false,
                    isFilterable:true ,
                    data:{},
                    displayFormat:'{value} ({status})'
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
              legalAgencies:{
                    label:"代理法务:",
                    data:resourceDatas.legalAgencies,
                    valueKey:'id',
                    displayFormat:'{name}',
                },
                legalInstitution:{
                    label:"受理法院:",
                    data:resourceDatas.legalInstitution_,
                    valueKey:'id',
                    displayFormat:'{name}',
                },
                legalCounsel:{
                    label:"受理相关人:",
                    type:"multicombobox",
                    data:resourceDatas.legalCounsels,
                    valueKey:'id',
                    displayFormat:'{name} {contact}',
                },
                lawFirm:{
                    label:"代理律所:",
                    data:resourceDatas.lawFirms_,
                    valueKey:'id',
                    displayFormat:'{name}',
                },
                attorney:{
                    label:"代理律师:",
                    type:"multicombobox",
                    data:resourceDatas.attorneys,
                    valueKey:'id',
                    displayFormat:'{name} {contact}',
                }
            }
            
        },
        sum:{
            label:"金额信息",
            data:{
              appealAmount:{
                    label:"本诉金额:",
                },
                requestAmount:{
                    label:"反诉金额:",
                },
                penalty:{
                    label:"判决金额:",
                },
                paidAmount:{
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
            
        },
        attachments:{
          label:"附件信息",
          data:{
            type:"listview",
            attachments:[],
            displayFormat:"上传了 {numCPage}页的 【{fileLabel}】 {numFile}份，有原件{numOriginal}份，复印件{numCopy}份",
          },
          
        },
        
    } 
    add_update_template={
      settings:{
        hasLabel:true,
        hasPlaceHolder:true,
        labelPosition:"left",
        width:'550px',
        textareaHeight:90,
        isCollapsibleGrouping:false,
        displayFormat:"{updateDetails} （{caseDisputed}）",
        type:'caseUpdates',
        idkey:'updatesId',
      },
      template:list
    }
    add_execute_template={
      settings:{
        hasLabel:true,
        templateColumn:"50% 50%",
        hasPlaceHolder:true,
        labelPosition:"left",
        width:'850px',
        textareaHeight:90,
        isCollapsibleGrouping:false,
        displayFormat:"{personExecuted} 为 ({targetExecuted}) 支付了 {exexuteAmount} 万元 ({sumExecuted})",
        type:'caseExcutes',
        idkey:'excutesId',
      },
      template:list_executed
    }
    add_property_template={
      settings:{
        hasLabel:true,
        hasPlaceHolder:true,
        labelPosition:"left",
        width:'550px',
        textareaHeight:90,
        isCollapsibleGrouping:false,
        displayFormat:"{propertyName} 状态为 {propertyStatus}",
        type:'caseProperties',
        idkey:'propertyId',
      },
      template:list_proerty
    }
    add_evidence_template={
      settings:{
        hasLabel:true,
        hasPlaceHolder:true,
        labelPosition:"left",
        width:'550px',
        textareaHeight:90,
        isCollapsibleGrouping:false,
        displayFormat:"上传了 {numCPage}页的 【{fileLabel}】 {numFile}份，有原件{numOriginal}份，复印件{numCopy}份",
        type:'caseAttachments',
        idkey:'evidenceId',
      },
      template:list_evidence
    }
    databasePage_form={
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
          databseBatch:{
              label:"数据库批处理",
              data:{
                dbName:{
                      placeholder:"数据库名",
                      label:"数据库名:",
                      type:"combobox",
                      isOptional:false,
                      data:addEmptyValueToArray(Object.keys(Object.assign(basicTableList,caseTableList))),
                      isValueCanNotBeNone:true,
                      valueKey:"*"
                  },
                  matchId:{
                      placeholder:"索引ID",
                      label:"索引ID:",
                      type:"combobox",
                      isOptional:false,
                      valueKey:"*"
                  },
                  matchRange:{
                      placeholder:"索引范围",
                      label:"索引范围:",
                      type:"textrange",
                      isOptional:false,
                  },
                  targetId:{
                      placeholder:"目标ID",
                      label:"目标ID:",
                      type:"combobox",
                      isOptional:false,
                      valueKey:"*"
                  },
                  targetValue:{
                      placeholder:"目标值",
                      label:"目标值:",
                      type:"text",
                      isOptional:false,
                  },
                  cutom:{
                    type:"custom",
                    data:'<div data-role="controlgroup" data-type="horizontal" style="text-align:right;" data-mini="true">'+
                    '<a class="ui-btn ui-corner-all ui-shadow ui-icon-delete btn-icon-red ui-btn-icon-left database-reset">复位</a>'+
                    '<a class="ui-btn ui-corner-all ui-shadow ui-icon-check btn-icon-green ui-btn-icon-left database-submit">修改</a>'+
                    '</div>',
                    
                    //span:'4/4'
                },
              }
              
          },
          databseInsert:{
            label:"数据库插入",
            data:{
              dbName_insert:{
                    placeholder:"数据库名",
                    label:"数据库名:",
                    type:"combobox",
                    isOptional:false,
                    data:addEmptyValueToArray(Object.keys(Object.assign(basicTableList,caseTableList))),
                    isValueCanBeNone:false,
                    valueKey:"*"
                },
                insertQuery:{
                    placeholder:'{”name“:”John“, ”age“:30, ”city“:”New York“}',
                    label:"插入数据:",
                    type:"textarea",
                    isOptional:false,
                },
                cutom:{
                  type:"custom",
                  data:'<div data-role="controlgroup" data-type="horizontal" style="text-align:right;" data-mini="true">'+
                  '<a class="ui-btn ui-corner-all ui-shadow ui-icon-delete btn-icon-red ui-btn-icon-left database-insert-reset">复位</a>'+
                  '<a class="ui-btn ui-corner-all ui-shadow ui-icon-check btn-icon-green ui-btn-icon-left database-insert-submit">修改</a>'+
                  '</div>',
                  
                  //span:'4/4'
              },
            }
            
          },
        }
      };
    settingPage_form={
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
          personInfo:{
              label:"个人信息",
              data:{
                name:{
                      placeholder:"姓名",
                      label:"姓名:",
                      type:"text",
                      isOptional:true,
                  },
                  contact:{
                      placeholder:"联系方式",
                      label:"联系方式:",
                      type:"tel",
                      isOptional:true,
                  },
                  email:{
                      placeholder:"电子邮箱",
                      label:"电子邮箱:",
                      type:"email",
                      isOptional:true,
                  },
                  pass:{
                      placeholder:"密码",
                      label:"密码:",
                      type:"password",
                      isOptional:true,
                      isChangeable:true,
                  },
                  position:{
                      placeholder:"职务",
                      label:"职务:",
                      type:"combobox",
                      isOptional:true,
                      data:position,
                      isAdminOnly:true
                  },
                  level:{
                      placeholder:"权限",
                      label:"权限:",
                      type:"combobox",
                      isOptional:true,
                      data:resourceDatas.authLevels_,
                      valueKey:'id',
                      displayFormat:'{descriptions}',
                      isAdminOnly:true
                  },
              }
              
          },
        }
      };
      
    settingPage_add_form={
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
          personInfo:{
              label:"个人信息",
              data:{
                name:{
                      placeholder:"姓名",
                      label:"姓名:",
                      type:"text",
                      isOptional:false,
                  },
                  contact:{
                      placeholder:"联系方式",
                      label:"联系方式:",
                      type:"tel",
                      isOptional:true,
                  },
                  email:{
                      placeholder:"电子邮箱",
                      label:"电子邮箱:",
                      type:"email",
                      isOptional:true,
                  },
                  pass:{
                      placeholder:"登录密码",
                      label:"登录密码:",
                      type:"password",
                      isOptional:false,
                      isChangeable:false,
                  },
                  user:{
                      placeholder:"登录名",
                      label:"登录名:",
                      type:"text",
                      isOptional:false,
                      isAdminOnly:true
                  },
                  position:{
                      placeholder:"职务",
                      label:"职务:",
                      type:"combobox",
                      isOptional:true,
                      data:position,
                      isAdminOnly:true
                  },
                  level:{
                      placeholder:"权限",
                      label:"权限:",
                      type:"combobox",
                      isOptional:true,
                      data:resourceDatas.authLevels_,
                      valueKey:'id',
                      displayFormat:'{descriptions}',
                      isAdminOnly:true
                  },
                  isInactived_a:{
                      placeholder:"禁用账户",
                      label:"是否禁用此账户",
                      type:"radio",
                      data:["否","是"],
                      isOptional:true,
                      isAdminOnly:true
                  },
              }
              
          },
        }
      };
  header_filter_template={
    settings:{
      hasLabel:true,
      hasPlaceHolder:true,
      labelPosition:"left",
      templateColumn:"25% 25% 25% 25%",
      isCollapsibleGrouping:false,
      gridStyle:{'row-gap':"5px"},
      labelStyle:{'text-align': 'right','padding-right':"15px",'min-width':'100px'},
      isMini:true
    },
    template:{
      caseLabel_f:{
          label:"案件标签:",
          type:"multicombobox",
          isOptional:true,
          //data:addEmptyValueToArray(resourceDatas.caseLabels,'无'),
          data:resourceDatas.caseLabels,
      },
      caseProject_f:{
          label:"所属项目:",
          type:"multicombobox",
          isOptional:true,
          //data:addEmptyValueToArray(resourceDatas.projects),
          data:resourceDatas.projects_,
          valueKey:'id',
          displayFormat:'{name}'
      },
      
      caseCause_f:{label:"案由:",
        type:"multicombobox",
        //data:addEmptyValueToArray(resourceDatas.caseCauses), 
        data:resourceDatas.caseCauses_,
        valueKey:'id',
        displayFormat:'{label}',
        isOptional:true,
        isFilterable:true,
      },
      caseReason_f:{
          label:"案发原因:",
          //data:addEmptyValueToArray(resourceDatas.caseReason),
          data:resourceDatas.caseReason_,
          valueKey:'id',
          displayFormat:'{label}',
          isOptional:true,
          type:"multicombobox"
          //style:{'font-weight':'700','font-size':'18px'}
      },
      casePersonnel_f:{
          label:"我方当事人:",
          type:"multicombobox",
          isOptional:true,
          //data:Object.assign({"无":["无"]},resourceDatas.casePersonnel),
          data:resourceDatas.casePersonnel,
          isFilterable:true,
          valueKey:'id',
          valueFormat:'{key}{id}',
          displayFormat:'{name}',
          //defaultValue:"无0"
      },
      
      legalAgencies_f:{
        label:"代理法务:",
        type:"multicombobox",
        isOptional:true,
        valueKey:'id',
        displayFormat:'{name}',
        //data:addEmptyValueToArray(resourceDatas.legalAgencies),
        data:resourceDatas.legalAgencies//.filter((d)=>{return d!='无'}),
      },
        caseType_f:{label:"案件类型:",
        type:"multicombobox",
        //data:addEmptyValueToArray(resourceDatas.caseTypes), 
        data:resourceDatas.caseTypes_,
        valueKey:'id',
        displayFormat:'{label}',
        isOptional:true,},
        
        caseStatus_f:{
          label:"状态:",
          //data:addEmptyValueToArray(resourceDatas.caseStatus),
          data:resourceDatas.caseStatus_object,
          type:"multicombobox", 
          isOptional:true,
        },
        penalty_f:{
          label:"判决金额(万):",
          type:"textrange", 
          isOptional:true,
      },
      caseDate_f:{
          label:"立案日期:",
          type:"textrange",
          subType:"date",
          isOptional:true,
      },
      isInactived_f:{

      },
      cutom:{
        type:"custom",
        data:'<div data-role="controlgroup" data-type="horizontal" style="text-align:right;" data-mini="true">'+
        '<a href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-search btn-icon-green ui-btn-icon-left header-filter-btn">查询</a>'+
        '<button class="ui-btn ui-corner-all ui-shadow ui-icon-delete btn-icon-red ui-btn-icon-left header-filter-btn">复位</button>'+
        '</div>',
        
        span:'4/4'
    },
    }
  }
});
  
function addEmptyValueToArray(array,value){
  if (value==undefined) value="无";
  array.unshift(value);
  return array;
}


const PopupBottomYesNo='<fieldset class="ui-grid-a popup_message_buts">'+
'<div class="ui-block-a"><a id="{0}" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_message_but">{2}</a></div>'+
'<div class="ui-block-b"><a id="{1}" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back popup_message_but">{3}</a></div>'+
'</fieldset>';
const PopupBottomYes='<div class="popup_message_buts"><a id="{0}" href="#" class="ui-btn ui-corner-all ui-shadow ui-icon-check popup_message_but">{1}</a></div>';

/*
_progressTableTemplate=[
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
          backgroundData:resourceDatas.caseLabelsColors,
          style:{'font-weight':'700','font-size':'18px'}
      }
    }
  },
  {
    width:Number.NaN,
    data:{
      caseReason:{
        label:"案发原因：",
        data:resourceDatas.caseReason,
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
        data:resourceDatas.caseCauses_,
        valueKey:'id',
        displayFormat:'{label}',
      },
      caseStatus:{
        label:"状态：",
        data:resourceDatas.caseStatus,
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
                  {label:'查看',clss:'ui-icon-eye btn-icon-green ui-btn-icon-notext',href:"#"},
                  {label:'编辑',clss:'ui-icon-edit btn-icon-blue ui-btn-icon-notext'},
                  {label:'删除',clss:'ui-icon-delete btn-icon-red ui-btn-icon-notext'},
              ]
          }
      }
  }
]
firstPageTableColumns={
  id:{
  label: "序号",
  width:50,
  sortable:{
    type:'number',
    isASC:true
  }
  },
  caseNo:{
      label:"案件编号"
  },
  caseName:{label:"案件名称"},
  caseReason:{label:"案由",data:resourceDatas.caseReason},
  caseType:{label:"案件类型",data:resourceDatas.caseType},
  caseProject:{label:"所属项目",data:resourceDatas.projects},
  caseApplicant:{label:"申请人",},
  caseDate:{label:"立案日期"},
}
progressTableTemplate=[
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
        data:resourceDatas.caseReason
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
        data:resourceDatas.caseCause
      },
      caseStatus:{
        label:"状态：",
        data:resourceDatas.caseStatus
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
progress_status_details_request={
  /*
  courtDate:{
    type:"date",
    label:"开庭日期："
  },
  
  legalInstitution_p:{
    type:"text",
    label:"法院："
  },
  legalAgencies_p:{
    label:"代理法务：",
    type:"combobox",
    data:resourceDatas.legalAgencies,
  },
  lawFirm:{
    type:"text",
    label:"代理律所：",
    data:resourceDatas.lawFirms,
  },
  attorney:{
    type:"text",
    label:"代理律所：",
    data:resourceDatas.attorneys,
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
*/
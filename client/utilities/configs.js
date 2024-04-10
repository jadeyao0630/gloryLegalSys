var isRunLocal=true;//https://socket.io/get-started/chat/

var IPS={
    home:{ip:'192.168.10.241',port:5555},
    glory:{ip:'192.168.10.68',port:5555},
    test:{ip:'192.168.10.68',port:5556},
    remote:{ip:'cn.luyao.site',port:5568}}
var showDebug=false;
var serverSelection=IPS.glory

let domain=getDomain();
serverSelection=domain==="cn.luyao.site"?IPS.remote:serverSelection
let ip=serverSelection.ip;
let port=serverSelection.port;
var auth_code='1234';
var adminLevel=3;
var supervisorLevel=2;
const keyStr = 'it@glory.com'
const ivStr = 'it@glory.com'
const APP_TITLE='国瑞法务管理系统';
const VERSION="v1.4";
var enableConsoleLog=true;
var enableRealDelete=true;
var enableReadOnlyMode=false;
var hideInactiveAgentCase=true;
var functionButoonPostion="top";
const mainPage="legal.html";
var logoSrc='./images/logo.png';
const userDbTableName="names";
const tableSeperator=";";
const attachmentFolder='messageAttachments';
var DataList={};
var preload_completed_event_name="preloadCompleted";
var main_load_completed_event_name="mainDataloadCompleted";
class Message{
    static LOGIN_IS_EMPTY='<p style="color:red;">用户名和密码不能为空</p>';
    static LOGIN_ISNOT_MATCH='<p style="color:red;">用户名和密码不匹配</p>';
    static LOGIN_WELCOME_F='<p style="color:red;">欢迎{0}回来</p>';
    static PROGRESS_DELETE_WARNING_F='确定删除此流程点[{0}]后已存在其它流程点吗？';
}
class AuthCatalogues{
    static ASSIGN_CASES='assignCases';
    static MANAGE_LIBRARIES='manageLibraries';
    static MANAGE_USERS='manageUsers';
}
const fileTypes={
    'jpeg':{
        previewable:true,
        icon:'file-image text-blue',
        tooltip:'JPEG文件'
    },
    'jpg':{
        previewable:true,
        icon:'file-image text-blue',
        tooltip:'JPG文件'
    },
    'png':{
        previewable:true,
        icon:'file-image text-blue',
        tooltip:'PNG文件'
    },
    'txt':{
        previewable:true,
        icon:'file-edit text-blue',
        tooltip:'文本文件'
    },
    'zip':{
        previewable:false,
        icon:'file-archive text-red',
        tooltip:'ZIP文件'
    },
    'rar':{
        previewable:false,
        icon:'file-archive text-red',
        tooltip:'RAR文件'
    },
    'doc':{
        previewable:false,
        icon:'file-word text-blue',
        tooltip:'WORD文件'
    },
    'docx':{
        previewable:true,
        icon:'file-word text-blue',
        tooltip:'WORD文件'
    },
    'xls':{
        previewable:false,
        icon:'file-excel text-green',
        tooltip:'EXCEL文件'
    },
    'xlsx':{
        previewable:false,
        icon:'file-excel text-green',
        tooltip:'EXCEL文件'
    },
    'pdf':{
        previewable:true,
        icon:'file-pdf text-red',
        tooltip:'PDF文件'
    },
}
var progressLabels=[{id:0,name:'立案'},{id:1,name:'一审'},{id:2,name:'二审'},{id:4,name:'正常执行'},{id:3,name:'强制执行'},{id:5,name:'无需执行'},{id:6,name:'结案'},{id:7,name:'再审'},{id:8,name:'监督'}];

var casePersonnelStatus=['无','原告','被告','被执行人','申请执行人','上诉人','原审被告','被上诉人'];
var position=['无','法务人员','法务管理']
var deads=["无需执行"]; 
const TextColor="rgb(51, 51, 51)";
const users={
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    user:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    pass:"VARCHAR(255) NOT NULL",//我方当事人->corporateCompanies* && corporatePartners*
    name:"VARCHAR(255)",//我方当事人->corporateCompanies* && corporatePartners*
    position:"INT NOT NULL DEFAULT '0'",//所属项目->projects*
    level:"INT NOT NULL DEFAULT '0'",//所属项目->projects*
    columns:"VARCHAR(255)",//所属项目->projects*
    tables:"VARCHAR(255)",//所属项目->projects*
    createDate:"datetime NOT NULL",//申请日期
    contact:"VARCHAR(255)",
    descriptions:"VARCHAR(255)",
    isInactived:"INT(1) default '0' NOT NULL",
}
const _casePersonnelStatus={
    id:"INT NOT NULL,PRIMARY KEY",//案件标签唯一序列号
    label:"VARCHAR(255)",//案件标签名
    descriptions:"VARCHAR(255)",//案件标签说明
    isInactived:"INT(1) default '0' NOT NULL",
}
const _notifications={
    id:"INT NOT NULL,PRIMARY KEY",//案件标签唯一序列号
    title:"VARCHAR(255)",//案件标签名
    message:"VARCHAR(1000)",//案件标签说明
    sender:"INT(1) default '0' NOT NULL",
    isInactived:"INT(1) default '0' NOT NULL",
    targetGroup:"VARCHAR(255)",
    targetPerson:"VARCHAR(255)",
    isSend:"INT(1) default '0' NOT NULL",
}
const columns={//案件主表
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    caseNo:"VARCHAR(255),UNIQUE",//案件编号
    caseName:"VARCHAR(255) NOT NULL",//案件名称
    caseLabel:"INT NOT NULL DEFAULT '0'",//案件标签->caseLabels*
    //caseDepartment:"INT NOT NULL DEFAULT '0'",
    //caseCompany:"INT NOT NULL DEFAULT '0'",
    caseProject:"INT NOT NULL DEFAULT '0'",//所属项目->projects*
    casePersonnel:"VARCHAR(255) NOT NULL",//我方当事人->corporateCompanies* && corporatePartners*
    casePersonnelStr:"VARCHAR(500)",//我方当事人
    case2ndParty:"VARCHAR(255) NOT NULL",//对方当事人
    case2ndPartyStr:"VARCHAR(500)",//对方当事人
    caseCatelog:"INT NOT NULL DEFAULT '0'",//案件类别->caseCatelogs*
    //caseBelongs:"INT NOT NULL DEFAULT '0'",
    caseType:"INT NOT NULL DEFAULT '0'",//案件类型->caseTypes*
    caseAttachments:"varchar(1000)",//案件附件->attachments
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
    legalFee:"decimal(65,4)",//文档只读
    lastUpdate:"datetime",//文档只读
}
const caseStatus={//案件状态
  id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
  caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
  caseStatus:"VARCHAR(100) default '[]'",//案件状态->caseStatus*
  legalAgencies:"INT(11) NOT NULL",//代理法务->legalAgencies*
  lawFirm:"INT(11) NOT NULL",//代理律所->lawFirms*
  attorney:"VARCHAR(100) default '无0'",//代理律师->attorneys*
  FirstInstance:"datetime",//一审日期
  SecondInstance:"datetime",//二审日期
  //court:"VARCHAR(255)",//法院->courts
  legalInstitution:"INT(11) default '0' NOT NULL",//受理机构->legalInstitution*
  legalCounsel:"varchar(255)",//受理相关人->legalCounsel*
  //appealAmount:"VARCHAR(255) default '0.00'",//反诉金额
  //requestAmount:"VARCHAR(255) default '0.00'",//本诉金额
  penalty:"VARCHAR(255) default '0.00'",//判决金额
  paidAmount:"VARCHAR(255) default '0.00'",//执行金额
  isInactived:"INT(1) default '0' NOT NULL"
}
const caseProgresses={//案件状态
    id:"INT NOT NULL",//案件唯一序列号
    typeId:"INT NOT NULL",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    legalAgencies:"INT(11) NOT NULL",//代理法务->legalAgencies*
    lawFirm:"INT(11) NOT NULL",//代理律所->lawFirms*
    attorney:"VARCHAR(100) default '无0'",//代理律师->attorneys*
    trialDate:"timestamp",//一审日期
    judgmentDate:"timestamp",//二审日期
    //court:"VARCHAR(255)",//法院->courts
    legalInstitution:"INT(11) default '0' NOT NULL",//受理机构->legalInstitution*
    legalCounsel:"varchar(255)",//受理相关人->legalCounsel*
    //appealAmount:"VARCHAR(255) default '0.00'",//反诉金额
    //requestAmount:"VARCHAR(255) default '0.00'",//本诉金额
    penalty:"VARCHAR(255) default '0.00'",//判决金额
    judgmentSum:"VARCHAR(1000)"
  }
const caseUpdates={//案件每个状态点对应的更新
    id:"INT(11) NOT NULL",//案件唯一序列号
    updatesId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    subId:"INT(11) NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    updateDetails:"VARCHAR(255)",//案件更新事件内容
    dateOccur:"datetime",//案件更新事件发生日期
    dateUpdated:"datetime",//更新提交日期
    caseDisputed:"VARCHAR(255)",//案件争议
    attachments:"VARCHAR(255)",//案件附件
    isInactived:"INT(1) default '0' NOT NULL"
}

const caseExcutes={//案件执行数据
    id:"INT NOT NULL",//案件唯一序列号
    excutesId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    subId:"INT NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    personExecuted:"VARCHAR(100)",//执行人
    personContact:"INT",//执行人电话
    targetExecuted:"VARCHAR(255)",//执行标的
    exexuteAmount:"VARCHAR(255) default '0.00'",//执行金额
    sumExecuted:"VARCHAR(1000)",//执行概要
    dateExecuted:"datetime",//执行日期
    attachments:"VARCHAR(255)",//案件附件
    isInactived:"INT(1) default '0' NOT NULL"
}
const properties={//资产状态数据
    id:"INT NOT NULL",//案件唯一序列号
    propertyId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    subId:"INT NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    propertyName:"VARCHAR(255)",//资产名称
    propertyStatus:"INT NOT NULL default '-1'",//资产状态->propertyStatus*
    dateUpdated:"datetime",//更新提交日期
    dateOccur:"datetime",//案件更新事件发生日期
    attachments:"VARCHAR(255)",//案件附件
    isInactived:"INT(1) default '0' NOT NULL"
}
const attachments={//案件相关文件
    id:"INT NOT NULL",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    evidenceId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    numFile:"INT NOT NULL default '0'",//附件数
    numCPage:"INT NOT NULL default '0'",//附件页数
    numCopy:"INT NOT NULL default '0'",//附件复印件数
    numOriginal:"INT NOT NULL default '0'",//附件原件件数
    fileLabel:"VARCHAR(255)",//附件名称
    filePath:"VARCHAR(255)",//附件地址
    dateUploaded:"datetime",//上传日期
    isInactived:"INT(1) default '0' NOT NULL"
}
const _caseLinked={//案件状态
    id:"INT(11) NOT NULL",//案件状态唯一序列号
    caseStatus:"VARCHAR(100) default '0'",//案件状态子序列号
    caseId:"INT(11) NOT NULL",//案件状态名称
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    linkId:"INT(11) NOT NULL,PRIMARY KEY",//案件类型说明
    isInactived:"INT(1) default '0' NOT NULL"
}
const _caseStatus={//案件状态
    id:"INT NOT NULL,PRIMARY KEY",//案件状态唯一序列号
    isMain:"bool default '1'",//案件状态子序列号
    isTrial:"tinyint(1) DEFAULT '0' NULL",
    isExcute:"tinyint(1) DEFAULT '0' NULL",
    name:"VARCHAR(255)",//案件状态名称
    descriptions:"VARCHAR(255)",//案件类型说明
}
const caseLabels={//案件标签
    id:"INT NOT NULL,PRIMARY KEY",//案件标签唯一序列号
    label:"VARCHAR(255)",//案件标签名
    labelStyle:"VARCHAR(255)",//案件标CSS设置数据
    descriptions:"VARCHAR(255)",//案件标签说明
    isInactived:"INT(1) default '0' NOT NULL",
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
    isInactived:"bool default '0'",//是否标为禁用
}
const caseReason={//案发原因
    id:"INT NOT NULL,PRIMARY KEY",//案发原因唯一序列号
    label:"VARCHAR(255)",//案发原因类型
    descriptions:"VARCHAR(255)",//案发原因类型说明
    isInactived:"bool default '0'",//是否标为禁用
}
const _propertyStatus={//资产状态
    id:"INT NOT NULL,PRIMARY KEY",//资产状态唯一序列号
    label:"VARCHAR(255)",//资产状态名称
    descriptions:"VARCHAR(255)",//资产状态说明
}
const project={//项目列表
    id:"INT NOT NULL,PRIMARY KEY",//项目列表唯一序列号
    name:"VARCHAR(255)",//项目名称
    address:"VARCHAR(255)",//项目地址
    region:"VARCHAR(255)",//项目地区
    descriptions:"VARCHAR(255)",//项目说明
    isInactived:"bool default '0'",//是否标为禁用
}
const corporateCompanies={//案件当事公司
    id:"INT NOT NULL,PRIMARY KEY",//当事公司唯一序列号
    name:"VARCHAR(255)",//当事公司名称
    address:"VARCHAR(255)",//当事公司地址
    region:"VARCHAR(255)",//当事公司地区
    descriptions:"VARCHAR(255)",//当事公司说明
    isInactived:"bool default '0'",//是否标为禁用
}
const corporatePartners={//案件当事人
    id:"INT NOT NULL,PRIMARY KEY",//当事人唯一序列号
    name:"VARCHAR(255)",//当事人名字
    contact:"VARCHAR(255)",//当事联系方式
    descriptions:"VARCHAR(255)",//当事人说明
    isInactived:"bool default '0'",//是否标为禁用
}
const legalAgencies={//法务
    id:"INT NOT NULL,PRIMARY KEY",//法务唯一序列号
    name:"VARCHAR(255)",//法务名字
    contact:"VARCHAR(255)",//法务联系方式
    authLevel:"INT NOT NULL default '0'",//法务权限->authLevels*
    descriptions:"VARCHAR(255)",//法务说明
    isInactived:"bool default '0'",//是否标为禁用
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
    region:"VARCHAR(255)",//受理机构区域
    descriptions:"VARCHAR(255)",//受理机构说明
    isInactived:"bool default '0'",//是否标为禁用
}
const legalCounsel={//受理人
    id:"INT NOT NULL,PRIMARY KEY",//受理人唯一序列号
    name:"VARCHAR(255)",//受理人名字
    contact:"VARCHAR(255)",//受理人联系方式
    title:"INT NOT NULL default '0'",//受理人职务->counselTitles*
    institution:"INT NOT NULL default '-1'",//受理人所属机构
    descriptions:"VARCHAR(255)",//受理人说明
    isInactived:"bool default '0'",//是否标为禁用
}
const counselTitles={//受理人职务
    id:"INT NOT NULL,PRIMARY KEY",//受理人职务唯一序列号
    label:"VARCHAR(255)",//受理人职务名称
    descriptions:"VARCHAR(255)",//受理人职务说明
}
const _lawFirms={//代理律所列表
    id:"INT NOT NULL,PRIMARY KEY",//代理律所唯一序列号
    name:"VARCHAR(255)",//代理律所名称
    contact:"VARCHAR(255)",//代理律所联系方式
    address:"VARCHAR(255)",//代理律所地址
    descriptions:"VARCHAR(255)",//代理律所说明
    isInactived:"bool default '0'",//是否标为禁用
}
const attorneys={//代理律师列表
    id:"INT NOT NULL,PRIMARY KEY",//代理律师唯一序列号
    name:"VARCHAR(255)",//代理律师名字
    contact:"VARCHAR(255)",//代理律师联系方式
    lawFirm:"INT NOT NULL default '-1'",//代理律师所属机构
    descriptions:"VARCHAR(255)",//代理律师说明
    rating:"INT NOT NULL default 0",//代理律师评分
    expertise:"VARCHAR(255) default 0",//代理律师专长
    fee:"decimal(64,2) default 0.0",//代理律师费用
    isInactived:"bool default '0'",//是否标为禁用
}
const expertises={//代理律师专长
    id:"INT NOT NULL,PRIMARY KEY",//代理律师专长唯一序列号
    name:"VARCHAR(255)",//代理律师专长名称
    descriptions:"VARCHAR(255)",//代理律师专长说明
}
const auth_catalogues={//代理律师专长
    id:"INT NOT NULL,PRIMARY KEY",//代理律师专长唯一序列号
    name:"VARCHAR(255)",//代理律师专长名称
    descriptions:"VARCHAR(255)",//代理律师专长说明
}
const string_format={
    id: 'VARCHAR(255) NOT NULL,PRIMARY KEY',
    displayFormat:'VARCHAR(1000)',
    descriptions:"VARCHAR(255)",//代理律师专长说明
}
function getDomain(){
    // 获取referrer URL
    var referrer = document.referrer;

    // 判断referrer是否存在
    if (referrer) {
        // 使用URL构造函数解析referrer
        var referrerURL = new URL(referrer);

        // 获取referrer的域名
        var referrerDomain = referrerURL.hostname;

        // 输出referrer的域名
        console.log('Referrer domain:', referrerDomain);
        return referrerDomain;

    } else {
        console.log('没有referrer信息，可能是直接访问或其他情况。');
    }
    return undefined;
}
// 用户名
// u_igso6mtg
// 密码
// vlzj4hwi
// 服务器地址
// calendar.dingtalk.com


// ALTER TABLE case_causes
// ADD isInactived INT(1) default '0' NOT NULL;

// ALTER TABLE case_reasons
// ADD isInactived INT(1) default '0' NOT NULL;



// ALTER TABLE attorneys
// ADD fee decimal(64,2) default '0.0' AFTER descriptions;
// ALTER TABLE attorneys
// ADD expertise VARCHAR(255) default '-1' AFTER descriptions;
// ALTER TABLE attorneys
// ADD rating INT(11) default '0' AFTER descriptions;

// CREATE TABLE expertises (
//     id INT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL, 
//     descriptions VARCHAR(255)
// );

// ALTER TABLE names
// ADD authCatalogues VARCHAR(255);

// CREATE TABLE auth_catalogues (
//     id INT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL, 
//     descriptions VARCHAR(255)
// );

// CREATE TABLE string_format( 
//     id VARCHAR(255) NOT NULL , 
//     displayFormat VARCHAR(1000), 
//     descriptions VARCHAR(255),
//     PRIMARY KEY (`id`)
//   )

// CREATE TABLE libChangeLog( 
//     logId INT NOT NULL AUTO_INCREMENT,
//     id INT NOT NULL , 
//     userId INT NOT NULL , 
//     userName VARCHAR(255),
//     tableName VARCHAR(255),
//     operateType VARCHAR(255),
//     keyName VARCHAR(255),
//     fromValue VARCHAR(255),
//     toValue VARCHAR(255),
//     changedTime DATETIME,
//     PRIMARY KEY (`logId`)
//   )
// ALTER TABLE cases ADD casePersonnelStr JSON AFTER casePersonnel;
// ALTER TABLE cases ADD case2ndPartyStr JSON AFTER case2ndParty;

// alter table `glory`.`case_status` 
//    add column `isTrial` tinyint(1) DEFAULT '0' NULL after `isMain`, 
//    add column `isExcute` tinyint(1) DEFAULT '0' NULL after `isTrial`

// CREATE TABLE caseChangeLog( 
//     id INT NOT NULL AUTO_INCREMENT, 
//     caseId INT, 
//     changes text,
//     date DATETIME, 
//     operation VARCHAR(255),
//     userName VARCHAR(255),
//     userId INT,
//     PRIMARY KEY (`id`)
//   )

// CREATE TABLE caseUpdateChangeLog( 
//     id INT NOT NULL AUTO_INCREMENT, 
//     caseId INT, 
//     tableName VARCHAR(255),
//     changes text,
//     date DATETIME, 
//     operation VARCHAR(255),
//     userName VARCHAR(255),
//     userId INT,
//     PRIMARY KEY (`id`)
//   )

// CREATE TABLE userChangeLog( 
//     id INT NOT NULL AUTO_INCREMENT, 
//     targetId INT, 
//     changes text,
//     date DATETIME, 
//     operation VARCHAR(255),
//     userName VARCHAR(255),
//     userId INT,
//     PRIMARY KEY (`id`)
//   )
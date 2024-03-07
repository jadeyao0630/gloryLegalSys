

var result=[];
var collectDbList=true;

$('#loadingLogo').attr('src',logoSrc)
$('#headerLogo').attr('src',logoSrc)
goToPage('#');
$('#mainFooter').hide();
//getBasicDatabaseData();
$('#mainLoadingMessage').text('读取中...');
var isPassthrought=logingStatus();
logingStatus().then(function(e){

    console.log('logingStatus',e);
    if(e.sucess){
        updateLastLogin(getGlobalJson("currentUser").id).then((r)=>console.log);
        getLegalAgencies().then(d=>{
            console.log('getLegalAgencies',d)
            var agencies=d.data.filter(dd=>dd.position>0 && dd.isInactived==0);
            resourceDatas['legalAgencies']=agencies;
            resourceDatas['users']=d.data.filter(dd=>dd.id>0);
        })
        getBasic(basicTableList,[]).then(d=>{
            //console.log(d.data.attorneys);
            if(d.data!=undefined){
                
                $.each(d.data,(k,d)=>{
                    //$('#mainLoadingMessage').text('读取中...'+k);
                    if(showDebug)console.log(`Data from ${k}:`, d);
                    if(k=="projects"){
                        projects=getKeyValues(d,"name");
                        resourceDatas[k]=projects;
                        resourceDatas[k+"_"]=d;
                        //console.log(projects);
                    }
                    else if(k=="caseLabels"){
                        case_labels=getKeyValues(d,"label");
                        var _data={}
                        $.each(d,(i,element) => {
                            _data[element.label]=JSON.parse(element.labelStyle);
                        });
                        case_labels_colors=_data;
                        
                        resourceDatas[k]=case_labels;
                        resourceDatas[k+"_"]=d;
                        resourceDatas['caseLabelsColors']=_data;
                        //console.log(`Data from caseLabelsColors:`, _data);
                        //FormTemplate3.template.baseInfo.data.caseLabel.data=getKeyValues(d,"label");
                    }
                    else if(k=="caseReason"){
                        case_reason=getKeyValues(d,"label")
                        resourceDatas[k]=case_reason;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="caseCauses"){
                        case_causes=getKeyValues(d,"label")
                        resourceDatas[k]=case_causes;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="caseStatus"){
                        progresses=[];
                        progresses_object={};
                        var collector=[];
                        $.each(d,(index,_d)=>{
                            if(_d.isMain){
                                if(collector.length>0) {
                                    progresses.push(collector);
                                    collector=[];
                                }
                                progresses.push(_d.name)
                                progresses_object[_d.id]=_d.name;
                            }else{
                                collector.push(_d.name);
                                progresses_object[_d.id]=_d.name;
                            }
                        });
                        resourceDatas[k]=progresses;
                        var progresses_object=[];
                        progresses.forEach((prog=>{
                            if(prog instanceof Array){
                                progresses_object.push({name:"执行中",data:prog});
                            }else{
                                progresses_object.push(prog);
                            }
                        }))
                        resourceDatas[k+"_object"]=progresses_object;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="propertyStatus"){
                        property_status=getKeyValues(d,"label")
                        resourceDatas[k]=property_status;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="caseTypes"){
                        case_types=getKeyValues(d,"label")
                        resourceDatas[k]=case_types;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="caseCatelogs"){
                        case_catelogs=getKeyValues(d,"label")
                        resourceDatas[k]=case_catelogs;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="corporateCompanies"){
                        corporate_companies=getKeyValues(d,"name")
                        resourceDatas[k]=corporate_companies;
                        
                        casePersonnel["公司"]=d;
                    }
                    else if(k=="corporatePartners"){
                        corporate_partners=getKeyValues(d,"name")
                        resourceDatas[k]=corporate_partners;
                        
                        casePersonnel["个人"]=d;
                    }
                    else if(k=="authLevels"){
                        auth_levels=getKeyValues(d,"descriptions")
                        resourceDatas[k]=auth_levels;
                        resourceDatas[k+"_"]=d;
                    }
                    
                    else if(k=="casePersonnelStatus"){
                        casePersonnelStatus=getKeyValues(d,"label")
                        resourceDatas[k]=casePersonnelStatus;
                        resourceDatas[k+"_"]=d;
                    }
                    
                    else if(k=="lawFirms"){
                        lawFirms=getKeyValues(d,"name")
                        resourceDatas[k]=lawFirms;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="legalInstitution"){
                        case_orgnization=getKeyValues(d,"name")
                        resourceDatas[k]=case_orgnization;
                        resourceDatas[k+"_"]=d;
                    }
                    else if(k=="counselTitles"){
                        counsel_titles=getKeyValues(d,"label")
                        resourceDatas[k]=counsel_titles;
                        resourceDatas[k+"_"]=d;
                    }else{
                        resourceDatas[k]=d;
                    }
                });
                var _data={};
                $.each(resourceDatas['lawFirms_'],(index,lawFirm)=>{
                    var _d=[];
                    //console.log('lawFirms',lawFirm,d.data['attorneys']);
                    d.data['attorneys'].filter((attorney) => attorney.lawFirm==lawFirm.id).forEach((attorney)=>{
                        //attorney['value']=lawFirms+attorney.id;
                        _d.push(attorney);
                    });
                    _data[lawFirm.name]=_d;
                });
                Attorneys=_data;
                resourceDatas['attorneys']=_data;
        
                _data={};
                $.each(resourceDatas['counselTitles_'],(index,title)=>{
                    var _d=[];
                    //console.log('counselTitles_',title,d.data['legalCounsels'].filter((counsels) => counsels.title==title.id))
                    
                    d.data['legalCounsels'].filter((counsels) => counsels.title==title.id).forEach((counsel)=>{
                        //counsel['value']=title.label+counsel.id;
                        _d.push(counsel);
                    });
                    _data[title.label]=_d;//data.value['legalCounsels'].filter((counsels) => counsels.title==index);
                    
                });
                
                case_orgnizationPersonnel=_data;
                resourceDatas['legalCounsels']=_data;
                //console.log('legalCounsels');
                //console.log(_data);
                
                caseRelatedParty=casePersonnel;
                //console.log(casePersonnel);
                resourceDatas['casePersonnel']=caseRelatedParty;
                //setGlobalJson('resourceDatas',resourceDatas);
                result.push(true);
                
                output('resourceDatas',resourceDatas);
                const intervalId = setInterval(() => {
                    if (resourceDatas.hasOwnProperty('legalAgencies')) {
                        clearInterval(intervalId);
                        $('body').trigger(preload_completed_event_name);
                        console.log('trigger '+preload_completed_event_name);
                        if(collectDbList) $().mloader("show",{message:"加载表格数据....",overlay:true});
                        $('#main-container').addClass('hide');
                    }
                }, 100);
                
                
            }
        });
        
        if(collectDbList){
            console.log('获取案件数据。。')
            //console.log('caseTableList',caseTableList)
            getBasic(caseTableList,[]).then(d=>{
                
                //console.log(d.data);
                var _excutes={}
                d.data.caseExcutes.forEach((data)=>{
                    //console.log('caseExcutes',data)
                    if(!_excutes.hasOwnProperty(data.id)) _excutes[data.id]=0.0;
                    _excutes[data.id]+=Number(data.exexuteAmount);
                })
                var _legalFees={}
                d.data.caseProgresses.forEach((data)=>{
                    //console.log('caseExcutes',data)
                    if(!_legalFees.hasOwnProperty(data.id)) _legalFees[data.id]=0.0;
                    _legalFees[data.id]+=Number(data.legalFee);
                })
                
                console.log(_excutes)
                var combinedData=[];
                d.data.casesDb.forEach((data)=>{
                    var matchedData=d.data.caseStatus.filter(sta => sta.id==data.id);
                    var matchedProgressData_frist=d.data.caseProgresses.filter(sta => sta.id==data.id && sta.typeId==1);
                    var matchedProgressData_second=d.data.caseProgresses.filter(sta => sta.id==data.id && sta.typeId==2);
                    if(matchedData.length>0){
                        var excuteAmount=0.0
                        var legalFee=0.0
                        if(_excutes.hasOwnProperty(data.id)){
                            excuteAmount=_excutes[data.id]
                        }
                        if(_legalFees.hasOwnProperty(data.id)){
                            legalFee=_legalFees[data.id]
                        }
                        var progress_data={legalFee:legalFee,
                            firstTrialDate:'0000-00-00 00:00:00',firstJudgmentDate:'0000-00-00 00:00:00',firstPenalty:0.0,firstJudgmentSum:'',firstLegalInstitution:-1,firstLegalCounsel:"无0",
                            secondTrialDate:'0000-00-00 00:00:00',secondJudgmentDate:'0000-00-00 00:00:00',secondPenalty:0.0,secondJudgmentSum:'',secondLegalInstitution:-1,secondLegalCounsel:"无0",
                        }
                        if(matchedProgressData_frist.length>0){
                            progress_data.firstTrialDate=matchedProgressData_frist[0].trialDate;
                            progress_data.firstJudgmentDate=matchedProgressData_frist[0].judgmentDate;
                            progress_data.firstPenalty=matchedProgressData_frist[0].penalty;
                            progress_data.firstJudgmentSum=matchedProgressData_frist[0].judgmentSum;
                            progress_data.firstLegalInstitution=matchedProgressData_frist[0].legalInstitution;
                            progress_data.firstLegalCounsel=matchedProgressData_frist[0].legalCounsel;
                        }
                        if(matchedProgressData_second.length>0){
                            progress_data.secondTrialDate=matchedProgressData_second[0].trialDate;
                            progress_data.secondJudgmentDate=matchedProgressData_second[0].judgmentDate;
                            progress_data.secondPenalty=matchedProgressData_second[0].penalty;
                            progress_data.secondJudgmentSum=matchedProgressData_second[0].judgmentSum;
                            progress_data.secondLegalInstitution=matchedProgressData_second[0].legalInstitution;
                            progress_data.secondLegalCounsel=matchedProgressData_second[0].legalCounsel;
                        }
                        
                        
                        combinedData.push(Object.assign(data,matchedData[0],progress_data));
                        //console.log(Object.assign(data,matchedData[0],progress_data));
                    }
                });
                
                //console.log(combinedData);
                DataList=d.data;
                if(!DataList.hasOwnProperty('caseUpdates')) DataList.caseUpdates=[];
                if(!DataList.hasOwnProperty('caseExcutes')) DataList.caseExcutes=[];
                if(!DataList.hasOwnProperty('caseProperties')) DataList.caseProperties=[];
                if(!DataList.hasOwnProperty('caseAttachments')) DataList.caseAttachments=[];
                if(!DataList.hasOwnProperty('caseLinked')) DataList.caseLinked=[];
                DataList.combinedData=combinedData;

                //console.log('format2NewStatus',format2NewStatus(DataList.caseStatus,'caseStatus','id'));
                
                //console.log('format2NewStatus',format2NewStatus(DataList.caseUpdates,'caseUpdates','updatesId'));
                
                // console.log('format2NewStatus',format2NewStatus(DataList.caseExcutes,'caseExcutes','excutesId'));
                
                // console.log('format2NewStatus',format2NewStatus(DataList.caseProperties,'caseProperties','propertyId'));
                
                // console.log('format2NewStatus',format2NewStatus(DataList.caseAttachments,'caseAttachments','evidenceId'));
                //DataList.combinedData=d.data.casesDb;
                //setGlobalJson("combinedData",combinedData);
                //setGlobalJson("datalist",d.data);
                //console.log("setGlobalJson datalist: ",getGlobalJson("datalist"));
                output('caseTableList completed: ',DataList);
                result.push(true);
                $('body').trigger(main_load_completed_event_name);
            });
        }else{
            result.push(true);
        }
    }else{
        showAutoLogin(e.message);
    }
    
});

/*
const intervalId = setInterval(() => {
    if (result.length==2) {
        clearInterval(intervalId);
        if(sessionStorage.getItem("currentUser")!=undefined){
            $('body').trigger(preload_completed_event_name);
        }
        
    }
}, 100);
*/
async function logingStatus(){
	//setGlobalJson("currentUser","{}");
    const response = new Promise(async(resolve,reject)=>{
        if(getGlobalJson("currentUser") && getGlobalJson("currentUser").name){
            output('currentUser',getGlobalJson('currentUser'));
            

            //condtions.push('legalAgencies='+getGlobalJson('currentUser').id);
            $.each(caseTableList,(key,settings)=>{
                settings['orderBy']="ORDER BY id DESC";
                if(key=='caseStatus'){
                    if(getGlobalJson('currentUser').level==1){
                        settings['conditions']=' WHERE isInactived=0 AND legalAgencies='+getGlobalJson('currentUser').id;
                    }else if (getGlobalJson('currentUser').level<adminLevel){
                        settings['conditions']=' WHERE isInactived=0';
                    }
                }else if(key=='casesDb'){
                    
                    settings['orderBy']="ORDER BY caseStatus.id DESC";
                    if(getGlobalJson('currentUser').level==1){
                        settings['conditions']='JOIN caseStatus ON '+
                        settings.tablename+'.id=caseStatus.id AND caseStatus.isInactived=0 AND caseStatus.legalAgencies='+getGlobalJson('currentUser').id;
                    }else if (getGlobalJson('currentUser').level<adminLevel){
                        settings['conditions']='JOIN caseStatus ON '+
                        settings.tablename+'.id=caseStatus.id AND caseStatus.isInactived=0';
                    }else{
                        settings['orderBy']="ORDER BY id DESC";
                    }
                }else{
                    if(getGlobalJson('currentUser').level==1){
                        settings['conditions']=' WHERE id IN ( SELECT id FROM caseStatus WHERE isInactived=0 AND legalAgencies='+getGlobalJson('currentUser').id+')';
                    }else if (getGlobalJson('currentUser').level<adminLevel){
                        settings['conditions']=' WHERE id IN ( SELECT id FROM caseStatus WHERE isInactived=0)';
                    }
                }
                
            });
            //'JOIN caseStatus ON cases.id=caseStatus.id AND caseStatus.legalAgencies=1'
            $('#username').text(getGlobalJson("currentUser").name);
            
            //console.log('currentUser',getGlobalJson("currentUser"));
            getCurrentUser({id:getGlobalJson("currentUser").id,pass:getGlobalJson("currentUser").pass,user:getGlobalJson("currentUser").user})
            .then((d)=>{
                console.log('getCurrentUser',d);
                if(d.data.length>0 && d.data[0].hasOwnProperty('isInactived') && d.data[0].isInactived==0){
                    setGlobalJson("currentUser",d.data[0]);
                    resolve({sucess:true,message:'登录信息确认成功！'});
                }else{
                    setGlobalJson("currentUser",{});
                    console.log('账户有问题可能被禁用，请与管理员联系！')
                    //showAutoLogin('账户可能被禁用，请与管理员联系！');
                    resolve({sucess:false,message:'账户有问题可能被禁用，请与管理员联系！'});
                }
            
            });
            
        }else{
            console.log('没有登录记录,需要重新登录')
            //showAutoLogin('没有登录记录，需要重新登录');
            resolve({sucess:false,message:'没有登录记录，需要重新登录'});
        }
    });
    return await response;
}
function showAutoLogin(message){
    if(message==undefined) message='账户遇到问题，需要重新登录'
    
    $().minfo('show',{title:"错误",message:message}).then(()=>{
        window.location.href = 'index.html';
        $().minfo('hide');
    });
    
}
function format2NewStatus(data,table,matchId){
    var newData=[];
    
    data.forEach((d)=>{
        //console.log('insertRows',table,d);
        var val=d.caseStatus;
        if(val.constructor===String && (val.indexOf('[')>-1 || val.indexOf(',')>-1)){

        }else{
            //var status=d.caseStatus;
            //console.log('insertRows',table);
            if(val<3){
                val=table.toLowerCase()=='casestatus'?'['+getNewCaseStatus(val).join()+']':val;
            }else if(val<4){
                var index=formatIndex(val);
                val=table.toLowerCase()=='casestatus'?'['+getNewCaseStatus(index.main+index.sub).join()+']':index.main+index.sub;
            }else{
                var index=formatIndex(val);
                val=table.toLowerCase()=='casestatus'?'['+getNewCaseStatus(index.main+2,3+index.sub).join()+']':index.main+2;
            }
            d.caseStatus=val;
            $.each(d,(k,v)=>{
                if(v==null||v=="null") d[k]='';
            });
            newData.push(d)
            update(matchId+"="+d[matchId],table,{caseStatus:d.caseStatus},(e)=>{
                console.log('insertRows',e);
            });
            update(matchId+"="+d[matchId],table.toLowerCase(),{caseStatus:d.caseStatus},(e)=>{
                console.log('insertRows',e);
            });
        }
        
    });
    
    // insertRows(table,newData,(e)=>{
    //     console.log('insertRows',e);
    // })
    console.log('insertRows','完成');
    return newData;
}
function getNewCaseStatus(val,subIndex){
    var status=[];
    if(subIndex!=undefined){
        for(var i=0;i<3;i++){
            status.push(i);
        }
        if(subIndex>=3) status.push(subIndex);
        for(var i=6;i<=val;i++){
            status.push(i);
        }
    }else{
        if(val == -1){
            status.push(0);
        }else if(val == 0){
            status.push(val);
        }else{
            for(var i=0;i<3;i++){
                status.push(i);
            }
            if(val>=3) status.push(val);
        }
    }
    
    return status;
}

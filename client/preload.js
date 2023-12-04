

var result=[];
$('#mainFooter').hide();
//getBasicDatabaseData();
getCaseDb(basicTableList,[],(k,d)=>{
    $('#mainLoadingMessage').text('读取中...'+k);
    console.log(`Data from ${k}:`, d);
    if(k=="projects"){
        projects=getKeyValues(d,"name");
        resourceDatas[k]=projects;
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
        resourceDatas['caseLabelsColors']=_data;
        console.log(`Data from caseLabelsColors:`, _data);
        //FormTemplate3.template.baseInfo.data.caseLabel.data=getKeyValues(d,"label");
    }
    else if(k=="caseReason"){
        case_reason=getKeyValues(d,"label")
        resourceDatas[k]=case_reason;
    }
    else if(k=="caseCauses"){
        case_causes=getKeyValues(d,"label")
        resourceDatas[k]=case_causes;
    }
    else if(k=="caseStatus"){
        progresses=[];
        var collector=[];
        $.each(d,(index,_d)=>{
            if(_d.isMain){
                if(collector.length>0) {
                    progresses.push(collector);
                    collector=[];
                }
                progresses.push(_d.name)
            }else{
                collector.push(_d.name);
            }
        });
        resourceDatas[k]=progresses;
    }
    else if(k=="propertyStatus"){
        property_status=getKeyValues(d,"label")
        resourceDatas[k]=property_status;
    }
    else if(k=="caseTypes"){
        case_types=getKeyValues(d,"label")
        resourceDatas[k]=case_types;
    }
    else if(k=="caseCatelogs"){
        case_catelogs=getKeyValues(d,"label")
        resourceDatas[k]=case_catelogs;
    }
    else if(k=="corporateCompanies"){
        corporate_companies=getKeyValues(d,"name")
        resourceDatas[k]=corporate_companies;
        
        casePersonnel["公司"]=corporate_companies;
    }
    else if(k=="corporatePartners"){
        corporate_partners=getKeyValues(d,"name")
        resourceDatas[k]=corporate_partners;
        
        casePersonnel["个人"]=corporate_partners;
    }
    else if(k=="authLevels"){
        auth_levels=getKeyValues(d,"descriptions")
        resourceDatas[k]=auth_levels;
    }
    else if(k=="legalAgencies"){
        legalAffairs=getKeyValues(d,"name")
        resourceDatas[k]=legalAffairs;
    }
    else if(k=="lawFirms"){
        lawFirms=getKeyValues(d,"name")
        resourceDatas[k]=lawFirms;
    }
    else if(k=="legalInstitution"){
        case_orgnization=getKeyValues(d,"name")
        resourceDatas[k]=case_orgnization;
    }
    else if(k=="counselTitles"){
        counsel_titles=getKeyValues(d,"label")
        resourceDatas[k]=counsel_titles;
    }
}).then((r) => {
    //console.log('All requests completed: ',r);
    var _data={};
    resourceDatas['lawFirms'].forEach((lawFirms,index)=>{
        var _d=[];
        r['attorneys'].filter((attorney) => attorney.lawFirm==index).forEach((attorney)=>{
            attorney['value']=lawFirms+attorney.id;
            _d.push(attorney);
        });
        _data[lawFirms]=_d;
    });
    Attorneys=_data;
    resourceDatas['attorneys']=_data;

    _data={};
    resourceDatas['counselTitles'].forEach((title,index)=>{
        var _d=[];
        r['legalCounsels'].filter((counsels) => counsels.title==index).forEach((counsel)=>{
            counsel['value']=title+counsel.id;
            _d.push(counsel);
        });
        _data[title]=_d;//data.value['legalCounsels'].filter((counsels) => counsels.title==index);
    });
    
    case_orgnizationPersonnel=_data;
    resourceDatas['legalCounsels']=_data;
    //console.log('legalCounsels');
    //console.log(_data);
    
    caseRelatedParty=casePersonnel;
    //console.log(casePersonnel);
    resourceDatas['casePersonnel']=caseRelatedParty;
    result.push(true);
    
})
.catch(error => {
    console.error('Error:', error);
    result.push(false);
});

getCaseDb(caseTableList,[],(k,d)=>{
    
    $('#mainLoadingMessage').text('读取中...'+k);
    console.log(`Data from ${k}:`, d);
}).then((r) => {
    console.log('caseTableList completed: ',r);
    var combinedData=[];
    r.casesDb.forEach((data)=>{
        var matchedData=r.caseStatus.filter(sta => sta.id==data.id);
        //console.log(matchedData);
        if(matchedData.length>0){
            combinedData.push(Object.assign(data,matchedData[0]));
        }
    });
    //console.log(combinedData);
    DataList=r;
    DataList.combinedData=combinedData;
    setGlobalJson("combinedData",combinedData);
    setGlobalJson("datalist",r);
    console.log("setGlobalJson datalist: ",getGlobalJson("datalist"));

    result.push(true);
    
})
.catch(error => {
    console.error('Error:', error);
    result.push(false);
});
const intervalId = setInterval(() => {
    if (result.length==2) {
        clearInterval(intervalId);
        $('body').trigger(preload_completed_event_name);
    }
}, 100);

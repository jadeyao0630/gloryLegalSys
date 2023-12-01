

var matches={
    caseProject:{id:"projects",key:"name"},
    caseLabel:{id:"caseLabels",key:"label"},
}
var keys=Object.keys(matches);
var casePersonnel={"公司":[],"个人":[]};

//createTable('caseUpdates',caseUpdates);
//createTable('caseExcutes',caseExcutes);
//createTable('caseProperties',properties,(r)=>{console.log(r.error);});
//createTable('caseAttachments',attachments,(r)=>{console.log(r);});
$('body').on('dataLoaded',function(data){
    
    if(data.key=="projects"){
        projects=getKeyValues(data.value,"name");
        resourceDatas[data.key]=projects;
        //console.log(projects);
    }
    else if(data.key=="caseLabels"){
        case_labels=getKeyValues(data.value,"label");
        var _data={}
        $.each(data.value,(i,element) => {
            _data[element.label]=JSON.parse(element.labelStyle);
        });
        case_labels_colors=_data;
        
        resourceDatas[data.key]=case_labels;
        resourceDatas['caseLabelsColors']=_data;
        //FormTemplate3.template.baseInfo.data.caseLabel.data=getKeyValues(data.value,"label");
    }
    else if(data.key=="caseReason"){
        case_reason=getKeyValues(data.value,"label")
        resourceDatas[data.key]=case_reason;
    }
    else if(data.key=="caseCauses"){
        case_causes=getKeyValues(data.value,"label")
        resourceDatas[data.key]=case_causes;
    }
    else if(data.key=="caseStatus"){
        progresses=getKeyValues(data.value,"name")
        resourceDatas[data.key]=progresses;
    }
    else if(data.key=="propertyStatus"){
        property_status=getKeyValues(data.value,"label")
        resourceDatas[data.key]=property_status;
    }
    else if(data.key=="caseTypes"){
        case_types=getKeyValues(data.value,"label")
        resourceDatas[data.key]=case_types;
    }
    else if(data.key=="caseCatelogs"){
        case_catelogs=getKeyValues(data.value,"label")
        resourceDatas[data.key]=case_catelogs;
    }
    else if(data.key=="corporateCompanies"){
        corporate_companies=getKeyValues(data.value,"name")
        resourceDatas[data.key]=corporate_companies;
        
        casePersonnel["公司"]=corporate_companies;
    }
    else if(data.key=="corporatePartners"){
        corporate_partners=getKeyValues(data.value,"name")
        resourceDatas[data.key]=corporate_partners;
        
        casePersonnel["个人"]=corporate_partners;
    }
    else if(data.key=="authLevels"){
        auth_levels=getKeyValues(data.value,"descriptions")
        resourceDatas[data.key]=auth_levels;
    }
    else if(data.key=="legalAgencies"){
        legalAffairs=getKeyValues(data.value,"name")
        resourceDatas[data.key]=legalAffairs;
    }
    else if(data.key=="lawFirms"){
        lawFirms=getKeyValues(data.value,"name")
        resourceDatas[data.key]=lawFirms;
    }
    else if(data.key=="legalInstitution"){
        case_orgnization=getKeyValues(data.value,"name")
        resourceDatas[data.key]=case_orgnization;
    }
    else if(data.key=="counselTitles"){
        counsel_titles=getKeyValues(data.value,"label")
        resourceDatas[data.key]=counsel_titles;
    }


    if(data.status=="completed"){
        //console.log(resourceDatas);
        setTimeout(() => {
            var _data={};
            resourceDatas['lawFirms'].forEach((lawFirms,index)=>{
                var _d=[];
                data.value['attorneys'].filter((attorney) => attorney.lawFirm==index).forEach((attorney)=>{
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
                data.value['legalCounsels'].filter((counsels) => counsels.title==index).forEach((counsel)=>{
                    counsel['value']=title+counsel.id;
                    _d.push(counsel);
                });
                _data[title]=_d;//data.value['legalCounsels'].filter((counsels) => counsels.title==index);
            });
            
            case_orgnizationPersonnel=_data;
            resourceDatas['legalCounsels']=_data;
            console.log('legalCounsels');
            console.log(_data);
            
            caseRelatedParty=casePersonnel;
            //console.log(casePersonnel);
            resourceDatas['casePersonnel']=caseRelatedParty;

            $('body').trigger("completed");
        }, 1000);
        
    }
        
});
getBasicDatabaseData();
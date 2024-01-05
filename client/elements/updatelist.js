$.fn.updateListView=function(args){
    var defaults={
    }
    this.settings = $.extend({}, defaults, args);
    var collapsible=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"><h3>更新</h3><div>');
    var newUpdateBtn=$('<a href="#progress_point_popupMenu_" data-rel="popup" style="position: absolute;z-index:100;margin-top:2px;right:10px;height:14px;line-height:14px;" class="ui-btn ui-btn-a ui-mini ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-plus btn-icon-green">添加</a>')
    this.append(newUpdateBtn);
    this.settings.listview=$('<ul data-role="listview" id="progress_point_info_body"></ul>');
    collapsible.append(this.settings.listview);
    this.append(collapsible);
}
$.fn.updateListViewData=function(data){
    var _this=this;
    if (data==undefined) throw new Error("source data Required");
    var sortedItems=Object.keys(data).sort(function(a,b){
        return data[a][0].originalDate>data[b][0].originalDate;
    });
    _this.settings.listview.empty();
    sortedItems.forEach(date=>{
        var items=data[date];
        var date_bar=$('<li data-role="list-divider">'+date+'<span class="ui-li-count">'+items.length+'</span></li>');
        _this.settings.listview.append(date_bar);
        items.forEach(item=>{
            var item_container=$('<li data-item=\''+JSON.stringify(item)+'\'></li>');
            //console.log('JSON.stringify',item_d);
            var del_btn;
            if(item.type=='caseAttachments'){
                var itemData=getDataById(DataList[item.type],item.key,item.id);
                
                if(itemData==undefined) {
                    
                    itemData={};
                    itemData.filePath=item.fileName;
                    itemData.id=item.caseId;
                    console.log('itemData',itemData)
                }
                var icon=getIconFromTypeName(item.typeName,itemData.filePath);
                
                var attachmentData=getAttachmentData(itemData.filePath);
                var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+item.description+'</h3>');
                list_item.prepend(icon);
                
                item_container=$('<li style="padding:0px;" data-item=\''+JSON.stringify(item)+'\'></li>');
                var group=$('<div style="display: grid;grid-gap: 0px;margin:-8px 0px;"></div>');
                var view_btn=$('<a href="#" class="ui-btn ui-icon-eye ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">查看</a>')
                console.log('preview',"http://"+ip+':'+port+'/downloadLocal?fileName='+itemData.filePath+'&folder='+itemData.id);
                var download_btn=$('<a href="http://'+ip+':'+port+'/downloadLocal?fileName='+itemData.filePath+'&folder='+itemData.id+'" class="ui-btn ui-icon-action ui-btn-icon-notext btn-icon-blue view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">下载</a>')
                del_btn=$('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red view-list-button" style="padding:10px 5px;border: none;">删除</a>')
                
                if(item.isInactived){
                    del_btn=$('<a href="#" class="ui-btn ui-icon-recycle ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border: none;">还原</a>')
                }
                group.append(list_item);
                if(attachmentData.previewable) {
                    group.append(view_btn);
                    group.css({'grid-template-columns': '1fr auto auto auto'})
                }else{
                    group.css({'grid-template-columns': '1fr auto auto'})
                }
                group.append(download_btn);
                group.append(del_btn);
                view_btn.jqmData('label',list_item);
                item_container.append(group);
            }else{
                var icon=getIconFromTypeName(item.typeName);
                var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+item.description+'</h3>');
                list_item.prepend(icon);
                item_container=$('<li style="padding:0px;" data-item=\''+JSON.stringify(item)+'\'></li>');
                var group=$('<div style="display: grid;grid-template-columns: 1fr auto auto;grid-gap: 0px;margin:-8px 0px;"></div>');
                var view_btn=$('<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext btn-icon-blue view-list-button" style="padding:10px 5px;border-top: none;border-bottom: none;">编辑</a>')
                del_btn=$('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red view-list-button" style="padding:10px 5px;border: none;">删除</a>')
                
                if(item.isInactived){
                    del_btn=$('<a href="#" class="ui-btn ui-icon-recycle ui-btn-icon-notext btn-icon-green view-list-button" style="padding:10px 5px;border: none;">还原</a>')
                }
                group.append(list_item);
                group.append(view_btn);
                group.append(del_btn);
                view_btn.jqmData('label',list_item);
                item_container.append(group);
            }
            _this.settings.listview.append(item_container);
        })

    })
    _this.settings.listview.listview().listview('refresh');
    _this.settings.listview.find('.view-list-button').on('click',function(e){
        _this.trigger({type:'clicked',eventData:e});
    });
}
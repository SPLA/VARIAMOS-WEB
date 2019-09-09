/**
 * return the VariaMos main model info
 * @property    {array} projFolders             - each folder should have how many models when the folder or project is generated
 */
export function getModelInfo(){
    let info =[];
    //list of graphical models
    info["gmodels"]=["feature","component","binding_feature_component","adaptation_state","adaptation_hardware","adaptation_binding_state_hardware"];
    //define feature model main info
    info["feature"]={projFolders:["Domain","Application","Adaptation"]};
    //define component model main info
    info["component"]={projFolders:["Domain"]};
    //define binding model main info
    info["binding_feature_component"]={projFolders:["Domain"]};
    //define adaptation_state model main info
    info["adaptation_state"]={projFolders:["Application"]};
    //define adaptation_hardware model main info
    info["adaptation_hardware"]={projFolders:["Application"]};
    //define adaptation_binding_state_hardware model main info
    info["adaptation_binding_state_hardware"]={projFolders:["Application"]};
    return info;
}

// insert models according to main model info
export function insertmodel(data, index, temp) {
    for(let i = 0; i < getModelInfo()['gmodels'].length; i++)
	{
		if(getModelInfo()[getModelInfo()['gmodels'][i]].projFolders.includes(data[index].data.nodeName.split(' -')[0]))
		{
			data.splice(index + 1 + i, 0 , {
				children: [],
				data: {
					open: false,
					isSelected: false,
					level: data[index].data.level + 1,
					nodeId: temp,
					nodeName: getModelInfo()['gmodels'][i],
					nodeType: 3,
					parentId: data[index].data.nodeId,
					projectId: data[index].data.projectId,
					modeltype: i+1,
	        		contextmenuIndex: 'empty'
				},
				numberOfChildren: 0
			});
            data[index].numberOfChildren++;
            temp++;
        }
    }
    return data;
}

// define the list of right click functions, icons and names
export function getcontextmenulist(){
    let info =[];
    info['delete_project'] = {
        fnHandler: 'deleteproject',
        icoName: 'fa fa-times',
        btnName: 'delete project'
    };
    info['create_app'] = {
        fnHandler: 'createapplication',
        icoName: 'fa fa-folder',
        btnName: 'New Application'
    };
    info['create_adp'] = {
        fnHandler: 'createadaption',
        icoName: 'fa fa-folder',
        btnName: 'New Adatption'
    };
    info['rename'] = {
        fnHandler: 'newname',
	    icoName: 'fa fa-pencil-alt',
		btnName: 'Rename'
    };
    info['delete_folder'] = {
        fnHandler: 'deletedire',
		icoName: 'fa fa-times',
		btnName: 'delete'
    }
    return info;
}
/**
 * return the VariaMos main model info
 * @property    {array} projFolders             - each folder should have how many models when the folder or project is generated
 * @property    {array} shown_Elements          - each model should display how many elements in the element tree
 * @property    {boolean} checkbox_enable       - each model should enable or disable checkbox in the element tree
 * @property    {boolean} select_constraint     - the selection constratins of the element tree for the binding model
 */
export function getModelInfo(){
    var info =[];
    //list of graphical models
    
    info["gmodels"]=["feature","component","feedback","binding_feature_component"];
    //define feature model main info
    info["feature"]={projFolders:["Domain","Application","Adaptation"], shown_Elements:["root", "abstract", "concrete"], checkbox_enable:true};
    //define component model main info
    info["component"]={projFolders:["Domain"], shown_Elements:["component", "file"], checkbox_enable:false};
    //define binding model main info
    info["binding_feature_component"]={projFolders:["Domain"], shown_Elements:['concrete', 'component'], checkbox_enable:false};
    //define feedback model main info
    info["feedback"]={projFolders:["Application"], shown_Elements:["component", "file", "summing_point"], checkbox_enable:false};
    return info;
}

// insert models according to main model info
export function insertmodel(data, index, temp) {
    let modeltype = 3;
    for(let i = 0; i < getModelInfo()['gmodels'].length; i++)
	{
		if(getModelInfo()[getModelInfo()['gmodels'][getModelInfo()['gmodels'].length-i-1]].projFolders.includes(data[index].data.nodeName.split(' -')[0]))
		{
			data.splice(index + 1, 0 , {
				children: [],
				data: {
					open: false,
					isSelected: false,
					level: data[index].data.level + 1,
					nodeId: temp,
					nodeName: getModelInfo()['gmodels'][getModelInfo()['gmodels'].length-i-1],
					nodeType: 3,
					parentId: data[index].data.nodeId,
					projectId: data[index].data.projectId,
					modeltype: modeltype,
	        		contextmenuIndex: 'empty'
				},
				numberOfChildren: 0
			});
            data[index].numberOfChildren++;
            temp++;
        }
        modeltype--;
    }
    return data;
}

// define the list of right click functions, icons and names
export function getcontextmenulist(){
    var info =[];
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
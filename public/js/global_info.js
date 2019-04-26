//return the VariaMos main model info
function getModelInfo(){
    var info =[];
    //list of graphical models
    info["gmodels"]=["feature","component","binding_feature_component"];
    //define feature model main info
    info["feature"]={projFolders:["domain","application","adaptation"], topElements:["root", "abstract", "concrete"]};
    //define component model main info
    info["component"]={projFolders:["domain"], topElements:["component"]};
    //define binding model main info
    info["binding_feature_component"]={projFolders:["domain"], topElements:['concrete', 'component']};
    return info;
}

// define the list of right click functions, icons and names
function getcontextmenulist(){
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
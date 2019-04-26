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
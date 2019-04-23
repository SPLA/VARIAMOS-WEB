var di_actions = function di_actions(graph,selected_method)
{
    if(selected_method=="execute"){
        return execute();
    }else if(selected_method=="verify"){
        return verify();
    }else if(selected_method=="customize"){
        return customize();
    }

    function customize(){
        //collect the information of the components and files to be customized
        var binding_root = graph.getModel().getCell("binding_feature_component");    
        var binding_relations = graph.getModel().getChildEdges(binding_root);

        var customizations = [];

        for (var i = 0; i < binding_relations.length; i++) {
            var source = binding_relations[i].source;
            var target = binding_relations[i].target;
            if(source.getAttribute("selected")=="true"){ //only selected concrete features are analyzed
                var label = target.getAttribute("label");
                var clon_id = target.getId();
                var id = clon_id.replace("clon", "");
                var inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
                for (var j = 0; j < inco_egdes.length; j++) {
                    var file_source = inco_egdes[j].source;
                    var data = {};
                    data["filename"]=file_source.getAttribute("filename");

                    if(data["filename"]=="customization.json"){
                        customizations.push(label);
                    }
                }
            }
        }
        
        return customizations;
    }

    function verify(){
        //collect the information of the components and files to be derived
        var binding_root = graph.getModel().getCell("binding_feature_component");    
        var binding_relations = graph.getModel().getChildEdges(binding_root);

        var destinations = [];

        for (var i = 0; i < binding_relations.length; i++) {
            var source = binding_relations[i].source;
            var target = binding_relations[i].target;
            if(source.getAttribute("selected")=="true"){ //only selected concrete features are analyzed
                var label = target.getAttribute("label");
                var clon_id = target.getId();
                var id = clon_id.replace("clon", "");
                var inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
                for (var j = 0; j < inco_egdes.length; j++) {
                    var file_source = inco_egdes[j].source;
                    var data = {};
                    data["destination"]=file_source.getAttribute("destination");

                    if(data["destination"]!=null){
                        destinations.push(data["destination"]);
                    }
                }
            }
        }

        return destinations;
    }

    function execute(){
        //collect the information of the components and files to be derived
        var binding_root = graph.getModel().getCell("binding_feature_component");    
        var binding_relations = graph.getModel().getChildEdges(binding_root);
        var files = [];

        for (var i = 0; i < binding_relations.length; i++) {
            var source = binding_relations[i].source;
            var target = binding_relations[i].target;
            if(source.getAttribute("selected")=="true"){ //only selected concrete features are analyzed
                var label = target.getAttribute("label");
                var clon_id = target.getId();
                var id = clon_id.replace("clon", "");
                var inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
                for (var j = 0; j < inco_egdes.length; j++) {
                    var file_source = inco_egdes[j].source;
                    var data = {};
                    data["component_folder"]=label;
                    data["ID"]=file_source.getAttribute("label");
                    data["filename"]=file_source.getAttribute("filename");
                    data["destination"]=file_source.getAttribute("destination");
                    if(data["filename"]!="customization.json"){
                        files.push(data);
                    }
                }
            }
        }

        var complete_data=[];
        complete_data[0]=files;
        
        return complete_data;
    }
}

export default di_actions
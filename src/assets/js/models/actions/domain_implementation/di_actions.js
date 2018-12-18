var di_actions = function di_actions(graph,selected_method)
{
    if(selected_method=="execute"){
        return execute();
    }

    function execute(){
        //collect the information of the components and files to be derived
        var binding_root = graph.getModel().getCell("binding_feature_component");    
        var binding_relations = graph.getModel().getChildEdges(binding_root);

        var files = [];
        var customization_files = [];
        var parser_files = [];

        for (var i = 0; i < binding_relations.length; i++) {
            var source = binding_relations[i].source;
            var target = binding_relations[i].target;
            if(source.getAttribute("selected")==1){ //only selected leaf features are analyzed
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

                    if(data["filename"]=="customization.json"){
                        customization_files.push(label+data["filename"]);
                    }else{
                        parser_files.push(data["destination"]);
                        files.push(data);
                    }
                }
            }
        }

        var complete_data=[];
        complete_data[0]=files;
        complete_data[1]=customization_files;
        complete_data[2]=parser_files;
        
        return complete_data;
    }
}

export default di_actions
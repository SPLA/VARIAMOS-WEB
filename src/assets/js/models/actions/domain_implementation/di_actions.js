let di_actions = function di_actions(graph,selected_method)
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
        let binding_root = graph.getModel().getCell("binding_feature_component");    
        let binding_relations = graph.getModel().getChildEdges(binding_root);

        let customizations = [];

        for (let i = 0; i < binding_relations.length; i++) {
            let source = binding_relations[i].source;
            let target = binding_relations[i].target;
            if(source.getAttribute("selected")=="true"){ //only selected concrete features are analyzed
                let label = target.getAttribute("label");
                let clon_id = target.getId();
                let id = clon_id.replace("clon", "");
                let inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
                for (let j = 0; j < inco_egdes.length; j++) {
                    let file_source = inco_egdes[j].source;
                    if(file_source.getAttribute("type")=="custom"){
                        customizations.push(label);
                    }
                }
            }
        }
        
        return customizations;
    }

    function verify(){
        //collect the information of the components and files to be derived
        let binding_root = graph.getModel().getCell("binding_feature_component");    
        let binding_relations = graph.getModel().getChildEdges(binding_root);

        let destinations = [];

        for (let i = 0; i < binding_relations.length; i++) {
            let source = binding_relations[i].source;
            let target = binding_relations[i].target;
            if(source.getAttribute("selected")=="true"){ //only selected concrete features are analyzed
                let label = target.getAttribute("label");
                let clon_id = target.getId();
                let id = clon_id.replace("clon", "");
                let inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
                for (let j = 0; j < inco_egdes.length; j++) {
                    let file_source = inco_egdes[j].source;
                    if(file_source.getAttribute("type")=="file"){
                        let data = {};
                        data["destination"]=file_source.getAttribute("destination");
                        destinations.push(data["destination"]);
                    }
                }
            }
        }

        return destinations;
    }

    function execute(){
        //collect the information of the components and files to be derived
        let binding_root = graph.getModel().getCell("binding_feature_component");    
        let binding_relations = graph.getModel().getChildEdges(binding_root);
        let files = [];
        for (let i = 0; i < binding_relations.length; i++) {
            let source = "";
            let target = ""; 
            try{
                source = binding_relations[i].source;
                target = binding_relations[i].target;
                if(source.getAttribute("selected")=="true"){ //only selected concrete features are analyzed
                    let label = target.getAttribute("label");
                    let clon_id = target.getId();
                    let id = clon_id.replace("clon", "");
                    let inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
                    for (let j = 0; j < inco_egdes.length; j++) {
                        let file_source = inco_egdes[j].source;
                        if(file_source.getAttribute("type")!="custom"){
                            let data = {};
                            data["component_folder"]=label;
                            data["ID"]=file_source.getAttribute("label");
                            data["filename"]=file_source.getAttribute("filename");
                            if(file_source.getAttribute("type")=="file"){
                                data["destination"]=file_source.getAttribute("destination");
                            }else{
                                data["destination"]=="";
                            }
                            files.push(data);
                        }
                    }
                }
            }catch{
                //remove strange generated rels
                let cells=[]
				cells[0]=binding_relations[i];
                graph.removeCells(cells);
            }
        }

        let complete_data=[];
        complete_data[0]=files;
        
        return complete_data;
    }
}

export default di_actions
let component_main = function component_main(graph)
{
	component_constraints(graph);
	let data={};
	data["m_type"]="normal"; //custom type
	data["m_elements"]=component_elements(); //custom elements
	data["m_attributes"]=component_attributes(); //custom attributes
	data["m_clon_cells"]=component_clon_cells(); //custom clon cells
	data["m_relation_styles"]=component_relation_styles(); //custom relation styles
	data["m_constraints_relations"]=component_constraints_relations; //custom constraints for relations
	return data;
	
	function component_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "component", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "file", null, null, 0, null, ["file","component"],
			"Invalid connection",
			"Only shape targets allowed"));
	}

	function component_elements(){
		let component = {src:projectPath+"images/models/component/component.png", wd:100, hg:40, style:"shape=component", type:"component", pname:"Component"};
		let file = {src:projectPath+"images/models/component/file.png", wd:100, hg:40, style:"shape=file", type:"file", pname:"File"};

		let elements=[];
		elements[0]=component;
		elements[1]=file;
		
		return elements;
	}

	function component_attributes(){
		let attributes=[];
		attributes[0]={
			"types":["file"],
			"custom_attributes":[{
				"name":"filename",
				"def_value":""
			},
			{
				"name":"destination",
				"def_value":""
			}]
		};
	
		return attributes;
	}

	function component_clon_cells(){
		let clons={};
		clons={
			"component":"binding_feature_component"
		};

		return clons;
	}

	function component_relation_styles(){
		var relations=[];
		relations.push({
		  "source":["file"],
		  "rel_source_target":"and",
		  "target":["file"],
		  "style":"dashed=1;endArrow=open;strokeColor=red;"
		});

		return relations;
	}

	function component_constraints_relations(graph, source, target){
		if(source.getAttribute("type")=="file" && target.getAttribute("type")=="file"){
			if(target.getAttribute("destination")==null){
				alert("Invalid connection");
				return false;
			}else if(source.getAttribute("destination")!=null || source.getAttribute("filename")==null || !source.getAttribute("filename").includes(".frag")){
				alert("Invalid connection");
				return false;
			}
		}

		if(target.getAttribute("type")=="component"){
			let source_id = source.getId();
			let out_egdes = graph.getModel().getOutgoingEdges(graph.getModel().getCell(source_id));
			for (let j = 0; j < out_egdes.length; j++) {
				if(out_egdes[j].target.getAttribute("type")=="component"){
					alert("Invalid connection one file can be only linked with one component");
					return false;
				}
			}
		}

		return true;
	}

}

export default component_main
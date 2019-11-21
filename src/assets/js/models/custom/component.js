let componentMain = function componentMain(graph)
{
	componentConstraints(graph);
	let data = {};
	data["m_type"] = "normal"; //custom type
	data["m_elements"] = componentElements(); //custom elements
	data["m_attributes"] = componentAttributes(); //custom attributes
	data["m_clon_cells"] = componentClonCells(); //custom clon cells
	data["m_relation_styles"] = componentRelationStyles(); //custom relation styles
	data["m_constraints_relations"] = componentConstraintsRelations; //custom constraints for relations
	return data;
	
	function componentConstraints(graph){
		graph.multiplicities = []; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "component", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "file", null, null, 0, 1, ["component"],
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "custom", null, null, 0, 1, ["component"],
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "fragment", null, null, 0, null, ["file","component"],
			"Invalid connection",
			"Only shape targets allowed"));
	}

	function componentElements(){
		let component = {src:projectPath + "images/models/component/component.png", wd:100, hg:40, style:"shape=component", type:"component", pname:"Component"};
		let file = {src:projectPath + "images/models/component/file.png", wd:100, hg:40, style:"shape=file", type:"file", pname:"File"};
		let fragment = {src:projectPath + "images/models/component/fragment.png", wd:100, hg:40, style:"shape=fragment", type:"fragment", pname:"Fragment"};
		let custom = {src:projectPath + "images/models/component/custom.png", wd:100, hg:40, style:"shape=custom", type:"custom", pname:"Custom. file"};

		let elements = [];
		elements[0] = component;
		elements[1] = file;
		elements[2] = fragment;
		elements[3] = custom;
		
		return elements;
	}

	function componentAttributes(){
		let attributes = [];
		attributes[0] = {
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
		attributes[1] = {
			"types":["fragment"],
			"custom_attributes":[{
				"name":"filename",
				"def_value":""
			}]
		};
	
		return attributes;
	}

	function componentClonCells(){
		let clons = {};
		clons = {
			"component":"binding_feature_component"
		};

		return clons;
	}

	function componentRelationStyles(){
		var relations = [];
		relations.push({
		  "source":["fragment"],
		  "rel_source_target":"and",
		  "target":["file"],
		  "style":"dashed=1;endArrow=open;strokeColor=red;"
		});

		return relations;
	}

	function componentConstraintsRelations(graph, source, target){
		//only one custom file per component
		if(target.getAttribute("type") == "component" && source.getAttribute("type") == "custom"){
			let targetId = target.getId();
			let incoEgdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(targetId));
			for (let j = 0; j < incoEgdes.length; j++) {
				if(incoEgdes[j].source.getAttribute("type")=="custom"){
					alert("Invalid connection only one custom. file can be linked for this component");
					return false;
				}
			}
		}

		//fragment can be only linked with one component
		if(target.getAttribute("type") == "component" && source.getAttribute("type") == "fragment"){
			let sourceId = source.getId();
			let outEgdes = graph.getModel().getOutgoingEdges(graph.getModel().getCell(sourceId));
			for (let j = 0; j < outEgdes.length; j++) {
				if(outEgdes[j].target.getAttribute("type")=="component"){
					alert("Invalid connection one fragment can be only linked with one component");
					return false;
				}
			}
		}

		return true;
	}

}

export default componentMain
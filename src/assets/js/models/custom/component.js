var component_main = function component_main(graph)
{
	component_constraints(graph);
	var data=[];
	data[0]="normal" //custom type
	data[1]=component_elements(); //custom elements
	data[2]=component_attributes(); //custom attributes
	data[3]=null; //custom relations
	data[4]=null; //custom properties styles
	data[5]=null; //custom labels
	data[6]=component_clon_cells(); //custom clon cells
	return data;
	
	function component_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "package", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "file", null, null, 0, 1, ["package"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function component_elements(){
		var packagex = {src:"/images/models/component/package.png", wd:100, hg:40, style:"shape=package", type:"package", pname:"Package"};
		var file = {src:"/images/models/component/file.png", wd:100, hg:40, style:"shape=file", type:"file", pname:"File"};

		var elements=[];
		elements[0]=packagex;
		elements[1]=file;
		
		return elements;
	}

	function component_attributes(){
		var attributes=[];
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
		var clons={};
		clons={
			"package":"binding_feature_component"
		};

		return clons;
	}
	
}

export default component_main
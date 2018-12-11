var feature_main = function feature_main(graph)
{
	feature_constraints(graph);
	var data=[];
	data[0]=feature_elements(); //custom elements
	data[1]=feature_attributes(); //custom attributes
	data[2]=feature_relations(); //custom relations
	data[3]=feature_properties_styles(); //custom properties styles
	data[4]=feature_labels(); //custom labels
	return data;
	
	function feature_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "root", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "association", null, null, 0, 1, ["root","general"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function feature_elements(){
		var root = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"root", style:"", pname:"Root Feature"};
		var general = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"general", style:"", pname:"General Feature"};
		var leaf = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"leaf", style:"", pname:"Leaf Feature"};
		var association = {src:"static/images/models/feature/association.png", wd:35, hg:35, type:"association", style:"shape=ellipse", pname:"Association"};
		
		var elements=[];
		elements[0]=root;
		elements[1]=general;
		elements[2]=leaf;
		elements[3]=association;
		
		return elements;
	}

	function feature_attributes(){
		var attributes=[];
		attributes[0]={
			"types":["association"],
			"custom_attributes":[{
				"name":"associationType",
				"def_value":"and"
			},
			{
				"name":"lowRange",
				"def_value":"1"
			},
			{
				"name":"highRange",
				"def_value":"1"
			}]
		};
	
		return attributes;
	}

	function feature_relations(){
		var relations=[];
		relations[0]={
			"source":["general","leaf"],
			"rel_source_target":"and",
			"target":["general","leaf","root"],
			"attributes":[{
				"name":"relType",
				"def_value":"mandatory"
			}]
		};
		relations[1]={
			"source":["association"],
			"rel_source_target":"and",
			"target":["general","root"],
			"attributes":[{
				"name":"relType",
				"def_value":"mandatory"
			}]
		};
	
		return relations;
	}

	function feature_properties_styles(){
		var styles={};
		styles={
			"relation":[{
				"attribute":"relType",
				"input_type":"select",
				"input_values":["mandatory","optional","requires","excludes"]
			}],
			"association":[{
				"attribute":"associationType",
				"input_type":"select",
				"input_values":["and","or","mutex","range"]
			}]
		}

		return styles;
	}

	function feature_labels(){
		var labels={};
		labels={
			"association":"associationType"
		};

		return labels;
	}
	
}

export default feature_main
var feature_main = function feature_main(graph)
{
	feature_constraints(graph);
	var data=[];
	data[0]="normal" //custom type
	data[1]=feature_elements(); //custom elements
	data[2]=feature_attributes(); //custom attributes
	data[3]=feature_relations(); //custom relations
	data[4]=feature_properties_styles(); //custom properties styles
	data[5]=feature_labels(); //custom labels
	data[6]=feature_clon_cells(); //custom clon cells
	return data;
	
	function feature_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "root", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "bundle", null, null, 0, 1, ["root","general"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function feature_elements(){
		var root = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"root", style:"", pname:"Root Feature"};
		var general = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"general", style:"", pname:"General Feature"};
		var leaf = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"leaf", style:"", pname:"Leaf Feature"};
		var bundle = {src:"static/images/models/feature/bundle.png", wd:35, hg:35, type:"bundle", style:"shape=ellipse", pname:"Bundle"};
		
		var elements=[];
		elements[0]=root;
		elements[1]=general;
		elements[2]=leaf;
		elements[3]=bundle;
		
		return elements;
	}

	function feature_attributes(){
		var attributes=[];
		attributes[0]={
			"types":["bundle"],
			"custom_attributes":[{
				"name":"bundleType",
				"def_value":"AND"
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
		attributes[1]={
			"types":["leaf"],
			"custom_attributes":[{
				"name":"selected",
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
		}
	
		return relations;
	}

	function feature_properties_styles(){
		var styles={};
		styles={
			"relation":[{
					"attribute":"relType",
					"input_type":"select",
					"input_values":["mandatory","optional","requires","excludes"]
				}
			],
			"bundle":[
				{
					"attribute":"bundleType",
					"input_type":"select",
					"input_values":["AND","OR","XOR","RANGE"],
					"onchange": feature_custom_methods(0)
				},
				{
					"attribute":"lowRange",
					"input_type":"text",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
				},
				{
					"attribute":"highRange",
					"input_type":"text",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
				}
			]
		}

		return styles;
	}

	function feature_custom_methods(pos){
		var methods=[]
		methods[0]=function(){
			document.getElementById("tr-lowRange").style.display="none";
			document.getElementById("tr-highRange").style.display="none";
			var val = document.getElementById("tr-bundleType").getElementsByTagName('select')[0].value;
			if(val=="RANGE"){
				document.getElementById("tr-lowRange").style.display="";
				document.getElementById("tr-highRange").style.display="";
			}
		};

		return methods[pos];
	}

	function feature_labels(){
		var labels={};
		labels={
			"bundle":"bundleType"
		};

		return labels;
	}

	function feature_clon_cells(){
		var clons={};
		clons={
			"leaf":"binding_feature_component"
		};

		return clons;
	}
	
}

export default feature_main
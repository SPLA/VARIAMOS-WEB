var binding_feature_component_main = function binding_feature_component_main(graph)
{
    binding_f_c_constraints(graph);
    var data=[];
	data[0]="binding" //custom type
	data[1]=binding_f_c_elements(); //custom elements
	data[2]=binding_f_c_attributes(); //custom attributes
	data[3]=null; //custom relations
	data[4]=binding_f_c_properties_styles(); //custom properties styles
	data[5]=binding_f_c_labels(); //custom labels
	data[6]=null; //custom clon cells
	data[7]=null; //custom constraints in element creation
    return data;
    
    function binding_f_c_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "bundle", null, null, 0, null, ["component"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "leaf", null, null, 0, 1, ["component","bundle"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "component", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
	}

	function binding_f_c_elements(){
		var bundle = {src:projectPath+"images/models/feature/bundle.png", wd:35, hg:35, type:"bundle", style:"shape=ellipse", pname:"Bundle"};
		var elements=[];
		elements[0]=bundle;
		
		return elements;
	}

	function binding_f_c_attributes(){
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
		return attributes;
	}

	function binding_f_c_properties_styles(){
		var styles={};
		styles={
			"bundle":[
				{
					"attribute":"bundleType",
					"input_type":"select",
					"input_values":["AND","OR","XOR","RANGE"],
					"onchange": binding_f_c_custom_methods(0)
				},
				{
					"attribute":"lowRange",
					"input_type":"text",
					"input_text_type":"number",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
					"onchangerestrictive": binding_f_c_custom_methods(1)
				},
				{
					"attribute":"highRange",
					"input_type":"text",
					"input_text_type":"number",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
					"onchangerestrictive": binding_f_c_custom_methods(1)
				}
			]
		}

		return styles;
	}

	function binding_f_c_custom_methods(pos){
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
		methods[1]=function(){
			var lowRange = document.getElementById("input-lowRange").value;
			var highRange = document.getElementById("input-highRange").value;
			if(lowRange>highRange){
				alert(messages["feature_custom_range_check"]);
				return false;
			}
			return true;
		};

		return methods[pos];
	}

	function binding_f_c_labels(){
		var labels={};
		labels={
			"bundle":"bundleType"
		};

		return labels;
	}

}

export default binding_feature_component_main

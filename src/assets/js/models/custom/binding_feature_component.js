let bindingFeatureComponentMain = function bindingFeatureComponentMain(graph){
    bindingFCConstraints(graph);

    let data = {};
	data["m_type"] = "binding"; //custom type
	data["m_elements"] = bindingFCElements(); //custom elements
	data["m_attributes"] = bindingFCAttributes(); //custom attributes
	data["m_properties_styles"] = bindingFCPropertiesStyles(); //custom properties styles
	data["m_labels"] = bindingFCLabels(); //custom labels
    return data;
    
    function bindingFCConstraints(graph){
		graph.multiplicities = []; //reset multiplicities
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

	function bindingFCElements(){
		let bundle = {src:projectPath + "images/models/feature/bundle.png", wd:35, hg:35, type:"bundle", style:"shape=ellipse", pname:"Bundle"};
		let elements = [];
		elements[0] = bundle;
		
		return elements;
	}

	function bindingFCAttributes(){
		let attributes = [];
		attributes[0] = {
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

	function bindingFCPropertiesStyles(){
		let styles = {};
		styles = {
			"bundle":[
				{
					"attribute":"bundleType",
					"input_type":"select",
					"input_values":["AND","OR","XOR","RANGE"],
					"onchange": bindingFCCustomMethods(0)
				},
				{
					"attribute":"lowRange",
					"input_type":"text",
					"input_text_type":"number",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
					"onchangerestrictive": bindingFCCustomMethods(1)
				},
				{
					"attribute":"highRange",
					"input_type":"text",
					"input_text_type":"number",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
					"onchangerestrictive": bindingFCCustomMethods(1)
				}
			]
		}

		return styles;
	}

	function bindingFCCustomMethods(pos){
		let methods = [];
		methods[0] = function(){
			document.getElementById("tr-lowRange").style.display = "none";
			document.getElementById("tr-highRange").style.display = "none";
			let val = document.getElementById("tr-bundleType").getElementsByTagName('select')[0].value;
			if(val == "RANGE"){
				document.getElementById("tr-lowRange").style.display = "";
				document.getElementById("tr-highRange").style.display = "";
			}
		};
		methods[1] = function(){
			let lowRange = document.getElementById("input-lowRange").value;
			let highRange = document.getElementById("input-highRange").value;
			if(lowRange > highRange){
				alert(global.messages["feature_custom_range_check"]);
				return false;
			}
			return true;
		};

		return methods[pos];
	}

	function bindingFCLabels(){
		let labels = {};
		labels = {
			"bundle":"bundleType"
		};

		return labels;
	}

}

export default bindingFeatureComponentMain
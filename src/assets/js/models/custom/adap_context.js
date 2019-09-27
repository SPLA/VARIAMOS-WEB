var adap_context_main = function adap_context_main(graph)
{
	adap_context_constraints(graph);
	var data=[];
	data["m_type"]="normal" //custom type
	data["m_elements"]=adap_context_elements(); //custom elements
	data["m_attributes"]=adap_context_attributes(); //custom attributes
	return data;
	
	function adap_context_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "kind", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "subkind", null, null, 0, 1, ["kind"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function adap_context_elements(){
		var kind = {src:projectPath+"images/models/adap_context/kind.png", wd:100, hg:40, style:"", type:"kind", pname:"kind"};
		var subkind = {src:projectPath+"images/models/adap_context/subkind.png", wd:100, hg:40, style:"", type:"subkind", pname:"subkind"};

		var elements=[];
		elements[0]=kind;
		elements[1]=subkind;
		
		return elements;
	}

	function adap_context_attributes(){
		var attributes=[];
		attributes[0]={
			"types":["kind"],
			"custom_attributes":[{
				"name":"name",
				"def_value":""
			},
			{
				"name":"destination",
				"def_value":""
			}]
		};
	
		return attributes;
	}
}

export default adap_context_main
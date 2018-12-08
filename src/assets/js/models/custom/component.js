var component_main = function component_main(graph)
{
	component_constraints(graph);
	var elements=[];
    elements= component_elements();
	return elements;
	
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
		var packagex = {src:"static/images/models/component/package.png", wd:100, hg:40, style:"shape=package", type:"package", pname:"Package", attr:""};
		var file = {src:"static/images/models/component/file.png", wd:100, hg:40, style:"shape=file", type:"file", pname:"File", attr:""};

		var elements=[];
		elements[0]=packagex;
		elements[1]=file;
		
		return elements;
	}
	
}

export default component_main
var feature_main = function feature_main(graph)
{
	feature_constraints(graph);
	var elements=[];
    elements= feature_elements();
	return elements;
	
	function feature_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "root", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "leaf", null, null, 0, 1, ["root","general","association"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "general", null, null, 0, 1, ["root","general","association"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "association", null, null, 0, 1, ["root","general"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function feature_elements(){
		var root = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"root", style:"", pname:"Root Feature", attr:""};
		var general = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"general", style:"", pname:"General Feature", attr:""};
		var leaf = {src:"static/images/models/feature/rectangle.png", wd:100, hg:35, type:"leaf", style:"", pname:"Leaf Feature", attr:""};
		var association = {src:"static/images/models/feature/association.png", wd:35, hg:35, type:"association", style:"shape=ellipse", pname:"Association", attr:""};
		
		var elements=[];
		elements[0]=root;
		elements[1]=general;
		elements[2]=leaf;
		elements[3]=association;
		
		return elements;
	}
	
}

export default feature_main
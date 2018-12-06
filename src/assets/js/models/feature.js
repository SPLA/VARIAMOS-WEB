var feature_main = function feature_main(graph)
{
	feature_constraints(graph);
	var elements=[];
    elements= feature_elements();
	return elements;
	
	function feature_constraints(graph){
		graph.multiplicities.push(new mxMultiplicity(
				  true, "root", null, null, 0, 0, ["root","leaf","general"],
				  "Invalid connection",
				  "Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
				  true, "leaf", null, null, 0, 1, ["root","general"],
				  "Only 1 target allowed",
				  "Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
				  true, "general", null, null, 0, 1, ["root","general"],
				  "Only 1 target allowed",
				  "Only shape targets allowed"));
	}

	function feature_elements(){
		var root = {src:"static/images/models/feature/rectangle.gif", wd:100, hg:40, type:"root", pname:"Root Feature", attr:""};
		var general = {src:"static/images/models/feature/rectangle.gif", wd:100, hg:40, type:"general", pname:"General Feature", attr:""};
		var leaf = {src:"static/images/models/feature/rectangle.gif", wd:100, hg:40, type:"leaf", pname:"Leaf Feature", attr:""};
		
		var elements=[];
		elements[0]=root;
		elements[1]=general;
		elements[2]=leaf;
		
		return elements;
	}
	
}

export default feature_main
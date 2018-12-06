var component_main = function component_main(graph)
{
	component_constraints(graph);
	var elements=[];
    elements= component_elements();
	return elements;
	
	function component_constraints(graph){

	}

	function component_elements(){
		var root = {src:"static/images/models/feature/rectangle.gif", wd:100, hg:40, type:"root", pname:"Root Feature", attr:""};
		var elements=[];
		elements[0]=root;
		
		return elements;
	}
	
}

export default component_main
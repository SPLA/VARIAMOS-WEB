var binding_feature_component_main = function binding_feature_component_main(graph)
{
    binding_f_c_constraints(graph);
    var data=[];
    data[0]="binding" //custom type
	data[1]=null //custom elements
	data[2]=null //custom attributes
	data[3]=null; //custom relations
	data[4]=null; //custom properties styles
	data[5]=null; //custom labels
	data[6]=null; //custom clon cells
	data[7]=null; //custom constraints in element creation
    return data;
    
    function binding_f_c_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "leaf", null, null, 0, 1, ["component"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "component", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
	}
}

export default binding_feature_component_main

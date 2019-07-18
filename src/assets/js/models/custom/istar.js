var istar_main = function istar_main(graph)
{
	istar_constraints(graph);
	var data={};
	data["m_type"]="normal"; //custom type
	data["m_elements"]=istar_elements(); //custom elements
  data["m_attributes"]=istar_attributes(); //custom attributes
  data["m_relations"]=istar_relations(); //custom relations
  data["m_properties_styles"]=istar_properties_styles(); //custom properties styles
  data["m_labels"]=null; //custom labels
	data["m_clon_cells"]=null; //custom clon cells
	return data;
	
	function istar_constraints(graph){
    graph.multiplicities=[]; //reset multiplicities
    /*
		graph.multiplicities.push(new mxMultiplicity(
			true, "component", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "file", null, null, 0, 1, ["component"],
			"Only 1 target allowed",
      "Only shape targets allowed"));
    */
	}

	function istar_elements(){
		var actor = {src:projectPath+"images/models/istar/Actor.svg", wd:87, hg:87, style:"shape=image;image=images/models/istar/Actor.svg;perimeter=ellipsePerimeter", type:"actor", pname:"Actor"};
		var agent = {src:projectPath+"images/models/istar/Agent.svg", wd:87, hg:87, style:"shape=image;image=images/models/istar/Agent.svg;perimeter=ellipsePerimeter", type:"agent", pname:"Agent"};
    var role = {src:projectPath+"images/models/istar/Role.svg", wd:87, hg:87, style:"shape=image;image=images/models/istar/Role.svg;perimeter=ellipsePerimeter", type:"role", pname:"Role"};
    var goal = {src:projectPath+"images/models/istar/Goal.svg", wd:88, hg:40, style:"shape=image;image=images/models/istar/Goal.svg;perimeter=ellipsePerimeter", type:"goal", pname:"Goal"};
    var quality = {src:projectPath+"images/models/istar/Quality.svg", wd:127, hg:55, style:"shape=image;image=images/models/istar/Quality.svg", type:"quality", pname:"Quality"};
		var task = {src:projectPath+"images/models/istar/Task.svg", wd:141, hg:40, style:"shape=image;image=images/models/istar/Task.svg", type:"task", pname:"Task"};
    var resource = {src:projectPath+"images/models/istar/Resource.svg", wd:80, hg:41, style:"shape=image;image=images/models/istar/Resource.svg", type:"resource", pname:"Resource"};

		var elements=[];
		elements[0]=actor;
    elements[1]=agent;
    elements[2]=role;
    elements[3]=goal;
    elements[4]=quality;
    elements[5]=task;
    elements[6]=resource;

		return elements;
	}

	function istar_attributes(){
    var attributes=[];
    /*
		attributes[0]={
			"types":["file"],
			"custom_attributes":[{
				"name":"filename",
				"def_value":""
			},
			{
				"name":"destination",
				"def_value":""
			}]
		};
    */
		return attributes;
  }

  function istar_relations(){
    var relations=[];
    relations[0]={
      "source":["actor","agent","role"],
      "rel_source_target":"and",
      "target":["actor","agent","role"],
      "attributes":[{
        "name":"relType",
        "def_value":"is-a"
      }]
    }
    relations[1]={
      "source":["goal","quality","task","resource"],
      "rel_source_target":"and",
      "target":["quality"],
      "attributes":[{
        "name":"relType",
        "def_value":"contribution"
      }]
    }
    return relations
  }
  
  function istar_properties_styles(){
    return {
      "relation":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["is-a","participates-in",]
      }]
    }
  }

	function istar_clon_cells(){
    var clons={};
    /*
		clons={
			"component":"binding_feature_component"
		};
    */
		return clons;
	}
	
}

export default istar_main
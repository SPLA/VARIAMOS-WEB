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
  data["m_constraints_ic"]=istar_constraints_in_creation();
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
		attributes[0]={
			"types":["actor","role","agent"],
			"custom_attributes":[{
				"name":"boundary",
				"def_value":"false"
			}]
		};
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
        "def_value":"participates-in"
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
      //Actor
      "actor":[{
        "attribute":"boundary",
        "input_type":"checkbox",
        "onchange":actorboundary
      }],
      //Actor as source for a relation
      "rel_actor_actor":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in","is-a"],
      }],
      "rel_actor_agent":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_actor_role":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      //Agent
      "agent":[{
        "attribute":"boundary",
        "input_type":"checkbox",
        "onchange":actorboundary
      }],
      //Agent as source for a relation
      "rel_agent_actor":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_agent_agent":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_agent_role":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      //Role
      "role":[{
        "attribute":"boundary",
        "input_type":"checkbox",
        "onchange":actorboundary
      }],
      //Role as source for a relation
      "rel_role_actor":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_role_agent":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_role_role":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in","is-a"]
      }],
      //
    }
  }

  function istar_custom_methods(pos){
		var methods=[]
		methods[0]=function(prototype, cell){
      if(cell != null){
        alert("you may not add actor within another\'s boundary")
        return false;
      }
      //console.log(JSON.stringify(prototype, null, 2));
      //console.log(JSON.stringify(cell !== null ? cell.getValue()['type'] : null,null, 2));
      return true;
		};
		return methods[pos];
	}

  function istar_constraints_in_creation(){
		var constraints_ic={};
		constraints_ic={
      "actor":istar_custom_methods(0),
      "agent":istar_custom_methods(0),
      "role":istar_custom_methods(0)
		};
		return constraints_ic;
	}

  function actorboundary(){  
    const currentCell = graph.getModel().getCell(this.name);
    const parent = currentCell.getParent();

    let checked = currentCell.getAttribute('boundary');
    checked = checked === 'true' ? 'false' : 'true';

    currentCell.setAttribute('boundary', checked);
    //graph.stopEditing(false);
    graph.getModel().beginUpdate();
    try {
      if (checked === 'true') {
        const boundaryCell = graph.insertVertex(parent, null, '', currentCell.getGeometry().x, currentCell.getGeometry().y, 100, 100, 'shape=ellipse;fillColor=none;dashed=1;dashPattern=10 10;');
        boundaryCell.setConnectable(false);
        boundaryCell.setValue({'type':'boundary'});
        graph.groupCells(boundaryCell, 100, [currentCell]);
        const geo = currentCell.getGeometry();
        geo.x = 0;
        geo.y = 0;
        currentCell.setGeometry(geo);
        graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [currentCell])
      } else {
        const boundaryCell = parent;
        const mainparent = boundaryCell.getParent();
        const parentGeo = boundaryCell.getGeometry();
        const currentGeo = currentCell.getGeometry();
        currentGeo.x = parentGeo.x + 100;
        currentGeo.y = parentGeo.y + 100;
        graph.ungroupCells([currentCell]);
        //graph.removeCells([boundaryCell]);
        graph.removeCells([boundaryCell]);
        graph.getModel().add(mainparent,currentCell)
        //mainparent.insert(currentCell);
        //currentCell.setParent(mainparent);
        currentCell.setGeometry(currentGeo);
        graph.setCellStyles(mxConstants.STYLE_MOVABLE, '1', [currentCell])
      }
    } finally {
      //console.log(currentCell.getAttribute('boundary'))
      graph.getModel().endUpdate();
    }
  }
	
}

export default istar_main
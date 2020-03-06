let istar_main = function istar_main(graph)
{
  istar_custom_overrides();
  istar_constraints();
  istar_custom_markers();
  istar_custom_events();
	let data={};
	data["m_type"]="normal"; //custom type
	data["m_elements"]=istar_elements(); //custom elements
  data["m_attributes"]=istar_attributes(); //custom attributes
  data["m_relations"]=istar_relations(); //custom relations
  data["m_properties_styles"]=istar_properties_styles(); //custom properties styles
  data["m_labels"]=null; //custom labels
  data["m_constraints_ic"]=istar_constraints_in_creation();
  data["m_clon_cells"]=null; //custom clon cells
  data["m_relation_styles"]=istar_relation_styles();
  data["m_overlay"] = istar_overlay(); //custom overlay
  return data;
  
  function istar_custom_overrides(){
    graph.isHtmlLabel = function (cell) {
      return mxUtils.isNode(cell.value);
    }

    graph.isCellSelectable = function(cell)
    {
      let state = this.view.getState(cell);
      let style = (state != null) ? state.style : this.getCellStyle(cell);

      return this.isCellsSelectable() && !this.isCellLocked(cell) && style['selectable'] != 0;
    };

    mxEdgeHandler.prototype.addEnabled = true;
    mxEdgeHandler.prototype.removeEnabled = true;
    mxEdgeHandler.prototype.virtualBendsEnabled = true;
    mxEdgeHandler.prototype.dblClickRemoveEnabled = true;
    mxEdgeHandler.prototype.straightRemoveEnabled = true;
  }
	
	function istar_constraints(){
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
   //Only allow one outgoing connection out of a dependum
    graph.multiplicities.push(new mxMultiplicity(true,"goal","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 outgoing connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(true,"quality","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 outgoing connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(true,"task","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 outgoing connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(true,"resource","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 outgoing connection allowed","Only shape targets allowed"));
    //Only allow one incoming connection into a dependum
    graph.multiplicities.push(new mxMultiplicity(false,"goal","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"quality","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"task","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"resource","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    //Disallow actors/roles/agents from connecting to things within their own boundaries
    //or into elements wihin the boundaries of others without passing through a dependum.
    /* graph.multiplicities.push(new mxMultiplicity(false,"goal","dependum","false",0,0,
      ["actor","agent","role"],"Actors/Roles/Agents may not connect directly to intentional elements inside boundaries",
      "Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"quality","dependum","false",0,0,
      ["actor","agent","role"],"Actors/Roles/Agents may not connect directly to intentional elements inside boundaries",
      "Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"task","dependum","false",0,0,
      ["actor","agent","role"],"Actors/Roles/Agents may not connect directly to intentional elements inside boundaries",
      "Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"resource","dependum","false",0,0,
      ["actor","agent","role"],"Actors/Roles/Agents may not connect directly to intentional elements inside boundaries",
      "Only shape targets allowed")); */
  }
  
  function istar_custom_markers(){
    mxMarker.addMarker('capitalD', function(canvas, _shape, _type, pe, unitX, unitY, _size, _source, _sw, _filled){
			//unitX, unitY correspond to the representation of the orientation as a point
			//on a unit circle. (It is essential to rememeber that the y axis increases towards the bottom of the page.)
			//Size is constant defined by the library
			//nx, ny are then the "augmented" vector on the unit circle by a given amount.
			//Here d1 controls the distance by which the both the tips of the semicircle
			//are separated from the endpoint of the edge within the same axis as the edge.
			//d2 controls the distance by which the endpoints are separated on the axis
			//perpendicular to the line given by the edge.
			//
			const d1 = 20;
			const d2 = 10;
			const nx = unitX * d1;
			const ny = unitY * d1;
			const m = (nx !== 0) ? ny / nx : 0;
			const m_perp = (m !== 0) ? -1 * (1/m) : 0; 
			const pe_d = new mxPoint(pe.x, pe.y);
			const pe_anti_d = new mxPoint(pe.x - nx, pe.y - ny);

			return function() {
        const x1 = 
          (
            (m_perp !== 0) ? 
              (d2/(Math.sqrt(Math.pow(m_perp,2) + 1))) : 
              (
                (nx !== 0) ? 
                  0 : 
                  d2
              )
          ) 
          + pe_anti_d.x ;
        const y1 = 
          (
            (m_perp !== 0) ? 
              (m_perp * (x1 - pe_anti_d.x)) : 
              (
                (ny !== 0)? 
                  0 : 
                  d2
              )
          ) 
          + pe_anti_d.y;
			  const x2 = pe_d.x;
			  const y2 = pe_d.y;
        const x3 = 
          (
            (m_perp !== 0) ? 
              (-d2/(Math.sqrt(Math.pow(m_perp,2) + 1))) : 
              (
                (nx !== 0) ? 
                  0 : 
                  -d2
              )
          ) 
          + pe_anti_d.x;
        const y3 = 
          (
            (m_perp !== 0) ? 
              (m_perp * (x3 - pe_anti_d.x)) : 
              (
                (ny !== 0) ? 
                  0 : 
                  -d2
              )
          ) 
          + pe_anti_d.y;
        canvas.setFillColor('#FFFFFF');
			  canvas.begin();
			  canvas.moveTo(x1, y1);
        canvas.quadTo(x2,y2,x3,y3);
        canvas.lineTo(x1,y1);
        canvas.fillAndStroke();
			}
    });
    
    mxMarker.addMarker('dash', function(canvas, _shape, _type, pe, unitX, unitY, _size, _source, _sw, _filled){
      let nx = unitX * (size + sw + 10);
      let ny = unitY * (size + sw + 10);

      return function() {
        canvas.begin();
        let x1 = pe.x - nx / 2 - ny / 2;
        let y1 = pe.y - ny / 2 + nx / 2;
        canvas.moveTo(x1, y1);
        let x2 = pe.x + ny / 2 -  nx / 2;
        let y2 = pe.y - ny / 2 - nx / 2;
        canvas.lineTo(x2, y2);
        canvas.stroke();
      }
    });
  };

  //Temporary Workaround to the setup Events change...
  function istar_custom_events(){
  };

	function istar_elements(){
    let actor = {src:projectPath+"images/models/istar/Actor.png", wd:100, hg:100, style:"shape=actor;perimeter=ellipsePerimeter;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"actor", pname:"Actor"};
    let agent = {src:projectPath+"images/models/istar/Agent.png", wd:100, hg:100, style:"shape=agent;perimeter=ellipsePerimeter;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"agent", pname:"Agent"};
    let role = {src:projectPath+"images/models/istar/Role.png", wd:100, hg:100, style:"shape=role;perimeter=ellipsePerimeter;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"role", pname:"Role"};
    let goal = {src:projectPath+"images/models/istar/Goal.png", wd:125, hg:50, style:"shape=goal;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"goal", pname:"Goal"};
    let quality = {src:projectPath+"images/models/istar/Quality.png", wd:125, hg:50, style:"shape=quality;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"quality", pname:"Quality"};
		let task = {src:projectPath+"images/models/istar/Task.png", wd:125, hg:50, style:"shape=task;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"task", pname:"Task"};
    let resource = {src:projectPath+"images/models/istar/Resource.png", wd:125, hg:50, style:"shape=resource;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"resource", pname:"Resource"};
    
    /*
    const securityConstraint = {src:projectPath+"images/models/component/file.png", wd:100, hg:100, style:"shape=secconstraint;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"secconstraint", pname:"Security Constraint"};
    const securityObjective = {src:projectPath+"images/models/component/file.png", wd:100, hg:100, style:"shape=secobjective;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"secobjective", pname:"Security Objective"};
    const securityMechanism = {src:projectPath+"images/models/component/file.png", wd:125, hg:50, style:"shape=secmechanism;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"secmechanism", pname:"Security Mechanism"};
    const threat = {src:projectPath+"images/models/component/file.png", wd:100, hg:100, style:"shape=threat;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"threat", pname:"Threat"};
    const attack = {src:projectPath+"images/models/component/file.png", wd:100, hg:100, style:"shape=attack;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"attack", pname:"Attack"};
    const vulnerability = {src:projectPath+"images/models/component/file.png", wd:125, hg:50, style:"shape=vulnerability;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", type:"vulnerability", pname:"Vulnerability"};
    */

		let elements=[];
		elements.push(actor);
    elements.push(agent);
    elements.push(role);
    elements.push(goal);
    elements.push(quality);
    elements.push(task);
    elements.push(resource);

    /*
    //tests
    elements.push(securityConstraint);
    elements.push(securityObjective);
    elements.push(securityMechanism);
    elements.push(threat);
    elements.push(attack);
    elements.push(vulnerability)
    */
   
		return elements;
	}

	function istar_attributes(){
    let attributes=[];
		attributes.push({
			"types":["actor","role","agent"],
			"custom_attributes":[
        {
          "name":"boundary",
          "def_value":"false"
        },
        {
          "name":"selected",
				  "def_value":"false"
        }
      ]
    });
    /* attributes.push({
      "types":["goal","quality","task","resource"],
      "custom_attributes":[{
        "name":"dependum",
        "def_value":"true"
      }]
    }); */
		return attributes;
  }

  function istar_relations(){
    let relations=[];
    relations.push({
      "source":["actor","agent","role"],
      "rel_source_target":"and",
      "target":["actor","agent","role"],
      "attributes":[{
        "name":"relType",
        "def_value":"participates-in"
      }]
    });
    /* relations[1]={
      "source":["actor","agent","role"],
      "rel_source_target":"and",
      "target":["goal-dependum","quality-dependum","task-dependum","resource-dependum"],
      "attributes":[{
        "name":"relType",
        "def_value":"D"
      }]
    };
    relations[2]={
      "source":["goal-dependum","quality-dependum","task-dependum","resource-dependum"],
      "rel_source_target":"and",
      "target":["actor","agent","role"],
      "attributes":[{
        "name":"relType",
        "def_value":"D"
      }]
    }; */
    //Contribution
    relations.push({
      "source":["goal","quality","task","resource"],
      "rel_source_target":"and",
      "target":["quality"],
      "attributes":[{
        "name":"relType",
        "def_value":"help"
      }]
    });
    //Refinement
    relations.push({
      "source":["goal","task"],
      "rel_source_target":"and",
      "target":["goal","task"],
      "attributes":[{
        "name":"refinement",
        "def_value":"and"
      }]
    });
    //Qualification
    /* relations[5]={
      "source":["quality"],
      "rel_source_target":"and",
      "target":["goal","quality","task","resource"],
      "style":"dashed=1;endArrow=none;"
    }; */
    return relations
  }

  function istar_relation_styles(){
    let relations=[];
    relations.push({
      "source":["actor","agent","role"],
      "rel_source_target":"and",
      "target":["actor","agent","role"],
      "style":"endArrow=open;"
    });
    relations.push({
      "source":["actor","agent","role","goal","quality","task","resource"],
      "rel_source_target":"and",
      "target":["goal-dependum","quality-dependum","task-dependum","resource-dependum"],
      "style":"endArrow=capitalD;"
      /* "style":"endArrow=capitald;" */
    });
    relations.push({
      "source":["goal-dependum","quality-dependum","task-dependum","resource-dependum"],
      "rel_source_target":"and",
      "target":["actor","agent","role","goal","quality","task","resource"],
      "style":"endArrow=capitalD;"
      /* "style":"endArrow=capitald;" */
    });
    //Contribution  
    relations.push({
      "source":["goal","quality","task","resource"],
      "rel_source_target":"and",
      "target":["quality"],
      "style":"endArrow=open;"
    });
    //Refinement
    relations.push({
      "source":["goal","task"],
      "rel_source_target":"and",
      "target":["goal","task"],
      "style":"endArrow=dash;"
    });
    //Qualification
    relations.push({
      "source":["quality"],
      "rel_source_target":"and",
      "target":["goal","task","resource"],
      "style":"dashed=1;endArrow=none;"
    });
    //NeededBy
    relations.push({
      "source":["resource"],
      "rel_source_target":"and",
      "target":["task"],
      "style":"endArrow=oval;endFill=1;"
    });
    //Restricts
    relations.push({
      "source":["secconstraint"],
      "rel_source_target":"and",
      "target":["goal"],
      "style":"endArrow=none;"
    })
    return relations;
  }
  
  function istar_properties_styles(){
    return {
      //Actor
      "actor":[
        {
          "attribute":"boundary",
          "input_type":"checkbox",
          "onchange":actorboundary
        },
        {
          "attribute":"selected",
					"input_type":"checkbox",
					"onchange": set_selected_overlay
        }
      ],
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
      //Actor Dependum Links
      /* "rel_actor_goal-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_actor_quality-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_actor_task-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_actor_resource-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }], */
      //Agent
      "agent":[
        {
          "attribute":"boundary",
          "input_type":"checkbox",
          "onchange":actorboundary
        },
        {
          "attribute":"selected",
					"input_type":"checkbox",
					"onchange": set_selected_overlay
        }
      ],
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
      //Agent Dependum Links
      /* "rel_agent_goal-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_agent_quality-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_agent_task-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_agent_resource-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }], */
      //Role
      "role":[
        {
          "attribute":"boundary",
          "input_type":"checkbox",
          "onchange":actorboundary
        },
        {
          "attribute":"selected",
					"input_type":"checkbox",
					"onchange": set_selected_overlay
        }
      ],
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
      //Agent Dependum Links
      /* "rel_role_goal-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_role_quality-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_role_task-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }],
      "rel_role_resource-dependum":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["D"]
      }], */
      /* //Goal
      "goal":[{
        "attribute":"dependum",
        "input_type":"checkbox",
      }],
      //Quality
      "quality":[{
        "attribute":"dependum",
        "input_type":"checkbox",
      }],
      //Task
      "task":[{
        "attribute":"dependum",
        "input_type":"checkbox",
      }],
      //Resource
      "resource":[{
        "attribute":"dependum",
        "input_type":"checkbox",
      }], */
      //Contribution relations
      "rel_goal_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      "rel_quality_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      "rel_task_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      "rel_resource_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      //Refinement
      "rel_goal_task":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }],
      "rel_goal_goal":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }],
      "rel_task_task":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }],
      "rel_task_goal":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }] 
    }
  }

  function istar_custom_methods(pos){
		let methods=[]
		methods.push(function(_prototype, cell){
      if(cell !== null){
        alert("you may not add actor within another\'s boundary")
        return false;
      }
      //console.log(JSON.stringify(prototype, null, 2));
      //console.log(JSON.stringify(cell !== null ? cell.getValue()['type'] : null,null, 2));
      return true;
    });
		return methods[pos];
	}

  function istar_constraints_in_creation(){
		let constraints_ic={};
		constraints_ic={
      "actor":istar_custom_methods(0),
      "agent":istar_custom_methods(0),
      "role":istar_custom_methods(0)
		};
		return constraints_ic;
	}

  function actorboundary(){
    const uuidv1 = require('uuid/v1');
    //this.name points to the id of the cell that contains the element.  
    const currentCell = graph.getModel().getCell(this.name);
    const parent = currentCell.getParent();

    let checked = currentCell.getAttribute('boundary');
    checked = checked === 'true' ? 'false' : 'true';

    currentCell.setAttribute('boundary', checked);
    //graph.stopEditing(false);
    graph.getModel().beginUpdate();
    try {
      if (checked === 'true') {
        const boundaryCell = graph.insertVertex(parent, uuidv1(), '', currentCell.getGeometry().x, currentCell.getGeometry().y, 100, 100, 'shape=rectangle;fillColor=none;dashed=1;dashPattern=10 10;rounded=1;arcSize=15;');
        boundaryCell.setConnectable(false);
        boundaryCell.setValue({'type':'boundary', 'actorCellId': currentCell.getId()});
        graph.groupCells(boundaryCell, 0, [currentCell]);
        const geo = currentCell.getGeometry();
        geo.x = 0;
        geo.y = 0;
        graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [currentCell])
        //Set the size of the boundary.
        let boundaryH = 300;
        let boundaryW = 300;
        //If the boundary was already set before, set it to the old limits.
        if(currentCell.boundarySize !== undefined){
          boundaryH = currentCell.boundarySize.height;
          boundaryW = currentCell.boundarySize.width;
          delete currentCell.boundarySize;
        }
        //Apply the changes. The bounds indicate the absolute shape of the cell.
        const bounds = new mxRectangle(boundaryCell.getGeometry().x, boundaryCell.getGeometry().y, boundaryW, boundaryH);
        graph.resizeCell(boundaryCell, bounds);
        //Find any edges that were promoted and remove them.
        const edgeCount = currentCell.getEdgeCount();
        const promotedEdges = [];
        if (edgeCount > 0){
          for(let i = 0; i < edgeCount; i++){
            const edge = currentCell.getEdgeAt(i);
            if(edge.promotedEdge !== undefined && edge.promotedEdge){
              promotedEdges.push(edge);
            }
          }
        }
        //Remove the edges that were promoted.
        graph.removeCells(promotedEdges);
        //If there were elements that existed previously, reconstruct them.
        const newCells = new Map;
        if(currentCell.elements !== undefined){
          //key is the id of the old cell
          //value contains the cell.
          for(let [key, value] of currentCell.elements){
            const cells = graph.importCells([value], 0,0, boundaryCell);
            //This ties the old cell's id to the new one's so that the relations can be reconstructed.
            newCells.set(key, cells[0].getId());
            //graph.insertVertex(boundaryCell, null, child.getValue(), childGeo.x, childGeo.y, childGeo.width, childGeo.height, child.getStyle());
          }
          delete currentCell.elements;
        }
        const done = [];
        const boundaryGeo = boundaryCell.getGeometry();
        if(currentCell.relations !== undefined){
          for(let [key, value] of currentCell.relations){
            console.log('key :', key);
            console.log('value :', value);
            //Within value is every edge coming or going from the <<old>> cell given by key.
            value.forEach(edge => {
              //For both the terminals, check if the reference is one of the cells that are destroyed, otherwise it is the normal one.
              const sourceCell = graph.getModel().getCell(newCells.has(edge.source) ? newCells.get(edge.source) : edge.source);
              const srcId = sourceCell.getId();
              const targetCell = graph.getModel().getCell(newCells.has(edge.target) ? newCells.get(edge.target) : edge.target);
              const tgtId = targetCell.getId();
              //If the relation was already added, skip all of the code to add it.
              if(!done.some(pair => {
                return (pair.t1 === srcId && pair.t2 === tgtId) || (pair.t1 === tgtId && pair.t2 === tgtId);
              })){
                console.log('sourceCell :', sourceCell);
                console.log('targetCell :', targetCell);
                const newEdge = graph.insertEdge(boundaryCell, uuidv1(), edge.value, sourceCell, targetCell, edge.style);
                done.push({t1:sourceCell.getId(),t2:targetCell.getId()});
              }
            })
          }
        }
      } else {
        //get the references to the boundary cell and the main graph.
        const boundaryCell = parent;
        const mainparent = boundaryCell.getParent();
        const innerElementCount = boundaryCell.getChildCount();
        const innerElements = new Map;
        const relations = new Map;
        //get the position information from the parent (and its references)
        const parentGeo = boundaryCell.getGeometry();
        const currentGeo = currentCell.getGeometry();
        //There are other elements inside
        //get their references.
        if(innerElementCount > 1){
          for(let i = 0; i < innerElementCount; i++){
            const child = boundaryCell.getChildAt(i);
            if(child !== currentCell && !child.isEdge()){
              //With this logic, we obtain the important values of these edges,
              //then we store the information in an array.
              const edgeCount = child.getEdgeCount();
              const innerEdges = [];
              if (edgeCount > 0){
                for(let i = 0; i < edgeCount; i++){
                  const edge = child.getEdgeAt(i);
                  const value = edge.getValue();
                  const source = edge.getTerminal(true).getId();
                  const isSource = source === child.getId();
                  const target = edge.getTerminal(false).getId();
                  const style = edge.getStyle();
                  innerEdges.push({value, isSource, source, target, style});
                }
              }
              //Now we map every id to its corresponding cell and edges so that we can reconstruct it later.
              innerElements.set(child.getId(), child.clone());
              relations.set(child.getId(),innerEdges);
              //innerElements.push({child: child.clone(), id: child.getId(), edges: innerEdges});
            }
          }
          //We will now do edge promotion based on what was calculated before.
          for(let [_key, value] of relations){
            //We will now iterate over the inner edges of every inner element.
            //If they contain external connections we will now add them to the actor cell.
            value.forEach(edge => {
              const terminal = edge.isSource ? edge.target : edge.source;
              //The only allowed external connections are done with dependums.
              if(!innerElements.has(terminal)){
                const sourceCell = edge.isSource ? currentCell : graph.getModel().getCell(edge.source);
                const targetCell = edge.isSource ? graph.getModel().getCell(edge.target) : currentCell;
                const newEdge = graph.insertEdge(mainparent, uuidv1(), edge.value, sourceCell, targetCell, edge.style);
                newEdge.promotedEdge = true;
              }
            })
          }
        }

        //We modify the actor cell to have the information of both its boundary cell and that of the inner elements.
        currentCell.elements = innerElements;
        currentCell.relations = relations;
        currentCell.boundarySize = {height: parentGeo.height, width: parentGeo.width};

        //These cells are fundamentally different to those that are returned by ungroupCells.
        //They retain their properties though. I suspect they are cloned from the first ones.
        const innerCells = graph.ungroupCells([boundaryCell]);
        //Remove the superfluous cells from the graph.
        innerCells.forEach(cell => {
          if(cell !== currentCell){
            graph.removeCells([cell]);
          }
        })

        //set the postion to the parent's old position
        currentGeo.x = parentGeo.x + 100;
        currentGeo.y = parentGeo.y + 100;
        //remove the cell from the hierarchy and then add it back to the model.
        //graph.ungroupCells([currentCell]);
        /* const innerCells = graph.ungroupCells([boundaryCell]); */
        //graph.removeCells([boundaryCell]);
        //graph.getModel().add(mainparent, currentCell);
        //Change the cell's properties so that it can move again.
        graph.setCellStyles(mxConstants.STYLE_MOVABLE, '1', [currentCell]);
      }
    } finally {
      //console.log(currentCell.getAttribute('boundary'))
      graph.getModel().endUpdate();
    }
  }

  /**
   * This function updates all edges that link to a particular goal, thus setting the refinement style.
   */
  function refinementStyle(){
    const admittedTypes = ['goal', 'task'];
    //Get the reference to the edge and find its target
    const currentCell = graph.getModel().getCell(this.name);
    const target = currentCell.getTerminal(false);
    //this.value should carry the value that has been changed to
    graph.getModel().beginUpdate();
    try {
      if (target.edges.length > 1){
        target.edges.forEach(edge => {
          const source = edge.getTerminal(true);
          const sourceType = source.getAttribute('type');
          const destination = edge.getTerminal(false);
          const destType = destination.getAttribute('type');
          if(source !== target && admittedTypes.includes(sourceType) && admittedTypes.includes(destType)){
            //Set the arrow style based on the incoming value of the select
            graph.setCellStyles(mxConstants.STYLE_ENDARROW, this.value === 'and' ? 'dash' : 'block', [edge]);
            if(edge !== currentCell){
              const edit = new mxCellAttributeChange(
                edge, "refinement",
                this.value);
              graph.getModel().execute(edit);
            }
          }
        })
      }
    } finally {
      graph.getModel().endUpdate();
    }
  }
  
  function istar_overlay(){
    return function(){
      console.log('I was called');
      const model = graph.getModel();
			let featureRoot = model.getCell("istar");
			let featureElements = model.getChildVertices(featureRoot);
			for (let i = 0; i < featureElements.length; i++) {
				let source = featureElements[i];
        let type = source.getAttribute("type");
        if(type === undefined){
          const value = source.getValue();
          type = value.type;
        }
				if(["actor","agent","role", "boundary"].includes(type)){
          if("boundary" == type){
            const value = source.getValue();
            source = model.getCell(value.actorCellId);
          }
					let sel = source.getAttribute("selected");
					if(sel == "true"){
						let overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
						graph.addCellOverlay(source, overlay);
					}
				}
			}
		};
  }

  function set_selected_overlay(){
    // Creates a new overlay with an image and a tooltip and makes it "transparent" to events
    let overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
    const model = graph.getModel();
    if(this.checked){
      graph.addCellOverlay(model.getCell(this.name), overlay);
    }else{
      graph.removeCellOverlay(model.getCell(this.name));
    }
  }
}

export default istar_main
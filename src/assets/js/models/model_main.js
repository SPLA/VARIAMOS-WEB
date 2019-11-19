//main function
let main = function main(graph,layers,mxModel,toolbar,keyHandler,container,model_type,model_specific_main,counter,setupFunctions,undoManager, route_pare, store)
{
	// Checks if the browser is supported
	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is not supported.
		mxUtils.error(global.messages["model_main_browser"], 200, false);
	}
	else
	{
		let currentLayer="";
		currentLayer=layers[model_type]; //current layer to be displayed (feature, component, etc)
		graph.setDefaultParent(currentLayer); //any new graphic element will be connected with this parent

		let data={};
		data=model_specific_main(graph); //specific model data

		//collect functions that are used in multiple places
		let reused_functions=[];
		reused_functions=get_reused_functions(graph,data["m_type"]);

		//counter equals 1 load the entire mxGraph 
		if(counter==1){
			// Disables the built-in context menu
			mxEvent.disableContextMenu(container);
			
			// Matches DnD inside the graph
			mxDragSource.prototype.getDropTarget = function(graph, x, y){
				let cell = graph.getCellAt(x, y);
				
				if (!graph.isValidDropTarget(cell)){
					cell = null;
				}
				
				return cell;
			};

			//setup graph config
			setup_graph_config(graph);
		}
		
		//setup buttons
		setupFunctions["setup_buttons"](graph,undoManager,reused_functions,route_pare,store);
		//setup properties
		setupFunctions["setup_properties"](graph,data["m_properties_styles"]);
		//setup keys
		setupFunctions["setup_keys"](keyHandler,graph,reused_functions);
		//setup custom elements
		setupFunctions["setup_elements"](graph,data["m_elements"],data["m_attributes"],data["m_clon_cells"],data["m_constraints_ic"],toolbar,data["m_type"]);
		//setup custom shapes
		setup_custom_shapes(model_type);
		//setup label changed
		setup_label_changed(graph,data["m_labels"]);	
		//setup relations
		setupFunctions["setup_relations"](graph,data["m_relations"],data["m_relation_styles"],data["m_constraints_relations"]);
		//setup custom features by model type
		setup_custom_features_by_type(data["m_type"]);
		//setup overlay
		setup_overlay(data["m_overlay"]);
		// setup events
		setupFunctions["setup_events"](graph);

		//hide all elements that do not belong to the current layer (parent)
		for (let key in layers) {
			mxModel.setVisible(layers[key], false);
		}
		mxModel.setVisible(currentLayer, true);
	}

	function setup_overlay(m_overlay){
		if(m_overlay){
			m_overlay();
		}
	}

	function setup_custom_features_by_type(m_type){
		//hide "reset current model" button for binding models
		let buttonRESET = document.getElementById('buttonRESET');
		if(m_type=="binding"){
			buttonRESET.style.display="none";
		}else{
			buttonRESET.style.display="";
		}
	}

	function setup_custom_shapes(model_type){
		function CustomShape()
		{
			mxShape.call(this);
		};
		mxUtils.extend(CustomShape, mxShape);

		// Replaces existing actor shape
		mxCellRenderer.registerShape('customShape', CustomShape);

		let req = mxUtils.load(projectPath+'xml/MX/'+model_type+'/custom_shapes.xml');
		let root = req.getDocumentElement();
		let shape = root.firstChild;
	
		while (shape != null)
		{
			if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
			{ 
				mxStencilRegistry.addStencil(shape.getAttribute('name'), new mxStencil(shape));
			}
			shape = shape.nextSibling;
		}
	}

	function setup_graph_config(graph){
		graph.dropEnabled = true;
		graph.setConnectable(true); // Enables new connections in the graph
		graph.setMultigraph(false);
		graph.setAllowDanglingEdges(false);
		graph.setCellsDisconnectable(false) // Avoid disconnect egdes
		graph.setDisconnectOnMove(false);
		graph.setPanning(true);
		graph.setCellsEditable(false); // Avoid double click cells
		new mxRubberband(graph); // Enables rectangular selection
		graph.maximumGraphBounds = new mxRectangle(0, 0, 4000, 4000);
		// new mxOutline(graph, document.getElementById('navigator'));
	}

	function setup_label_changed(graph,m_labels){		
		graph.convertValueToString = function(cell)
		{
		  if (mxUtils.isNode(cell.value))
		  {
			if(m_labels != null && m_labels[cell.getAttribute("type")]){
				return cell.getAttribute(m_labels[cell.getAttribute("type")], '')
			}else{
				if(cell.isEdge()){
					//default attribute showed in drawing area for edges is relType
					return cell.getAttribute('relType', '')
				}else{
					//default attribute showed in drawing area for vertex is label
					return cell.getAttribute('label', '') 
				}
			}
		  }
		};
	}

	function get_reused_functions(graph,m_type){
		let reused_functions=[];
		reused_functions[0]=function(evt)
		{
			if (graph.isEnabled())
			{
				if(m_type=="binding"){
					//binding models allow to remove egdes but not vertexs
					let cells = graph.getSelectionCells();
					let contain_clons = false;
					for (let i = 0; i < cells.length; i++) {
						if(cells[i].isVertex()){
							if(cells[i].getId().includes("clon")){ //cloned elements are not allowed to remove directly
								contain_clons = true;
								alert(global.messages["setup_keys_remove_cloned"]);
								break;
							}
						}
					}

					if(!contain_clons){
					//	graph.removeCells();
					let removed_cells=graph.removeCells();

					//remove clons if exist
					for (let i = 0; i < removed_cells.length; i++) {
						if(removed_cells[i].isVertex()){
							let clon = graph.getModel().getCell("clon"+removed_cells[i].getId());
							if(clon){
								let cells=[]
								cells[0]=clon;
								graph.removeCells(cells);
							}
						}
					}
					}
				}else{
					let removed_cells=graph.removeCells();

					//remove clons if exist
					for (let i = 0; i < removed_cells.length; i++) {
						if(removed_cells[i].isVertex()){
							let clon = graph.getModel().getCell("clon"+removed_cells[i].getId());
							if(clon){
								let cells=[]
								cells[0]=clon;
								graph.removeCells(cells);
							}
						}
					}
				}
			}
		}

		return reused_functions;
	}
}

export default main
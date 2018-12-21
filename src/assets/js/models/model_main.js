//main function
var main = function main(graph,layers,mxModel,toolbar,keyHandler,container,model_type,model_specific_main,counter,setupFunctions,undoManager)
{
	// Checks if the browser is supported
	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is not supported.
		mxUtils.error(messages["model_main_browser"], 200, false);
	}
	else
	{
		var currentLayer="";
		currentLayer=layers[model_type]; //current layer to be displayed (feature, component, etc)
		graph.setDefaultParent(currentLayer); //any new graphic element will be connected with this parent

		var data=[], c_type="", c_elements=[], c_attributes=[], c_relations=[], c_properties_styles=[] , c_labels=[];
		var c_clon_cells=[], c_constraints_ic=[];
		data=model_specific_main(graph); //specific model data
		c_type=data[0];
		c_elements=data[1];
		c_attributes=data[2];
		c_relations=data[3];
		c_properties_styles=data[4];
		c_labels=data[5];
		c_clon_cells=data[6];
		c_constraints_ic=data[7];

		//collect functions that are used in multiple places
		var reused_functions=[];
		reused_functions=get_reused_functions(graph,c_type);

		//counter equals 1 load the entire mxGraph 
		if(counter==1){
			// Disables the built-in context menu
			mxEvent.disableContextMenu(container);
			
			// Matches DnD inside the graph
			mxDragSource.prototype.getDropTarget = function(graph, x, y){
				var cell = graph.getCellAt(x, y);
				
				if (!graph.isValidDropTarget(cell)){
					cell = null;
				}
				
				return cell;
			};

			//setup graph config
			setup_graph_config(graph);
			//setup custom shapes
			setup_custom_shapes();
		}
		
		//setup buttons
		setupFunctions["setup_buttons"](graph,undoManager,reused_functions);
		//setup properties
		setupFunctions["setup_properties"](graph,c_properties_styles);
		//setup keys
		setupFunctions["setup_keys"](keyHandler,graph,reused_functions);
		//setup custom elements
		setupFunctions["setup_elements"](graph,c_elements,c_attributes,c_clon_cells,c_constraints_ic,toolbar,c_type);
		//setup label changed
		setup_label_changed(graph,c_labels);	
		//setup relations
		setupFunctions["setup_relations"](graph,c_relations);
		//setup custom features by model type
		setup_custom_features_by_type(c_type);

		//hide all elements that do not belong to the current layer (parent)
		for (var key in layers) {
			mxModel.setVisible(layers[key], false);
		}
		mxModel.setVisible(currentLayer, true);
	}

	function setup_custom_features_by_type(c_type){
		//hide "reset current model" button for binding models
		var buttonRESET = document.getElementById('buttonRESET');
		if(c_type=="binding"){
			buttonRESET.style.display="none";
		}else{
			buttonRESET.style.display="";
		}
	}

	function setup_custom_shapes(){
		function CustomShape()
		{
			mxShape.call(this);
		};
		mxUtils.extend(CustomShape, mxShape);

		// Replaces existing actor shape
		mxCellRenderer.registerShape('customShape', CustomShape);
		
		// Loads the stencils into the registry
		var req = mxUtils.load(projectPath+'xml/MX/custom_shapes.xml');
		var root = req.getDocumentElement();
		var shape = root.firstChild;
		
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
		graph.setCellsDisconnectable(false) // Avoid disconect egdes
		graph.setDisconnectOnMove(false);
		graph.setPanning(true);
		graph.setCellsEditable(false); // Avoid double click cells
		new mxRubberband(graph); // Enables rectangular selection
		graph.maximumGraphBounds = new mxRectangle(0, 0, 2000, 2000);
		new mxOutline(graph, document.getElementById('navigator'));
	}

	function setup_label_changed(graph,c_labels){		
		graph.convertValueToString = function(cell)
		{
		  if (mxUtils.isNode(cell.value))
		  {
			if(c_labels != null && c_labels[cell.getAttribute("type")]){
				return cell.getAttribute(c_labels[cell.getAttribute("type")], '')
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

	function get_reused_functions(graph,c_type){
		var reused_functions=[];
		reused_functions[0]=function(evt)
		{
			if (graph.isEnabled())
			{
				if(c_type=="binding"){
					console.log("binding");
					//binding models allow to remove egdes but not vertexs
					var cells = graph.getSelectionCells();
					var contain_clons = false;
					for (var i = 0; i < cells.length; i++) {
						if(cells[i].isVertex()){
							if(cells[i].getId().includes("clon")){ //cloned elements are not allowed to remove directly
								contain_clons = true;
								alert(messages["setup_keys_remove_cloned"]);
								break;
							}
						}
					}

					if(!contain_clons){
						graph.removeCells();
					}
				}else{
					var removed_cells=graph.removeCells();

					//remove clons if exist
					for (var i = 0; i < removed_cells.length; i++) {
						if(removed_cells[i].isVertex()){
							var clon = graph.getModel().getCell("clon"+removed_cells[i].getId());
							if(clon){
								var cells=[]
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
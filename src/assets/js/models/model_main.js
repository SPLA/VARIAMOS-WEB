//main function
let main = function main(graph, layers, mxModel, toolbar, keyHandler, container, modelType, 
    modelSpecificMain, counter, setupFunctions, undoManager, routePare, store)
{
	// Checks if the browser is supported
	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is not supported.
		mxUtils.error(global.messages["model_main_browser"], 200, false);
	}
	else
	{
		let currentLayer = "";
		currentLayer = layers[modelType]; //current layer to be displayed (feature, component, etc)
		graph.setDefaultParent(currentLayer); //any new graphic element will be connected with this parent

		let data = {};
		data = modelSpecificMain(graph); //specific model data

		//collect functions that are used in multiple places
		let reusedFunctions = [];
		reusedFunctions = getReusedFunctions(graph, data["m_type"]);

		//counter equals 1 load the entire mxGraph 
		if(counter == 1){
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
			setupGraphConfig(graph);
		}
		
		//setup buttons
		setupFunctions["setup_buttons"](graph, undoManager, reusedFunctions, routePare, store);
		//setup properties
		setupFunctions["setup_properties"](graph, data["m_properties_styles"]);
		//setup keys
		setupFunctions["setup_keys"](keyHandler, graph, reusedFunctions);
		//setup custom elements
		setupFunctions["setup_elements"](graph, data["m_elements"], data["m_attributes"], 
		    data["m_clon_cells"], data["m_constraints_ic"], toolbar, data["m_type"]);
		//setup custom shapes
		setupCustomShapes(modelType);
		//setup label changed
		setupLabelChanged(graph,data["m_labels"]);	
		//setup relations
		setupFunctions["setup_relations"](graph, data["m_relations"], data["m_relation_styles"],
		    data["m_constraints_relations"]);
		//setup custom features by model type
		setupCustomFeaturesByType(data["m_type"]);
		//setup overlay
		setupOverlay(data["m_overlay"]);
		// setup events
		setupFunctions["setup_events"](graph);

		//hide all elements that do not belong to the current layer (parent)
		for (let key in layers) {
			mxModel.setVisible(layers[key], false);
		}
		mxModel.setVisible(currentLayer, true);
	}

	function setupOverlay(mOverlay){
		if(mOverlay){
			mOverlay();
		}
	}

	function setupCustomFeaturesByType(mType){
		//hide "reset current model" button for binding models
		let buttonRESET = document.getElementById('buttonRESET');
		if(mType == "binding"){
			buttonRESET.style.display="none";
		}else{
			buttonRESET.style.display="";
		}
	}

	function setupCustomShapes(modelType){
		function CustomShape()
		{
			mxShape.call(this);
		};
		mxUtils.extend(CustomShape, mxShape);

		// Replaces existing actor shape
		mxCellRenderer.registerShape('customShape', CustomShape);

		let req = mxUtils.load(projectPath+'xml/MX/' + modelType + '/custom_shapes.xml');
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

	function setupGraphConfig(graph){
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

	function setupLabelChanged(graph,mLabels){		
		graph.convertValueToString = function(cell)
		{
		  if (mxUtils.isNode(cell.value))
		  {
			if(mLabels != null && mLabels[cell.getAttribute("type")]){
				return cell.getAttribute(mLabels[cell.getAttribute("type")], '')
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

	function getReusedFunctions(graph,mType){
		let reusedFunctions=[];
		reusedFunctions[0]=function(evt)
		{
			if (graph.isEnabled())
			{
				if(mType == "binding"){
					//binding models allow to remove egdes but not vertexs
					let cells = graph.getSelectionCells();
					let containClons = false;
					for (let i = 0; i < cells.length; i++) {
						if(cells[i].isVertex()){
							if(cells[i].getId().includes("clon")){ //cloned elements are not allowed to remove directly
								containClons = true;
								alert(global.messages["setup_keys_remove_cloned"]);
								break;
							}
						}
					}

					if(!containClons){
						let removedCells=graph.removeCells();

						//remove clons if exist
						for (let i = 0; i < removedCells.length; i++) {
							if(removedCells[i].isVertex()){
								let clon = graph.getModel().getCell("clon" + removedCells[i].getId());
								if(clon){
									let cells = [];
									cells[0] = clon;
									graph.removeCells(cells);
								}
							}
						}
					}
				}else{
					let removedCells=graph.removeCells();

					//remove clons if exist
					for (let i = 0; i < removedCells.length; i++) {
						if(removedCells[i].isVertex()){
							let clon = graph.getModel().getCell("clon" + removedCells[i].getId());
							if(clon){
								let cells = [];
								cells[0] = clon;
								graph.removeCells(cells);
							}
						}
					}
				}
			}
		}

		return reusedFunctions;
	}
}

export default main
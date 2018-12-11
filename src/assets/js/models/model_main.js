
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

		var data=[], elements=[], attributes=[], relations=[], properties_styles=[];
		data=model_specific_main(graph); //specific model data
		elements=data[0];
		attributes=data[1];
		relations=data[2];
		properties_styles=data[3];

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
			//setup keys
			setupFunctions["setup_keys"](keyHandler,graph);
			//setup properties
			setupFunctions["setup_properties"](graph,properties_styles);
			//setup label changed
			setup_label_changed(graph);
			//setup custom elements
			setupFunctions["setup_elements"](graph,elements,attributes,toolbar);
			//setup relations
			setupFunctions["setup_relations"](graph,relations);
			//setup buttons
			setupFunctions["setup_buttons"](graph,undoManager);
			//setup custom shapes
			setup_custom_shapes();
		}else{
			//counter equals 2 only setup the elements (palette), properties and relations
			//setup properties
			setupFunctions["setup_properties"](graph,properties_styles);
			//setup custom elements
			setupFunctions["setup_elements"](graph,elements,attributes,toolbar);	
			//setup relations
			setupFunctions["setup_relations"](graph,relations);	
		}

		//hidden all elements that do not belong to the current layer (parent)
		for (var key in layers) {
			mxModel.setVisible(layers[key], false);
		}
		mxModel.setVisible(currentLayer, true);
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
		var req = mxUtils.load('/static/xml/MX/custom_shapes.xml');
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
		graph.setCellsDisconnectable(false)
		graph.setDisconnectOnMove(false);
		graph.setPanning(true);
		graph.setCellsEditable(false);
		new mxRubberband(graph); // Enables rectangular selection
		new mxOutline(graph, document.getElementById('navigator'));
	}

	function setup_label_changed(graph){		
		graph.convertValueToString = function(cell)
		{
		  if (mxUtils.isNode(cell.value))
		  {
			if(cell.isEdge()){
				return cell.getAttribute('relType', '')
			}else{
				return cell.getAttribute('label', '') 
			}
		  }
		};
		
		var cellLabelChanged = graph.cellLabelChanged;
		graph.cellLabelChanged = function(cell, newValue, autoSize)
		{
		  if (mxUtils.isNode(cell.value))
		  {
		    // Clones the value for correct undo/redo
		    var elt = cell.value.cloneNode(true);
		    elt.setAttribute('label', newValue);
		    newValue = elt;
		  }

		  cellLabelChanged.apply(this, arguments);
		};
	}
}

export default main
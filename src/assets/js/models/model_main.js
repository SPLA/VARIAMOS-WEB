//main function
var main = function main(graph,toolbar,keyHandler,container,model_type,model_specific_main,m_code="",counter,setup_elements,setup_buttons,setup_keys,setup_properties)
{
	// Checks if the browser is supported
	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is not supported.
		mxUtils.error('Browser is not supported!', 200, false);
	}
	else
	{
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
			setup_keys(keyHandler,graph);
			//setup buttons
			setup_buttons(graph);
			//setup properties
			setup_properties(graph);
			//setup label changed
			setup_label_changed(graph);
			//setup custom elements
			setup_elements(graph, model_specific_main, toolbar);
			//setup saved model
			setup_saved_model(m_code);
		}
		//counter equals 2 setup the elements
		else{
			//setup custom elements
			setup_elements(graph, model_specific_main, toolbar);
			//setup saved model
			setup_saved_model(m_code);
		}
	}

	function setup_graph_config(graph){
		graph.dropEnabled = true;
		graph.setConnectable(true); // Enables new connections in the graph
		graph.setMultigraph(false);
		graph.setAllowDanglingEdges(false);
		graph.setDisconnectOnMove(false);
	}

	function setup_label_changed(graph){		
		graph.convertValueToString = function(cell)
		{
		  if (mxUtils.isNode(cell.value))
		  {
		    return cell.getAttribute('label', '')
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
		
	function setup_saved_model(m_code){
		//load saved model if exists
		if(m_code!=""){
			var doc = mxUtils.parseXml(m_code);
			var codec = new mxCodec(doc);
			codec.decode(doc.documentElement, graph.getModel());
		}else{
			graph.getModel().clear();
		}
	}
}

export default main
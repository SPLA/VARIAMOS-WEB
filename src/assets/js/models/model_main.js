//main function
var main = function main(container,model_type,model_specific_main,m_code="")
{
	// Checks if the browser is supported
	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is not supported.
		mxUtils.error('Browser is not supported!', 200, false);
	}
	else
	{
		// Disables the built-in context menu
		mxEvent.disableContextMenu(container);
		
		// Creates the graph inside the given container
		var graph = new mxGraph(container);
		
		// Matches DnD inside the graph
		mxDragSource.prototype.getDropTarget = function(graph, x, y)
		{
			var cell = graph.getCellAt(x, y);
			
			if (!graph.isValidDropTarget(cell))
			{
				cell = null;
			}
			
			return cell;
		};
		
		// Creates the div for the toolbar
		var tbContainer = document.getElementById('tbContainer');
		// Creates new toolbar without event processing
		var toolbar = new mxToolbar(tbContainer);
		// Stops editing on enter or escape keypress
		var keyHandler = new mxKeyHandler(graph);
		
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
		
		/* execute feature_main or component_main, etc */
		var elements="";
		elements=model_specific_main(graph);
		
		for (var i = 0; i < elements.length; i++) {
			addVertex(graph, elements[i].src, elements[i].wd, elements[i].hg, '', elements[i].type, elements[i].pname, elements[i].attr);
		}


		//load saved model
		if(m_code!=""){
			var doc = mxUtils.parseXml(m_code);
			var codec = new mxCodec(doc);
			codec.decode(doc.documentElement, graph.getModel());
		}
		
	}

	function addVertex(graph, icon, w, h, style, type, namepalette, attributes)
	{
		var doc = mxUtils.createXmlDocument();
		var node = doc.createElement(type);
		node.setAttribute('label', type);
		node.setAttribute('type', type);
		
		var vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
		vertex.setConnectable(true);
		vertex.setVertex(true);
	
		addToolbarItem(graph, toolbar, vertex, icon, namepalette);
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

	function setup_properties(graph){
		graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
		{
			selectionChanged(graph);
		});

		selectionChanged(graph);
	}

	function setup_buttons(graph){
		/* begin buttonxml */
		// Adds an option to view the XML of the graph
		var buttonXML = document.getElementById('buttonXML');
		buttonXML.appendChild(mxUtils.button('View XML', function()
		{
			var encoder = new mxCodec();
			var node = encoder.encode(graph.getModel());
			mxUtils.popup(mxUtils.getPrettyXml(node), true);
		}));
		/* end buttonxml */

		/* begin buttonreset */
		// Adds an option to reset the graph
		var buttonRESET = document.getElementById('buttonRESET');
		buttonRESET.appendChild(mxUtils.button('Reset', function()
		{
			graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
			var model_code = document.getElementById('model_code');
			model_code.value="";
			var event = new Event('change');
			model_code.dispatchEvent(event);
		}));
		/* end buttonreset */

		/* begin buttonsave */
		// Adds an option to save in localstorage the graph
		var buttonSAVE = document.getElementById('buttonSAVE');
		buttonSAVE.appendChild(mxUtils.button('Save Locally', function()
		{
			var encoder = new mxCodec();
			var result = encoder.encode(graph.getModel());
			var xml = mxUtils.getXml(result);
			var model_code = document.getElementById('model_code');
			model_code.value=xml;
			var event = new Event('change');
			model_code.dispatchEvent(event);
			alert("Model saved!");
		}));
		/* end buttonsave */
	}

	function setup_keys(keyHandler,graph){
		//allows removing elements with supr key
		keyHandler.bindKey(46, function(evt)
		{
			if (graph.isEnabled())
			{
				graph.removeCells();
			}
		});
	}

	function selectionChanged(graph)
	{
		var div = document.getElementById('properties');

		// Forces focusout in IE
		graph.container.focus();

		// Clears the DIV the non-DOM way
		div.innerHTML = '';

		// Gets the selection cell
		var cell = graph.getSelectionCell();

		if (cell == null)
		{
			mxUtils.writeln(div, 'Nothing selected.');
		}
		else
		{
			if(cell.isEdge()){
				//missing 
			}else{
				// Writes the title
				/*var center = document.createElement('center');
				mxUtils.writeln(center, cell.value.nodeName + ' (' + cell.id + ')');
				div.appendChild(center);
				mxUtils.br(div);*/

				// Creates the form from the attributes of the user object
				var form = new mxForm("properties-table");

				var attrs = cell.value.attributes;
				
				for (var i = 0; i < attrs.length; i++)
				{
					createTextField(graph, form, cell, attrs[i]);
				}

				div.appendChild(form.getTable());
				mxUtils.br(div);
			}
		}
	}

	/**
	 * Creates the textfield for the given property.
	 */
	function createTextField(graph, form, cell, attribute)
	{
		var input = form.addText(jsUcfirst(attribute.nodeName) + ':', attribute.nodeValue);
		
		if(attribute.nodeName=="type"){
			input.disabled="disabled";
		}

		var applyHandler = function()
		{
			var newValue = input.value || '';
			var oldValue = cell.getAttribute(attribute.nodeName, '');

			if (newValue != oldValue)
			{
				graph.getModel().beginUpdate();
				
				try
				{
					var edit = new mxCellAttributeChange(
							cell, attribute.nodeName,
							newValue);
					graph.getModel().execute(edit);
					//graph.updateCellSize(cell);
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}
		}; 

		mxEvent.addListener(input, 'keypress', function (evt)
		{
			// Needs to take shift into account for textareas
			if (evt.keyCode == /*enter*/13 &&
				!mxEvent.isShiftDown(evt))
			{
				input.blur();
			}
		});

		if (mxClient.IS_IE)
		{
			mxEvent.addListener(input, 'focusout', applyHandler);
		}
		else
		{
			// Note: Known problem is the blurring of fields in
			// Firefox by changing the selection, in which case
			// no event is fired in FF and the change is lost.
			// As a workaround you should use a local variable
			// that stores the focused field and invoke blur
			// explicitely where we do the graph.focus above.
			mxEvent.addListener(input, 'blur', applyHandler);
		}
	}

	function addToolbarItem(graph, toolbar, prototype, image, namepalette)
	{
		// Function that is executed when the image is dropped on
		// the graph. The cell argument points to the cell under
		// the mousepointer if there is one.
		var funct = function(graph, evt, cell)
		{
			graph.stopEditing(false);

			var pt = graph.getPointForEvent(evt);
			var vertex = graph.getModel().cloneCell(prototype);
			vertex.geometry.x = pt.x;
			vertex.geometry.y = pt.y;
			
			graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
		}
		
		var tbContainer = document.getElementById('tbContainer');
		var span = document.createElement('span');
		span.innerHTML = namepalette+"<br />";
		tbContainer.appendChild(span);

		// Creates the image which is used as the drag icon (preview)
		var img = toolbar.addMode(namepalette, image, funct);
		mxUtils.makeDraggable(img, graph, funct);
		
		span = document.createElement('span');
		span.innerHTML = "<br />";
		tbContainer.appendChild(span);
	}

	/* begin util */
	// converts the first letter in uppercase
	function jsUcfirst(string) 
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	/* end util */
}

export default main
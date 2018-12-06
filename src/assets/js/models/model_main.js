var rootCounter = 1;
//Main function
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
		//setup scrollbar config
		setup_scrollbar_config(graph);
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
		graph.setPanning(true);

	}	

	function setup_scrollbar_config(graph){

		
		graph.scrollTileSize = new mxRectangle(0, 0, 400, 400);	
		/**
		 * Specifies the size of the size for "tiles" to be used for a graph with
		 * scrollbars but no visible background page. A good value is large
		 * enough to reduce the number of repaints that is caused for auto-
		 * translation, which depends on this value, and small enough to give
		 * a small empty buffer around the graph. Default is 400x400.
		 */
		

		//ScrollbarConfig and functions
		/**
		 * Returns the padding for pages in page view with scrollbars.
		 */
		graph.getPagePadding = function()
		{
			return new mxPoint(Math.max(0, Math.round(graph.container.offsetWidth - 34)),
					Math.max(0, Math.round(graph.container.offsetHeight - 34)));
		};
		
		/**
		 * Returns the size of the page format scaled with the page size.
		 */		
		graph.getPageSize = function()
		{
		return (this.pageVisible) ? new mxRectangle(0, 0, this.pageFormat.width * this.pageScale,
					this.pageFormat.height * this.pageScale) : this.scrollTileSize;
		};

		/**
		 * Returns a rectangle describing the position and count of the
		 * background pages, where x and y are the position of the top,
		 * left page and width and height are the vertical and horizontal
		 * page count.
		 */
		graph.getPageLayout = function()
		{
			var size = (this.pageVisible) ? this.getPageSize() : this.scrollTileSize;
			console.log(size);
			var bounds = this.getGraphBounds();
			console.log(bounds);
		if (bounds.width == 0 || bounds.height == 0)
		{
			return new mxRectangle(0, 0, 1, 1);
		}
		else
		{
			// Computes untransformed graph bounds
			var x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
			var y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
			var w = Math.floor(bounds.width / this.view.scale);
			var h = Math.floor(bounds.height / this.view.scale);
			
			var x0 = Math.floor(x / size.width);
			var y0 = Math.floor(y / size.height);
			var w0 = Math.ceil((x + w) / size.width) - x0;
			var h0 = Math.ceil((y + h) / size.height) - y0;
			
			return new mxRectangle(x0, y0, w0, h0);
		}
		};

		// Fits the number of background pages to the graph
		graph.view.getBackgroundPageBounds = function()
		{
			var layout = this.graph.getPageLayout();
			var page = this.graph.getPageSize();
			
			return new mxRectangle(this.scale * (this.translate.x + layout.x * page.width),
					this.scale * (this.translate.y + layout.y * page.height),
					this.scale * layout.width * page.width,
					this.scale * layout.height * page.height);
		};

		graph.getPreferredPageSize = function(bounds, width, height)
		{
			var pages = this.getPageLayout();
			var size = this.getPageSize();
			
			return new mxRectangle(0, 0, pages.width * size.width, pages.height * size.height);
		};

		/**
		 * Guesses autoTranslate to avoid another repaint (see below).
		 * Works if only the scale of the graph changes or if pages
		 * are visible and the visible pages do not change.
		 */
		var graphViewValidate = graph.view.validate;
		graph.view.validate = function()
		{
			if (this.graph.container != null && mxUtils.hasScrollbars(this.graph.container))
			{
				var pad = this.graph.getPagePadding();
				var size = this.graph.getPageSize();
				
				// Updating scrollbars here causes flickering in quirks and is not needed
				// if zoom method is always used to set the current scale on the graph.
				var tx = this.translate.x;
				var ty = this.translate.y;
				this.translate.x = pad.x / this.scale - (this.x0 || 0) * size.width;
				this.translate.y = pad.y / this.scale - (this.y0 || 0) * size.height;
			}
					
					graphViewValidate.apply(this, arguments);
				};
				
		var graphSizeDidChange = graph.sizeDidChange;
		graph.sizeDidChange = function()
		{
			if (this.container != null && mxUtils.hasScrollbars(this.container))
			{
				var pages = this.getPageLayout();
				var pad = this.getPagePadding();
				var size = this.getPageSize();
				
				// Updates the minimum graph size
				var minw = Math.ceil(2 * pad.x / this.view.scale + pages.width * size.width);
				var minh = Math.ceil(2 * pad.y / this.view.scale + pages.height * size.height);
				
				var min = graph.minimumGraphSize;
				
				// LATER: Fix flicker of scrollbar size in IE quirks mode
				// after delayed call in window.resize event handler
				if (min == null || min.width != minw || min.height != minh)
				{
					graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
				}
				
				// Updates auto-translate to include padding and graph size
				var dx = pad.x / this.view.scale - pages.x * size.width;
				var dy = pad.y / this.view.scale - pages.y * size.height;
				
				if (!this.autoTranslate && (this.view.translate.x != dx || this.view.translate.y != dy))
				{
					this.autoTranslate = true;
					this.view.x0 = pages.x;
					this.view.y0 = pages.y;

					// NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
					// BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
					// SHOULD MOVE TRANSLATE/SCALE TO VIEW.
					var tx = graph.view.translate.x;
					var ty = graph.view.translate.y;

					graph.view.setTranslate(dx, dy);
					graph.container.scrollLeft += (dx - tx) * graph.view.scale;
					graph.container.scrollTop += (dy - ty) * graph.view.scale;

					this.autoTranslate = false;
					return;
				}

				graphSizeDidChange.apply(this, arguments);
			}
		};

		window.setTimeout(function()
		{
			var bounds = graph.getGraphBounds();
			console.log(bounds);
			var width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale);
			console.log("width :"+width);
			var height = Math.max(bounds.height, graph.scrollTileSize.height * graph.view.scale);
			console.log("height: "+height);
			graph.container.scrollTop = Math.floor(Math.max(0, bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4)));
			console.log("scrolltop: "+Math.floor(Math.max(0, bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4))));
			graph.container.scrollLeft = Math.floor(Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)));
			console.log("scrollleft" +Math.floor(Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2))))
		}, 0);
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
			if(prototype.getAttribute("type") === "root"){
				console.log(prototype.getAttribute("type"))
				if(rootCounter > 1){
					alert("Only 1 root")
					return
				}else{
					rootCounter ++;
				}
			}
			console.log(rootCounter)
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
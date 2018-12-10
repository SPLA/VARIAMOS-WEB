
//main function
var main = function main(graph,layers,mxModel,toolbar,keyHandler,container,model_type,model_specific_main,counter,setupFunctions,undoManager)
{

	// Checks if the browser is supported
	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is not supported.
		mxUtils.error('Browser is not supported!', 200, false);
	}
	else
	{
		var currentLayer="";
		currentLayer=layers[model_type]; //current layer to be displayed (feature, component, etc)
		graph.setDefaultParent(currentLayer); //any new graphic element will be connected with this parent

		var data=[], elements=[], relations=[];
		data=model_specific_main(graph); //specific model data
		elements=data[0];
		relations=data[1];

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
			//setup scrollbar config
			setup_scrollbar_config(graph);
			//setup keys
			setupFunctions["setup_keys"](keyHandler,graph);
			//setup properties
			setupFunctions["setup_properties"](graph);
			//setup label changed
			setup_label_changed(graph);
			//setup custom elements
			setupFunctions["setup_elements"](graph,elements,toolbar);
			//setup relations
			setupFunctions["setup_relations"](graph,relations);
			//setup buttons
			setupFunctions["setup_buttons"](graph,undoManager);
			//setup custom shapes
			setup_custom_shapes();
		}else{
			//counter equals 2 only setup the elements (palette) and relations
			//setup custom elements
			setupFunctions["setup_elements"](graph,elements,toolbar);	
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
		graph.setDisconnectOnMove(false);
		graph.setPanning(true);
		graph.setCellsEditable(false);
		new mxRubberband(graph); // Enables rectangular selection
		new mxOutline(graph, document.getElementById('navigator'));
	}	

	function setup_scrollbar_config(graph){
		graph.scrollTileSize = new mxRectangle(0, 0, 100, 100);	
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
			return new mxPoint(Math.max(0, Math.round(graph.container.offsetWidth - 400)),
					Math.max(0, Math.round(graph.container.offsetHeight - 400)));
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
			

			var bounds = this.getGraphBounds();
			
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
				var minw = Math.ceil(pad.x / this.view.scale + pages.width * size.width);
				var minh = Math.ceil(pad.y / this.view.scale + pages.height * size.height);
				
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
			var width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale);
			
			var height = Math.max(bounds.height, graph.scrollTileSize.height * graph.view.scale);
			graph.container.scrollTop = Math.floor(Math.max(0, bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4)));
			graph.container.scrollLeft = Math.floor(Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)));
		}, 0);
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
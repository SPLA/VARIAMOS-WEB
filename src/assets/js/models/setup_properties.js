
var setup_properties = function setup_properties(graph){
    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
    {
        selectionChanged(graph);
    });

    selectionChanged(graph);

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
			mxUtils.writeln(div, messages["setup_properties_nothing"]);
		}
		else
		{
			if(cell.value.attributes){
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
}

export default setup_properties
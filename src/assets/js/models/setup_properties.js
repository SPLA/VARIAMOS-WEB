
var setup_properties = function setup_properties(graph,properties_styles,c_type){
    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
    {
        selectionChanged(graph,properties_styles,c_type);
    });

    selectionChanged(graph,properties_styles,c_type);

    function selectionChanged(graph,properties_styles,c_type)
	{
		var div = document.getElementById('properties');
		// Forces focusout in IE
		graph.container.focus();
		// Clears the DIV the non-DOM way
		div.innerHTML = '';
		// Gets the selection cell
		var cell = graph.getSelectionCell();

		if(c_type=="binding"){
			if (cell == null)
			{
				mxUtils.writeln(div, messages["setup_properties_nothing"]);
			}else{
				mxUtils.writeln(div, messages["setup_properties_binding"]);
			}
		}else{
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
						if(properties_styles!=null && properties_styles[cell.getAttribute("type")]){
							var type = cell.getAttribute("type");
							var passed = false;
							for (var j = 0; j < properties_styles[type].length; j++)
							{
								if(properties_styles[type][j]["attribute"]==attrs[i].nodeName){
									if(properties_styles[type][j]["input_type"]=="text"){
										createTextField(graph, form, cell, attrs[i], properties_styles[type][j]);
										passed = true;
									}else if(properties_styles[type][j]["input_type"]=="select"){
										createSelectField(graph, form, cell, attrs[i], properties_styles[type][j]);
										passed = true;
									}
								}
							}
							if(!passed){
								createTextField(graph, form, cell, attrs[i], "");
							}
						}else{
							createTextField(graph, form, cell, attrs[i], "");
						}
					}

					div.appendChild(form.getTable());
					mxUtils.br(div);
				}
			}
		}
	}

	/**
	 * Creates the select field for the given property.
	 */
	function createSelectField(graph, form, cell, attribute, custom){
		var values=custom["input_values"];
		var input = form.addCombo(attribute.nodeName, false, 1);
		for (var i = 0; i < values.length; i++)
		{
			if(values[i]==attribute.nodeValue){
				form.addOption(input,values[i],values[i],true);
			}else{
				form.addOption(input,values[i],values[i],false);
			}
		}

		if(custom["onchange"]!=null){
			input.onchange = custom["onchange"];
		}

		executeApplyHandler(graph, form, cell, attribute, input);
	}

	/**
	 * Creates the textfield for the given property.
	 */
	function createTextField(graph, form, cell, attribute, custom)
	{
		var def_display=""
		if(custom!=null){
			def_display=custom["def_display"];
			if(custom["display_check_attribute"]){
				if(custom["display_check_value"]==cell.getAttribute(custom["display_check_attribute"])){
					def_display=custom["display_check"];
				}
			}
		}

		var input = form.addText(attribute.nodeName, attribute.nodeValue, "text", def_display);
		
		if(attribute.nodeName=="type"){
			input.disabled="disabled";
		}

		executeApplyHandler(graph, form, cell, attribute, input);

	}

	function executeApplyHandler(graph, form, cell, attribute, input){
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
					
					//update cloned cell
					var clon = graph.getModel().getCell("clon"+cell.getId());
					console.log(clon);
					if(clon){
						var edit2 = new mxCellAttributeChange(
							clon, attribute.nodeName,
							newValue);
						graph.getModel().execute(edit2);
					}
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
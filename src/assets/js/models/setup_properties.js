
var setup_properties = function setup_properties(graph,properties_styles){
	//remove previous listeners
	if(graph.getSelectionModel().eventListeners.length>3){
		graph.getSelectionModel().eventListeners.pop();
		graph.getSelectionModel().eventListeners.pop();
	}

    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
    {
        selectionChanged(graph,properties_styles);
	});

    selectionChanged(graph,properties_styles);

    function selectionChanged(graph,properties_styles)
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
			if(cell.getId().includes("clon")){
				mxUtils.writeln(div, messages["setup_properties_clon"]);
			}else{
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
									}else if(properties_styles[type][j]["input_type"]=="checkbox"){
										createCheckboxField(graph, form, cell, attrs[i], properties_styles[type][j]);
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
	 * Creates the checkbox field for the given property.
	 */
	function createCheckboxField(graph, form, cell, attribute, custom){

		var def_display = getDisplayValue(cell,custom);
		var input = form.addCheckbox(attribute.nodeName, attribute.nodeValue, def_display);

		executeApplyHandler(graph, form, cell, attribute, input, custom);
	}

	/**
	 * Creates the select field for the given property.
	 */
	function createSelectField(graph, form, cell, attribute, custom){

		var values=custom["input_values"];
		var def_display = getDisplayValue(cell,custom);
		var input = form.addCombo(attribute.nodeName, false, 1, def_display);

		for (var i = 0; i < values.length; i++)
		{
			if(values[i]==attribute.nodeValue){
				form.addOption(input,values[i],values[i],true);
			}else{
				form.addOption(input,values[i],values[i],false);
			}
		}

		executeApplyHandler(graph, form, cell, attribute, input, custom);
	}

	/**
	 * Creates the textfield for the given property.
	 */
	function createTextField(graph, form, cell, attribute, custom)
	{
		var def_display = getDisplayValue(cell,custom);

		var input = form.addText(attribute.nodeName, attribute.nodeValue, "text", def_display);
		
		//attribute type can not be modified
		if(attribute.nodeName=="type"){
			input.disabled="disabled";
		}

		executeApplyHandler(graph, form, cell, attribute, input, custom);

	}

	function executeApplyHandler(graph, form, cell, attribute, input, custom){

		//apply custom configurations
		applyCustomElements(input, custom, cell);

		var applyHandler = function()
		{
			var newValue = "";

			if(input.type=="checkbox"){
				newValue = "false";
				if(input.checked){
					newValue = "true";
				}
			}else{
				newValue = input.value || '';
			}

			var oldValue = cell.getAttribute(attribute.nodeName, '');
			var onchange_allowed = true;

			//check custom changes that are not allowed
			if(custom["onchangerestrictive"]!=null){
				onchange_allowed = custom["onchangerestrictive"]();
				if(!onchange_allowed){
					input.value=oldValue;
				}
			}

			if (newValue != oldValue && onchange_allowed)
			{
				graph.getModel().beginUpdate();
				
				try
				{
					var edit = new mxCellAttributeChange(
							cell, attribute.nodeName,
							newValue);
					graph.getModel().execute(edit);
					
					//update cloned cell if exists
					var clon = graph.getModel().getCell("clon"+cell.getId());
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

	function getDisplayValue(cell,custom){
		var def_display = "";
 		if(custom!=null && custom["def_display"]!=null){
			def_display=custom["def_display"];
			if(custom["display_check_attribute"]){
				if(custom["display_check_value"]==cell.getAttribute(custom["display_check_attribute"])){
					def_display=custom["display_check"];
				}
			}
		}

		return def_display;
	}

	function applyCustomElements(input, custom, cell){
		if(custom!=null){
			//add onchange listener
			if(custom["onchange"]!=null){
				input.name=cell.getId();
				input.onchange = custom["onchange"];
			}

			//custom input type
			if(custom["input_text_type"]){
				var type=custom["input_text_type"];
				input.setAttribute('type', type);
			}
		}
	}
}

export default setup_properties
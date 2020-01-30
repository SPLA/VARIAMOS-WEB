let setupProperties = function setupProperties(graph, properties_styles){
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

    function selectionChanged(graph,properties_styles){
		let div = document.getElementById('properties');
		// Forces focusout in IE
		graph.container.focus();
		// Clears the DIV the non-DOM way
		div.innerHTML = '';
		// Gets the selection cell
		let cell = graph.getSelectionCell();
		
		if (cell == null)
		{
			mxUtils.writeln(div, global.messages["setup_properties_nothing"]);
		}
		else
		{
			if(cell.getId().includes("clon")){
				mxUtils.writeln(div, global.messages["setup_properties_clon"]);
			}else{
				if(cell.value.attributes){
					let form = new mxForm("properties-table");
					let attrs = cell.value.attributes;
					
					for (let i = 0; i < attrs.length; i++)
					{
						if(properties_styles!=null && properties_styles[cell.getAttribute("type")]){
							let type = cell.getAttribute("type");
							let passed = false;

							for (let j = 0; j < properties_styles[type].length; j++)
							{form
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

		let defDisplay = getDisplayValue(cell,custom);
		let input = form.addCheckbox(attribute.nodeName, attribute.nodeValue, defDisplay);

		executeApplyHandler(graph, form, cell, attribute, input, custom);
	}

	/**
	 * Creates the select field for the given property.
	 */
	function createSelectField(graph, form, cell, attribute, custom){

		let values=custom["input_values"];
		let defDisplay = getDisplayValue(cell,custom);
		let input = form.addCombo(attribute.nodeName, false, 1, defDisplay);
		for (let i = 0; i < values.length; i++)
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
		let defDisplay = getDisplayValue(cell,custom);

		let input = form.addText(attribute.nodeName, attribute.nodeValue, "text", defDisplay);
		
		//attribute type can not be modified
		if(attribute.nodeName=="type"){
			input.disabled="disabled";
		}

		executeApplyHandler(graph, form, cell, attribute, input, custom);

	}

	function executeApplyHandler(graph, form, cell, attribute, input, custom){

		//apply custom configurations
		applyCustomElements(input, custom, cell);

		let applyHandler = function()
		{
			let newValue = "";

			if(input.type=="checkbox"){
				newValue = "false";
				if(input.checked){
					newValue = "true";
				}
			}else{
				newValue = input.value || '';
			}

			let oldValue = cell.getAttribute(attribute.nodeName, '');
			let onchange_allowed = true;

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
					/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					///////////////////////////////////////////////Change cell over edge/////////////////////////////////////////////
					/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					for (let i = 0; i<cell.children.length; i++){
						if (cell.children[i].value == "Label"){
							switch (newValue) {
								case 'links':
									graph.getModel().setStyle(cell.children[i], 'shape=link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'aggregation':
									graph.getModel().setStyle(cell.children[i], 'shape=Aggregation;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'signal':
									graph.getModel().setStyle(cell.children[i], 'shape=Signal;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'resourcelink':
									graph.getModel().setStyle(cell.children[i], 'shape=Resource_link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'actuatorsignal':
									graph.getModel().setStyle(cell.children[i], 'shape=Actuator_link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'actionlink':
									graph.getModel().setStyle(cell.children[i], 'shape=Action_link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'sensorlink':
									graph.getModel().setStyle(cell.children[i], 'shape=Sensor_link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'wired':
									graph.getModel().setStyle(cell.children[i], 'shape=Wired_comunication;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								case 'wireless':
									graph.getModel().setStyle(cell.children[i], 'shape=Wirless_comunication;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;fontStyle=0;');
									break;
								default:
									let edit = new mxCellAttributeChange(cell, attribute.nodeName,newValue);
									graph.getModel().execute(edit);
									break;
							}
						}
						else if(cell.children[i].value.attributes){
							if(cell.children[i].value.localName == attribute.nodeName){
								cell.children[i].value.attributes[0].nodeValue = newValue;
							}

						}
					}
					
					
					//update cloned cell if exists
					let clon = graph.getModel().getCell("clon"+cell.getId());
					if(clon){
						let edit2 = new mxCellAttributeChange(
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
			// As a workaround you should use a local letiable
			// that stores the focused field and invoke blur
			// explicitely where we do the graph.focus above.
			mxEvent.addListener(input, 'blur', applyHandler);
		}
	}

	function getDisplayValue(cell,custom){
		let defDisplay = "";
 		if(custom!=null && custom["def_display"]!=null){
			defDisplay=custom["def_display"];
			if(custom["display_check_attribute"]){
				if(custom["display_check_value"]==cell.getAttribute(custom["display_check_attribute"])){
					console.log(custom["display_check"]);
					defDisplay=custom["display_check"];
				}
			}
		}

		return defDisplay;
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
				let type=custom["input_text_type"];
				input.setAttribute('type', type);
			}
		}
	}
}

export default setupProperties

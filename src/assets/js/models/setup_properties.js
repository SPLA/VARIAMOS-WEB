let setupProperties = function setupProperties(graph, propertiesStyles){
	//remove previous listeners
	if(graph.getSelectionModel().eventListeners.length > 3){
		graph.getSelectionModel().eventListeners.pop();
		graph.getSelectionModel().eventListeners.pop();
	}

    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
        selectionChanged(graph, propertiesStyles);
	});

    selectionChanged(graph, propertiesStyles);

    function selectionChanged(graph, propertiesStyles){
		let div = document.getElementById('properties');
		// Forces focusout in IE
		graph.container.focus();
		// Clears the DIV the non-DOM way
		div.innerHTML = '';
		// Gets the selection cell
		let cell = graph.getSelectionCell();
		
		if (cell == null){
			mxUtils.writeln(div, global.messages["setup_properties_nothing"]);
		}
		else{
			if(cell.getId().includes("clon")){
				mxUtils.writeln(div, global.messages["setup_properties_clon"]);
			}else{
				if(cell.value.attributes){
					let form = new mxForm("properties-table");
					let attrs = cell.value.attributes;
					
					for (let i = 0; i < attrs.length; i++){
						if(propertiesStyles!=null && propertiesStyles[cell.getAttribute("type")]){
							let type = cell.getAttribute("type");
							let passed = false;
							for (let j = 0; j < propertiesStyles[type].length; j++)
							{
								if(propertiesStyles[type][j]["attribute"] == attrs[i].nodeName){
									if(propertiesStyles[type][j]["input_type"] == "text"){
										createTextField(graph, form, cell, attrs[i], propertiesStyles[type][j]);
										passed = true;
									}else if(propertiesStyles[type][j]["input_type"] == "select"){
										createSelectField(graph, form, cell, attrs[i], propertiesStyles[type][j]);
										passed = true;
									}else if(propertiesStyles[type][j]["input_type"] == "checkbox"){
										createCheckboxField(graph, form, cell, attrs[i], propertiesStyles[type][j]);
										passed = true;
									}else if(propertiesStyles[type][j]["input_type"] == "disabled"){
										createTextField(graph, form, cell, attrs[i], propertiesStyles[type][j], true);
										passed = true;
									}else if(propertiesStyles[type][j]["input_type"] == "none"){ 
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
		let values = custom["input_values"];
		let defDisplay = getDisplayValue(cell, custom);
		let input = form.addCombo(attribute.nodeName, false, 1, defDisplay);

		for (let i = 0; i < values.length; i++){
			if(values[i] == attribute.nodeValue){
				form.addOption(input, values[i], values[i], true);
			}else{
				form.addOption(input, values[i], values[i], false);
			}
		}

		executeApplyHandler(graph, form, cell, attribute, input, custom);
	}

	/**
	 * Creates the textfield for the given property.
	 */
	function createTextField(graph, form, cell, attribute, custom, disabled){
		// TO FIX -> MUST BE REMOVED FROM HERE - initialize the highrange when its value is '*'
		if(attribute.nodeName === 'highRange' && attribute.nodeValue === '*'){
			custom['input_text_type'] = 'text';
		}
		let defDisplay = getDisplayValue(cell, custom);

		let input = form.addText(attribute.nodeName, attribute.nodeValue, "text", defDisplay);
		
		//attribute type can not be modified
		if(attribute.nodeName=="type" || disabled){
			input.disabled="disabled";
		}

		executeApplyHandler(graph, form, cell, attribute, input, custom);
	}

	function executeApplyHandler(graph, form, cell, attribute, input, custom){
		//apply custom configurations
		applyCustomElements(input, custom, cell);

		let applyHandler = function(){
			let newValue = "";

			if(input.type=="checkbox"){
				newValue = "false";
				if(input.checked){
					newValue = "true";
				}
			}
			// TO FIX -> MUST BE REMOVED FROM HERE set newValue as '*' if input is high range and smaller than 0
			else if(input.id === 'input-highRange' && input.value < 0){
				newValue = '*';
			}else{
				newValue = input.value || '';
			}

			let oldValue = cell.getAttribute(attribute.nodeName, '');
			let onChangeAllowed = true;

			//check custom changes that are not allowed
			if(custom["onchangerestrictive"] != null){
				onChangeAllowed = custom["onchangerestrictive"]();
				if(!onChangeAllowed){
					input.value=oldValue;
				}
			}

			if (newValue != oldValue && onChangeAllowed){
				graph.getModel().beginUpdate();
				
				try{
					let edit = new mxCellAttributeChange(
							cell, attribute.nodeName,
							newValue);
					graph.getModel().execute(edit);
					
					//update cloned cell if exists
					let clon = graph.getModel().getCell("clon"+cell.getId());
					if(clon){
						let edit2 = new mxCellAttributeChange(
							clon, attribute.nodeName,
							newValue);
						graph.getModel().execute(edit2);
					}
				}
				finally{
					graph.getModel().endUpdate();
				}
			}
		}; 

		mxEvent.addListener(input, 'keypress', function (evt){
			// Needs to take shift into account for textareas
			if (evt.keyCode == /*enter*/13 &&
				!mxEvent.isShiftDown(evt))
			{
				input.blur();
			}
		});

		if (mxClient.IS_IE){
			mxEvent.addListener(input, 'focusout', applyHandler);
		}
		else{
			// Note: Known problem is the blurring of fields in
			// Firefox by changing the selection, in which case
			// no event is fired in FF and the change is lost.
			// As a workaround you should use a local variable
			// that stores the focused field and invoke blur
			// explicitely where we do the graph.focus above.
			mxEvent.addListener(input, 'blur', applyHandler);
		}
	}

	function getDisplayValue(cell, custom){
		let defDisplay = "";
 		if(custom != null && custom["def_display"] != null){
			defDisplay = custom["def_display"];
			if(custom["display_check_attribute"]){
				if(custom["display_check_value"] == cell.getAttribute(custom["display_check_attribute"])){
					defDisplay=custom["display_check"];
				}
			}
		}

		return defDisplay;
	}

	function applyCustomElements(input, custom, cell){
		if(custom != null){
			//add onchange listener
			if(custom["onchange"] != null){
				input.name=cell.getId();
				input.onchange = custom["onchange"];
			}

			//custom input type
			if(custom["input_text_type"]){
				let type = custom["input_text_type"];
				input.setAttribute('type', type);
			}
		}
	}
}

export default setupProperties
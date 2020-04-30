let adapArchitectureMain = function adapArchitectureMain(graph)
{
	let counter = 0;
	let oldwith = 100;
	let oldheigh = 40;

	adapArchitectureConstraints(graph);
	let data=[];
	data['m_type'] = "normal" //custom type
	data["m_elements"] = adapArchitectureElements(); //custom elements
	data["m_attributes"] = adapArchitectureAttributes(); //custom attributes
	data["m_relations"] = adapArchitectureRelations(); //custom relations
	data["m_relation_styles"] = adapArchitectureRelationStyles();
	data["m_properties_styles"] = adapArchitecturePropertiesStyles(); //custom properties styles
	//data["m_clon_cells"]  =  adapArchitectureClonCells(); //custom clon cells
	data["m_overlay"]  =  adapArchitectureOverlay();
	return data;
	
	function adapArchitectureConstraints(graph){
		graph.multiplicities = []; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, 'layer', null, null, 1, 100, ['layer'],
			'Only 2 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'device', null, null, 1, 100, ['device', 'computer', 'actuator', 'network'],
			'Only 2 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'package', null, null, 1, 100, ['package'],
			'Only 2 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'module', null, null, 1, 100, ['module'],
			'Only 2 targets allowed',
			'Invalid connection'));	
		graph.multiplicities.push(new mxMultiplicity(
			true, 'software', null, null, 1, 100, ['software', 'computer','device'],
			'Only 2 targets allowed',
			'Invalid connection'));	
		graph.multiplicities.push(new mxMultiplicity(
			true, 'sensor', null, null, 1, 100, ['actuator','device', 'computer', 'resource'],
			'Only 2 targets allowed',
			'Invalid connection'));	
		graph.multiplicities.push(new mxMultiplicity(
			true, 'actuator', null, null, 1, 100, ['device', 'computer', 'resource'],
			'Only 2 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'resource', null, null, 1, 100, ['resource'],
			'Only 2 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'computer', null, null, 1, 100, ['computer','actuator', 'network'],
			'Only 2 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'network', null, null, 1, 100, ['network'],
			'Only 2 targets allowed',
			'Invalid connection'));

	}

	function adapArchitectureElements(){
		
		let paths = projectPath+"images/models/adap_architecture/";
		let layer = {src:paths+"layer.png", wd:100, hg:40, style:"", type:"layer", pname:"layer"};
		let module = {src:paths+"modul.png", wd:100, hg:40, style:"", type:"module", pname:"module"};
		let packag = {src:paths+"packag.png", wd:100, hg:40, style:"", type:"package", pname:"package"};
		let device = {src:paths+"device.png", wd:100, hg:40, style:"", type:"device", pname:"device"};
		let software = {src:paths+"software.png", wd:100, hg:40, style:"", type:"software", pname:"software"};
		let sensor = {src:paths+"sensor.png", wd:100, hg:40, style:"", type:"sensor", pname:"sensor"};
		let actuator = {src:paths+"actuator.png", wd:100, hg:40, style:"", type:"actuator", pname:"actuator"};
		let network = {src:paths+"network.png", wd:100, hg:40, style:"", type:"network", pname:"network"};
		let computer = {src:paths+"computer.png", wd:100, hg:40, style:"", type:"computer", pname:"computer"};
		let resource = {src:paths+"resource.png", wd:100, hg:40, style:"", type:"resource", pname:"resource"};
		
		let elements=[];

		elements[0] = layer;
		elements[1] = module;
		elements[2] = packag;
		elements[3] = device;
		elements[4] = software;
		elements[5] = sensor;
		elements[6] = actuator;
		elements[7] = resource;
		elements[8] = network;
		elements[9] = computer;
	
		return elements;
	}

	function adapArchitectureAttributes(){
		let attributes = [];
		attributes[0] = {
			"types":["device"],
			"custom_attributes":[
			{
				"name":"deviceType",
				"def_value":""
			}]
		};
		attributes[1] = {
			"types":["software"],
			"custom_attributes":[
			{
				"name":"softwareType",
				"def_value":""
			}]
		};
		attributes[2] = {
			"types":["module"],
			"custom_attributes":[
			{
				"name":"moduleType",
				"def_value":""
			},
			{
				"name":"boundary",
				"def_value":"false"
			}]
		};
		attributes[3] = {
			"types":["sensor"],
			"custom_attributes":[
			{
				"name":"sensorType",
				"def_value":""
			}]
		};
		attributes[4] = {
			"types":["resource"],
			"custom_attributes":[
			{
				"name":"resourceType",
				"def_value":""
			}]
		};
		attributes[5] = {
			"types":["network"],
			"custom_attributes":[
			{
				"name":"redType",
				"def_value":""
			}]
		};
		attributes[6] = {
			"types":["computer"],
			"custom_attributes":[
			{
				"name":"computerType",
				"def_value":""
			}]
		};
		attributes[7] = {
			"types":["package"],
			"custom_attributes":[
			{
				"name":"boundary",
				"def_value":"false"
			}]
		};
		attributes[8] = {
			"types":["layer"],
			"custom_attributes":[
			{
				"name":"boundary",
				"def_value":"false"
			}]
		};
		return attributes;
	}

	function adapArchitectureRelations(){
		let relations = [];
		relations[0] = {
			"source":["layer"],
			"rel_source_target":"and",
			"target":["layer"],
			"attributes":[{
				"name":'relType_L2L',
				"def_value":"link"
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[1] = {
			"source":["package"],
			"rel_source_target":"and",
			"target":["package"],
			"attributes":[{
				"name":'relType_P2P',
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[2] = {
			"source":["module"],
			"rel_source_target":"and",
			"target":["module"],
			"attributes":[{
				"name":"relType_M2M",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[3] = {
			"source":["device"],
			"rel_source_target":"and",
			"target":["computer"],
			"attributes":[{
				"name":"relType_D2C",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[4] = {
			"source":["device"],
			"rel_source_target":"and",
			"target":["actuator"],
			"attributes":[{
				"name":"relType_D2A",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[5] = {
			"source":["device"],
			"rel_source_target":"and",
			"target":["device"],
			"attributes":[{
				"name":"relType_D2D",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[6] = {
			"source":["device"],
			"rel_source_target":"and",
			"target":["network"],
			"attributes":[{
				"name":"relType_D2N",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[7] = {
			"source":["computer"],
			"rel_source_target":"and",
			"target":["actuator"],
			"attributes":[{
				"name":"relType_C2A",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[8] = {
			"source":["computer"],
			"rel_source_target":"and",
			"target":["computer"],
			"attributes":[{
				"name":"relType_C2C",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[9] = {
			"source":["computer"],
			"rel_source_target":"and",
			"target":["network"],
			"attributes":[{
				"name":"relType_C2N",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[10] = {
			"source":["software"],
			"rel_source_target":"and",
			"target":["software"],
			"attributes":[{
				"name":"relType_S2S",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[11] = {
			"source":["software"],
			"rel_source_target":"and",
			"target":["device"],
			"attributes":[{
				"name":"relType_S2D",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[12] = {
			"source":["software"],
			"rel_source_target":"and",
			"target":["computer"],
			"attributes":[{
				"name":"relType_S2C",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[13] = {
			"source":["sensor"],
			"rel_source_target":"and",
			"target":["device"],
			"attributes":[{
				"name":"relType_SS2D",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[14] = {
			"source":["sensor"],
			"rel_source_target":"and",
			"target":["actuator"],
			"attributes":[{
				"name":"relType_SS2A",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[15] = {
			"source":["sensor"],
			"rel_source_target":"and",
			"target":["computer"],
			"attributes":[{
				"name":"relType_SS2C",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[16] = {
			"source":["sensor"],
			"rel_source_target":"and",
			"target":["resource"],
			"attributes":[{
				"name":"relType_SS2R",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[17] = {
			"source":["actuator"],
			"rel_source_target":"and",
			"target":["device"],
			"attributes":[{
				"name":"relType_SS2D",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[18] = {
			"source":["actuator"],
			"rel_source_target":"and",
			"target":["computer"],
			"attributes":[{
				"name":"relType_SS2C",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[19] = {
			"source":["actuator"],
			"rel_source_target":"and",
			"target":["resource"],
			"attributes":[{
				"name":"relType_SS2R",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[20] = {
			"source":["network"],
			"rel_source_target":"and",
			"target":["network"],
			"attributes":[{
				"name":"relType_N2N",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		relations[21] = {
			"source":["resource"],
			"rel_source_target":"and",
			"target":["resource"],
			"attributes":[{
				"name":"relType_R2R",
				"def_value":""
			},
			{
				"name":"sourceCardinality",
				"def_value":"1"
			},
			{
				"name":"destinationCardinality",
				"def_value":"1"
			}]
		}
		return relations;
	}

	function adapArchitecturePropertiesStyles(){
		let styles = {};
		styles = {
			"layer":[
				{
					"attribute":"boundary",
					"input_type":"checkbox",
					"onchange":actorboundary
				}
			],
			"package":[
				{
					"attribute":"boundary",
					"input_type":"checkbox",
					"onchange":actorboundary
				}
			],
			"module":[
				{
					"name":"moduleType",
					"attribute":"moduleType",
					"input_type":"select",
					"input_values":["Parallel" , "Secuential" ,"Ad-Hoc"],
					"onchange": adapArchitectureCustomMethods(0)
				},
				{
					"attribute":"boundary",
					"input_type":"checkbox",
					"onchange":actorboundary
				}
			],
			"device":[
				{
					"name":"deviceType",
					"attribute":"deviceType",
					"input_type":"select",
					"input_values": ["Electric", "Electronic"],
					"onchange": adapArchitectureCustomMethods(1)
				}
			], 
			"software":[
				{
					"name":"softwareType",
					"attribute":"softwareType",
					"input_type":"select",
					"input_values":["OPSystem","Midleware","Database","AppWeb","AppMovil", "AppStandalone","Embedded", "Appi", "Services"],
					"onchange": adapArchitectureCustomMethods(2)
				}
			], 
			"sensor":[
				{
					"name":"sensorType",
					"attribute":"sensorType",
					"input_type":"select",
					"input_values":["Digital","Analog"],
					"onchange": adapArchitectureCustomMethods(3)
				}
			],
			"resource":[
				{
					"name":"resourceType",
					"attribute":"resourceType",
					"input_type":"select",
					"input_values":["Cyber","Physical"],
					"onchange": adapArchitectureCustomMethods(4)
				}
			],
			"network":[
				{
					"name":"redType",
					"attribute":"redType",
					"input_type":"select",
					"input_values":["Internet", "IoT", "Lan" ,"Wan"],
					"onchange": adapArchitectureCustomMethods(5)
				}
			],
			"computer":[
				{
					"name":"computerType",
					"attribute":"computerType",
					"input_type":"select",
					"input_values":["Cloud Computer", "Movil Computer", "Station Computer", "Embeded Computer", "Single Board Computer"],
					"onchange": adapArchitectureCustomMethods(6)
				}
			],
			"relation":[
				{
					"attribute":"sourceCardinality",
					"input_type":"text",
					"input_text_type":"label"
				},
				{
					"attribute":"destinationCardinality",
					"input_type":"text",
					"input_text_type":"label"
				},
				{
					"attribute":"relType_L2L",
					"input_type":"select",
					"input_values":["links"]
				},
				{
					"attribute":"relType_P2P",
					"input_type":"select",
					"input_values":["links"]
				},
				{
					"attribute":"relType_M2M",
					"input_type":"select",
					"input_values":["links", "signal"]
				},
				{
					"attribute":"relType_S2S",
					"input_type":"select",
					"input_values":["integration","aggregation"]
				},
				{
					"attribute":"relType_S2D",
					"input_type":"select",
					"input_values":["aggregation"]
				},
				{
					"attribute":"relType_S2C",
					"input_type":"select",
					"input_values":["aggregation"]
				},
				{
					"attribute":"relType_D2D",
					"input_type":"select",
					"input_values":["aggregation"]
				},
				{
					"attribute":"relType_D2A",
					"input_type":"select",
					"input_values":["signal"]
				},
				{
					"attribute":"relType_D2C",
					"input_type":"select",
					"input_values":["aggregation","wired", "wireless"]
				},
				{
					"attribute":"relType_D2N",
					"input_type":"select",
					"input_values":["wired", "wireless"]
				},
				{
					"attribute":"relType_C2A",
					"input_type":"select",
					"input_values":["signal"]
				},
				{
					"attribute":"relType_C2N",
					"input_type":"select",
					"input_values":["wired", "wireless"]
				},
				{
					"attribute":"relType_C2C",
					"input_type":"select",
					"input_values":["wired", "wireless"]
				},
				{
					"attribute":"relType_R2R",
					"input_type":"select",
					"input_values":["resourcelink"]
				},
				{
					"attribute":"relType_A2R",
					"input_type":"select",
					"input_values":["resourcelink"]
				},
				{
					"attribute":"relType_SS2D",
					"input_type":"select",
					"input_values":["dataIn"]
				},
				{
					"attribute":"relType_SS2C",
					"input_type":"select",
					"input_values":["dataIn"]
				},
				{
					"attribute":"relType_SS2A",
					"input_type":"select",
					"input_values":["aggregation"]
				},
				{
					"attribute":"relType_SS2R",
					"input_type":"select",
					"input_values":["aggregation"]
				},
				{
					"attribute":"relType_R2R",
					"input_type":"select",
					"input_values":["aggregation"]
				},
				{
					"attribute":"relType_N2N",
					"input_type":"select",
					"input_values":["link"]
				},
				{
					"attribute":"relType",
					"input_type":"select",
					"input_values":["links","aggregation","signal","resourcelink", "actuatorsignal", "actionlink", "sensorlink"]
				}
			]
		}
		return styles;
	}


	function adapArchitectureCustomMethods(pos){
		let methods = []
		methods[0] = function(){
			let select = document.getElementById('select-moduleType');
			let overlayRigth = null;
			switch (select.value) {
				case "Parallel":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/paralelo.png', 16, 16), 'Overlay tooltip');
					break;
				case "Secuential":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/secuencial.png', 16, 16), 'Overlay tooltip');
					break;
				case "Ad-Hoc":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/adHoc.png', 16, 16), 'Overlay tooltip');
					break;
				default:
					overlayRigth = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
					break;
			}

			//Coloco la imagen de la izquierda
			overlayRigth.align = mxConstants.ALIGN_RIGTH;
			overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayRigth.offset = new mxPoint(-10,10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/moduleFrame.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayFrame.offset = new mxPoint(10,10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};
		methods[1]=function(){
			let select = document.getElementById('select-deviceType');
			let overlayRigth = null;
			switch (select.value) {
				case "Cloud Computer":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloudComputer.png', 16, 16), 'Overlay tooltip');
					break;
				case "Local Computer":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/localComputer.png', 16, 16), 'Overlay tooltip');
					break;
				case "Firmware":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/firmware.png', 16, 16), 'Overlay tooltip');
					break;
				case "Electric":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/electric.png', 16, 16), 'Overlay tooltip');
					break;
				case "Electronic":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/electronic.png', 16, 16), 'Overlay tooltip');
					break;
				default:
					overlayRigth = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
					break;
			}

			//Coloco la imagen de la izquierda
			overlayRigth.align = mxConstants.ALIGN_RIGTH;
			overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayRigth.offset = new mxPoint(-10,10);
	
			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/devices.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayFrame.offset = new mxPoint(10,10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};	

		methods[2]=function(){
			let select = document.getElementById('select-softwareType');
			let selectOption = select.value;
			let overlayRigth =  null;
			switch (selectOption) {
				case "OPSystem":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/os.png', 16, 16), 'Overlay tooltip');
					break;
				case "Midleware":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/midleware.png', 16, 16), 'Overlay tooltip');
					break;
				case "Database":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/db.png', 16, 16), 'Overlay tooltip');
					break;
				case "AppWeb":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appWeb.png', 16, 16), 'Overlay tooltip');
					break;
				case "AppMovil":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appMovil.png', 16, 16), 'Overlay tooltip');
					break;
				case "AppStandalone":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appStandalone.png', 16, 16), 'Overlay tooltip');
					break;
				case "Embedded":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/embeded.png', 16, 16), 'Overlay tooltip');
					break;
				case "Appi":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appAppi.png', 16, 16), 'Overlay tooltip');
					break;
				case "Services":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/webServices.png', 16, 16), 'Overlay tooltip');
					break;
				default:
					overlayRigth = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
					break;
			}

			//Coloco la imagen de la izquierda
			overlayRigth.align = mxConstants.ALIGN_RIGTH;
			overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayRigth.offset = new mxPoint(-10,10);

			let overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/software.png', 16, 16), 'Overlay tooltip');
			overlayLeft.align = mxConstants.ALIGN_LEFT;
			overlayLeft.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayLeft.offset = new mxPoint(10,10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);

			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayLeft);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
		};
		methods[3]=function(){
			let select = document.getElementById('select-sensorType');
			let overlayRigth = null;
			switch (select.value) {
				case "Digital":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/digital.png', 16, 16), 'Overlay tooltip');
					break;
				case "Analog":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/analog.png', 16, 16), 'Overlay tooltip');
					break;

				default:
					overlayRigth = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
					break;
			}

			//Coloco la imagen de la izquierda
			overlayRigth.align = mxConstants.ALIGN_RIGTH;
			overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayRigth.offset = new mxPoint(-10,10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/sensor.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayFrame.offset = new mxPoint(10,10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);	  
		};
		methods[4] = function(){
			let select = document.getElementById('select-resourceType');
			let overlayRigth = null;
			switch (select.value) {
				case "Cyber":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cyber.png', 16, 16), 'Overlay tooltip');
					break;
				case "Physical":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/physical.png', 16, 16), 'Overlay tooltip');
					break;

				default:
					overlayRigth = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
					break;
			}

			//Coloco la imagen de la derecha
			overlayRigth.align = mxConstants.ALIGN_RIGTH;
			overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayRigth.offset = new mxPoint(-10,10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/resource.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayFrame.offset = new mxPoint(10,10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};
		methods[5] = function(){
			let select = document.getElementById('select-redType');
			let overlayRigth = null;
			switch (select.value) {
				case "Internet":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
					break;
				case "IoT":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/iot.png', 16, 16), 'Overlay tooltip');
					break;
				case "Wan":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/wan.png', 16, 16), 'Overlay tooltip');
					break;
				case "Lan":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/lan.png', 16, 16), 'Overlay tooltip');
					break;

				default:
					overlayRigth = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
					break;
			}

			//Coloco la imagen de la derecha
			overlayRigth.align = mxConstants.ALIGN_RIGTH;
			overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayRigth.offset = new mxPoint(-10,10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/network.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayFrame.offset = new mxPoint(10,10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};
		methods[6]=function(){
			let select = document.getElementById('select-computerType');
			let overlayRigth = null;
			switch (select.value) {
				case "Cloud Computer":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloudComputer.png', 16, 16), 'Overlay tooltip');
					break;
				case "Station Computer":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/localComputer.png', 16, 16), 'Overlay tooltip');
					break;
				case "Movil Computer":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/movil.png', 16, 16), 'Overlay tooltip');
					break;
				case "Embeded Computer":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/firmware.png', 16, 16), 'Overlay tooltip');
					break;
				case "Single Board Computer":
					graph.removeCellOverlay(graph.getModel().getCell(this.name));
					overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/singleBoard.png', 16, 16), 'Overlay tooltip');
					break;

				default:
					//overlayRigth = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
					break;
			}

			//Coloco la imagen de la derecha
			overlayRigth.align = mxConstants.ALIGN_RIGTH;
			overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayRigth.offset = new mxPoint(-10,10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/computer.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;	
			overlayFrame.offset = new mxPoint(10,10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
	
		};
		return methods[pos];
	}

	function adapArchitectureRelationStyles(){
		let style_rel_ppl = "whiteSpace = wrap;aspect = fixed;fontFamily = Helvetica;fontSize = 8;fillColor = #000080;strokeColor = #000000;strokeWidth = 1;gradientColor = #c8e6c9;";
		//let style_rel_add = "edgeStyle=elbowEdgeStyle;elbow=vertical;orthogonal=1;curved=0;" ;	
		let style_rel_add = "edgeStyle=segmentEdgeStyle;elbow=vertical;orthogonal=1;segment=50;curved=0;" ;	
		//let style_rel_add = "edgeStyle=orthogonalEdgeStyle;elbow=vertical;orthogonal=1;segment=50;curved=1;" ;	
		
		let relations = [];
		relations[0] = {
			"source":["layer"],
			"rel_source_target":"and",
			"target":["layer"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[1] = {
			"source":["module"],
			"rel_source_target":"and",
			"target":["module"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[0] = {
			"source":["package"],
			"rel_source_target":"and",
			"target":["package"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[2] = {
			"source":["device"],
			"rel_source_target":"and",
			"target":["actuator","device","computer", "network"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[3] = {
			"source":["software"],
			"rel_source_target":"and",
			"target":["software","device", "computer"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[4] = {
			"source":["sensor"],
			"rel_source_target":"and",
			"target":["device","computer", "resource"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[5] = {
			"source":["actuator"],
			"rel_source_target":"and",
			"target":["device","computer", "resource"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[6] = {
			"source":["resource"],
			"rel_source_target":"and",
			"target":["resource"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[7] = {
			"source":["computer"],
			"rel_source_target":"and",
			"target":["actuator", "network"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[8] = {
			"source":["network"],
			"rel_source_target":"and",
			"target":["network"],
			"style": style_rel_add + style_rel_ppl
		}
		return relations;
	}

	function actorboundary(){

		const uuidv1 = require('uuid/v1');
		//this.name points to the id of the cell that contains the element.  
		const currentCell = graph.getModel().getCell(this.name);

		let used = true;

		//console.log(currentCell);
		const parent = currentCell.getParent();
	
		let checked = currentCell.getAttribute('boundary');
		checked = checked === 'true' ? 'false' : 'true';

		if((counter%2) == 0){
			if(counter == 100){
				counter = 0
			}
			oldwith = currentCell.geometry.width;
			oldheigh = currentCell.geometry.height;
			counter = counter+ 1;
		}
		else if(checked){
			counter = counter+1;
		}
	
		currentCell.setAttribute('boundary', checked);
		graph.getModel().beginUpdate();

		try {
			if (checked === 'true') {
				const boundaryCell = graph.insertVertex(parent, uuidv1(), '', currentCell.getGeometry().x, currentCell.getGeometry().y, 100, 100, 'shape = rectangle;fillColor = none;arcSize = 15;');
				boundaryCell.setConnectable(false);
				boundaryCell.setValue({'type':'boundary'});
				graph.groupCells(boundaryCell, 0, [currentCell]);
				const geo = currentCell.getGeometry();
				geo.x = 0;
				geo.y = 0;
				graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [currentCell])
				//Set the size of the boundary.
				let boundaryH = 200;
				let boundaryW = 300;
				//If the boundary was already set before, set it to the old limits.
				if(currentCell.boundarySize !== undefined){
					boundaryH = currentCell.boundarySize.height;
					boundaryW = currentCell.boundarySize.width;
					delete currentCell.boundarySize;
				}
				//Apply the changes. The bounds indicate the absolute shape of the cell.
				const bounds = new mxRectangle(boundaryCell.getGeometry().x, boundaryCell.getGeometry().y, boundaryW, boundaryH);
				graph.resizeCell(boundaryCell, bounds);
				//Find any edges that were promoted and remove them.
				const edgeCount = currentCell.getEdgeCount();
				const promotedEdges = [];
				if (edgeCount > 0){
					for(let i = 0; i < edgeCount; i++){
						const edge = currentCell.getEdgeAt(i);
						if(edge.promotedEdge !== undefined && edge.promotedEdge){
							promotedEdges.push(edge);
						}
					}
				}
				//Remove the edges that were promoted.
				graph.removeCells(promotedEdges);
				//If there were elements that existed previously, reconstruct them.
				const newCells = new Map;
				if(currentCell.elements !== undefined){
					//key is the id of the old cell
					//value contains the cell.
					for(let [key, value] of currentCell.elements){
						const cells = graph.importCells([value], 0,0, boundaryCell);
						//This ties the old cell's id to the new one's so that the relations can be reconstructed.
						newCells.set(key, cells[0].getId());
						//graph.insertVertex(boundaryCell, null, child.getValue(), childGeo.x, childGeo.y, childGeo.width, childGeo.height, child.getStyle());
					}
					delete currentCell.elements;
				}
				const done = [];
				const boundaryGeo = boundaryCell.getGeometry();
				if(currentCell.relations !== undefined){
				for(let [key, value] of currentCell.relations){
					//Within value is every edge coming or going from the <<old>> cell given by key.
					value.forEach(edge => {
					//For both the terminals, check if the reference is one of the cells that are destroyed, otherwise it is the normal one.
					const sourceCell = graph.getModel().getCell(newCells.has(edge.source) ? newCells.get(edge.source) : edge.source);
					const srcId = sourceCell.getId();
					const targetCell = graph.getModel().getCell(newCells.has(edge.target) ? newCells.get(edge.target) : edge.target);
					const tgtId = targetCell.getId();
					//If the relation was already added, skip all of the code to add it.
					if(!done.some(pair => {
						return (pair.t1 === srcId && pair.t2 === tgtId) || (pair.t1 === tgtId && pair.t2 === tgtId);
					})){
						const newEdge = graph.insertEdge(boundaryCell, uuidv1(), edge.value, sourceCell, targetCell, edge.style);
						if(newEdge.getAttribute('type').includes('dependum')){
						//Gather the state information of both the source and target elements.
						const sourceState = graph.view.getState(sourceCell);
						const sourceGeo = sourceCell.getGeometry();
						const targetState = graph.view.getState(targetCell);
						const targetGeo = targetCell.getGeometry();

						//Obtain the coordinates and offset to the center of the bounding rectangle.
						//If the state is undefined, it is because it has just been created.
						const initX = sourceState !== undefined ? (sourceState.origin.x + (sourceGeo.width/2)) : (boundaryGeo.x + sourceGeo.getCenterX());
						const initY = sourceState !== undefined ? (sourceState.origin.y + (sourceGeo.height/2)) : (boundaryGeo.y + sourceGeo.getCenterY());
						const destX = targetState !== undefined ? (targetState.origin.x + (targetGeo.width/2)) : (boundaryGeo.x + targetGeo.getCenterX());
						const destY = targetState !== undefined ? (targetState.origin.y + (targetGeo.height/2)) : (boundaryGeo.y + targetGeo.getCenterY());
						//Calculate the angle given by the edge in its current orientation.
						const angle = (Math.atan2(destY-initY,destX-initX) * (180/Math.PI)).toFixed(0);
						//Insert a new element onto the the edge with the calculated angle.
						const capitald = graph.insertVertex(newEdge,uuidv1(),null,0,0,20,20,'shape =  capitald; fillColor =  #000080;rotation =  '+angle+';');
						//Set the offset of the element so that it is centered. 
						capitald.geometry.offset = new mxPoint(-10, -10);
						capitald.geometry.relative = true;
						//Set the element as unconnectable.
						capitald.connectable = false;
						}
						done.push({t1:sourceCell.getId(),t2:targetCell.getId()});
					}
					})
				}
				}
				currentCell.geometry.width = boundaryCell.geometry.width;
				currentCell.geometry.height = 20;	
			} else {
				//get the references to the boundary cell and the main graph.
				//console.log(parent)
				const boundaryCell = parent;
				const mainparent = boundaryCell.getParent();
				const innerElementCount = boundaryCell.getChildCount();
				const innerElements = new Map;
				const relations = new Map;
				//get the position information from the parent (and its references)
				const parentGeo = boundaryCell.getGeometry();
				const currentGeo = currentCell.getGeometry();
				//There are other elements inside
				//get their references.
				if(innerElementCount > 1){
					for(let i = 0; i < innerElementCount; i++){
						const child = boundaryCell.getChildAt(i);
						if(child !== currentCell && !child.isEdge()){
						//With this logic, we obtain the important values of these edges,
						//then we store the information in an array.
						const edgeCount = child.getEdgeCount();
						const innerEdges = [];
						if (edgeCount > 0){
							for(let i = 0; i < edgeCount; i++){
							const edge = child.getEdgeAt(i);
							const value = edge.getValue();
							const source = edge.getTerminal(true).getId();
							const isSource = source === child.getId();
							const target = edge.getTerminal(false).getId();
							const style = edge.getStyle();
							innerEdges.push({value, isSource, source, target, style});
							}
						}
						//Now we map every id to its corresponding cell and edges so that we can reconstruct it later.
						innerElements.set(child.getId(), child.clone());
						relations.set(child.getId(),innerEdges);
						//innerElements.push({child: child.clone(), id: child.getId(), edges: innerEdges});
						}
					}
					//We will now do edge promotion based on what was calculated before.
					for(let [_key, value] of relations){
						//We will now iterate over the inner edges of every inner element.
						//If they contain external connections we will now add them to the actor cell.
						value.forEach(edge => {
						const terminal = edge.isSource ? edge.target : edge.source;
						//The only allowed external connections are done with dependums.
						if(!innerElements.has(terminal)){
							const sourceCell = edge.isSource ? currentCell : graph.getModel().getCell(edge.source);
							const targetCell = edge.isSource ? graph.getModel().getCell(edge.target) : currentCell;
							const newEdge = graph.insertEdge(mainparent, uuidv1(), edge.value, sourceCell, targetCell, edge.style);
							newEdge.promotedEdge = true;
							//Gather the state information of both the source and target elements.
							const sourceState = graph.view.getState(sourceCell);
							const targetState = graph.view.getState(targetCell);
							//Obtain the coordinates and offset to the center of the bounding rectangle.
							const initX = sourceState.x + (sourceState.width/2);
							const initY = sourceState.y + (sourceState.height/2);
							const destX = targetState.x + (targetState.width/2);
							const destY = targetState.y + (targetState.height/2);
							//Calculate the angle given by the edge in its current orientation.
							const angle = (Math.atan2(destY-initY,destX-initX) * (180/Math.PI)).toFixed(0);
							//Insert a new element onto the the edge with the calculated angle.
							const capitald = graph.insertVertex(newEdge,uuidv1(),null,0,0,20,20,'shape =  capitald;fillColor =  #000080;rotation =  '+angle+';');
							//Set the offset of the element so that it is centered. 
							capitald.geometry.offset = new mxPoint(-10, -10);
							capitald.geometry.relative = true;
							//Set the element as unconnectable.
							capitald.connectable = false;
						}
						})
					}
				}
		
				//We modify the actor cell to have the information of both its boundary cell and that of the inner elements.
				currentCell.elements = innerElements;
				currentCell.relations = relations;
				currentCell.boundarySize = {height: parentGeo.height, width: parentGeo.width};
		
				//These cells are fundamentally different to those that are returned by ungroupCells.
				//They retain their properties though. I suspect they are cloned from the first ones.
				const innerCells = graph.ungroupCells([boundaryCell]);
				//Remove the superfluous cells from the graph.
				innerCells.forEach(cell => {
				if(cell !== currentCell){
					graph.removeCells([cell]);
				}
				})
		
				//set the postion to the parent's old position
				currentGeo.x = parentGeo.x + 100;
				currentGeo.y = parentGeo.y + 100;
				//remove the cell from the hierarchy and then add it back to the model.
				//graph.ungroupCells([currentCell]);
				/* const innerCells = graph.ungroupCells([boundaryCell]); */
				//graph.removeCells([boundaryCell]);
				//graph.getModel().add(mainparent, currentCell);
				//Change the cell's properties so that it can move again.
				graph.setCellStyles(mxConstants.STYLE_MOVABLE, '1', [currentCell]);
				//Make it so the edges, and promoted edges, are all correctly aligned.
				reorientElement(null, {
				getProperty: function(_type){
					return [currentCell];
				}
				})

				currentCell.geometry.width = oldwith;
				currentCell.geometry.height = oldheigh;
			}
		} finally {
		//console.log(currentCell.getAttribute('boundary'))
		graph.getModel().endUpdate();
		}
	}
	
		/**
	 * This function reorients the "D" elements that exist as children of dependum edges. 
	 * @param {Object} _sender This is the graph that generated the event.
	 * @param {Object} evt This is the event itself, it contains all the parameters of the associated MOVED_CELLS event.
	 */
	function reorientElement(_sender, evt) {
		//Obtain the moved cells.
		const cells = evt.getProperty('cells');
		//For each and every moved cell we must reorient the dependum edges leading into, out of them.
		cells.forEach(cell => {
		//If the cell we moved turns out to be bounday cell
		//we must treat it differently and extract the elements within,
		//since the boundary itself is of no interest as it cannot be
		//connected to.
		const childCount = cell.getChildCount();
		//The elements array will either only contain the moved cell
		//or the inner elements of the boundary cell.
		let elements = [];
		if(childCount > 0){
			for(let i = 0; i < childCount; i++){
			const child = cell.getChildAt(i);
			elements.push(child);
			}
		} else {
			elements.push(cell);
		}
		
		elements.forEach(element => {
			//Check if the cell has any connections, otherwise ignore it.
			if(element.getEdgeCount() > 0){
			element.edges.forEach(edge => {
				//Check if the edge is a connection to a dependum element, otherwise ignore it.
				if(edge.getAttribute('type').includes('dependum') && edge.getChildCount() > 0){
				//These are the coordinates that will be used to calculate the angle to which
				//the marker will be rotated to. init for the source, dest for the target.
				let initX, initY, destX, destY;
				//Get the reference to the dependum marker, it is always the only child of the edge.
				let capitald = edge.getChildAt(0);
				//Get all the information for the source cell and its parent.
				const source = edge.getTerminal(true);
				const sourceGeo = source.getGeometry();
				const sourceParent = source.getParent();
				const sourceParentGeo = sourceParent.getGeometry();
				const sourceParentValue = sourceParent.getValue();
				//Check if the cell is inside a boudary.
				if(sourceParentValue !== undefined && sourceParentValue.type !== undefined && sourceParentValue.type  === 'boundary'){
					//If the cell is inside a boudary, its position is then given by the 
					//position of the boundary + its offset + the center of its bounding rectangle.
					//The state allows us to calculate the current size of the element and
					//thus we can obtain the center of the bounding rectangle.
					//const sourceStateShape = graph.view.getState(source);
					initX = sourceParentGeo.x + sourceGeo.x + (sourceGeo.width/2);
					initY = sourceParentGeo.y + sourceGeo.y + (sourceGeo.height/2);
				} else {
					//If the cell is outside a boundary, its position is given by its geometry.
					initX = sourceGeo.getCenterX();
					initY = sourceGeo.getCenterY();
				}
				//Get all the information for the target cell and its parent.
				const target = edge.getTerminal(false);
				const targetGeo = target.getGeometry();
				const targetParent = target.getParent();
				const targetParentGeo = targetParent.getGeometry();
				const targetParentValue = targetParent.getValue();
				//Check if the target cell is inside a boudary.
				if(targetParentValue !== undefined && targetParentValue.type !== undefined && targetParentValue.type  === 'boundary'){
					//Same as above...
					//const targetStateShape = graph.view.getState(target);
					destX = targetParentGeo.x + targetGeo.x + (targetGeo.width/2);
					destY = targetParentGeo.y + targetGeo.y + (targetGeo.height/2);
				} else {
					//Same as above...
					destX = targetGeo.getCenterX();
					destY = targetGeo.getCenterY();
				}
				/* console.log('dx :', dx);
				console.log('dy :', dy);
				console.log('initX :', initX);
				console.log('initY :', initY);
				console.log('destX :', destX);
				console.log('destY :', destY); */
				//Calculate the angle given by the line connecting the two points.
				const angle = (Math.atan2(destY-initY,destX-initX) * (180/Math.PI)).toFixed(0);
				/* console.log('angle :', angle); */
				//Set the style of the element within the edge to the calculated rotation.
				graph.setCellStyles(mxConstants.STYLE_ROTATION, angle, [capitald])
				}
			})
			}
		})
		})
	}

	function adapArchitectureOverlay(){
		let func1=function(){
			let adapArchitectureRoot = graph.getModel().getCell("adap_architecture");
			loadmodal(adapArchitectureRoot.children, graph);
		};
		return func1;
	}

	
	function loadmodal(adap, graph){
		if(adap){
			for (let i=0; i < adap.length; i++){
				if(adap[i]){
					if(adap[i].children){
						if(!adap[i].value.attributes){
							cargarAdap(adap[i], graph);
						}
					}
					else{
						cargarAdap(adap[i], graph);
					}
				}
			}
		}
	}


	function cargarAdap(adap, graph){

        let overlayLeft = null;
		let overlayRigth = null;

        if(adap.children){
			loadmodal(adap.children, graph);
        }
        else if(adap && adap.value){   
			switch (adap.value.attributes[1].value) {
				case "layer":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/layerFrame.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					break;
				case "module":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/moduleFrame.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					switch (adap.value.attributes[2].nodeValue) {
						case "Parallel":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/paralelo.png', 16, 16), 'Overlay tooltip');
							break;
						case "Secuential":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/secuencial.png', 16, 16), 'Overlay tooltip');
							break;
						case "Ad-Hoc":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/adHoc.png', 16, 16), 'Overlay tooltip');
							break;
						default:
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/paralelo.png', 16, 16), 'Overlay tooltip');	
							break;
					}
					break;
				case "package":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/package.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					break;
				case "device":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/devices.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					switch (adap.value.attributes[2].nodeValue) {
						case "Cloud Computer":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloudComputer.png', 16, 16), 'Overlay tooltip');
							break;
						case "Local Computer":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/localComputer.png', 16, 16), 'Overlay tooltip');
							break;
						case "Firmware":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/firmware.png', 16, 16), 'Overlay tooltip');
							break;
						case "Electric":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/electric.png', 16, 16), 'Overlay tooltip');
							break;
						case "Electronic":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/electronic.png', 16, 16), 'Overlay tooltip');
							break;
						default:
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloudComputer.png', 16, 16), 'Overlay tooltip');
							break;
					}
					break;
				case "software":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/software.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					switch (adap.value.attributes[2].nodeValue) {
						case "OPSystem":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/os.png', 16, 16), 'Overlay tooltip');
							break;
						case "Midleware":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/midleware.png', 16, 16), 'Overlay tooltip');
							break;
						case "Database":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/db.png', 16, 16), 'Overlay tooltip');
							break;
						case "AppWeb":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appWeb.png', 16, 16), 'Overlay tooltip');
							break;
						case "AppMovil":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appmovil.png', 16, 16), 'Overlay tooltip');
							break;
						case "AppStandalone":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appStandalone.png', 16, 16), 'Overlay tooltip');
							break;
						case "Embedded":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/embeded.png', 16, 16), 'Overlay tooltip');
							break;
						case "Appi":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/appAppi.png', 16, 16), 'Overlay tooltip');
							break;
						case "Services":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/webServices.png', 16, 16), 'Overlay tooltip');
							break;
						default:
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/os.png', 16, 16), 'Overlay tooltip');
							break;
						}

					break;
				case "sensor":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/sensor.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					switch (adap.value.attributes[2].nodeValue) {
						case "Digital":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/digital.png', 16, 16), 'Overlay tooltip');
							break;
						case "Analog":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/analog.png', 16, 16), 'Overlay tooltip');
							break;
		
						default:
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/digital.png', 16, 16), 'Overlay tooltip');
							break;
					}
					break;
				case "actuator":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/actuator.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					break;
				case "resource":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/resource.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					switch (adap.value.attributes[2].nodeValue) {
						case "Cyber":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cyber.png', 16, 16), 'Overlay tooltip');
							break;
						case "Physical":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/physical.png', 16, 16), 'Overlay tooltip');
							break;

						default:
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cyber.png', 16, 16), 'Overlay tooltip');
							break;
					}
					break;
				case "network":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/network.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					switch (adap.value.attributes[2].nodeValue) {
						case "Internet":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
							break;
						case "IoT":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/iot.png', 16, 16), 'Overlay tooltip');
							break;
						case "Wan":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/wan.png', 16, 16), 'Overlay tooltip');
							break;
						case "Lan":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
							break;
						default:
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
							break;
					}
					break;
				case "computer":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/computer.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10,10);
					switch (adap.value.attributes[2].nodeValue) {
						case "Cloud Computer":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloudComputer.png', 16, 16), 'Overlay tooltip');
							break;
						case "Station Computer":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/localComputer.png', 16, 16), 'Overlay tooltip');
							break;
						case "Movil Computer":
							graph.removeCellOverlay(graph.getModel().getCell(this.name));
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/movil.png', 16, 16), 'Overlay tooltip');
							break;
						case "Embeded Computer":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/firmware.png', 16, 16), 'Overlay tooltip');
							break;
						case "Single Board Computer":
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/singleBoard.png', 16, 16), 'Overlay tooltip');
							break;
						default:
							overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloudComputer.png', 16, 16), 'Overlay tooltip');
							break;
					}
					break;
				default:
					break;
			}	
			if (overlayRigth != null){
				overlayRigth.align = mxConstants.ALIGN_RIGTH;
				overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
				overlayRigth.offset = new mxPoint(-10,10);
				graph.addCellOverlay(adap, overlayRigth);
			}
			if (overlayLeft != null){
				overlayLeft.align = mxConstants.ALIGN_LEFT;
				overlayLeft.verticalAlign = mxConstants.ALIGN_TOP;	
				graph.addCellOverlay(adap, overlayLeft);
			} 

    	}

	}

	/*function adapArchitectureClonCells(){
		let clons = {};
		clons = {
			"module":"dinamic_adap_architecture"
		};
		return clons;
	}*/
}

export default adapArchitectureMain
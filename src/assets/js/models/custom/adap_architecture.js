let adapArchitectureMain = function adapArchitectureMain(graph) {
	let counter = 0;
	let oldwith = 100;
	let oldheigh = 40;

	adapArchitectureConstraints(graph);
	let data = [];
	data['m_type'] = "normal" //custom type
	data["m_elements"] = adapArchitectureElements(); //custom elements
	data["m_attributes"] = adapArchitectureAttributes(); //custom attributes
	data["m_relations"] = adapArchitectureRelations(); //custom relations
	data["m_relation_styles"] = adapArchitectureRelationStyles();
	data["m_properties_styles"] = adapArchitecturePropertiesStyles(); //custom properties styles
	data["m_overlay"] = adapArchitectureOverlay();
	return data;
	function adapArchitectureElements() {

		let paths = projectPath + "images/models/adap_architecture/";
		let layer = { src: paths + "layer.png", wd: 100, hg: 40, style: "", type: "layer", pname: "Layer" };
		let modul = { src: paths + "module.png", wd: 100, hg: 40, style: "", type: "module", pname: "Module" };
		let packag = { src: paths + "package.png", wd: 100, hg: 40, style: "", type: "package", pname: "Package" };
		let device = { src: paths + "device.png", wd: 100, hg: 40, style: "", type: "device", pname: "Device" };
		let software = { src: paths + "software.png", wd: 100, hg: 40, style: "", type: "software", pname: "Software" };
		let sensor = { src: paths + "sensor.png", wd: 100, hg: 40, style: "", type: "sensor", pname: "Sensor" };
		let actuator = { src: paths + "actuator.png", wd: 100, hg: 40, style: "", type: "actuator", pname: "Actuator" };
		let network = { src: paths + "network.png", wd: 100, hg: 40, style: "", type: "network", pname: "Network" };
		let computer = { src: paths + "computer.png", wd: 100, hg: 40, style: "", type: "computer", pname: "Computer" };
		let resource = { src: paths + "resource.png", wd: 100, hg: 40, style: "", type: "resource", pname: "Resource" };
		let b_variable = { src: paths + "b_variable.png", wd: 100, hg: 40, style: "", type: "b_variable", pname: "Biology variable" };
		let p_variable = { src: paths + "p_variable.png", wd: 100, hg: 40, style: "", type: "p_variable", pname: "Physical Variable" };
		let e_variable = { src: paths + "e_variable.png", wd: 100, hg: 40, style: "", type: "e_variable", pname: "Environment Variable" };
		let port_in = { src: paths + "port_in.png", wd: 25, hg: 20, style: "", type: "port_in", pname: "Port In" };
		let port_out = { src: paths + "port_out.png", wd: 25, hg: 20, style: "", type: "port_out", pname: "Port Out" };
		let elements = [];

		elements[0] = layer;
		elements[1] = modul;
		elements[2] = packag;
		elements[3] = device;
		elements[4] = software;
		elements[5] = sensor;
		elements[6] = actuator;
		elements[7] = resource;
		elements[8] = network;
		elements[9] = computer;
		elements[10] = b_variable;
		elements[11] = p_variable;
		elements[12] = e_variable;
		elements[13] = port_in;
		elements[14] = port_out;						
		return elements;
	}

	function adapArchitectureAttributes() {
		let attributes = [];
		attributes[0] = {
			"types": ["layer"],
			"custom_attributes": [
				{
					"name": "layerType",
					"def_value": ""
				}]
		};		
		attributes[1] = {
			"types": ["device"],
			"custom_attributes": [
				{
					"name": "deviceType",
					"def_value": ""
				}]
		};
		attributes[2] = {
			"types": ["software"],
			"custom_attributes": [
				{
					"name": "softwareType",
					"def_value": ""
				}]
		};
		attributes[3] = {
			"types": ["module"],
			"custom_attributes": [
				{
					"name": "moduleType",
					"def_value": ""
				}  
			]
		};
		attributes[4] = {
			"types": ["sensor"],
			"custom_attributes": [
				{
					"name": "sensorType",
					"def_value": ""
				}]
		};
		attributes[5] = {
			"types": ["resource"],
			"custom_attributes": [
				{
					"name": "resourceType",
					"def_value": ""
				}]
		};
		attributes[6] = {
			"types": ["network"],
			"custom_attributes": [
				{
					"name": "redType",
					"def_value": ""
				}]
		};
		attributes[7] = {
			"types": ["computer"],
			"custom_attributes": [
				{
					"name": "computerType",
					"def_value": ""
				}]
		};
		attributes[8] = {
			"types": ["package"],
			"custom_attributes": [
				{
					"name": "packageType",
					"def_value": ""
				}]
		};
		attributes[9] = {
			"types": ["b_variable"],
			"custom_attributes": [
				{
					"name": "b_variableType",
					"def_value": ""
				}]
		};
		attributes[10] = {
			"types": ["p_variable"],
			"custom_attributes": [
				{
					"name": "p_variableType",
					"def_value": ""
				}]
		};
		attributes[11] = {
			"types": ["e_variable"],
			"custom_attributes": [
				{
					"name": "e_variableType",
					"def_value": ""
				}]
		};
		attributes[12] = {
			"types": ["port_in"],
			"custom_attributes": [
				{
					"name": "por_inType",
					"def_value": ""
				}]
		};
		attributes[13] = {
			"types": ["port_out"],
			"custom_attributes": [
				{
					"name": "por_outType",
					"def_value": ""
				}]
		};
		return attributes;
	}

	mxPrintPreview.prototype.printOverlays = true;
	function adapArchitectureConstraints(graph) {
		graph.multiplicities = []; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, 'layer', null, null, 1, 100, ['layer'],
			'Only 1 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'device', null, null, 1, 100, ['device', 'computer', 'actuator', 'network', 'port_in', 'port_out'],
			'Only 5 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'package', null, null, 1, 100, ['package'],
			'Only 2 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'module', null, null, 1, 100, ['module'],
			'Only 1 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'software', null, null, 1, 100, ['software', 'computer', 'device'],
			'Only 3 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'sensor', null, null, 1, 100, ['actuator', 'device', 'resource', 'port_in'],
			'Only 4 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'actuator', null, null, 1, 100, ['device', 'resource', 'port_in', 'port_out'],
			'Only 5 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'resource', null, null, 1, 100, ['resource'],
			'Only 1 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'computer', null, null, 1, 100, ['computer', 'network', 'port_in', 'port_out'],
			'Only 4 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'network', null, null, 1, 100, ['network'],
			'Only 1 targets allowed',
			'Invalid connection'));
		graph.multiplicities.push(new mxMultiplicity(
			true, 'b_variable', null, null, 1, 100, ['sensor'],
			'Only 1 targets allowed',
			'Invalid connection'));			
		graph.multiplicities.push(new mxMultiplicity(
			true, 'p_variable', null, null, 1, 100, ['sensor'],
			'Only 1 targets allowed',
			'Invalid connection'));			
		graph.multiplicities.push(new mxMultiplicity(
			true, 'e_variable', null, null, 1, 100, ['sensor'],
			'Only 1 targets allowed',
			'Invalid connection'));							
		graph.multiplicities.push(new mxMultiplicity(
			true, 'port_in', null, null, 1, 100, ['computer'],
			'Only 1 targets allowed',
			'Invalid connection'));	
		graph.multiplicities.push(new mxMultiplicity(
			true, 'port_out', null, null, 1, 100, ['actuator'],
			'Only 1 targets allowed',
			'Invalid connection'));	
		}

	function adapArchitectureRelations() {
		let relations = [];
		relations[0] = {
			"source": ["layer"],
			"rel_source_target": "and",
			"target": ["layer"],
			"attributes": [{
				"name": 'relType_L2L',
				"def_value": "link"
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[1] = {
			"source": ["package"],
			"rel_source_target": "and",
			"target": ["package"],
			"attributes": [{
				"name": 'relType_P2P',
				"def_value": "link"
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[2] = {
			"source": ["module"],
			"rel_source_target": "and",
			"target": ["module"],
			"attributes": [{
				"name": "relType_M2M",
				"def_value": "link"
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[3] = {
			"source": ["device"],
			"rel_source_target": "and",
			"target": ["computer"],
			"attributes": [{
				"name": "relType_D2C",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[4] = {
			"source": ["device"],
			"rel_source_target": "and",
			"target": ["actuator"],
			"attributes": [{
				"name": "relType_D2A",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[5] = {
			"source": ["device"],
			"rel_source_target": "and",
			"target": ["device"],
			"attributes": [{
				"name": "relType_D2D",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[6] = {
			"source": ["device"],
			"rel_source_target": "and",
			"target": ["network"],
			"attributes": [{
				"name": "relType_D2N",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		
		relations[7] = {
			"source": ["computer"],
			"rel_source_target": "and",
			"target": ["actuator"],
			"attributes": [{
				"name": "relType_C2A",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		} 
		relations[8] = {
			"source": ["computer"],
			"rel_source_target": "and",
			"target": ["computer"],
			"attributes": [{
				"name": "relType_C2C",
				"def_value": "1"
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[9] = {
			"source": ["computer"],
			"rel_source_target": "and",
			"target": ["network"],
			"attributes": [{
				"name": "relType_C2N",
				"def_value": "1"
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[10] = {
			"source": ["software"],
			"rel_source_target": "and",
			"target": ["software"],
			"attributes": [{
				"name": "relType_S2S",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[11] = {
			"source": ["software"],
			"rel_source_target": "and",
			"target": ["device"],
			"attributes": [{
				"name": "relType_S2D",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[12] = {
			"source": ["software"],
			"rel_source_target": "and",
			"target": ["computer"],
			"attributes": [{
				"name": "relType_S2C",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[13] = {
			"source": ["sensor"],
			"rel_source_target": "and",
			"target": ["device"],
			"attributes": [{
				"name": "relType_SS2D",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[14] = {
			"source": ["sensor"],
			"rel_source_target": "and",
			"target": ["actuator"],
			"attributes": [{
				"name": "relType_SS2A",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[15] = {
			"source": ["sensor"],
			"rel_source_target": "and",
			"target": ["computer"],
			"attributes": [{
				"name": "relType_SS2C",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[16] = {
			"source": ["sensor"],
			"rel_source_target": "and",
			"target": ["resource"],
			"attributes": [{
				"name": "relType_SS2R",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[17] = {
			"source": ["actuator"],
			"rel_source_target": "and",
			"target": ["device"],
			"attributes": [{
				"name": "relType_SS2D",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[18] = {
			"source": ["actuator"],
			"rel_source_target": "and",
			"target": ["computer"],
			"attributes": [{
				"name": "relType_SS2C",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[19] = {
			"source": ["actuator"],
			"rel_source_target": "and",
			"target": ["resource"],
			"attributes": [{
				"name": "relType_SS2R",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[20] = {
			"source": ["network"],
			"rel_source_target": "and",
			"target": ["network"],
			"attributes": [{
				"name": "relType_N2N",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[21] = {
			"source": ["resource"],
			"rel_source_target": "and",
			"target": ["resource"],
			"attributes": [{
				"name": "relType_R2R",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[22] = {
			"source": ["b_variable"],
			"rel_source_target": "and",
			"target": ["sensor"],
			"attributes": [{
				"name": "relType_BV2SS",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[23] = {
			"source": ["e_variable"],
			"rel_source_target": "and",
			"target": ["sensor"],
			"attributes": [{
				"name": "relType_EV2SS",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[24] = {
			"source": ["p_variable"],
			"rel_source_target": "and",
			"target": ["sensor"],
			"attributes": [{
				"name": "relType_PV2SS",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[25] = {
			"source": ["sensor"],
			"rel_source_target": "and",
			"target": ["port_in"],
			"attributes": [{
				"name": "relType_SS2PI",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[26] = {
			"source": ["computer"],
			"rel_source_target": "and",
			"target": ["port_out"],
			"attributes": [{
				"name": "relType_CP2PO",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[27] = {
			"source": ["port_in"],
			"rel_source_target": "and",
			"target": ["computer"],
			"attributes": [{
				"name": "relType_PI2CP",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[28] = {
			"source": ["device"],
			"rel_source_target": "and",
			"target": ["port_out"],
			"attributes": [{
				"name": "relType_DV2PO",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[29] = {
			"source": ["port_in"],
			"rel_source_target": "and",
			"target": ["device"],
			"attributes": [{
				"name": "relType_PI2DV",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[30] = {
			"source": ["actuator"],
			"rel_source_target": "and",
			"target": ["port_in"],
			"attributes": [{
				"name": "relType_AC2PI",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		relations[31] = {
			"source": ["port_out"],
			"rel_source_target": "and",
			"target": ["actuator"],
			"attributes": [{
				"name": "relType_PO2AC",
				"def_value": ""
			},
			{
				"name": "sourceCardinality",
				"def_value": "1"
			},
			{
				"name": "destinationCardinality",
				"def_value": "1"
			}]
		}
		return relations;
	}

	function adapArchitecturePropertiesStyles() {
		let styles = {};
		styles = {
			"module": [
				{
					"name": "moduleType",
					"attribute": "moduleType",
					"input_type": "select",
					"input_values": ["Parallel", "Secuential", "Ad-Hoc"],
					"onchange": adapArchitectureCustomMethods(0)
				 } 
			],
			"device": [
				{
					"name": "deviceType",
					"attribute": "deviceType",
					"input_type": "select",
					"input_values": ["Electric", "Electronic"],
					"onchange": adapArchitectureCustomMethods(1)
				}
			],
			"software": [
				{
					"name": "softwareType",
					"attribute": "softwareType",
					"input_type": "select",
					"input_values": ["OPSystem", "Midleware", "Database", "AppWeb", "AppMovil", "AppStandalone", "Embedded", "Appi", "Services"],
					"onchange": adapArchitectureCustomMethods(2)
				}
			],
			"sensor": [
				{
					"name": "sensorType",
					"attribute": "sensorType",
					"input_type": "select",
					"input_values": ["Digital", "Analog"],
					"onchange": adapArchitectureCustomMethods(3)
				}
			],
			"resource": [
				{
					"name": "resourceType",
					"attribute": "resourceType",
					"input_type": "select",
					"input_values": ["Cyber", "Physical"],
					"onchange": adapArchitectureCustomMethods(4)
				}
			],
			"network": [
				{
					"name": "redType",
					"attribute": "redType",
					"input_type": "select",
					"input_values": ["Internet", "IoT", "Lan", "Wan"],
					"onchange": adapArchitectureCustomMethods(5)
				}
			],
			"computer": [
				{
					"name": "computerType",
					"attribute": "computerType",
					"input_type": "select",
					"input_values": ["Cloud Computer", "Movil Computer", "Station Computer", "Embeded Computer", "Single Board Computer"],
					"onchange": adapArchitectureCustomMethods(6)
				}
			],
			"e_variable": [
				{
					"name": "e_variableType",
					"attribute": "e_variableType",
					"input_type": "select",
					"input_values": ["temperatury", "humidity", "pressure", "wind speed", "oxigen level", "CO2 level", "brightness", "UV radiation", "seismicity"],
					"onchange": adapArchitectureCustomMethods(7)
				}
			],
			"b_variable": [
				{
					"name": "b_variableType",
					"attribute": "b_variableType",
					"input_type": "select",
					"input_values": ["body mass index", "blood group", "body temperature", "blood glucose level", "blood pressure", "heart rate"],
					"onchange": adapArchitectureCustomMethods(8)
				}
			],
			"p_variable": [
				{
					"name": "p_variableType",
					"attribute": "p_variableType",
					"input_type": "select",
					"input_values": ["aceleration", "distance", "force", "acceleration due to gravity", "Impulse", "kinetic energy","mass","momentum","speed","time","change in time","velocity","work","displacement"],
					"onchange": adapArchitectureCustomMethods(9)
				}
			],							
			"relation": [
				{
					"attribute": "sourceCardinality",
					"input_type": "text",
					"input_text_type": "label"
				},
				{
					"attribute": "destinationCardinality",
					"input_type": "text",
					"input_text_type": "label"
				},
				{
					"attribute": "relType_L2L",
					"input_type": "select",
					"input_values": ["links"]
				},
				{
					"attribute": "relType_P2P",
					"input_type": "select",
					"input_values": ["links"]
				},
				{
					"attribute": "relType_M2M",
					"input_type": "select",
					"input_values": ["links", "signal"]
				},
				{
					"attribute": "relType_S2S",
					"input_type": "select",
					"input_values": ["integration", "aggregation"]
				},
				{
					"attribute": "relType_S2D",
					"input_type": "select",
					"input_values": ["aggregation"]
				},
				{
					"attribute": "relType_S2C",
					"input_type": "select",
					"input_values": ["aggregation"]
				},
				{
					"attribute": "relType_D2D",
					"input_type": "select",
					"input_values": ["aggregation"]
				},
				{
					"attribute": "relType_D2A",
					"input_type": "select",
					"input_values": ["signal"]
				},
				{
					"attribute": "relType_D2C",
					"input_type": "select",
					"input_values": ["aggregation", "wired", "wireless"]
				},
				{
					"attribute": "relType_D2N",
					"input_type": "select",
					"input_values": ["wired", "wireless"]
				},
			/*	{
					"attribute": "relType_C2A",
					"input_type": "select",
					"input_values": ["signal"]
				},*/
				{
					"attribute": "relType_CO2PO",
					"input_type": "select",
					"input_values": ["signal"]
				},		
				{
					"attribute": "relType_PI2CO",
					"input_type": "select",
					"input_values": ["signal"]
				},								
				{
					"attribute": "relType_C2N",
					"input_type": "select",
					"input_values": ["wired", "wireless"]
				},
				{
					"attribute": "relType_C2C",
					"input_type": "select",
					"input_values": ["wired", "wireless"]
				},
				{
					"attribute": "relType_R2R",
					"input_type": "select",
					"input_values": ["resourcelink", "aggregation"]
				},
				{
					"attribute": "relType_A2R",
					"input_type": "select",
					"input_values": ["resourcelink"]
				},
				{
					"attribute": "relType_SS2D",
					"input_type": "select",
					"input_values": ["dataIn"]
				},
/*				{
					"attribute": "relType_SS2C",
					"input_type": "select",
					"input_values": ["dataIn"]
				},*/
				{
					"attribute": "relType_SS2PI",
					"input_type": "select",
					"input_values": ["dataIn"]
				},				
				{
					"attribute": "relType_SS2A",
					"input_type": "select",
					"input_values": ["aggregation"]
				},
				{
					"attribute": "relType_SS2R",
					"input_type": "select",
					"input_values": ["aggregation"]
				},
				/*{
					"attribute": "relType_SS2E",
					"input_type": "select",
					"input_values": ["perceive"]
				},*/
				{
					"attribute": "relType_BV2SS",
					"input_type": "select",
					"input_values": ["dataIn"]
				},
				{
					"attribute": "relType_EV2SS",
					"input_type": "select",
					"input_values": ["dataIn"]
				},		
				{
					"attribute": "relType_PV2SS",
					"input_type": "select",
					"input_values": ["dataIn"]
				},							
				{
					"attribute": "relType_N2N",
					"input_type": "select",
					"input_values": ["link"]
				},
				{
					"attribute": "relType_PO2AC",
					"input_type": "select",
					"input_values": ["signal"]
				},			
				{
					"attribute": "relType_AC2PI",
					"input_type": "select",
					"input_values": ["dataIn"]
				},				
				{
					"attribute": "relType_DV2PO",
					"input_type": "select",
					"input_values": ["signal"]
				},			
				{
					"attribute": "relType_PI2DV",
					"input_type": "select",
					"input_values": ["dataIn"]
				},										
				{
					"attribute": "relType",
					"input_type": "select",
					"input_values": ["links", "aggregation", "signal", "resourcelink", "actuatorsignal", "actionlink", "sensorlink"]
				},
				{
					"attribute": "relType_N2N",
					"input_type": "select",
					"input_values": ["link"]
				},

			]
		}
		return styles;
	}


	function adapArchitectureCustomMethods(pos) {
		let methods = []
		methods[0] = function () {
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
			overlayRigth.offset = new mxPoint(-10, 10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/module.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;
			overlayFrame.offset = new mxPoint(10, 10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};
		methods[1] = function () {
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
			overlayRigth.offset = new mxPoint(-10, 10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/device.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;
			overlayFrame.offset = new mxPoint(10, 10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};

		methods[2] = function () {
			let select = document.getElementById('select-softwareType');
			let selectOption = select.value;
			let overlayRigth = null;
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
			overlayRigth.offset = new mxPoint(-10, 10);

			let overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/software.png', 16, 16), 'Overlay tooltip');
			overlayLeft.align = mxConstants.ALIGN_LEFT;
			overlayLeft.verticalAlign = mxConstants.ALIGN_TOP;
			overlayLeft.offset = new mxPoint(10, 10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);

			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayLeft);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
		};
		methods[3] = function () {
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
			overlayRigth.offset = new mxPoint(-10, 10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/sensor.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;
			overlayFrame.offset = new mxPoint(10, 10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};
		methods[4] = function () {
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
			overlayRigth.offset = new mxPoint(-10, 10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/resource.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;
			overlayFrame.offset = new mxPoint(10, 10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};
		methods[5] = function () {
			let select = document.getElementById('select-networkType');
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
			overlayRigth.offset = new mxPoint(-10, 10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/network.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;
			overlayFrame.offset = new mxPoint(10, 10);

			//pintar en la parte de arriba
			graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [graph.getModel().getCell(this.name)]);
			graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_top, [graph.getModel().getCell(this.name)]);

			//agrego la imagen dentro de la celula en el overlay
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayRigth);
			graph.addCellOverlay(graph.getModel().getCell(this.name), overlayFrame);
		};
		methods[6] = function () {
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
			overlayRigth.offset = new mxPoint(-10, 10);

			//borde acomodable
			let overlayFrame = new mxCellOverlay(new mxImage('images/models/adap_architecture/computer.png', 16, 16), 'Overlay tooltip');

			//Coloco la borde a la izquierda
			overlayFrame.align = mxConstants.ALIGN_LEFT;
			overlayFrame.verticalAlign = mxConstants.ALIGN_TOP;
			overlayFrame.offset = new mxPoint(10, 10);

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

	function adapArchitectureRelationStyles() {
		let style_rel_ppl = "whiteSpace = wrap;aspect = fixed;fontFamily = Helvetica;fontSize = 8;fillColor = #000080;strokeColor = #000000;strokeWidth = 1;gradientColor = #c8e6c9;";
		//let style_rel_add = "edgeStyle=elbowEdgeStyle;elbow=vertical;orthogonal=1;curved=0;" ;	
		let style_rel_add = "edgeStyle=segmentEdgeStyle;elbow=vertical;orthogonal=1;segment=50;curved=0;";
		//let style_rel_add = "edgeStyle=orthogonalEdgeStyle;elbow=vertical;orthogonal=1;segment=50;curved=1;" ;	

		let relations = [];
		relations[0] = {
			"source": ["layer"],
			"rel_source_target": "and",
			"target": ["layer"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[1] = {
			"source": ["module"],
			"rel_source_target": "and",
			"target": ["module"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[2] = {
			"source": ["package"],
			"rel_source_target": "and",
			"target": ["package"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[3] = {
			"source": ["device"],
			"rel_source_target": "and",
			"target": ["actuator", "device", "computer", "network"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[4] = {
			"source": ["software"],
			"rel_source_target": "and",
			"target": ["software", "device", "computer"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[5] = {
			"source": ["sensor"],
			"rel_source_target": "and",
			"target": ["device", "computer", "resource", "port_in" ],
			"style": style_rel_add + style_rel_ppl
		}
		relations[6] = {
			"source": ["actuator"],
			"rel_source_target": "and",
			"target": ["device", "resource", "port_out"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[7] = {
			"source": ["resource"],
			"rel_source_target": "and",
			"target": ["resource"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[8] = {
			"source": ["computer"],
			"rel_source_target": "and",
			"target": ["network", "computer", "port_out"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[9] = {
			"source": ["network"],
			"rel_source_target": "and",
			"target": ["network"],
			"style": style_rel_add + style_rel_ppl
		}
		relations[9] = {
			"source": ["b_variable"],
			"rel_source_target": "and",
			"target": ["sensor"],
			"style": style_rel_add + style_rel_ppl
		}		
		relations[10] = {
			"source": ["e_variable"],
			"rel_source_target": "and",
			"target": ["sensor"],
			"style": style_rel_add + style_rel_ppl
		}	
		relations[10] = {
			"source": ["p_variable"],
			"rel_source_target": "and",
			"target": ["sensor"],
			"style": style_rel_add + style_rel_ppl
		}						
		return relations;
	}

/*
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
			if (childCount > 0) {
				for (let i = 0; i < childCount; i++) {
					const child = cell.getChildAt(i);
					elements.push(child);
				}
			} else {
				elements.push(cell);
			}

			elements.forEach(element => {
				//Check if the cell has any connections, otherwise ignore it.
				if (element.getEdgeCount() > 0) {
					element.edges.forEach(edge => {
						//Check if the edge is a connection to a dependum element, otherwise ignore it.
						if (edge.getAttribute('type').includes('dependum') && edge.getChildCount() > 0) {
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
							if (sourceParentValue !== undefined && sourceParentValue.type !== undefined && sourceParentValue.type === 'boundary') {
								//If the cell is inside a boudary, its position is then given by the 
								//position of the boundary + its offset + the center of its bounding rectangle.
								//The state allows us to calculate the current size of the element and
								//thus we can obtain the center of the bounding rectangle.
								//const sourceStateShape = graph.view.getState(source);
								initX = sourceParentGeo.x + sourceGeo.x + (sourceGeo.width / 2);
								initY = sourceParentGeo.y + sourceGeo.y + (sourceGeo.height / 2);
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
							if (targetParentValue !== undefined && targetParentValue.type !== undefined && targetParentValue.type === 'boundary') {
								//Same as above...
								//const targetStateShape = graph.view.getState(target);
								destX = targetParentGeo.x + targetGeo.x + (targetGeo.width / 2);
								destY = targetParentGeo.y + targetGeo.y + (targetGeo.height / 2);
							} else {
								//Same as above...
								destX = targetGeo.getCenterX();
								destY = targetGeo.getCenterY();
							}
							//Calculate the angle given by the line connecting the two points.
							const angle = (Math.atan2(destY - initY, destX - initX) * (180 / Math.PI)).toFixed(0);
							/* console.log('angle :', angle); */
							//Set the style of the element within the edge to the calculated rotation.
							graph.setCellStyles(mxConstants.STYLE_ROTATION, angle, [capitald])
						}
					})
				}
			})
		})
	}

	function adapArchitectureOverlay() {
		let func1 = function () {
			let adapArchitectureRoot = graph.getModel().getCell("adap_architecture");
			loadmodal(adapArchitectureRoot.children, graph);
		};
		return func1;
	}


	function loadmodal(adap, graph) {
		if (adap) {
			for (let i = 0; i < adap.length; i++) {
				if (adap[i]) {
					if (adap[i].children) {
						if (!adap[i].value.attributes) {
							cargarAdap(adap[i], graph);
						}
					}
					else {
						cargarAdap(adap[i], graph);
					}
				}
			}
		}
	}


	function cargarAdap(adap, graph) {

		let overlayLeft = null;
		let overlayRigth = null;

		if (adap.children) {
			loadmodal(adap.children, graph);
		}
		else if (adap && adap.value) {
			switch (adap.value.attributes[1].value) {
				case "layer":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/layer.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
					break;
				case "module":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/module.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
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
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/package.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
					break;
				case "device":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/devices.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
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
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/software.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
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
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/sensor.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
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
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/actuator.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
					break;
				case "resource":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/resource.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
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
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/network.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
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
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/computer.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
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
				case "b_variable":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/b_variable.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);
				case "p_variable":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/p_variable.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);	
				case "e_variable":
					graph.removeCellOverlay(adap);
					overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/e_variable.png', 16, 16), 'Overlay tooltip');
					overlayLeft.offset = new mxPoint(10, 10);										
					break;
				default:
					break;
			}
			if (overlayRigth != null) {
				overlayRigth.align = mxConstants.ALIGN_RIGTH;
				overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;
				overlayRigth.offset = new mxPoint(-10, 10);
				graph.addCellOverlay(adap, overlayRigth);
			}
			if (overlayLeft != null) {
				overlayLeft.align = mxConstants.ALIGN_LEFT;
				overlayLeft.verticalAlign = mxConstants.ALIGN_TOP;
				graph.addCellOverlay(adap, overlayLeft);
			}

		}

	}

}

export default adapArchitectureMain
let controlMain = function controlMain(graph)
{
    controlConstraints(graph);
    let data=[];
    data["m_type"]="normal"; //custom type
	data["m_elements"]=controlElements(); //custom elements
	data["m_attributes"]=controlAttributes(); //custom attributes
	data["m_relations"]=controlRelations(); //custom relations
    data["m_properties_styles"]=controlPropertiesStyles(); //custom properties styles
    data["m_labels"]=controlLabels(); //custom labels
  
	return data;
    
    function controlConstraints(graph){
        graph.multiplicities=[]; //reset multiplicities
        graph.multiplicities.push(new mxMultiplicity(
            true, 'outputSystem', null, null, 0, 0, null,
            'Measured output must have no outcoming edges',
            null));
        graph.multiplicities.push(new mxMultiplicity(
            false, 'setpoint', null, null, 0, 0, 'controlAction',
            'Setpoint must have no incoming edges ',
            null));
            // Target needs exactly one incoming connection from Source
		graph.multiplicities.push(new mxMultiplicity(
            false, 'controlAction', null, null, 1, 1, ['controller', 'summingPoint'],
            'Target Must Have 1 incoming connection ',
            'Target Must Connect From controller or summing point'));
        graph.multiplicities.push(new mxMultiplicity(
            false, 'branchpoint', null, null, 1, 1, ['controlAction','plant'],
            'Branchpoint Must Have 1 Target system',
            'Branchpoint Must Connect From Target system'));
            graph.multiplicities.push(new mxMultiplicity(
            true, 'setpoint', null, null, 1, 1, ['summingPoint'],
            'Setpoint system Must Have 1  summingPoint',
            'Setpoint system Must Connect to summingPoint'));                                      
    }

    function controlElements(){
        let  controller = {src:projectPath+"images/models/control/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"controller", pname:"Controller"};
        let  plant = {src:projectPath+"images/models/control/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"plant", pname:"Plant"};
        let  transducer = {src:projectPath+"images/models/control/transducer.png", wd:100, hg:40, style:"shape=transducer", type:"transducer", pname:"Sensor"};
        let  summingPoint   = {src:projectPath+"images/models/control/summing_point.PNG", wd:100, hg:40, style:"shape=ellipse", type:"summingPoint", pname:"Summing point"};
        let  setpoint   = {src:projectPath+"images/models/control/setpoint.png", wd:100, hg:40, style:"shape=setpoint", type:"setpoint", pname:"Setpoint "};
        let  outputSystem   = {src:projectPath+"images/models/control/measured-output.png", wd:100, hg:40, style:"shape=measured_output", type:"outputSystem", pname:"Process output "};
        let  branchpoint   = {src:projectPath+"images/models/control/bifurcation.png", wd:100, hg:40, style:"shape=rhombus", type:"branchpoint", pname:"Branchpoint"};
        let  filter = {src:projectPath+"images/models/control/filter.png", wd:100, hg:40, style:"shape=filter", type:"filter", pname:"Filter"};


        let elements=[];
        elements[0]=controller;
        elements[1]=summingPoint;
        elements[2]=transducer;
        elements[3]=setpoint;
        elements[4]=outputSystem;
        elements[5]=branchpoint;
        elements[6]=filter;  
        elements[7]=plant;       
        
        return elements;
    }

    function controlAttributes(){
        let attributes=[];
        attributes[0]={
            "types":["controller"],
            "custom_attributes":[{
                "name":"Proportional",
                "def_value":"0"
            },
            {
                "name":"Integral",
                "def_value":"0"
            },
            {
                "name":"Derivate",
                "def_value":"0"
            }]
        };
        attributes[1]={
            "types":["setpoint"],
            "custom_attributes":[{
                "name":"SetPoint",
                "def_value":"0"
            },
            {
                "name":"Time",
                "def_value":"0"
            },
            {
                "name":"Tm",
                "def_value":"100"
            }]
            
        };
        attributes[2]={
            "types":["transducer"],
            "custom_attributes":[{
                "name":"InitialPosition",
                "def_value":"0"
            }]
        };
        attributes[3]={
            "types":["summingPoint"],
            "custom_attributes":[{
                "name":"Direction",
                "def_value":"+/-",
            }]
        };
        attributes[4]={
            "types":["outputSystem"],
            "custom_attributes":[{
                "name":"CurrentOutput",
                "def_value":"0",
            }]
        };
        attributes[5]={
            "types":["filter"],
            "custom_attributes":[{
                "name":"FilterType",
                "def_value":"Average",
            }]
        };
        return attributes;
    }

    function controlRelations(){
		let relations=[];	
		return relations;
    }
    
    function controlPropertiesStyles(){
		let  styles={};
		styles={
			"summingPoint":[{
					"attribute":"Direction",
                    "input_type":"select",
					"input_values":["+/-","+/+","-/+","-/-"]
				}
            ],
            "filter":[
				{
					"attribute":"FilterType",
					"input_type":"select",
					"input_values":["Average","Recursive"],
				}
            ],
            "plant":[
				{
					"attribute":"Delay",
                    "input_type":"checkbox",
				}
			]
        }      
		return styles;
    }
    
    function controlLabels(){
		let labels={};
		labels={
            "summingPoint":"Direction",
            "branchpoint":"Direction",
		};
		return labels;
	}

}

export default controlMain
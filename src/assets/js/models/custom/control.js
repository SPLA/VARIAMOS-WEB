let control_main = function control_main(graph)
{
    control_constraints(graph);
    let data=[];
    data["m_type"]="normal"; //custom type
	data["m_elements"]=control_elements(); //custom elements
	data["m_attributes"]=control_attributes(); //custom attributes
	data["m_relations"]=control_relations(); //custom relations
    data["m_properties_styles"]=control_properties_styles(); //custom properties styles
    data["m_labels"]=control_labels(); //custom labels
  
	return data;
    
    function control_constraints(graph){
        graph.multiplicities=[]; //reset multiplicities
        graph.multiplicities.push(new mxMultiplicity(
            true, 'measured_output', null, null, 0, 0, null,
            'Measured output must have no outcoming edges',
            null));
        graph.multiplicities.push(new mxMultiplicity(
            false, 'set_point', null, null, 0, 0, 'plant',
            'Setpoint must have no incoming edges ',
            null));
            // Target needs exactly one incoming connection from Source
				graph.multiplicities.push(new mxMultiplicity(
                    false, 'plant', null, null, 1, 1, ['controller', 'summing_point'],
                    'Target Must Have 1 incoming connection ',
                    'Target Must Connect From controller or summing point'));
        graph.multiplicities.push(new mxMultiplicity(
            false, 'branchpoint', null, null, 1, 1, ['plant'],
            'Branchpoint Must Have 1 Target system',
            'Branchpoint Must Connect From Target system'));
            graph.multiplicities.push(new mxMultiplicity(
            true, 'set_point', null, null, 1, 1, ['summing_point'],
            'Setpoint system Must Have 1  summing_point',
            'Setpoint system Must Connect to summing_point'));     
                                    
    }

    function control_elements(){
        let  controller = {src:projectPath+"images/models/control/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"controller", pname:"Controller"};
        let  transducer = {src:projectPath+"images/models/control/transducer.png", wd:100, hg:40, style:"shape=transducer", type:"transducer", pname:"Transducer/Sensor"};
        let  summing_point   = {src:projectPath+"images/models/control/summing_point.PNG", wd:100, hg:40, style:"shape=ellipse", type:"summing_point", pname:"Summing point"};
        let  setpoint   = {src:projectPath+"images/models/control/setpoint.png", wd:100, hg:40, style:"shape=setpoint", type:"set_point", pname:"Setpoint "};
        let  measured_output   = {src:projectPath+"images/models/control/measured-output.png", wd:100, hg:40, style:"shape=measured_output", type:"measured_output", pname:"Measured output "};
        let  branchpoint   = {src:projectPath+"images/models/control/bifurcation.png", wd:100, hg:40, style:"shape=rhombus", type:"Branchpoint", pname:"Branchpoint"};
        let  filter = {src:projectPath+"images/models/control/filter.png", wd:100, hg:40, style:"shape=filter", type:"filter", pname:"Filter"};
        let  plant = {src:projectPath+"images/models/control/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"plant", pname:"Plant"};


        let elements=[];
        elements[0]=controller;
        elements[1]=summing_point;
        elements[2]=transducer;
        elements[3]=setpoint;
        elements[4]=measured_output;
        elements[5]=branchpoint;
        elements[6]=filter;   
        elements[7]=plant;       
        
        return elements;
    }

    function control_attributes(){
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
            "types":["set_point"],
            "custom_attributes":[{
                "name":"SetPoint",
                "def_value":"0"
            },
            {
                "name":"Time",
                "def_value":"0"
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
            "types":["summing_point"],
            "custom_attributes":[{
                "name":"Direction",
                "def_value":"+/-",
            }]
        };

        attributes[4]={
            "types":["measured_output"],
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

    function control_relations(){
		let relations=[];	
		return relations;
    }
    
    function control_properties_styles(){
		let  styles={};
		styles={
			"summing_point":[{
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
			]   	
        }      
		return styles;
    }
    
    function control_labels(){
		let labels={};
		labels={
            "summing_point":"Direction",
		};

		return labels;
	}


}

export default control_main
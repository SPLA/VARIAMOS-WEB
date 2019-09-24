let  control_main = function control_main(graph)
{
    control_constraints(graph);
    let  data=[];
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
            false, 'set_point', null, null, 0, 0, 'controlAction',
            'Setpoint must have no incoming edges ',
            null));
            // Target needs exactly one incoming connection from Source
				graph.multiplicities.push(new mxMultiplicity(
                    false, 'controlAction', null, null, 1, 1, ['controller', 'summing_point'],
                    'Target Must Have 1 incoming connection ',
                    'Target Must Connect From controller or summing point'));
        graph.multiplicities.push(new mxMultiplicity(
            false, 'branchpoint', null, null, 1, 1, ['controlAction'],
            'Branchpoint Must Have 1 Target system',
            'Branchpoint Must Connect From Target system'));
       /* graph.multiplicities.push(new mxMultiplicity(
            true, 'controlAction', null, null, 1, 1, ['branchpoint'],
            'Target system Must Have 1  branchpoint',
            'Target system Must Connect to branchpoint'));
            */
            graph.multiplicities.push(new mxMultiplicity(
            true, 'set_point', null, null, 1, 1, ['summing_point'],
            'Setpoint system Must Have 1  summing_point',
            'Setpoint system Must Connect to summing_point'));     
                                    
    }

    function control_elements(){
        let  controller = {src:projectPath+"images/models/control/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"controller", pname:"Controller"};
        let  target_system = {src:projectPath+"images/models/control/target_system.png", wd:100, hg:40, style:"shape=rectangle", type:"target_system", pname:"Target system"};
        let  transducer = {src:projectPath+"images/models/control/transducer.png", wd:100, hg:40, style:"shape=rectangle", type:"transducer", pname:"Transducer"};
        let  summing_point   = {src:projectPath+"images/models/control/summing_point.PNG", wd:100, hg:40, style:"shape=ellipse", type:"summing_point", pname:"Summing point"};
        let  reference_input   = {src:projectPath+"images/models/control/reference_input.png", wd:100, hg:40, style:"shape=reference_input", type:"set_point", pname:"Set point "};
        let  measured_output   = {src:projectPath+"images/models/control/measured-output.png", wd:100, hg:40, style:"shape=measured_ouput", type:"measured_output", pname:"Measured output "};
        let  branchpoint   = {src:projectPath+"images/models/control/bifurcation.png", wd:100, hg:40, style:"shape=rhombus", type:"branchpoint", pname:"Branchpoint"};
        let  filter = {src:projectPath+"images/models/control/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"filter", pname:"filter"};
        
        let  elements=[];
        elements[0]=controller;
        elements[1]=summing_point;
        elements[2]=target_system;
        elements[3]=transducer;
        elements[4]=reference_input;
        elements[5]=measured_output;
        elements[6]=branchpoint;
        elements[7]=filter;        
        
        return elements;
    }

    function control_attributes(){
        let  attributes=[];
        attributes[0]={
            "types":["controller"],
            "custom_attributes":[{
                "name":"Proportional",
                "def_value":"0.25"
        
            },
            {
                "name":"Integral",
                "def_value":"0.01"
            },
            {
                "name":"Derivate",
                "def_value":"0.4"
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
            "types":["target_system"],
            "custom_attributes":[]
        };

        attributes[4]={
            "types":["summing_point"],
            "custom_attributes":[{
                "name":"Direction",
                "def_value":"+/-",
            }]
        };

        attributes[5]={
            "types":["measured_output"],
            "custom_attributes":[{
                "name":"CurrentOutput",
                "def_value":"0",
            }]
        };
     

        
    
        return attributes;
    }

    function control_relations(){
		let  relations=[];
		
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
        }      
		return styles;
    }

    function control_labels(){
		let labels={};
		labels={
            "subtraction":"Value",
            "summing_point":"Direction"
		};

		return labels;
	}


}

export default control_main
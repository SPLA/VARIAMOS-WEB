let feedback_main = function feedback_main(graph)
{
    feedback_constraints(graph);
    let data=[];
    data["m_type"]="normal"; //custom type
	data["m_elements"]=feedback_elements(); //custom elements
	data["m_attributes"]=feedback_attributes(); //custom attributes
	data["m_relations"]=feedback_relations(); //custom relations
    data["m_properties_styles"]=feedback_properties_styles(); //custom properties styles
	return data;
    
    function feedback_constraints(graph){
        graph.multiplicities=[]; //reset multiplicities
        graph.multiplicities.push(new mxMultiplicity(
            true, "reference_input", null, null, 0, 1, ["summing_point"],
            "Invalid connection",
            "Only shape targets allowed"));
        graph.multiplicities.push(new mxMultiplicity(
            true, "process", null, null, 0, 1, ["feedback"],
            "Only 1 target allowed",
            "Only shape targets allowed"));
            
    }

    function feedback_elements(){
        let controller = {src:projectPath+"images/models/feedback/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"controlador", pname:"Controller"};
        let target_system = {src:projectPath+"images/models/feedback/target_system.png", wd:100, hg:40, style:"shape=rectangle", type:"planta", pname:"Target system"};
        let transducer = {src:projectPath+"images/models/feedback/transducer.png", wd:100, hg:40, style:"shape=rectangle", type:"sensor", pname:"Transducer"};
        let summing_point   = {src:projectPath+"images/models/feedback/summing_point.PNG", wd:100, hg:40, style:"shape=ellipse", type:"summing_point", pname:"Summing point"};
        let reference_input   = {src:projectPath+"images/models/feedback/reference_input.png", wd:100, hg:40, style:"shape=reference_input", type:"temperature", pname:"Reference input "};
        let measured_output   = {src:projectPath+"images/models/feedback/measured-output.png", wd:100, hg:40, style:"shape=measured_ouput", type:"measured_output", pname:"Measured output "};
        let branchpoint   = {src:projectPath+"images/models/feedback/bifurcation.png", wd:100, hg:40, style:"shape=rhombus", type:"branchpoint", pname:"Branchpoint"};
       
        let elements=[];
        elements[0]=controller;
        elements[1]=summing_point;
        elements[2]=target_system;
        elements[3]=transducer;
        elements[4]=reference_input;
        elements[5]=measured_output;
        elements[6]=branchpoint;

        return elements;
    }

    function feedback_attributes(){
        let attributes=[];
        attributes[0]={
            "types":["file"],
            "custom_attributes":[{
                
            
            },
            {
                
            }]
        };
        attributes[1]={
            "types":["controlador"],
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
        attributes[2]={
            "types":["Set Point"],
            "custom_attributes":[{
                "name":"SetPoint",
                "def_value":"0"
            },
            {
                "name":"Time",
                "def_value":"0"
            }]
        };
        attributes[3]={
            "types":["sensor"],
            "custom_attributes":[{
                "name":"Variable",
                "def_value":""
            },
            {
                "name":"Value",
                "def_value":"0"
            }]
        };
        attributes[4]={
            "types":["planta"],
            "custom_attributes":[{
                "name":"Value",
                "def_value":"0"
            }]
        };
        attributes[5]={
            "types":["summing_point"],
            "custom_attributes":[{
                "name":"Value",
                "def_value":"++"
            }]
        };
        attributes[6]={
            "types":["measured_output"],
            "custom_attributes":[{
                "name":"Value",
                "def_value":"0"
            }]
        };
    
        return attributes;
    }

    function feedback_relations(){
		let relations=[];
		relations[0]={
			"source":["controller","transducer","target-system","summing_point","reference_input","branchpoint"],
			"rel_source_target":"and",
			"target":["controller","transducer","summing_point","target-system","measured_output","branchpoint"],
			"attributes":[{
				"name":"relType",
                "def_value":"",
			}]
		}
		return relations;
    }
    
    function feedback_properties_styles(){
		let styles={};
		styles={
			"relation":[{
					"attribute":"relType",
                    "input_type":"select",
                    "value":"0",
					"input_values":["Control error","Control input","excludes"]
				}
			],
		}

		return styles;
    }

}

export default feedback_main
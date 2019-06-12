var feedback_main = function feedback_main(graph)
{
    feedback_constraints(graph);
    var data=[];
    data[0]="normal" //custom type
    data[1]=feedback_elements(); //custom elements
    data[2]=feedback_attributes(); //custom attributes
    data[3]=feature_relations(); //custom relations
    data[4]=feature_properties_styles(); //custom properties styles
    data[5]=null; //custom labels
    data[6]=null; //custom clon cells
    data[7]=null; //custom constraints in element creation
    data[8]=null; //custom overlays
    return data;
    
    function feedback_constraints(graph){
        graph.multiplicities=[]; //reset multiplicities
        graph.multiplicities.push(new mxMultiplicity(
            true, "reference_input", null, null, 0, 0, ["summing_point"],
            "Invalid connection",
            "Only shape targets allowed"));
        graph.multiplicities.push(new mxMultiplicity(
            true, "process", null, null, 0, 1, ["feedback"],
            "Only 1 target allowed",
            "Only shape targets allowed"));
            
    }

    function feedback_elements(){
        var controller = {src:projectPath+"images/models/feedback/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"controller", pname:"Controller"};
        var target_system = {src:projectPath+"images/models/feedback/target_system.png", wd:100, hg:40, style:"shape=rectangle", type:"target-system", pname:"Target system"};
        var transducer = {src:projectPath+"images/models/feedback/transducer.png", wd:100, hg:40, style:"shape=rectangle", type:"transducer", pname:"Transducer"};
        var summing_point   = {src:projectPath+"images/models/feedback/summing_point.PNG", wd:100, hg:40, style:"shape=ellipse", type:"summing_point", pname:"Summing point"};
        var reference_input   = {src:projectPath+"images/models/feedback/reference_input.png", wd:100, hg:40, style:"shape=reference_input", type:"reference_input", pname:"Reference input "};
        var measured_output   = {src:projectPath+"images/models/feedback/measured-output.png", wd:100, hg:40, style:"shape=measured_ouput", type:"measured_output", pname:"Measured output "};
        var branchpoint   = {src:projectPath+"images/models/feedback/bifurcation.png", wd:100, hg:40, style:"shape=rhombus", type:"branchpoint", pname:"Branchpoint"};
        
        
        var elements=[];
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
        var attributes=[];
        attributes[0]={
            "types":["file"],
            "custom_attributes":[{
                "name":"filename",
                "def_value":""
            },
            {
                "name":"destination",
                "def_value":""
            }]
        };
        attributes[1]={
            "types":["controller"],
            "custom_attributes":[{
                "name":"Proportional",
                "def_value":"1"
            },
            {
                "name":"Integral",
                "def_value":"1"
            },
            {
                "name":"Derivate",
                "def_value":"0"
            }]
        };
        attributes[2]={
            "types":["reference_input"],
            "custom_attributes":[{
                "name":"StepTime",
                "def_value":"1"
            },
            {
                "name":"InitialValue",
                "def_value":"0"
            },
            {
                "name":"FinalValue",
                "def_value":"1"
            }]
        };

        
    
        return attributes;
    }

    function feature_relations(){
		var relations=[];
		relations[0]={
			"source":["controller","transducer","target-system","summing_point","reference_input","branchpoint"],
			"rel_source_target":"and",
			"target":["controller","transducer","summing_point","target-system","measured_output","branchpoint"],
			"attributes":[{
				"name":"relType",
                "def_value":"signal",
                
                

                
			}]
		}
	
		return relations;
    }
    
    function feature_properties_styles(){
		var styles={};
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
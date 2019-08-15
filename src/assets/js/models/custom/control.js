var feedback_main = function feedback_main(graph)
{
    feedback_constraints(graph);
    var data=[];
    data["m_type"]="normal"; //custom type
	data["m_elements"]=feedback_elements(); //custom elements
	data["m_attributes"]=feedback_attributes(); //custom attributes
	data["m_relations"]=feedback_relations(); //custom relations
    data["m_properties_styles"]=feedback_properties_styles(); //custom properties styles
    data["m_overlay"]=feature_overlay(); //custom overlay
  
	return data;
    
    function feedback_constraints(graph){
        graph.multiplicities=[]; //reset multiplicities
        graph.multiplicities.push(new mxMultiplicity(
            true, "set_point", null, null, 0, 0, ["measured_output"],
            "Invalid connection"));
        graph.multiplicities.push(new mxMultiplicity(
            true, ["summing_point","controller","set_point","filter","target_system","transducer", "branchpoint"], null, null, 0, 1, ["control"],
            "Only 1 target allowed",
            "Only shape targets allowed"));
            graph.multiplicities.push(new mxMultiplicity(
                true, "measured_output", null, null, 0, 0, ["control"],
                "Invalid connection"));
           
            
    }

    function feedback_elements(){
        var controller = {src:projectPath+"images/models/feedback/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"controller", pname:"Controller"};

        var target_system = {src:projectPath+"images/models/feedback/target_system.png", wd:100, hg:40, style:"shape=rectangle", type:"target_system", pname:"Target system"};
        var transducer = {src:projectPath+"images/models/feedback/transducer.png", wd:100, hg:40, style:"shape=rectangle", type:"sensor", pname:"Transducer"};
        var summing_point   = {src:projectPath+"images/models/feedback/summing_point.PNG", wd:100, hg:40, style:"shape=ellipse", type:"summing_point", pname:"Summing point"};
        var reference_input   = {src:projectPath+"images/models/feedback/reference_input.png", wd:100, hg:40, style:"shape=reference_input", type:"set_point", pname:"Set point "};
        var measured_output   = {src:projectPath+"images/models/feedback/measured-output.png", wd:100, hg:40, style:"shape=measured_ouput", type:"measured_output", pname:"Measured output "};
        var branchpoint   = {src:projectPath+"images/models/feedback/bifurcation.png", wd:100, hg:40, style:"shape=rhombus", type:"branchpoint", pname:"Branchpoint"};
        var filter = {src:projectPath+"images/models/feedback/controller.png", wd:100, hg:40, style:"shape=rectangle", type:"filter", pname:"filter"};
        
        var elements=[];
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

    function feedback_attributes(){
        var attributes=[];
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
            "types":["sensor"],
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
                "def_value":"++",
                "name":"selected",
				"def_value":"false"
            }]
        };

        attributes[5]={
            "types":["measured_output"],
            "custom_attributes":[]
        };

        
    
        return attributes;
    }

    function feedback_relations(){
		var relations=[];
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

       

		var styles={};
		styles={
			
			"Signal":[{
					"attribute":"relType",
                    "input_type":"select",
                    "value":"0",
					"input_values":["Control error","Control input","excludes"]
				}
            ],
            
            "summing_point":[
				{
					"attribute":"selected",
					"input_type":"checkbox",
				}],
			
        }
        

		return styles;
    }

    function feature_overlay(){
		var func1=function(){
			var feature_root = graph.getModel().getCell("control");
			var feature_elements = graph.getModel().getChildEdges(feature_root);
			for (var i = 0; i < feature_elements.length; i++) {
				var source = feature_elements[i].source;
				var type = source.getAttribute("type");
				if(type=="summing_point"){
					var sel = source.getAttribute("selected");
					if(sel=="true"){
						var overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
						graph.addCellOverlay(source,overlay);
					}
				}
			}
		};

		return func1;
	}

}

export default feedback_main
var feedback_main = function feedback_main(graph)
{
    feedback_constraints(graph);
    var data=[];
    data[0]="normal" //custom type
    data[1]=feedback_elements(); //custom elements
    data[2]=feedback_attributes(); //custom attributes
    data[3]=null; //custom relations
    data[4]=null; //custom properties styles
    data[5]=null; //custom labels
    data[6]=null; //custom clon cells
    data[7]=null; //custom constraints in element creation
    data[8]=null; //custom overlays
    return data;
    
    function feedback_constraints(graph){
        graph.multiplicities=[]; //reset multiplicities
        graph.multiplicities.push(new mxMultiplicity(
            true, "feedback", null, null, 0, 0, null,
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
        var reference_input   = {src:projectPath+"images/models/feedback/reference_input.png", wd:100, hg:40, style:"shape=ellipse", type:"reference_input", pname:"Reference input "};
        var measured_output   = {src:projectPath+"images/models/feedback/measured-output.png", wd:100, hg:40, style:"shape=ellipse", type:"measured_output", pname:"Measured output "};
        var disturbance   = {src:projectPath+"images/models/feedback/disturbance.png", wd:100, hg:40, style:"shape=ellipse", type:"disturbance", pname:"Disturbance"};
        
        var elements=[];
        elements[0]=controller;
        elements[1]=summing_point;
        elements[2]=target_system;
        elements[3]=transducer;
        elements[4]=reference_input;
        elements[5]=measured_output;
        elements[5]=disturbance;
        
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
    
        return attributes;
    }
    
}

export default feedback_main
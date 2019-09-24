let setup_events = function setup_events(graph){
    //clean previous generated events
    if(graph.eventListeners.length>22){
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
    }
    //redirect to the original model when double click on a clon cell
    graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){
        let cell = evt.getProperty('cell');
        if (cell!=null){ 
            if(cell.getId().includes("clon")){
                let url = document.URL;
                let n = url.lastIndexOf('/');
                let result_url = url.substring(0,n);
                let original_cell_id = cell.getId().substring(4);
                let original_cell = graph.getModel().getCell(original_cell_id);
                let parent = original_cell.getParent();
                window.location.href = result_url+"/"+parent.getId();
            } 
        }
    }); 

    let url = document.URL;  
    var captured = /controlAction=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    var controlAction = captured ? captured : 'myDefaultValue'; 
    
    //localStorage.setItem('controlAction', controlAction);
    //this.modelCode = localStorage[temp];

    hide_control_elements(graph, controlAction);

    function hide_control_elements(graph, controlActionLabel){
        //alert('escondiendo elementos ' + controlActionLabel);
        let names_control_action = [];
        let target;// 
       let target_system_id; // target system id
       let proportional;// proportional value of the target system element
       let derivate;// derivate value of the target system element
       let integral;// integral value of the target system element
       let target_system_relations; // relations target system
       // controller variables
       let id_controller;// controller id
       let controller_relations; // controller relations
       let id_controller_inner;
       let controller_inner_relations;
       let proportional_inner;// proportional value of the target system element
       let derivate_inner;// derivate value of the target system element
       let integral_inner;// integral value of the target system element
       // summing point variables
       let id_summing; // summing point id
       let summing_relations; // summing relations
       let id_initial_summing; // summing initial id
       let summing_relations2;
       let summing_value;// value summing
       let summing_value_inner; // value summing inner
       let id_summing_plant // id summing plant
       // filter variables
       let id_filter; // filter relations
       let filter_relations;
       // set point variables
       let setpoint_value; // value setpoint
       let setpoint_time;
       let setpoints=[]; // array
       let id_set;// id setpoint
       let times=[];
       let id_set2=false;
       // subtraction
       let id_subtraction;
       let subtraction_relations;
       let subraction_value;
     
       // branch variables
       let id_branch// id branchpoint
       let id_final_branch
       let branch_relations_targets// target relations branchpoint
       let branch_relations_targets2// target relations branchpoint
       let branch_relations// source relations branchpoint
        let final_branch_relations// source relations branchpoint
       // output variables
       let id_output// id output
       let currentoutput// current output
       // transducer variables
       let value_transducer// value transducer
       let id_transducer// id transducer
       let transducer_relations// transducer relations
       // list elements
       let list_elements=[];
       let id_final;
 
        let feedback_root = graph.getModel().getCell("control");
       let childs = graph.getModel().getChildVertices(feedback_root);
       //navigates through the feature model childsld
       for (let i = 0; i < childs.length; i++)
        {
          if (childs[i].getAttribute("type") == "controlAction") {
           let target_sys = childs[i].getAttribute("label");
           names_control_action.push(target_sys)
         }
       }
       for (let i = 0; i < names_control_action.length; i++) 
       {
          if ( controlActionLabel== names_control_action[i]  )
         {
           
            for (let i = 0; i < childs.length; i++)
             {
                   if (childs[i].getAttribute("type") == "controlAction")
                   { //only selected concrete features are analyzed
                 
                     if(childs[i].getAttribute("label")== controlActionLabel)
                     {
                       target_system_id = childs[i].getId(); 
                       list_elements.push(target_system_id);
                     }                 
                   }   
             }
 
             target_system_relations = graph.getModel().getIncomingEdges
             (graph.getModel().getCell(target_system_id));
             for (let i = 0; i < target_system_relations.length; i++)
             {
             let source = target_system_relations[i].source;    
             if(source.getAttribute("type")=="controller")
               { 
                 
                 id_controller_inner= source.getId();
                 list_elements.push(id_controller);
                 
                   
                     
               }
          
             
               else if(source.getAttribute("type")=="summing_point")
               { 
                      id_summing_plant = source.getId();
                 
                 list_elements.push(id_summing);     
               }
          
             }
             controller_inner_relations = graph.getModel().getIncomingEdges
             (graph.getModel().getCell(id_summing_plant));
       
             for (let i = 0; i < controller_inner_relations.length; i++)
             {
               let source = controller_inner_relations[i].source;
              if(source.getAttribute("type")=="controller")
               { 
                 
                 id_controller_inner= source.getId();
                 list_elements.push(id_controller);
                 
                   
                     
               }
               
             }
            
            controller_inner_relations = graph.getModel().getIncomingEdges
             (graph.getModel().getCell(id_controller_inner));
       
             for (let i = 0; i < controller_inner_relations.length; i++)
             {
               let source = controller_inner_relations[i].source;
               if(source.getAttribute("type")=="summing_point"  )
               {
                 id_summing = source.getId();
                 list_elements.push(id_summing);   
               } 
               
             }
             
             summing_relations = graph.getModel().getIncomingEdges
             (graph.getModel().getCell(id_summing));
             for (let i = 0; i < summing_relations.length; i++)
             {
               let source = summing_relations[i].source;
               if(source.getAttribute("type")=="filter")
               {
                 id_filter = source.getId(); 
                  list_elements.push(id_filter); 
               }
                 
               else if(source.getAttribute("type")=="branchpoint"  )
               { 
                 id_final_branch = source.getId(); 
                 
               } 
               else if(source.getAttribute("type")=="controlAction"  )
               { 
                 target_system_id = source.getId(); 
                 
               } 
               else if(source.getAttribute("type")=="controller"  )
               {
                 id_controller = source.getId();
              
               
               } 
               
               else if(source.getAttribute("type")=="set_point"  )
               { 
                 id_set = source.getId(); 
                  list_elements.push(id_set); 
               }
              else if(source.getAttribute("type")=="transducer"  )
               { 
                 id_transducer=source.getId();
                
               }
               
             }
             
             controller_relations =  graph.getModel().getIncomingEdges
               ( graph.getModel().getCell(id_controller));
             for (let i = 0; i < controller_relations.length; i++)
             {
                     let source = controller_relations[i].source;
                     if(source.getAttribute("type")=="summing_point")
               {
                 id_initial_summing = source.getId(); 
                  list_elements.push(id_initial_summing);
 
               }
               
             }
             summing_relations2 =  graph.getModel().getIncomingEdges
               ( graph.getModel().getCell(id_initial_summing));
             for (let i = 0; i < summing_relations2.length; i++)
             {
                     let source = summing_relations2[i].source;
                    
                   if(source.getAttribute("type")=="set_point"  )
               { 
                 id_set = source.getId(); 
                  list_elements.push(id_set); 
               } 
               else if(source.getAttribute("type")=="filter")
               {
                 id_filter = source.getId(); 
                  list_elements.push(id_filter); 
               }
                 
              else if(source.getAttribute("type")=="branchpoint"  )
               { 
                 id_final_branch = source.getId(); 
                 
               } 
                else if(source.getAttribute("type")=="transducer"  )
               { 
                 id_transducer = source.getId(); 
                 
               } 
             }
                filter_relations =  graph.getModel().getIncomingEdges
               ( graph.getModel().getCell(id_filter));
             for (let i = 0; i < filter_relations.length; i++)
             {
                let source = filter_relations[i].source;
               if(source.getAttribute("type")=="branchpoint")
               {
                 id_final_branch = source.getId(); 
                  list_elements.push(id_branch); 
               }
              else if(source.getAttribute("type")=="transducer")
               {
                 id_transducer = source.getId();
                 list_elements.push(id_branch); 
               }   
             }
              transducer_relations =  graph.getModel().getIncomingEdges
               ( graph.getModel().getCell(id_transducer));
             for (let i = 0; i < transducer_relations.length; i++)
             {
                let source = transducer_relations[i].source;
               if(source.getAttribute("type")=="branchpoint")
               {
                 id_final_branch = source.getId(); 
                 list_elements.push(id_branch); 
               }
                
             }
               branch_relations_targets =graph.getModel().getOutgoingEdges
             (graph.getModel().getCell(id_final_branch));
             for (let i = 0; i < branch_relations_targets.length; i++)
             {
                 let target = branch_relations_targets[i].target;
               if(target.getAttribute("type")=="measured_output")
               {
                 id_output= target.getId();
                  list_elements.push(id_output); 
               }
             }
              final_branch_relations =graph.getModel().getIncomingEdges
             (graph.getModel().getCell(id_final_branch));
             for (let i = 0; i < final_branch_relations.length; i++)
             {
                 let source = final_branch_relations[i].source;
                
               if(source.getAttribute("type")=="branchpoint")
               {
                 id_branch= source.getId();
                  list_elements.push(id_branch); 
               }
               
             }
            
             branch_relations = graph.getModel().getIncomingEdges
            (graph.getModel().getCell(id_branch));
           for(let i = 0; i < branch_relations.length; i++)
           {
             let source = branch_relations[i].source;
             if(source.getId() == target_system_id && source.getAttribute("type")=="controlAction")
             {
                  id_final=source.getId();
             }
             
             
           }
             
           let feedback_root = graph.getModel().getCell("control");
           let childs2 = graph.getModel().getChildVertices(feedback_root);
           for (let i = 0; i < childs2.length; i++) 
           {
             if(childs2[i].getId()!= target_system_id && childs2[i].getId()!= id_summing && childs2[i].getId()!= id_set
                 && childs2[i].getId()!= id_filter && childs2[i].getId()!= id_controller && childs2[i].getId()!= id_branch
                 && childs2[i].getId()!= id_output && childs2[i].getId()!= id_controller_inner && childs2[i].getId()!= id_initial_summing
                 && childs2[i].getId()!= id_final_branch && childs2[i].getId()!=  id_transducer && childs2[i].getId()!=  id_summing_plant) 
           {
             
            graph.getModel().setVisible(childs2[i], false)
           }
           else{
             graph.getModel().setVisible(childs2[i], true)
           }
           }
 
 
         }
 
       }
    };
}

export default setup_events
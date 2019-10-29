import { setupModal, modalH3, modalInputTexts, modalButton, modalControl } from '../../../common/util'

let setup_events = function setup_events(graph){
  let texts = ["DeltaU:","Delay"]   
  let default_vals = ["",""];
  let inputs=["idDeltaU","idDelay"];
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
             /* window.location.href = result_url+"/"+parent.getId();*/
             data_continuous();

          } 
          let type = cell.getAttribute("type");
      if (type == "measured_output") {
            
          }  
      }
  }); 
    let data_continuous = function() {
    let c_header = modalH3(("Transfer Function"));
    let c_body = modalControl(texts,inputs,default_vals);
    let c_footer = [];
    c_footer.push(modalButton("Model Output", function(){
        /*if(  document.getElementById('idDeltaU').value =="")
        {
          alert("invalid")
        }
        else
        {
          canvas()
        }*/
        canvas()
    }));
    c_footer.push(modalButton("Upload", function(){uploadData();}));
    setupModal(c_header, c_body, c_footer);  
  }

  let data_csv = function() {
    let text=localStorage["control_data"];
    let allTextLines = text.split(/\r\n|\n/);
    let lines = [];
    let data
    let data_n
    let cont=0
    let time=[]
    for (let i=0; i<allTextLines.length; i++) {
        data = allTextLines[i];
        data = data.replace(",", ".");
        data_n= parseFloat(data)
        lines.push(data_n);
        cont=i*cont;
        time.push(i);
    }
    return lines 
  }

  

  function canvas()
  {
    let pos_delay = function() {
      let pos
      for (let i=0; i<lines.length; i++) {
       
        if(lines[i]!=lines[0])
        {  
          first=lines[i-1]
          pos=i-1
          break;
        }
        else
        {
          pos=0
        }
    }
      return pos
    }

    let time=[];
    let lines=data_csv();
    let k
    let last=lines.slice(-2)[0];
    let tao_value
    let first=lines[0]
    let tao=((last-first)*0.63)+first

    let tao_aproximate = function() {
      let cercano=0;
      let diferencia=0;

      for (let i = 0; i < lines.length; i++)
      {
        if ( Math.abs(tao -cercano) > Math.abs(lines[i] - tao)) {
          cercano = lines[i];
          diferencia=i;
          
        }


      }
      return diferencia;
    }
    if(document.getElementById('idDelay').checked==false)
    {
      first=lines[0];
       tao_value = tao_aproximate();
    }
    else{
      first=lines[pos_delay()]
      tao_value = tao_aproximate() - pos_delay()
    }

    

    
    let continuous = function() {
      let result=[];
      let delta_value = document.getElementById('idDeltaU').value;
      
  
      k=(last-first)/parseInt(delta_value);

      for (let i = 0; i < lines.length; i++)
      { 
        
          let value=(k*parseInt(delta_value)*(1-Math.exp(-i/parseInt(tao_value)))+first);
          result.push(value);
          time.push(i);
        
        
      }
      /*console.log(pos_delay(),tao_value,k)
      let proportional=1.2*(tao_value/(k*pos_delay()))
      let Ti=(2*pos_delay())
      let Td= (0.5*pos_delay())

     /* alert("K: "+proportional.toFixed(2)+"ti: "+Ti+"td: "+Td)*/
      return result;
    
      };
    

    let result_continuous=continuous()
   
    let c_header = modalH3(("Y(s)="+k.toFixed(2)+"/("+tao_value+"-1)"));
    let c_body=0
    let c_footer = modalButton(("return"),function(){data_continuous();});
    setupModal(c_header,c_body,c_footer)
    let main_modal = document.getElementById("main_modal_body");
    
       let canvas = document.createElement("canvas");

          canvas.id = "myChart";
          canvas.width = 500;
          canvas.height = 200;
          canvas.className = "my-4 chartjs-render-monitor";

           main_modal.appendChild(canvas);
          let ctx = document.getElementById("myChart");
          let myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: time,
              datasets: [
                {
                  data: lines,//setInterval(function(){ uploadData(); }, 3000),
                  label: "Data Plant",
                  lineTension: 0,
                  backgroundColor: "transparent",
                  borderColor: "#D83A18",
                  borderWidth: 2,
                  pointBackgroundColor: "#D83A18",
                  pointBorderColor: "transparent",
                  pointBackgroundColor: "transparent",
                  pointBorderWidth: 0
                },
                {
                  data: result_continuous,
                  label: "Data Transfer Function",
                  lineTension: 0,
                  backgroundColor: "transparent",
                  borderColor: "#007bff",
                  borderWidth: 2,
                  pointBackgroundColor: "#007bff",
                  pointBorderColor: "transparent",
                  pointBackgroundColor: "transparent",
                  pointBorderWidth: 0
                }
              ]
            },
            options: {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: false,
                      suggestedMin: 40,
                      suggestedMax: 20

                    }
                  }
                ]
              },
              legend: {
                display: true
              }
            }
          });

          return canvas

  }

  function uploadData()
  {
      let he = document.getElementById("hidden_elements");
      let input=document.createElement('input');
          input.type="file";
          input.style.display="none";           
          he.appendChild(input);
        input.addEventListener('change', function(event) {
        let fileToLoad = input.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) 
        {
              
                let textload = fileLoadedEvent.target.result;
                localStorage["control_data"]=textload; 
                alert("Successfully stored data")
              
        }
        fileReader.readAsText(fileToLoad, "UTF-8");
        });
   if (input)
    {
    input.click();
    }
     
    }

  var controlAction = findControlAction(graph)

  hide_control_elements(graph, controlAction);

  function findControlAction(graph){
    //se busca el control action en la url
    // let url = document.URL;  
    // var captured = /controlAction=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    // var controlAction = captured ? captured : 'myDefaultValue'; 
 
    //se busca el controlaction en el local storage y si no existe se muestra el primero
    var controlActionLS = localStorage['adaptation_binding_state_hardware_controlAction']; 
    var controlAction = "asdf";
    let feedback_root = graph.getModel().getCell("control");
    let childs = graph.getModel().getChildVertices(feedback_root); 
    for (let i = 0; i < childs.length; i++)
    {
      if (childs[i].getAttribute("type") == "controlAction") {
        controlAction=childs[i].getAttribute("label");
        if (childs[i].getAttribute("label") == controlActionLS) {
          break;
        }
      }
    } 
    return controlAction;
  };

  function hide_control_elements(graph, controlActionLabel){
      //alert('escondiendo elementos ' + controlActionLabel);
     let names_control_action = [];
     let target_system_id; // target system id
     let target_system_relations; // relations target system
     // controller variables
     let id_controller;// controller id
     let controller_relations; // controller relations
     let id_controller_inner;
     let controller_inner_relations;
     // summing point variables
     let id_summing; // summing point id
     let summing_relations; // summing relations
     let id_initial_summing; // summing initial id
     let summing_relations2;
     let id_summing_plant // id summing plant
     // filter variables
     let id_filter; // filter relations
     let filter_relations;
     // set point variables
     let id_set;// id setpoint
     // branch variables
     let id_branch// id branchpoint
     let id_final_branch
     let branch_relations_targets// target relations branchpoint
     let branch_relations// source relations branchpoint
      let final_branch_relations// source relations branchpoint
     // output variables
     let id_output// id output
     // transducer variables
     let id_transducer// id transducer
     let transducer_relations// transducer relations
     // list elements
     let list_elements=[];
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
import { setupModal, modalH3, modalSimpleText, modalButton } from '../../../common/util'

let setup_events = function setup_events(graph){
      let texts = ['Input [∆𝑋] (Setpoint injection): ',
      "Delay[𝜃](Time it takes for the system output to increase): "];
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
            if (type == "controller")
            {
            generate_graph();
            } 
             
            if (type == "plant") 
            {
            data_continuous();
            }
        
      }
  }); 

  // modal function
function modalControl(texts,inputs,default_vals){
  let table = document.createElement('table');
  for(let i=0;i<texts.length;i++){
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.innerHTML=texts[i];
      let input={}
      tr.appendChild(td);
      if(i==1){
          input = document.createElement('input');
          input.type="checkbox";
          input.id=inputs[i];
      }
      else if(i==2){
        input = document.createElement('input');
        input.type="checkbox";
        input.id=inputs[i];
    }
      else if(i==3){
          input = document.createElement('span');
          input.innerText=inputs[i];
      }

      else{  
      input = document.createElement('input');
      input.value=default_vals[i];
      input.type="text";
      input.id=inputs[i];
      input.size=10;
      input.name=inputs[i];
      }
      let td2 = document.createElement('td');
      td2.appendChild(input);
      tr.appendChild(td2);
      table.appendChild(tr);
  }
  return table;
}

  // Modal Identifying transfer function  
    let data_continuous = function() {
    let c_header = modalH3(("System model"));
    let c_body = modalControl(texts,inputs,default_vals);
    let c_footer = [];
    c_footer.push(modalButton("Import Data", function(){ 
        uploadData()
    }));
    c_footer.push(modalButton("Estimate", function(){
      if(  document.getElementById('idDeltaU').value =="")
        {
          alert("Incomplete information")
        }
      else
        {
          sistemIdentification();
        }
      }));
    setupModal(c_header, c_body, c_footer);  
  }

  function uploadData()
  {
      let hidden = document.getElementById("hidden_elements");
      let input=document.createElement('input');
      input.type="file";
      input.style.display="none";           
      hidden.appendChild(input);
        input.addEventListener('change', function(event) {
        let fileToLoad = input.files[0];
        let fileReader = new FileReader();
          fileReader.onload = function(fileLoadedEvent) {   
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
    function sistemIdentification(){
    
    let datos_dic = function(){
      let text=localStorage["control_data"];
      let allTextLines = text.split(/\r\n|\n/); 
      let list_data = [];
      let list_time = [];
      let firstColumn;
      let SecondColumn;
            for (let i=0; i<allTextLines.length; i++) {
              firstColumn = allTextLines[i].split(";")[1];
              SecondColumn = allTextLines[i].split(";")[0];
              if(firstColumn!=null && SecondColumn!=null){
                firstColumn = firstColumn.replace(",", ".");
                SecondColumn = SecondColumn.replace(",", ".");
                firstColumn= parseFloat(firstColumn);
                SecondColumn= parseFloat(SecondColumn)
                list_data.push(firstColumn);
                list_time.push(SecondColumn);
              }
            }
            list_data.pop();
            list_time.push(SecondColumn);
            let dictionary_data = {
              "data": list_data,
              "time": list_time
            };
            return  dictionary_data
          }
  
  function canvas()
  {
    let lines=datos_dic().data;
    let delay=datos_dic().time;
    let last=lines.slice(-2)[0];
    let tao_value;
    let first=lines[0];
    let tao=((last-first)*0.63)+first;
    let delta_value = document.getElementById('idDeltaU').value;
    let k=(last-first)/parseInt(delta_value);
    let tex;

    //Calculate delay
    let pos_delay = function() {
      let position;
      for (let i=0; i<lines.length; i++) {   
        if(lines[i]!=lines[0]){  
          first=lines[i-1]
          position=i-1
          break;
        }
        else{
          position=0;
        }
      }
      return position;
    }
    let model_fit = function() {
      let result=[];
      for (let i = 0; i < lines.length; i++)
      { 
          let value=(k*parseInt(delta_value)*(1-Math.exp(-delay[i]/parseInt(tao_value)))+first);
          result.push(value);
      }
      localStorage.setItem("modelo fit",result)
      return result;
      };
    let tao_aproximate = function() {
      let near=0;
      let difference=0;
      let t=((last-first)*0.63)+first;
      for (let i = 0; i < lines.length; i++)
      {
        if ( Math.abs(t -near) > Math.abs(lines[i] - t) && Math.abs(t -near) > Math.abs(lines[i-1] - t)) {
          near = lines[i];
          difference=i; 
        }
      }  
      return difference;
    }
    let fit_model = function() {
      let result_continuous=model_fit()
      let list_difference=[];
      let difference;
      let sum;
      let fit;
      for (let i = 0; i < lines.length; i++)
      {
        difference=result_continuous[i]-lines[i] 
        difference=Math.pow(difference,2)
        sum+=difference
        list_difference.push(difference)
      }
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      sum=list_difference.reduce(reducer);
      fit=Math.sqrt(sum/lines.length)
      return fit;
    }
    let feedback_root = graph.getModel().getCell("control");
    let childs = graph.getModel().getChildVertices(feedback_root);
    for (let i = 0; i < childs.length; i++) {
      if ( childs[i].getAttribute("type") == "controlAction") { //change
          childs[i].setAttribute("Delay")==true;  
        }
    }
      if(document.getElementById('idDelay').checked==false){
       tao_value = delay[tao_aproximate()];
       //var tex = "\\frac{"+ k.toFixed(2)+"}{"+tao_value+"+1}";
       tex='K: '+k.toFixed(2)+" "+'Tao: '+tao_value;
       localStorage.setItem("tao", tao_value);    
        }
      else{
        first=lines[pos_delay()];
        tao_value = delay[tao_aproximate()] - delay[pos_delay()]
        tex = "Gp(s) = \\frac{"+ k.toFixed(2)+"* e^-"+ delay[pos_delay()]+"s}{"+tao_value+"+1}";
        localStorage.setItem("k",k)
        localStorage.setItem("delay",delay[pos_delay()])
        localStorage.setItem("tao", tao_value)
      }    
     
      let main_modal = document.getElementById("main_modal_body");
      let c_header = modalH3("System Model");
      let c_body=""
      let c_footer = modalButton(("return"),function(){data_continuous();})
      setupModal(c_header,c_body,c_footer);

      let transfer_function=document.createElement("div");
      transfer_function.id="transfer";
      main_modal.appendChild(transfer_function);
      let ti=2*delay[pos_delay()];
      let td=ti/4;
      let fit= (fit_model().toFixed(2)*100)/last;
      fit=(100-fit).toFixed(2);
      transfer_function.innerHTML = "\\["+tex+"\\]";
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,transfer_function]);

      let div3=document.createElement("div");
      div3.id="formula3";
      main_modal.appendChild(div3);
      let cohen_proporti=  (1.35/0.018)*(1+((0.18*0.08)/1-0.08))*(61/12)
      let cohe_inte=(2.5-(2.0*0.08)/(1-(0.39*0.08)))*6
      div3.innerHTML = " \\[Cohen–Coon:  K:"+ cohen_proporti.toFixed(2)+"\\"+"   " +" Ti:"+cohe_inte.toFixed(2)+" \\]";
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,div3]);

      let div4=document.createElement("div");
      div4.id="formula4";
      main_modal.appendChild(div4);
      let first_operation = 0.35-((54.1*9.5)/Math.pow(54.1+9.5, 2));
      let kp_cohen = (1/0.018)*(0.15+((first_operation)*(54.1/9.5)))
      let denominador_integral =(13*(Math.pow(54.1, 2))) / (Math.pow(54.1, 2)+ (12*54.1*9.5)+(7* Math.pow(9.5, 2)));
      let integral_time=((0.35+denominador_integral)*9.5)
      let consta_integral = kp_cohen/integral_time
      div4.innerHTML = " \\[Amigo:  K:"+ kp_cohen.toFixed(2)+"\\"+"   " +" Ki:"+consta_integral.toFixed(2)+" \\]";
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,div4]); 

        
      let control = function() {
        let sp=1
        let tm=301
        let error=0
        let error_acum=0;
        let controlador=0;
        let salida_sistema=0;
        let  errorant=0
        let a=-Math.exp(-1/54.1)
        let b=0.018*(1+a)
        let controladores =[]
        let errores=[]
        let errorp=0
        let controladorp=0;
        let salidap=0;
       let salidas=[];
 
         for (let i = 0; i < tm; i++) {
           if(i<10){
           salida_sistema=0;
           error=(sp-salida_sistema);
           error_acum=error_acum+error;
           errores.push(error_acum);
           errorant = errorant-error
           controlador=(270*error)+(error_acum/7.5)+(0*errorant)
           controladores.push(controlador)
           }
           else{
           salidap=parseFloat((controladores[i-10]*b-(a*salidap)).toFixed(9))
           error=sp-salidap;
           errorp=error.toFixed(9)
           error_acum=error_acum+parseFloat(errorp);
           controlador=(270*errorp)+(error_acum/7.5)+(0*errorant)
           controladorp=parseFloat(controlador.toFixed(9))
           controladores.push(controladorp)
           salidas.push(salidap)
           //console.log("post ",i,"error",errorp, "controlador", controladorp,"salida sistema ", salidap, "acum", error_acum)
             }
         }
 
       }
       control();


    // Modal Canvas Plant
    let canvas = document.createElement("canvas");
          canvas.id = "myChart";
          canvas.width = 500;
          canvas.height = 300;
          canvas.className = "my-4 chartjs-render-monitor";
          main_modal.appendChild(canvas);
          let ctx = document.getElementById("myChart");
          let myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: datos_dic().time,
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
                  data: model_fit(),
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
              title: {
                display: true,
                text: ['Proportional: '+ k.toFixed(2)+" "+"Integral: "+ti+" "+"Derivate: "+td+" ",'Best fits:'+fit+"%"],
              },
            }
          });
          return canvas
        }
        canvas()
  }

  
      function generate_graph() {
      let controlAction =
      localStorage["adaptation_binding_state_hardware_controlAction"];
      let c_header = modalH3("Controller Tuning");
      let value_label = controlAction;
      let c_body = modalSimpleText("");
      let result_simple_plant = [];
      let result_cascade_plant = [];
      let result = [];
      let names = [];
      let feedback_root = graph.getModel().getCell("control");
      let childs = graph
        .getModel()
        .getChildVertices(feedback_root);
      for (let i = 0; i < childs.length; i++) {
        if ( childs[i].getAttribute("type") == "controlAction") { //change
          let target_sys = childs[i].getAttribute("label");
          names.push(target_sys);

          }
      }

      //  target system variables
      let target; //
      let target_system_id; // target system id
      let proportional; // proportional value of the target system element
      let derivate; // derivate value of the target system element
      let integral; // integral value of the target system element
      let target_system_relations; // relations target system
      // controller variables
      let id_controller; // controller id
      let controller_relations; // controller relations
      let id_controller_inner;
      let controller_inner_relations;
      let proportional_inner; // proportional value of the target system element
      let derivate_inner; // derivate value of the target system element
      let integral_inner; // integral value of the target system element
      // summing point variables
      let id_summing; // summing point id
      let summing_relations; // summing relations
      let id_initial_summing; // summing initial id
      let summing_relations2;
      let summing_value; // value summing
      let summing_value_inner; // value summing inner
      let id_summing_plant; // id summing plant
      // filter variables
      let id_filter; // filter relations
      let filter_relations;
      // set point variables
      let setpoint_value; // value setpoint
      let setpoint_time;
      let setpoints = []; // array
      let id_set; // id setpoint
      let times = [];
      let id_set2 = false;
      let sampling_time;


      // subtraction
      let id_subtraction;
      let subtraction_relations;
      let subraction_value;

      // branch variables
      let id_branch; // id Branchpoint
      let id_final_branch;
      let branch_relations_targets; // target relations Branchpoint
      let branch_relations_targets2; // target relations Branchpoint
      let branch_relations; // source relations Branchpoint
      let final_branch_relations; // source relations Branchpoint
      // output variables
      let id_output; // id output
      let currentoutput; // current output
      // transducer variables
      let value_transducer; // value transducer
      let id_transducer; // id transducer
      let transducer_relations; // transducer relations
      // list elements
      let list_elements = [];
      let id_final;

      for (let i = 0; i < names.length; i++) {
        if (value_label == names[i]) {
          setupModal(c_header, c_body);
          let main_modal = document.getElementById("main_modal_body");
          let canvas = document.createElement("canvas");

          for (let i = 0; i < childs.length; i++) {
            if (childs[i].getAttribute("type") == "controlAction") { //change
              //only selected concrete features are analyzed
              
             // if (childs[i].getAttribute("label") == value_label) {
                target_system_id = childs[i].getId();
                proportional = childs[i].getAttribute("Proportional");
                derivate = childs[i].getAttribute("Derivate");
                integral = childs[i].getAttribute("Integral");
                list_elements.push(target_system_id);
             // }
              
            }
           

          }
          target_system_relations = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(target_system_id)
            );
          for (let i = 0; i < target_system_relations.length; i++) {
            let source = target_system_relations[i].source;
            if (source.getAttribute("type") == "controller") {
              id_controller_inner = source.getId();
              proportional_inner = source.getAttribute("Proportional");
              derivate_inner = source.getAttribute("Derivate");
              integral_inner = source.getAttribute("Integral");
              list_elements.push(id_controller);
            }

            if (source.getAttribute("type") == "summing_point") {
              id_summing_plant = source.getId();

              list_elements.push(id_summing);
            }
          }
          controller_inner_relations = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(id_summing_plant)
            );

          for (let i = 0; i < controller_inner_relations.length; i++) {
            let source = controller_inner_relations[i].source;
            if (source.getAttribute("type") == "controller") {
              id_controller_inner = source.getId();
              proportional_inner = source.getAttribute("Proportional");
              derivate_inner = source.getAttribute("Derivate");
              integral_inner = source.getAttribute("Integral");
              list_elements.push(id_controller);
            }
          }

          controller_inner_relations = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(id_controller_inner)
            );

          for (let i = 0; i < controller_inner_relations.length; i++) {
            let source = controller_inner_relations[i].source;
            if (source.getAttribute("type") == "summing_point") {
              id_summing = source.getId();
              
              list_elements.push(id_summing);
              summing_value_inner = source.getAttribute("Direction");
            }
          }

          summing_relations = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(id_summing)
            );
          for (let i = 0; i < summing_relations.length; i++) {
            let source = summing_relations[i].source;
            if (source.getAttribute("type") == "filter") {
              id_filter = source.getId();
              list_elements.push(id_filter);
            }

            if (source.getAttribute("type") == "Branchpoint") {
              id_final_branch = source.getId();
              
            }
            if (source.getAttribute("type") == "controlAction") { //change
              target_system_id = source.getId();
            }
            if (source.getAttribute("type") == "controller") {
              id_set2 = true;
              id_controller = source.getId();
              proportional = source.getAttribute("Proportional");
              derivate = source.getAttribute("Derivate");
              integral = source.getAttribute("Integral");
            }

            if (source.getAttribute("type") == "set_point") {
              id_set = source.getId();
              setpoint_value = source.getAttribute("SetPoint");
              setpoints.push(setpoint_value);
              setpoint_time = source.getAttribute("Time");
              times.push(setpoint_time);
              sampling_time=source.getAttribute("Tm");

              list_elements.push(id_set);
            }
            if (source.getAttribute("type") == "transducer") {
              id_transducer = source.getId();
            }
          }

          controller_relations = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(id_controller)
            );
          for (let i = 0; i < controller_relations.length; i++) {
            let source = controller_relations[i].source;
            if (source.getAttribute("type") == "summing_point") {
              id_initial_summing = source.getId();
              list_elements.push(id_initial_summing);
              summing_value = source.getAttribute("Direction");
            }
          }
          summing_relations2 = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(id_initial_summing)
            );
          for (let i = 0; i < summing_relations2.length; i++) {
            let source = summing_relations2[i].source;

            if (source.getAttribute("type") == "set_point") {
              id_set = source.getId();
              setpoint_value = source.getAttribute("SetPoint");
              setpoints.push(setpoint_value);
              setpoint_time = source.getAttribute("Time");
              times.push(setpoint_time);
              list_elements.push(id_set);
              sampling_time=source.getAttribute("Tm");
            } else if (source.getAttribute("type") == "filter") {
              id_filter = source.getId();
              list_elements.push(id_filter);
            } else if (source.getAttribute("type") == "Branchpoint") {
              id_final_branch = source.getId();
            } else if (source.getAttribute("type") == "transducer") {
              id_transducer = source.getId();
            }
          }
          filter_relations = graph
            .getModel()
            .getIncomingEdges(graph.getModel().getCell(id_filter));
          for (let i = 0; i < filter_relations.length; i++) {
            let source = filter_relations[i].source;
            if (source.getAttribute("type") == "Branchpoint") {
              id_final_branch = source.getId();
              list_elements.push(id_branch);
            } else if (source.getAttribute("type") == "transducer") {
              id_transducer = source.getId();
              value_transducer = source.getAttribute("InitialPosition");
              list_elements.push(id_branch);
            }
          }
          transducer_relations = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(id_transducer)
            );
          for (let i = 0; i < transducer_relations.length; i++) {
            let source = transducer_relations[i].source;
            if (source.getAttribute("type") == "Branchpoint") {
              id_final_branch = source.getId();
              list_elements.push(id_branch);
            }
          }
          branch_relations_targets = graph
            .getModel()
            .getOutgoingEdges(
              graph.getModel().getCell(id_final_branch)
            );
          for (let i = 0; i < branch_relations_targets.length; i++) {
            let target = branch_relations_targets[i].target;
            if (target.getAttribute("type") == "measured_output") {
              id_output = target.getId();
              list_elements.push(id_output);
            }
          }
          final_branch_relations = graph
            .getModel()
            .getIncomingEdges(
              graph.getModel().getCell(id_final_branch)
            );
          for (let i = 0; i < final_branch_relations.length; i++) {
            let source = final_branch_relations[i].source;

            if (source.getAttribute("type") == "Branchpoint") {
              id_branch = source.getId();

              list_elements.push(id_branch);
            }
          }

          branch_relations = graph
            .getModel()
            .getIncomingEdges(graph.getModel().getCell(id_branch));
          for (let i = 0; i < branch_relations.length; i++) {
            let source = branch_relations[i].source;
            if (
              source.getId() == target_system_id &&
              source.getAttribute("type") == "controlAction" //change
            ) {
              id_final = source.getId();
            }
          }

          let feedback_root = graph.getModel().getCell("control");
          let childs2 = graph
            .getModel()
            .getChildVertices(feedback_root);
          for (let i = 0; i < childs2.length; i++) {
            if (
              childs2[i].getId() != target_system_id &&
              childs2[i].getId() != id_summing &&
              childs2[i].getId() != id_set &&
              childs2[i].getId() != id_filter &&
              childs2[i].getId() != id_controller &&
              childs2[i].getId() != id_branch &&
              childs2[i].getId() != id_output &&
              childs2[i].getId() != id_controller_inner &&
              childs2[i].getId() != id_initial_summing &&
              childs2[i].getId() != id_final_branch &&
              childs2[i].getId() != id_transducer &&
              childs2[i].getId() != id_summing_plant
            ) {
              graph.getModel().setVisible(childs2[i], false);
            } else {
              graph.getModel().setVisible(childs2[i], true);
            }
          }
         /***** Aqui va el codigo PID */

          let control = function() {
            let sp=setpoint_value
            let tm=1000
            let error=0
            let error_acum=0;
            let controlador=0;
            let salida_sistema=0;
            let  errorant=0
            let a=-Math.exp(-1/54.1)
            let b=0.018*(1+a)
            let controladores =[]
            let errores=[]
            let errorp=0
            let controladorp=0;
            let salidap=0;
           let salidas=[];
           let tiempos=[];
           let setpoints=[];
     
             for (let i = 0; i < sampling_time; i++) {
               if(i<10){
               salida_sistema=0;
               error=(sp-salida_sistema);
               error_acum=error_acum+error;
               errores.push(error_acum);
               errorant = errorant-error
               controlador=(78*error)+(error_acum/1.95)+(0*errorant)
               controladores.push(controlador)
               salidas.push(salida_sistema)
               tiempos.push(i)
               setpoints.push(sp)
               }
               else{
               salidap=parseFloat((controladores[i-10]*b-(a*salidap)).toFixed(9))
               error=sp-salidap;
               errorp=error.toFixed(9)
               error_acum=error_acum+parseFloat(errorp);
               controlador=(78*errorp)+(error_acum/1.95)+(0*errorant)
               controladorp=parseFloat(controlador.toFixed(9))
               controladores.push(controladorp)
               tiempos.push(i)
               salidas.push(salidap)
               setpoints.push(sp)
               //console.log("post ",i,"error",errorp, "controlador", controladorp,"salida sistema ", salidap, "acum", error_acum)
                 }
             }
             let dictionary_data = {
              "data": salidas,
              "time": tiempos,
              "set_point": setpoints
            };

             return dictionary_data
     
           }
        

          canvas.id = "myChart";
          canvas.width = 800;
          canvas.height = 300;
          canvas.className = "my-4 chartjs-render-monitor";
          main_modal.appendChild(canvas);
          let ctx = document.getElementById("myChart");
          let myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: control().time,
              datasets: [
                {
                  data: control().data,
                  label: "PV",
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
                  data: control().set_point,
                  label: "Set Point",
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
                      beginAtZero: result_cascade_plant
                    }
                  }
                ]
              },
              legend: {
                display: true
              }
            }
          });
        }
      }
    }
  


  let controlAction = findControlAction(graph)
  hide_control_elements(graph, controlAction);
  function findControlAction(graph){
    //se busca el control action en la url
    // let url = document.URL;  
    // var captured = /controlAction=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    // var controlAction = captured ? captured : 'myDefaultValue'; 
 
    //se busca el controlaction en el local storage y si no existe se muestra el primero
    let controlActionLS = localStorage['adaptation_binding_state_hardware_controlAction']; 
    let controlAction = "asdf";
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
     let id_branch// id Branchpoint
     let id_final_branch
     let branch_relations_targets// target relations Branchpoint
     let branch_relations// source relations Branchpoint
      let final_branch_relations// source relations Branchpoint
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
               
             else if(source.getAttribute("type")=="Branchpoint"  )
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
               
            else if(source.getAttribute("type")=="Branchpoint"  )
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
             if(source.getAttribute("type")=="Branchpoint")
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
             if(source.getAttribute("type")=="Branchpoint")
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
              
             if(source.getAttribute("type")=="Branchpoint")
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
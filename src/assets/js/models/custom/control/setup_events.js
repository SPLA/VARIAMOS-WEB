import { setupModal, modalH3, modalSimpleText, modalButton, modalControl } from '../../../common/util'
import * as Mathjax from 'mathjax';


let setup_events = function setup_events(graph){
  let texts = ['Input [∆𝑋] (Setpoint injection): ',"Delay[𝜃](Time it takes for the system output to increase): ",
"Note: data must have a comma-separated csv file, where time is specified in the first column and output in the second."]   
  let default_vals = ["","",""];
  let inputs=["idDeltaU","idDelay",""];
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
      if (type == "controller") {
        generate_graph();
          }  

          if (type == "plant") {
            data_continuous();
              }
      }
    
      
  }); 
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
          canvas();
        }
      }));
    setupModal(c_header, c_body, c_footer);  
  }
  // load data from localstorage
  let data_csv = function() {
    let text=localStorage["control_data"];
    let allTextLines = text.split(/\r\n|\n/);
    let lines = [];
    let data
    let data_n
    for (let i=0; i<allTextLines.length; i++) {
        data = allTextLines[i].split(";")[1];
        if(data!=null)
        {
        data = data.replace(",", ".");
        data_n= parseFloat(data)
        lines.push(data_n)
        }
    }
    
    lines.pop();
  
    return lines 
  }

  let data_csv_time = function() {
    let text=localStorage["control_data"];
    let allTextLines = text.split(/\r\n|\n/);
    let time = [];
    let data
    let data_n
    for (let i=0; i<allTextLines.length; i++) {
        data = allTextLines[i].split(";")[0];
        if(data!=null)
        {
        data = data.replace(",", ".");
        data_n= parseFloat(data)
        time.push(data_n)
        }
    }
    
    time.pop();
  
    return time 
  }
 // generate canvas Identifying model
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
    let delay=data_csv_time()
    let last=lines.slice(-2)[0];
    let tao_value
    let first=lines[0]
    let tao=((last-first)*0.63)+first
    let delta_value = document.getElementById('idDeltaU').value;

    k=(last-first)/parseInt(delta_value);

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
      
      tao_value = delay[tao_aproximate()];
      //var tex = "\\frac{"+ k.toFixed(2)+"}{"+tao_value+"+1}";
      var tex='K: '+k.toFixed(2)+" "+'Tao: '+tao_value;
      
    }
    else{
  
      first=lines[pos_delay()]
      tao_value = delay[tao_aproximate()] - delay[pos_delay()]
      //var tex = "\\frac{"+ k.toFixed(2)+"* e^-"+ delay[pos_delay()]+"s}{"+tao_value+"+1}";
      var tex= "K: "+k.toFixed(2)+" "+'𝜃: '+delay[pos_delay()]+" "+'Tao: '+tao_value;
      localStorage.setItem("k",k)
      localStorage.setItem("delay",delay[pos_delay()])
      localStorage.setItem("tao", tao_value)
    }    
      let continuous = function() {
      let result=[];
      let delta_value = document.getElementById('idDeltaU').value;
      k=(last-first)/parseInt(delta_value);
 
      for (let i = 0; i < lines.length; i++)
      { 
          let value=(k*parseInt(delta_value)*(1-Math.exp(-delay[i]/parseInt(tao_value)))+first);
          result.push(value);
          time.push(i); 
      }
      return result;
      };
    let result_continuous=continuous()
    let fit_graph = function() {
      let difference=[];
      let diff;
      let sum;
      let fit;
      for (let i = 0; i < lines.length; i++)
      {
        diff=result_continuous[i]-lines[i] 
        diff=Math.pow(diff,2)
        sum+=diff
        difference.push(diff)
      }
     
      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      sum=difference.reduce(reducer);
      fit=Math.sqrt(sum/lines.length)

      return fit;
    }

  
    let c_header = modalH3("System Model");
    let c_body=""
    let c_footer = modalButton(("return"),function(){data_continuous();});
    setupModal(c_header,c_body,c_footer)
    let main_modal = document.getElementById("main_modal_body");
    let div=document.createElement("div");
    div.setAttribute("align", "center")
    div.id="formula";
    div.size=50;
    main_modal.appendChild(div);
    //div.innerHTML = "\\["+tex+"\\]";
    div.innerHTML =tex
    //Mathjax.Hub.Queue(["Typeset",MathJax.Hub,div]);
   /* let div2=document.createElement("div");
    div2.id="formula2";
    main_modal.appendChild(div2);*/
    let ti=2*delay[pos_delay()]
    let td=ti/4
  
    
    /*div2.innerHTML = "\\[proportional:"+ k.toFixed(2)+"\\"+"   " +" integral:"+ti+" \\ "+"   " +"derivate:"+td+"\\]";
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,div2]);*/


    
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
              labels: data_csv_time(),
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
              
              title: {
                display: true,
                text: ['Proportional: '+ k.toFixed(2)+" "+"Integral: "+ti+" "+"Derivate: "+td+" ",'Best fits:'+(100-fit_graph().toFixed(2)-2)+"%"],
              },
            }
          });
          return canvas
  }
  // load data from csv
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
  
    

      function generate_graph() {
        var controlAction =
      localStorage["adaptation_binding_state_hardware_controlAction"];
      let c_header = modalH3("Controller Tuning");
      let value_label = controlAction;
      let c_body = modalSimpleText("");
      let result_outputs = [];
      let result_outputs2 = [];
      let result = [];
      let names = [];
      let feedback_root = graph.getModel().getCell("control");
      let childs = graph
        .getModel()
        .getChildVertices(feedback_root);
      //navigates through the feature model childsld
      for (let i = 0; i < childs.length; i++) {
        if ( childs[i].getAttribute("type") == "plant") { //change
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
      // subtraction
      let id_subtraction;
      let subtraction_relations;
      let subraction_value;

      // branch variables
      let id_branch; // id branchpoint
      let id_final_branch;
      let branch_relations_targets; // target relations branchpoint
      let branch_relations_targets2; // target relations branchpoint
      let branch_relations; // source relations branchpoint
      let final_branch_relations; // source relations branchpoint
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
        //if (value_label == names[i]) {
          setupModal(c_header, c_body);
          let main_modal = document.getElementById("main_modal_body");
          let canvas = document.createElement("canvas");

          for (let i = 0; i < childs.length; i++) {
            if (childs[i].getAttribute("type") == "plant") { //change
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

            if (source.getAttribute("type") == "branchpoint") {
              id_final_branch = source.getId();
            }
            if (source.getAttribute("type") == "plant") { //change
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
            } else if (source.getAttribute("type") == "filter") {
              id_filter = source.getId();
              list_elements.push(id_filter);
            } else if (source.getAttribute("type") == "branchpoint") {
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
            if (source.getAttribute("type") == "branchpoint") {
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
            if (source.getAttribute("type") == "branchpoint") {
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

            if (source.getAttribute("type") == "branchpoint") {
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
              source.getAttribute("type") == "plant" //change
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
              //graph.getModel().setVisible(childs2[i], true);
            }
          }
          let MiniPID = (function() {
            function MiniPID(kp, ki, kd, dt) {
              // variables
              this.P = 0;
              this.I = 0;
              this.D = 0;
              this.F = 0;
              this.DT = 0;
              this.maxIOutput = 0;
              this.maxError = 0;
              this.errorSum = 0;
              this.maxOutput = 0;
              this.minOutput = 0;
              this.setpoint = 0;
              this.lastActual = 0;
              this.lastError = 0;
              this.firstRun = true;
              this.reversed = false;
              this.outputRampRate = 0;
              this.lastOutput = 0;
              this.dt;
              this.outputFilter = 0;
              this.setpointRange = 0;
              this.P = kp;
              this.I = ki;
              this.D = kd;
              this.DT = dt;
              this.checkSigns();
            }
            // methods
            MiniPID.prototype.getOutput = function(actual, setpoint, error) {
              let output = currentoutput;
              let Poutput;
              let Ioutput;
              let Doutput;
              let Foutput;
              let derivate;
              let integral;
              this.error = error;
              this.setpoint = setpoint;

              Foutput = this.F * setpoint;
              Poutput = this.P * error;
              // first run
              if (this.firstRun) {
                this.lastActual = error;
                this.lastOutput = Poutput + Foutput;
                this.firstRun = false;
              }
                derivate=(error-this.lastActual)/this.DT
            Doutput=this.D*derivate;
            this.lastActual = error;
            integral = this.errorSum * this.DT;
            Ioutput  = this.I * integral;

            
              if (this.maxIOutput !== 0) {
                Ioutput = this.limit(
                  Ioutput,
                  -this.maxIOutput,
                  this.maxIOutput
                );
              }
              output = Foutput + Poutput + Ioutput + Doutput;
              if (
                this.minOutput !== this.maxOutput &&
                !this.delimited(output, this.minOutput, this.maxOutput)
              ) {
                this.errorSum = error ;
              } else if (
                this.outputRampRate !== 0 &&
                !this.delimited(
                  output,
                  this.lastOutput - this.outputRampRate,
                  this.lastOutput + this.outputRampRate
                )
              ) {
                this.errorSum = error ;
              } else if (this.maxIOutput !== 0) {
                this.errorSum = this.limit(
                  this.errorSum + error,
                  -this.maxError,
                  this.maxError
                );
              } else {
                this.errorSum += error;
              }
              if (this.outputRampRate !== 0) {
                output = this.limit(
                  output,
                  this.lastOutput - this.outputRampRate,
                  this.lastOutput + this.outputRampRate
                );
              }
              if (this.minOutput !== this.maxOutput) {
                output = this.limit(output, this.minOutput, this.maxOutput);
              }
              if (this.outputFilter !== 0) {
                output =
                  this.lastOutput * this.outputFilter +
                  output * (1 - this.outputFilter);
              }
              this.lastOutput = output;
              return output;
            };
            MiniPID.prototype.setmaxIOutput = function(maximum) {
              this.maxIOutput = maximum;
              if (this.I !== 0) {
                this.maxError = this.maxIOutput / this.I;
              }
            };
            MiniPID.prototype.RampRateOutput = function(rate) {
              this.outputRampRate = rate;
            };

            MiniPID.prototype.limit = function(value, min, max) {
              if (value > max) {
                return max;
              }
              if (value < min) {
                return min;
              }
              return value;
            };
            MiniPID.prototype.delimited = function(value, min, max) {
              return min < value && value < max;
            };
            MiniPID.prototype.reversedf = function() {
              this.P = 0 - this.P;
              this.I = 0 - this.I;
              this.D = 0 - this.D;
            };
             
              MiniPID.prototype.recursiveFilter = function (x)
              {
                let alpha=0.125;
                let y=0;
                y = alpha * x + (1 - alpha) * y;
                return y;
                
              }

              MiniPID.prototype.plant = function ()
              {
                let delay = localStorage.getItem('delay');
                let tao = localStorage.getItem('tao');
                let  k = localStorage.getItem('k');

                return ((k)/(tao+1))
                
              }
            MiniPID.prototype.checkSigns = function() {
              if (this.reversed) {
                if (this.P > 0) this.P *= -1;
                if (this.I > 0) this.I *= -1;
                if (this.D > 0) this.D *= -1;
                if (this.F > 0) this.F *= -1;
                if (this.DF > 0) this.DF *= -1;
              } else {
                if (this.P < 0) this.P *= -1;
                if (this.I < 0) this.I *= -1;
                if (this.D < 0) this.D *= -1;
                if (this.DF < 0) this.DF *= -1;
              }
            };
            MiniPID.prototype.data_csv = function() {
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
            };
            
            return MiniPID;
          })();
          let control_loop = []; // list outputs
          let listaset = []; // list set points
          function main() {
            let miniPID;
            let miniPID2;
    
            miniPID = new MiniPID(
              proportional_inner,
              integral_inner,
              derivate_inner,
              setpoint_time
            );
            let lines =miniPID.data_csv()
            let output = 50;
            let actual2=lines[1];
            let error = 0;
            let y;
            let actual=0;
            result_outputs.push(actual);
            let times_sum = 0;
            let time_float = parseFloat(setpoint_time);
            //miniPID.setmaxIOutput(2);
            miniPID.RampRateOutput(3);
            if (summing_value_inner == "-/+" || summing_value_inner == "-/-") {
              miniPID.reversedf();
            }
            if (id_set2 == false) {
               for (let i = 0; i < 300; i++) {
                output = miniPID.getOutput(actual, setpoint_value, error);
                y =miniPID.recursiveFilter(output);
                actual = actual+miniPID.plant()*output;
                if (summing_value_inner == "+/-") {
                  error = setpoint_value - actual;
                } else if (summing_value_inner == "+/+") {
                  error = setpoint_value + actual;
                } else {

                  error = setpoint_value - actual;
                }
                
                result_outputs.push(actual);
               // times_sum = i * time_float.toFixed(2);
               // times_sum = times_sum.toFixed(2);
               times_sum=times_sum+0.01;
                times.push(times_sum.toFixed(2));
                listaset.push(setpoint_value);
              }
              result = result_outputs;
            } else if (id_set2 == true) {
              miniPID = new MiniPID(
                proportional,
                integral,
                derivate,
                setpoint_time
              );
              if (summing_value == "-/+" || summing_value == "-/-") {
                miniPID.reversedf();
              }
              miniPID.setmaxIOutput(2);
              miniPID.RampRateOutput(3);
              for (let i = 0; i < 150; i++) {
                output = miniPID.getOutput(actual, setpoint_value, error);
                actual = actual * output;
                if (summing_value == "+/-") {
                  error = setpoint_value - actual;
                } else if (summing_value == "+/+") {
                  error = setpoint_value + actual;
                }
                
                result_outputs.push(actual);
              }
              let error2 = 0;
              miniPID2 = new MiniPID(
                proportional_inner,
                integral_inner,
                derivate_inner,
                setpoint_time
              );
              for (let i = 0; i < result_outputs.length; i++) {
                let output2 = miniPID2.getOutput(
                  result_outputs[i],
                  setpoint_value,
                  error2
                );
                if (summing_value_inner == "+/-") {
                  error2 = setpoint_value - result_outputs[i];
                  actual2 = result_outputs[i] + output2;
                } else if (summing_value_inner == "+/+") {
                  error = setpoint_value + result_outputs[i];
                  actual2 = result_outputs[i] + output2;
                } else if (summing_value_inner == "-/+") {
                  error = setpoint_value + result_outputs[i];
                  actual2 = result_outputs[i] - output2;
                } else if (summing_value_inner == "-/-") {
                  error = setpoint_value - result_outputs[i];
                  actual2 = result_outputs[i] - output2;
                }
                result_outputs2.push(
                  actual2);
                times_sum = i * time_float.toFixed(1);
                times_sum = times_sum.toFixed(1);
                times.push(times_sum);
                listaset.push(setpoint_value);
              }

              result = result_outputs2;
            }
            return result;
          }
          control_loop = main();


          let data_csv_time = function() {
            let text=localStorage["control_data"];
            let allTextLines = text.split(/\r\n|\n/);
            let time = [];
            let data
            let data_n
            for (let i=0; i<allTextLines.length; i++) {
                data = allTextLines[i].split(";")[0];
                if(data!=null)
                {
                data = data.replace(",", ".");
                data_n= parseFloat(data)
                time.push(data_n)
                }
            }
            
            time.pop();
          
            return time 
          }

          canvas.id = "myChart";
          canvas.width = 800;
          canvas.height = 300;
          canvas.className = "my-4 chartjs-render-monitor";
          for (let i = 0; i < childs.length; i++) {
            if (childs[i].getAttribute("type") == "set_point") {
              let set = childs[i].getAttribute("SetPoint");
              let plant = childs[i].getAttribute("Plant");
            }
          }

          main_modal.appendChild(canvas);
          let ctx = document.getElementById("myChart");
          let myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: times,
              datasets: [
                {
                  data: control_loop,
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
                  data: listaset,
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
                      beginAtZero: false
                    }
                  }
                ]
              },
              legend: {
                display: true
              }
            }
          });
       // }
      }
    }



 /* let controlAction = findControlAction(graph)
  hide_control_elements(graph, controlAction);*/
  /*function findControlAction(graph){
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
  };*/

 /* function hide_control_elements(graph, controlActionLabel){
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
  };*/
}

export default setup_events
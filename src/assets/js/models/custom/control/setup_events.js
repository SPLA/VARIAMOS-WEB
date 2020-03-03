import { setupModal, modalH3, modalSimpleText, modalButton } from '../../../common/util'

let setupEvents = function setupEvents(graph){
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
            let originalCellId = cell.getId().substring(4);
            let originalCell = graph.getModel().getCell(originalCellId);
            let parent = originalCell.getParent();
          /* window.location.href = result_url+"/"+parent.getId();*/
           DataContinuous()
          }
          let type = cell.getAttribute("type");
            if (type == "controller") {
              GenerateGraph();
            } 
            if (type == "plant") {
            DataContinuous();
            }
      }
  }); 

  // modal function
function ModalControl(texts,inputs,default_vals){
  let table = document.createElement('table');
  for (let i=0;i<texts.length;i++) {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.innerHTML=texts[i];
      let input={}
      tr.appendChild(td);
      if (i==1) {
          input = document.createElement('input');
          input.type="checkbox";
          input.id=inputs[i];
      }
      else if (i==2) {
        input = document.createElement('input');
        input.type="checkbox";
        input.id=inputs[i];
      }
      else if (i==3) {
          input = document.createElement('span');
          input.innerText=inputs[i];
      } else {  
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
    let DataContinuous = function() {
    let header = modalH3(("System model"));
    let body = ModalControl(texts,inputs,default_vals);
    let footer = [];

    footer.push(modalButton("Import Data", function() { 
        UploadData()
    }));
    footer.push(modalButton("Estimate", function(){
      if (document.getElementById('idDeltaU').value =="") {
          alert("Incomplete information")
      } else {
          SistemIdentification();
      }
    }));
    setupModal(header, body, footer);  
  }

  function UploadData()
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
      if (input) {
      input.click();
      }  
    }
    function SistemIdentification(){
    
    let DatosLocalStorage = function(){
      let text=localStorage["control_data"];
      let allTextLines = text.split(/\r\n|\n/); 
      let listData = [];
      let listTime = [];
      let firstColumn;
      let secondColumn;
            for (let i=0; i<allTextLines.length; i++) {
              firstColumn = allTextLines[i].split(";")[1];
              secondColumn = allTextLines[i].split(";")[0];
              if (firstColumn!=null && secondColumn!=null) {
                firstColumn = firstColumn.replace(",", ".");
                secondColumn = secondColumn.replace(",", ".");
                firstColumn= parseFloat(firstColumn);
                secondColumn= parseFloat(secondColumn)
                listData.push(firstColumn);
                listTime.push(secondColumn);
              }
            }
            listData.pop();
            listTime.push(secondColumn);
            let dictionary_data = {
              "data": listData,
              "time": listTime
            };
            return  dictionary_data
          }
  
  function Canvas()
  {
    let lines=DatosLocalStorage().data;
    let delay=DatosLocalStorage().time;
    let last=lines.slice(-2)[0];
    let taoValue;
    let first=lines[0];
    let tao=((last-first)*deltaValue)+first;
    let deltaValue = document.getElementById('idDeltaU').value;
    let gain=(last-first)/parseInt(deltaValue);
    let tex;

    //Calculate delay
    let PositionDelay = function() {
      let position;
      for (let i=0; i<lines.length; i++) {   
        if (lines[i]!=lines[0]) {  
          first=lines[i-1]
          position=i-1
          break;
        } else {
          position=0;
        }
      }
      return position;
    }
    let TransferFunctionOutput = function() {
      let result=[];
      for (let i = 0; i < lines.length; i++)
      { 
          let value=(gain*parseInt(deltaValue)*(1-Math.exp(-delay[i]/parseInt(taoValue)))+first);
          result.push(value);
      }
      localStorage.setItem("modelo fit",result)
      return result;
      };
    let TaoAproximate = function() {
      let near=0;
      let difference=0;
      let tao=((last-first)*0.63)+first;
      for (let i = 0; i < lines.length; i++) {
        if (Math.abs(t -near) > Math.abs(lines[i] - tao) && Math.abs(t -near) > Math.abs(lines[i-1] - tao)) {
          near = lines[i];
          difference=i; 
        }
      }  
      return difference;
    }
    let ModelFitting = function() {
      let resultContinuous=TransferFunctionOutput()
      let ListDifference=[];
      let difference;
      let sum;
      let fit;
      for (let i = 0; i < lines.length; i++) {
        difference=resultContinuous[i]-lines[i] 
        difference=Math.pow(difference,2)
        sum+=difference
        ListDifference.push(difference)
      }
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      sum=ListDifference.reduce(reducer);
      fit=Math.sqrt(sum/lines.length)
      return fit;
    }
    let feedbackRoot = graph.getModel().getCell("control");
    let childs = graph.getModel().getChildVertices(feedbackRoot);
    for (let i = 0; i < childs.length; i++) {
      if ( childs[i].getAttribute("type") == "controlAction") { 
          childs[i].setAttribute("Delay")==true;  
        }
    }
      if (document.getElementById('idDelay').checked==false) {
       taoValue = delay[TaoAproximate()];
       //var tex = "\\frac{"+ k.toFixed(2)+"}{"+taoValue+"+1}";
       tex='K: '+gain.toFixed(2)+" "+'Tao: '+taoValue;
       localStorage.setItem("tao", taoValue);    
      } else {
        first=lines[PositionDelay()];
        taoValue = delay[TaoAproximate()] - delay[PositionDelay()]
        tex = "Gp(s) = \\frac{"+ gain.toFixed(2)+"* e^-"+ delay[PositionDelay()]+"s}{"+taoValue+"+1}";
        localStorage.setItem("k",gain)
        localStorage.setItem("delay",delay[PositionDelay()])
        localStorage.setItem("tao", taoValue)
      }    
     
      let mainModal = document.getElementById("main_modal_body");
      let header = modalH3("System Model");
      let body=""
      let footer = modalButton(("return"),function(){DataContinuous();})
      setupModal(header,body,footer);

      let transferFunction=document.createElement("div");
      transferFunction.id="transfer";
      mainModal.appendChild(transferFunction);
      let ti=2*delay[PositionDelay()];
      let td=ti/4;
      let fit= (ModelFitting().toFixed(2)*100)/last;
      fit=(100-fit).toFixed(2);
      transferFunction.innerHTML = "\\["+tex+"\\]";
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,transferFunction]);

      let div3=document.createElement("div");
      div3.id="formula3";
      mainModal.appendChild(div3);
      let cohenKP=  (1.35/gain)*(1+((gain*0.08)/1-0.08))*(61/12)
      let cohenKI=(2.5-(2.0*0.08)/(1-(0.39*0.08)))*6
      div3.innerHTML = " \\[Cohen–Coon:  K:"+ cohenKP.toFixed(2)+"\\"+"   " +" Ti:"+cohenKI.toFixed(2)+" \\]";
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,div3]);

      let div4=document.createElement("div");
      div4.id="formula4";
      mainModal.appendChild(div4);
      let firstOperation = 0.35-((54.1*9.5)/Math.pow(54.1+9.5, 2));
      let amigoKP = (1/gain)*(0.15+((firstOperation)*(54.1/9.5)))
      let denominador_integral =(13*(Math.pow(54.1, 2))) / (Math.pow(54.1, 2)
      + (12*54.1*9.5)+(7* Math.pow(9.5, 2)));
      let integralTime=((0.35+denominador_integral)*9.5)
      let amigoKi = amigoKP/integralTime
      div4.innerHTML = " \\[Amigo:  K:"+ amigoKP.toFixed(2)+"\\"+"   " +" Ki:"+amigoKi.toFixed(2)+" \\]";
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,div4]); 
        
      let Control = function() {
        let sp=1
        let tm=301
        let error=0
        let error_acum=0;
        let controlador=0;
        let outputSystem=0;
        let errorant=0
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
           outputSystem=0;
           error=(sp-outputSystem);
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
       Control();


    // Modal Canvas Plant
    let canvas = document.createElement("canvas");
          canvas.id = "myChart";
          canvas.width = 500;
          canvas.height = 280;
          canvas.className = "my-4 chartjs-render-monitor";
          mainModal.appendChild(canvas);
          let ctx = document.getElementById("myChart");
          let myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: DatosLocalStorage().time,
              datasets: [
                {
                  data: lines,//setInterval(function(){ UploadData(); }, 3000),
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
                  data: TransferFunctionOutput(),
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
                text: [//'Proportional: '+ k.toFixed(2)+" "+"Integral: "+ti+" "+"Derivate: "+td+" ",//
                'Best fits:'+fit+"%"],
              },
            }
          });
          return canvas
        }
        Canvas()
  }

  
      function GenerateGraph() {
      let controlAction =
      localStorage["adaptation_binding_state_hardware_controlAction"];
      let header = modalH3("Controller Tuning");
      let valueLabel = controlAction;
      let body = modalSimpleText("");
      let result_cascade_plant = [];
      let result = [];
      let names = [];
      let feedbackRoot = graph.getModel().getCell("control");
      let childs = graph
        .getModel()
        .getChildVertices(feedbackRoot);
      for (let i = 0; i < childs.length; i++) {
        if ( childs[i].getAttribute("type") == "controlAction") { 
          let target_sys = childs[i].getAttribute("label");
          names.push(target_sys);
        }
      }

      //  target system variables
      let target; //
      let targetSystemId; // target system id
      let proportional; // proportional value of the target system element
      let derivate; // derivate value of the target system element
      let integral; // integral value of the target system element
      let targetSystemRelations; // relations target system
      // controller variables
      let id_controller; // controller id
      let controllerRelations; // controller relations
      let ControllerInnerId;
      let controllerInnerRelations;
      let InnerKP; // proportional value of the target system element
      let InnerKD; // derivate value of the target system element
      let InnerKI; // integral value of the target system element
      // summing point variables
      let summingID; // summing point id
      let summingRelations; // summing relations
      let initialSummingID; // summing initial id
      let summingRelationsTwo;
      let summingValue; // value summing
      let summingValueInner; // value summing inner
      let summingPlantID; // id summing plant
      // filter variables
      let filterID; // filter relations
      let filterRelations;
      // set point variables
      let setpointValue; // value setpoint
      let setpointTime;
      let setpoints = []; // array
      let setpointID; // id setpoint
      let times = [];
      let setpointTwoID = false;
      let samplingTime;

      // branch variables
      let branchID; // id Branchpoint
      let finalBranchID;
      let branchRelationsTarget; // target relations Branchpoint
      let branchRelations; // source relations Branchpoint
      let finalBranchRelations; // source relations Branchpoint

      // output variables
      let outputID; // id output

      // transducer variables
      let valueTransducer; // value transducer
      let transducerID; // id transducer
      let transdurcerRelations; // transducer relations
      // list elements
      let listElements = [];
      let finalID;

      for (let i = 0; i < names.length; i++) {
        if (valueLabel == names[i]) {
          setupModal(header, body);
          let mainModal = document.getElementById("main_modal_body");
          let canvas = document.createElement("canvas");
          for (let i = 0; i < childs.length; i++) {
            if (childs[i].getAttribute("type") == "controlAction") {
             // if (childs[i].getAttribute("label") == valueLabel) {
                targetSystemId = childs[i].getId();
                proportional = childs[i].getAttribute("Proportional");
                derivate = childs[i].getAttribute("Derivate");
                integral = childs[i].getAttribute("Integral");
                listElements.push(targetSystemId);
             // }  
            }
          }
          targetSystemRelations = graph.getModel().getIncomingEdges(
            graph.getModel().getCell(targetSystemId) );

          for (let i = 0; i < targetSystemRelations.length; i++) {
            let source = targetSystemRelations[i].source;
            if (source.getAttribute("type") == "controller") {
              ControllerInnerId = source.getId();
              InnerKP = source.getAttribute("Proportional");
              InnerKD = source.getAttribute("Derivate");
              InnerKI = source.getAttribute("Integral");
              listElements.push(id_controller);
            }
            if (source.getAttribute("type") == "summingPoint") {
              summingPlantID = source.getId();
              listElements.push(summingID);
            }
          }

          controllerInnerRelations = graph.getModel().getIncomingEdges(
              graph.getModel().getCell(summingPlantID));
          for (let i = 0; i < controllerInnerRelations.length; i++) {
            let source = controllerInnerRelations[i].source;
            if (source.getAttribute("type") == "controller") {
              ControllerInnerId = source.getId();
              InnerKP = source.getAttribute("Proportional");
              InnerKD = source.getAttribute("Derivate");
              InnerKI = source.getAttribute("Integral");
              listElements.push(id_controller);
            }
          }

          controllerInnerRelations = graph.getModel().getIncomingEdges(
              graph.getModel().getCell(ControllerInnerId) );
          for (let i = 0; i < controllerInnerRelations.length; i++) {
            let source = controllerInnerRelations[i].source;
            if (source.getAttribute("type") == "summingPoint") {
              summingID = source.getId();
              listElements.push(summingID);
              summingValueInner = source.getAttribute("Direction");
            }
          }

          summingRelations = graph.getModel().getIncomingEdges(
              graph.getModel().getCell(summingID) );
          for (let i = 0; i < summingRelations.length; i++) {
            let source = summingRelations[i].source;
            if (source.getAttribute("type") == "filter") {
              filterID = source.getId();
              listElements.push(filterID);
            }
            if (source.getAttribute("type") == "branchpoint") {
              finalBranchID = source.getId();
            }
            if (source.getAttribute("type") == "controlAction") { 
              targetSystemId = source.getId();
            }
            if (source.getAttribute("type") == "controller") {
              setpointTwoID = true;
              id_controller = source.getId();
              proportional = source.getAttribute("Proportional");
              derivate = source.getAttribute("Derivate");
              integral = source.getAttribute("Integral");
            }
            if (source.getAttribute("type") == "setpoint") {
              setpointID = source.getId();
              setpointValue = source.getAttribute("SetPoint");
              setpoints.push(setpointValue);
              setpointTime = source.getAttribute("Time");
              times.push(setpointTime);
              samplingTime=source.getAttribute("Tm");
              listElements.push(setpointID);
            }
            if (source.getAttribute("type") == "transducer") {
              transducerID = source.getId();
            }
          }

          controllerRelations = graph.getModel().getIncomingEdges(
              graph.getModel().getCell(id_controller));
          for (let i = 0; i < controllerRelations.length; i++) {
            let source = controllerRelations[i].source;
            if (source.getAttribute("type") == "summingPoint") {
              initialSummingID = source.getId();
              listElements.push(initialSummingID);
              summingValue = source.getAttribute("Direction");
            }
          }

          summingRelationsTwo = graph.getModel().getIncomingEdges(
              graph.getModel().getCell(initialSummingID) );
          for (let i = 0; i < summingRelationsTwo.length; i++) {
            let source = summingRelationsTwo[i].source;
            if (source.getAttribute("type") == "setpoint") {
              setpointID = source.getId();
              setpointValue = source.getAttribute("SetPoint");
              setpoints.push(setpointValue);
              setpointTime = source.getAttribute("Time");
              times.push(setpointTime);
              listElements.push(setpointID);
              samplingTime=source.getAttribute("Tm");
            } else if (source.getAttribute("type") == "filter") {
              filterID = source.getId();
              listElements.push(filterID);
            } else if (source.getAttribute("type") == "branchpoint") {
              finalBranchID = source.getId();
            } else if (source.getAttribute("type") == "transducer") {
              transducerID = source.getId();
            }
          }

          filterRelations = graph.getModel().getIncomingEdges(graph.getModel().getCell(filterID));
          for (let i = 0; i < filterRelations.length; i++) {
            let source = filterRelations[i].source;
            if (source.getAttribute("type") == "branchpoint") {
              finalBranchID = source.getId();
              listElements.push(branchID);
            } else if (source.getAttribute("type") == "transducer") {
              transducerID = source.getId();
              valueTransducer = source.getAttribute("InitialPosition");
              listElements.push(branchID);
            }
          }

          transdurcerRelations = graph.getModel().getIncomingEdges(
              graph.getModel().getCell(transducerID));
          for (let i = 0; i < transdurcerRelations.length; i++) {
            let source = transdurcerRelations[i].source;
            if (source.getAttribute("type") == "branchpoint") {
              finalBranchID = source.getId();
              listElements.push(branchID);
            }
          }

          branchRelationsTarget = graph.getModel().getOutgoingEdges(
              graph.getModel().getCell(finalBranchID) );
          for (let i = 0; i < branchRelationsTarget.length; i++) {
            let target = branchRelationsTarget[i].target;
            if (target.getAttribute("type") == "outputSystem") {
              outputID = target.getId();
              listElements.push(outputID);
            }
          }

          finalBranchRelations = graph.getModel().getIncomingEdges(
              graph.getModel().getCell(finalBranchID));
          for (let i = 0; i < finalBranchRelations.length; i++) {
            let source = finalBranchRelations[i].source;
            if (source.getAttribute("type") == "branchpoint") {
              branchID = source.getId();
              listElements.push(branchID);
            }
          }

          branchRelations = graph.getModel().getIncomingEdges(
          graph.getModel().getCell(branchID));
          for (let i = 0; i < branchRelations.length; i++) {
            let source = branchRelations[i].source;
            if (
              source.getId() == targetSystemId &&
              source.getAttribute("type") == "controlAction" 
            ) {
              finalID = source.getId();
            }
          }
          let feedbackRoot = graph.getModel().getCell("control");
          let childs2 = graph.getModel().getChildVertices(feedbackRoot);
          for (let i = 0; i < childs2.length; i++) {
            if (
              childs2[i].getId() != targetSystemId &&
              childs2[i].getId() != summingID &&
              childs2[i].getId() != setpointID &&
              childs2[i].getId() != filterID &&
              childs2[i].getId() != id_controller &&
              childs2[i].getId() != branchID &&
              childs2[i].getId() != outputID &&
              childs2[i].getId() != ControllerInnerId &&
              childs2[i].getId() != initialSummingID &&
              childs2[i].getId() != finalBranchID &&
              childs2[i].getId() != transducerID &&
              childs2[i].getId() != summingPlantID ) {
              graph.getModel().setVisible(childs2[i], false);
            } else {
              graph.getModel().setVisible(childs2[i], true);
            }
          }
         /***** Aqui va el codigo PID */
          let Control = function() {
            let sp=setpointValue
            let tm=1000
            let error=0
            let error_acum=0;
            let controlador=0;
            let outputSystem=0;
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
     
            for (let i = 0; i < samplingTime; i++) {
              if(i<10){
              outputSystem=0;
              error=(sp-outputSystem);
              error_acum=error_acum+error;
              errores.push(error_acum);
              errorant = errorant-error
              controlador=(78*error)+(error_acum/1)+(0*errorant)
              controladores.push(controlador)
              salidas.push(outputSystem)
              tiempos.push(i)
              setpoints.push(sp)
              } else {
              salidap=parseFloat((controladores[i-10]*b-(a*salidap)).toFixed(9))
              error=sp-salidap;
              errorp=error.toFixed(9)
              error_acum=error_acum+parseFloat(errorp);
              controlador=(78*errorp)+(error_acum/1)+(0*errorant)
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
              "setpoint": setpoints
            };
             return dictionary_data
     
          }
          canvas.id = "myChart";
          canvas.width = 800;
          canvas.height = 300;
          canvas.className = "my-4 chartjs-render-monitor";
          mainModal.appendChild(canvas);
          let ctx = document.getElementById("myChart");
          let myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: Control().time,
              datasets: [
                {
                  data: Control().data,
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
                  data: Control().setpoint,
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
  HideControlElements(graph, controlAction);
  function findControlAction(graph){
    //se busca el control action en la url
    // let url = document.URL;  
    // var captured = /controlAction=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    // var controlAction = captured ? captured : 'myDefaultValue'; 
 
    //se busca el controlaction en el local storage y si no existe se muestra el primero
    let controlActionLS = localStorage['adaptation_binding_state_hardware_controlAction']; 
    let controlAction = "asdf";
    let feedbackRoot = graph.getModel().getCell("control");
    let childs = graph.getModel().getChildVertices(feedbackRoot); 
    for (let i = 0; i < childs.length; i++) {
      if (childs[i].getAttribute("type") == "controlAction") {
        controlAction=childs[i].getAttribute("label");
        if (childs[i].getAttribute("label") == controlActionLS) {
          break;
        }
      }
    } 
    return controlAction;
  };

  function HideControlElements(graph, controlActionLabel){
      //alert('escondiendo elementos ' + controlActionLabel);
     let namesControlAction = [];
     let targetSystemId; // target system id
     let targetSystemRelations; // relations target system
     // controller variables
     let id_controller;// controller id
     let controllerRelations; // controller relations
     let ControllerInnerId;
     let controllerInnerRelations;
     // summing point variables
     let summingID; // summing point id
     let summingRelations; // summing relations
     let initialSummingID; // summing initial id
     let summingRelationsTwo;
     let summingPlantID // id summing plant
     // filter variables
     let filterID; // filter relations
     let filterRelations;
     // set point variables
     let setpointID;// id setpoint
     // branch variables
     let branchID// id Branchpoint
     let finalBranchID
     let branchRelationsTarget// target relations Branchpoint
     let branchRelations// source relations Branchpoint
    let finalBranchRelations// source relations Branchpoint
     // output variables
     let outputID// id output
     // transducer variables
     let transducerID// id transducer
     let transdurcerRelations// transducer relations
     // list elements
     let listElements=[];
     let feedbackRoot = graph.getModel().getCell("control");
     let childs = graph.getModel().getChildVertices(feedbackRoot);
     //navigates through the feature model childsld
     for (let i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("type") == "controlAction") {
         let target_sys = childs[i].getAttribute("label");
         namesControlAction.push(target_sys)
        }
     }
     for (let i = 0; i < namesControlAction.length; i++) {
        if ( controlActionLabel== namesControlAction[i]) {
          for (let i = 0; i < childs.length; i++) {
            if (childs[i].getAttribute("type") == "controlAction") {
                    //only selected concrete features are analyzed
              if (childs[i].getAttribute("label")== controlActionLabel) {
                     targetSystemId = childs[i].getId(); 
                     listElements.push(targetSystemId);
              }                 
            }   
           }

          targetSystemRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(targetSystemId));
          for (let i = 0; i < targetSystemRelations.length; i++) {
            let source = targetSystemRelations[i].source;    
            if (source.getAttribute("type")=="controller") {   
              ControllerInnerId= source.getId();
              listElements.push(id_controller);  
            } else if (source.getAttribute("type")=="summingPoint") { 
              summingPlantID = source.getId();
              listElements.push(summingID);     
            }
          }

          controllerInnerRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(summingPlantID));
          for (let i = 0; i < controllerInnerRelations.length; i++) {
            let source = controllerInnerRelations[i].source;
            if (source.getAttribute("type")=="controller") { 
              ControllerInnerId= source.getId();
              listElements.push(id_controller);    
            }   
          }
          
          controllerInnerRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(ControllerInnerId));
          for (let i = 0; i < controllerInnerRelations.length; i++) {
              let source = controllerInnerRelations[i].source;
              if (source.getAttribute("type")=="summingPoint") {
                summingID = source.getId();
                listElements.push(summingID);   
              }  
            }
        
          summingRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(summingID));
          for (let i = 0; i < summingRelations.length; i++) {
              let source = summingRelations[i].source;
              if(source.getAttribute("type")=="filter") {
                filterID = source.getId(); 
                listElements.push(filterID); 
              } else if (source.getAttribute("type")=="branchpoint") { 
                finalBranchID = source.getId(); 
              } else if(source.getAttribute("type")=="controlAction") { 
                targetSystemId = source.getId();  
              } else if(source.getAttribute("type")=="controller") {
                id_controller = source.getId();
              }  else if(source.getAttribute("type")=="setpoint") { 
                setpointID = source.getId(); 
                listElements.push(setpointID); 
              } else if(source.getAttribute("type")=="transducer") { 
               transducerID=source.getId();  
              }   
          }
           
          controllerRelations =  graph.getModel().getIncomingEdges
          ( graph.getModel().getCell(id_controller));
          for (let i = 0; i < controllerRelations.length; i++) {
            let source = controllerRelations[i].source;
            if (source.getAttribute("type")=="summingPoint") {
              initialSummingID = source.getId(); 
              listElements.push(initialSummingID);
             }
          }

          summingRelationsTwo =  graph.getModel().getIncomingEdges
          (graph.getModel().getCell(initialSummingID));
          for (let i = 0; i < summingRelationsTwo.length; i++) {
            let source = summingRelationsTwo[i].source; 
            if (source.getAttribute("type")=="setpoint") { 
              setpointID = source.getId(); 
              listElements.push(setpointID); 
            } else if (source.getAttribute("type")=="filter") {
              filterID = source.getId(); 
              listElements.push(filterID); 
            } else if (source.getAttribute("type")=="branchpoint") { 
              finalBranchID = source.getId();  
            } else if(source.getAttribute("type")=="transducer") { 
              transducerID = source.getId(); 
            } 
          }
              
          filterRelations =  graph.getModel().getIncomingEdges
          ( graph.getModel().getCell(filterID));
          for (let i = 0; i < filterRelations.length; i++) {
            let source = filterRelations[i].source;
            if (source.getAttribute("type")=="branchpoint") {
              finalBranchID = source.getId(); 
              listElements.push(branchID); 
            } else if (source.getAttribute("type")=="transducer") {
              transducerID = source.getId();
              listElements.push(branchID); 
            }   
          }
        
          transdurcerRelations =  graph.getModel().getIncomingEdges
          ( graph.getModel().getCell(transducerID));
          for (let i = 0; i < transdurcerRelations.length; i++) {
              let source = transdurcerRelations[i].source;
            if(source.getAttribute("type")=="branchpoint") {
              finalBranchID = source.getId(); 
              listElements.push(branchID); 
            }    
          }
  
          branchRelationsTarget =graph.getModel().getOutgoingEdges
          (graph.getModel().getCell(finalBranchID));
          for (let i = 0; i < branchRelationsTarget.length; i++) {
            let target = branchRelationsTarget[i].target;
            if(target.getAttribute("type")=="outputSystem") {
              outputID= target.getId();
              listElements.push(outputID); 
            }
          }

          finalBranchRelations =graph.getModel().getIncomingEdges
          (graph.getModel().getCell(finalBranchID));
          for (let i = 0; i < finalBranchRelations.length; i++) {
            let source = finalBranchRelations[i].source;
            if(source.getAttribute("type")=="branchpoint") {
              branchID= source.getId();
              listElements.push(branchID); 
             }
          }

          branchRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(branchID));
          for (let i = 0; i < branchRelations.length; i++) {
            let source = branchRelations[i].source;
            if(source.getId() == targetSystemId && source.getAttribute("type")=="controlAction") {
              finalID=source.getId();
            }
          }
           
          let feedbackRoot = graph.getModel().getCell("control");
          let childs2 = graph.getModel().getChildVertices(feedbackRoot);
          for (let i = 0; i < childs2.length; i++) {
            if (
              childs2[i].getId() != targetSystemId &&
              childs2[i].getId() != summingID &&
              childs2[i].getId() != setpointID &&
              childs2[i].getId() != filterID &&
              childs2[i].getId() != id_controller &&
              childs2[i].getId() != branchID &&
              childs2[i].getId() != outputID &&
              childs2[i].getId() != ControllerInnerId &&
              childs2[i].getId() != initialSummingID &&
              childs2[i].getId() != finalBranchID &&
              childs2[i].getId() != transducerID &&
              childs2[i].getId() != summingPlantID ) {
              graph.getModel().setVisible(childs2[i], false);
            } else {
            graph.getModel().setVisible(childs2[i], true)
            }
          }
        }
      }
    };
  }
export default setupEvents
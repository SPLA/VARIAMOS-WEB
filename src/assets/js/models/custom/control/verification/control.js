import axios from "axios";
import io from 'socket.io-client';
import { setupModal, modalH3, modalSimpleText, modalButton } from '../../../../common/util';
let control_verification = function control_verification()
{
  
  //custom verification menu options and functions
  let data=[];
  data[0]={
      "label":"Check unique  control action",
      "func":check_unique_ids
  }
  data[1]={
      "label":"Test Arduino Variamos Services",
      "func":arduino
  }
  return data;

  //check that all the features (root, abstract and concrete) contain unique IDs
  function check_unique_ids(graph,c_errors,c_overlays){
    let control_root = graph.getModel().getCell("control");    
    let childs = graph.getModel().getChildVertices(control_root);
    let names = [];
    let result = "";

    //navigates through the feature model childs
    for (let i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("type") == "controlAction") {
            let label = childs[i].getAttribute("label");
            if (names.indexOf(label) > -1) {
                result+="Duplicated control action ID - " + label + "\n";
                let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
                graph.addCellOverlay(childs[i], overlay);
                c_errors.push(childs[i]);
                c_overlays.push(overlay);
              }else{
                names.push(label);
              }
            }
          }
      if(result!=""){
        alert(result);
      }else{
        alert("No errors found");
      }
    }
    


  function  arduino(graph){
      let x=5
      let errors=[];
      var socket = io.connect('http://localhost:8085', { 'forceNew': true });
      socket.on('arduino:data', function(data) {
        console.log(data);
        socket.send('my-message');
        //socket.emit('hi!');
        socket.send(JSON.stringify({data: "hola"}));
      });

      axios.post('http://localhost:8085',{
      data: x
        })
        .then( response => {
         console.log(response.data.data);
         console.log(response)
          })
        .catch(e => {
        errors.push(e); 
        console.log(e)
        });
        let counter = 0 ;
        /*axios.get('http://localhost:8082')
        .then( response => {
         console.log(response.data.data);
         chart.data.labels.push(counter);
         chart.data.datasets.forEach((dataset) => {
             dataset.data.push(response.data.data);
         });
         counter++;
         chart.update();
          })
        .catch(e => {
        errors.push(e); 
        console.log(e)
        });
       // console.log(response.data.data)
        return data;*/
        socket.on('arduino:data', function (dataSerial) {
         
          chart.data.labels.push(counter);
          chart.data.datasets.forEach(dataset => {
            dataset.data.push(dataSerial.value);
            console.log(dataSerial)
          });
          counter++;
          chart.update();
          });
        

    let c_header = modalH3("Arduino Test");
    let c_body = modalSimpleText("")
    setupModal(c_header,c_body);
    let main_modal = document.getElementById("main_modal_body");
    let canvas = document.createElement("canvas");
    canvas.id = "myChart";
    canvas.height = 300;
      
    canvas.className = "my-4 chartjs-render-monitor";
    main_modal.appendChild(canvas);         
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: ["Serial"],
            datasets: [{
                label: "Serial Data from Arduino",
                backgroundColor: 'rgb(52, 73, 94)',
                borderColor: 'rgb(41, 128, 185)',
                data: [],
            }]
        },
        // Configuration options go here
        options: {}
    });
      //setInterval(data(),4000)
    }
}

export default control_verification
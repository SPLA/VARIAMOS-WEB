<template>
  <div>
    <a @click="test_micro()" class="dropdown-item">{{ $t("control_data_acquisition") }}</a>
  </div>
</template>
<script>
import axios from "axios";
import {
  setupModal,
  modalH3,
  modalInputTexts,
  modalButton,
  modalSimpleText
} from "@/assets/js/common/util.js";

export default {
  data: function() {
    return {
      model_data: "",
      errors: [] //errors
    };
  },
  props: {
    current_graph: {
      type: Object,
      required: true
    }
  },
  methods: {
    test_micro(){
      axios.post(localStorage["domain_implementation_main_path"]+'Control/saveBD', 0)
      let mainModal = document.getElementById("main_modal_body");
      var myChart;
      var name;

      const createModal = () =>
      {
      let header = modalH3(this.$t("control_data_acquisition"));  
      let default_vals = "0";
      let texts = [("Setpoint: ")];
      const inputs = ["setpoint"];
      let body = modalInputTexts(texts, inputs, default_vals);
      let footer = [];
    
      footer.push(modalButton("start", function() { 
        setInterval(getData, 500);
        document.getElementById("start").disabled = true;
        }));
      footer.push(modalButton("reset", function(){
      reset();
      }));
      footer.push(modalButton("export", function() { 
       exportCsv();  
      }));
      footer.push(modalButton("send", function(){
      enviar();
      }));
     // let footer = modalButton(("Send"),function(){enviar()}) 
      setupModal(header,body,footer);
      }
    
      const generateCanvas= () =>
      {
        createModal();
        let canvas = document.createElement("canvas");
        canvas.id = "myChart";
        canvas.width = 500;
        canvas.height = 280;
        canvas.className = "my-4 chartjs-render-monitor";
        return canvas;
      }
       
      const generateChart =() =>
      {
        mainModal.appendChild(generateCanvas());
        let ctx = document.getElementById("myChart");
        myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              data: [],
              borderWidth: 1,
              borderColor:'#00c0ef',
              label: 'Response',
            },
            {
              data: [],
              label: "Setpoint",
              borderWidth: 1,
              borderColor:'#FF3333',
              label: 'Setpoint',
            }]
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: "",
            },
            legend: {
              display: true
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                }
              }]
            }
          }
        });
      } 
      generateChart()
   
      const reset= ()=>
      {
        axios.post(localStorage["domain_implementation_main_path"]+'Control/saveBD', 0)
        myChart.destroy();
        myChart.data.datasets[0].data=[];
        myChart.data.datasets[1].data=[];
        myChart.data.labels=[]
        generateChart()
      }
      const getData = () =>
      {
        if (localStorage["domain_implementation_main_path"]) {
        this.errors=[];
        axios.get(localStorage["domain_implementation_main_path"]+'Control/getData')
        .then(response => {
          myChart.data.labels.push((response.data.times));
            myChart.data.datasets[0].data.push(response.data.data);
            myChart.data.datasets[1].data.push(response.data.set);
            name=response.data.name;
              myChart.update();        
          })
        }
      };
  
    const enviar = () =>
    {
      const setpoint = document.getElementById('setpoint').value;
      let errors=[] //errors
      if (localStorage["domain_implementation_main_path"]) {
        errors=[];
        axios.post(localStorage["domain_implementation_main_path"]+'Control/saveBD', setpoint)
        .then(response => {
          console.log("enviado");
        })
        .catch(e => {
          this.errors.push(e);
          var c_header = modalH3(this.$t("modal_error"),"error");
          var c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
          setupModal(c_header,c_body);
        });
      }else{
        var c_header = modalH3(this.$t("modal_error"),"error");
        var c_body = modalSimpleText(this.$t("verification_path_problem"));
        setupModal(c_header,c_body);
      }
    }

    const exportCsv =() =>
    {
      let sets=myChart.data.datasets[1].data;
      let output=myChart.data.datasets[0].data;
      let itemSet=sets.indexOf( parseInt(document.getElementById('setpoint').value));
      let datacsv;
      let setcsv;
      let multiples=[0];

      const stedyState = list =>
      {
      let responseItems=list.length-itemSet
      // from the change of setpoint you bring the previous 6 items
      let result = list.slice(-(6+responseItems),itemSet);
      return result;
      }
        
      let previousData=stedyState(output);
      let previousSet=stedyState(sets);
      try{
        const removeOffset=  ( ) =>
        { 
          const average= previousData.reduce((a, b) => (a + b)) / output.length;

          const nearValue= previousData.reduce((a, b) => {
          return Math.abs(b - average) < Math.abs(a - average) ? b : a;
          });
    
          const initialScope= previousData.map(item => item=0 );

        return initialScope;
        }

        const generateDataCSV = () =>
        {
        let outputLas=output.slice(itemSet);
        let setsLas=sets.slice(itemSet);
        setcsv = previousSet.concat(setsLas)  
        const simu= outputLas.map(item => item - outputLas[0] );
        datacsv=removeOffset().concat(simu);
        }

        const generateCSV = () =>
        {
          generateDataCSV();
          let sum=0;
          for(var i=0,j=output.length;i<j;i++){
            multiples.push((sum += 0.5).toFixed(2))
          }

          var rows = [];
          for(var i=0, j=datacsv.length;i<j;i++){
            rows.push([multiples[i],datacsv[i],setcsv[i] ]);
             /*multiples=multiples[i].toFixed(2).toString().replace(".", ",");
             datacsv=multiples[i].toFixed(2).toString().replace(".", ",");
             setcsv=multiples[i].toFixed(2).toString().replace(".", ",");
            rows.push([multiples,datacsv,setcsv]);*/
          }

          let csvContent = "data:text/csv;charset=utf-8," 
          + rows.map(e => e.join(";")).join("\n");
          var encodedUri = encodeURI(csvContent);
          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "my_data.csv");
          document.body.appendChild(link); // Required for FF
          link.click(); 
        }
        generateCSV();  
      }
      catch  {
        alert('Error: Setpoint already registered, restart data acquisition');
      } 
      let dictionaryData = {
                "time": multiples,
                "data": datacsv,
                "setpoint":setcsv,
                "name": name
              };
      if (localStorage["domain_implementation_main_path"]) {
        this.errors=[];
        axios.post(localStorage["domain_implementation_main_path"]+'Control/saveBD', dictionaryData)
        .then(response => {
          console.log("enviado");
        })}      
      }  
    }, 
  }  
};
</script>
<style scoped>
</style>
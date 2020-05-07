<template>
  <div>
    <a @click="test_micro()" class="dropdown-item">{{ $t("test_micro") }}</a>
    <a @click="websocket_test()" class="dropdown-item">{{ $t("websocket_test") }}</a>
    <a @click="send_message()" class="dropdown-item">{{ $t("send_message") }}</a>
  </div>
</template>
<script>
import {
  setupModal,
  modalH3,
  modalInputTexts,
  modalButton,
  modalSimpleText
} from "@/assets/js/common/util.js";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import axios from "axios";


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
       let mainModal = document.getElementById("main_modal_body");
        let header = modalH3("Test ");
      let body=""
      let footer = modalButton(("Send"),function(){enviar()}) 
      setupModal(header,body,footer);
      let canvas = document.createElement("canvas");
      canvas.id = "myChart";
      canvas.width = 500;
      canvas.height = 280;
      canvas.className = "my-4 chartjs-render-monitor";
      mainModal.appendChild(canvas);
     let ctx = document.getElementById("myChart");
    let myChart = new Chart(ctx, {
    type: 'line',
      data: {
    labels: [],
    datasets: [{
      data: [],
      borderWidth: 1,
      borderColor:'#00c0ef',
      label: 'liveCount',
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Chart.js - Dynamically Update Chart Via Axios Requests",
    },
    legend: {
      display: false
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

    var getData = function() {
      if (localStorage["domain_implementation_main_path"]) {
       this.errors=[];
       axios.get(localStorage["domain_implementation_main_path"]+'NewMicro/getData')
       .then(response => {
         console.log(response.data)
         myChart.data.labels.push("Post " + response.data);
          myChart.data.datasets[0].data.push(response.data);
          myChart.update();
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
};
  setInterval(getData, 3000);

  function  enviar()
  {
    let errors=[] //errors
     if (localStorage["domain_implementation_main_path"]) {
       errors=[];
       axios.post(localStorage["domain_implementation_main_path"]+'NewMicro/sendData', {
      data: "dato desde variamos Web"})
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
    
   },
   websocket_test(){
      this.socket = new SockJS("http://localhost:8080/gs-guide-websocket");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        frame => {
          this.connected = true;
         // console.log(frame);
          this.stompClient.subscribe("/topic/greetings", tick => {
            //console.log(this.stompClient);
           alert(JSON.parse(tick.body).content);
          
          });
        },
        error => {
          console.log(error);
          this.connected = false;
        }
      );
   },
   send_message(){

      
     if (this.stompClient && this.stompClient.connected) {
       
        const msg = "Andres";
        //console.log(JSON.stringify(msg));
        this.stompClient.send("/app/hello", JSON.stringify(msg), {});
      }

    
   }

   


  }
};
</script>


<style scoped>
</style>
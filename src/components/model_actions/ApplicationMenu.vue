
<template>
  <li class="nav-item dropdown">
    <a
      class="nav-link dropdown-toggle"
      id="navbarDropdown"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >{{ $t("application_menu") }}</a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a @click="set_parameters()" class="dropdown-item">{{ $t("application_menu_set_app") }}</a>
      <a
        @click="execute_derivation()"
        class="dropdown-item"
      >{{ $t("domain_implementation_execute") }}</a>
      <a
        @click="customize_derivation()"
        class="dropdown-item"
      >{{ $t("domain_implementation_customize") }}</a>
      <a @click="verify_derivation()" class="dropdown-item">{{ $t("domain_implementation_verify") }}</a>

      <a @click="component()" class="dropdown-item">{{ $t("generate_graph") }}</a>

      <a
        @click="adaptation_state_source_code_generation()"
        class="dropdown-item"
      >Source code generation</a>
    </div>
  </li>
</template>

<script>
import axios from "axios";
import di_actions from "@/assets/js/models/actions/domain_implementation/di_actions.js";
import "@/assets/js/chart/Chart.min.js";
import {
  setupModal,
  modalH3,
  modalSimpleText,
  modalInputTexts,
  modalCustomization,
  modalButton
} from "../../assets/js/common/util";
import { uptime } from "os";
import { deepStrictEqual } from 'assert';

export default {
  data: function() {
    return {
      model_data: "",
      file_to_upload: "",
      file_dest: "",
      previous_dest: "",
      previous_cpoint: "",
      previous_plan: "",
      customization_data: "",
      customization_comp_pos: 0,
      customization_comp_max_pos: 0,
      customization_cus_pos: 0,
      customization_cus_max_pos: 0,
      customization_response: "",
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
    //Start set parameters
    set_parameters() {
      let c_header = modalH3(this.$t("application_menu_set_app"));
      let default_vals = "";
      let texts = [this.$t("domain_implementation_derived_path")];
      let inputs = ["server_derived_path"];
      if (localStorage["domain_implementation_pool_path"]) {
        default_vals = [localStorage["domain_implementation_derived_path"]];
      } else {
        default_vals = ["uploads/component_derived/"];
      }
      let c_body = modalInputTexts(texts, inputs, default_vals);
      let c_footer = modalButton(this.$t("modal_save"), this.save_parameters);
      setupModal(c_header, c_body, c_footer);
    },
    //Start execute derivation
    execute_derivation() {
      if (
        localStorage["domain_implementation_main_path"] &&
        localStorage["domain_implementation_pool_path"] &&
        localStorage["domain_implementation_derived_path"]
      ) {
        this.errors = [];
        this.model_data = JSON.stringify(
          di_actions(this.current_graph, "execute")
        );
        axios
          .post(
            localStorage["domain_implementation_main_path"] +
              "ComponentImplementation/execute",
            {
              data: this.model_data,
              p_pool: localStorage["domain_implementation_pool_path"],
              p_derived: localStorage["domain_implementation_derived_path"]
            }
          )
          .then(response => {
            let c_header = modalH3(
              this.$t("models_actions_derivation_response")
            );
            let c_body = modalSimpleText(response.data);
            setupModal(c_header, c_body);
          })
          .catch(e => {
            this.errors.push(e);
            let c_header = modalH3(this.$t("modal_error"), "error");
            console.log(this.$t("model_actions_backend_problem"));
            let c_body = modalSimpleText(
              e + this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
          });
      } else {
        let c_header = modalH3(this.$t("modal_error"), "error");
        let c_body = modalSimpleText(
          this.$t("domain_implementation_path_problem")
        );
        setupModal(c_header, c_body);
      }
    },
    //Start verify derivation
    verify_derivation() {
      if (
        localStorage["domain_implementation_main_path"] &&
        localStorage["domain_implementation_derived_path"]
      ) {
        this.errors = [];
        this.model_data = JSON.stringify(
          di_actions(this.current_graph, "verify")
        );
        axios
          .post(
            localStorage["domain_implementation_main_path"] +
              "ComponentImplementation/verify",
            {
              data: this.model_data,
              p_derived: localStorage["domain_implementation_derived_path"]
            }
          )
          .then(response => {
            let c_header = modalH3(
              this.$t("models_actions_derivation_response")
            );
            let c_body = modalSimpleText(response.data);
            setupModal(c_header, c_body);
          })
          .catch(e => {
            this.errors.push(e);
            let c_header = modalH3(this.$t("modal_error"), "error");
            console.log(this.$t("model_actions_backend_problem"));
            let c_body = modalSimpleText(
              e + this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
          });
      } else {
        let c_header = modalH3(this.$t("modal_error"), "error");
        let c_body = modalSimpleText(
          this.$t("domain_implementation_path_problem")
        );
        setupModal(c_header, c_body);
      }
    },
    //Start customize derivation
    customize_derivation() {
      this.previous_dest = "";
      if (
        localStorage["domain_implementation_main_path"] &&
        localStorage["domain_implementation_pool_path"] &&
        localStorage["domain_implementation_derived_path"]
      ) {
        this.errors = [];
        this.customization_data = di_actions(this.current_graph, "customize");

        if (this.customization_data.length == 0) {
          let c_header = modalH3(this.$t("modal_error"), "error");
          let c_body = modalSimpleText("No components to customize");
          setupModal(c_header, c_body);
        } else {
          if (this.customization_data[0]) {
            this.model_data = JSON.stringify(this.customization_data);
            axios
              .post(
                localStorage["domain_implementation_main_path"] +
                  "ComponentImplementation/customize/start",
                {
                  data: this.model_data,
                  p_pool: localStorage["domain_implementation_pool_path"],
                  p_derived: localStorage["domain_implementation_derived_path"]
                }
              )
              .then(response => {
                this.customization_response = response.data;
                this.customization_comp_pos = 0;
                this.customization_cus_pos = 0;
                this.customization_cus_max_pos = 0;
                this.customization_comp_max_pos = this.customization_response.length;
                let default_vals = ["", "", "", "", ""];
                let c_header = modalH3("Start Customization Process");
                let texts = [
                  "Current file",
                  "Default content",
                  "New customized content",
                  "File to upload",
                  "Notification"
                ];
                let inputs = [
                  "current",
                  "default",
                  "customized",
                  "filetoupload",
                  "notification"
                ];
                let c_body = modalCustomization(texts, inputs, default_vals);
                let c_footer = modalButton(
                  "Start/Next",
                  this.run_customization
                );
                setupModal(c_header, c_body, c_footer);
                document.getElementById(
                  "filetoupload"
                ).onchange = this.send_file;
              })
              .catch(e => {
                this.errors.push(e);
                let c_header = modalH3(this.$t("modal_error"), "error");
                console.log(this.$t("model_actions_backend_problem"));
                let c_body = modalSimpleText(
                  e + this.$t("model_actions_backend_problem")
                );
                setupModal(c_header, c_body);
              });
          } else {
            let c_header = modalH3("Customization response");
            let c_body = modalSimpleText("customization completed");
            setupModal(c_header, c_body);
          }
        }
      } else {
        let c_header = modalH3(this.$t("modal_error"), "error");
        let c_body = modalSimpleText(
          this.$t("domain_implementation_path_problem")
        );
        setupModal(c_header, c_body);
      }
    },
    //Start save parameters
    save_parameters() {
      localStorage[
        "domain_implementation_derived_path"
      ] = document.getElementById("server_derived_path").value;
      document.getElementById("main_modal").style.display = "none";
    },
    //Start run customization
    run_customization() {
      document.getElementById("filetouploadtr").style.display = "none";
      document.getElementById("customized").disabled = false;
      if (this.customization_comp_pos < this.customization_comp_max_pos) {
        this.customization_cus_max_pos = this.customization_response[
          this.customization_comp_pos
        ][1];
        if (this.customization_cus_pos < this.customization_cus_max_pos) {
          let current_pos = 2 + this.customization_cus_pos * 3;
          document.getElementById("notification").value = "";
          document.getElementById("default").value = "";
          let customized_content = "";
          if (this.previous_dest != "") {
            customized_content = document.getElementById("customized").value;
          }
          document.getElementById("customized").value = "";
          document.getElementById(
            "current"
          ).value = this.customization_response[this.customization_comp_pos][
            current_pos
          ];
          let destination = this.find_destination_file(
            this.customization_response[this.customization_comp_pos][
              current_pos
            ]
          );
          if (destination == "") {
            this.previous_dest = "";
            document.getElementById("notification").value =
              "Current file not found, verify the component diagram";
          } else {
            document.getElementById("current").value =
              "ID: " +
              this.customization_response[this.customization_comp_pos][
                current_pos
              ] +
              " - DEST: " +
              destination;
            let model_datax = [];
            model_datax[0] = destination;
            model_datax[1] = this.customization_response[
              this.customization_comp_pos
            ][current_pos + 1];
            model_datax[2] = this.customization_response[
              this.customization_comp_pos
            ][current_pos + 2];
            if (this.previous_dest != "") {
              model_datax[3] = this.previous_dest;
              model_datax[4] = this.previous_cpoint;
              model_datax[5] = this.previous_plan;
              model_datax[6] = customized_content;
            }

            this.model_data = JSON.stringify(model_datax);
            document.getElementById("Start/Next").disabled = true;

            axios
              .post(
                localStorage["domain_implementation_main_path"] +
                  "ComponentImplementation/customize/next",
                {
                  data: this.model_data,
                  p_pool: localStorage["domain_implementation_pool_path"],
                  p_derived: localStorage["domain_implementation_derived_path"]
                }
              )
              .then(response => {
                document.getElementById("Start/Next").disabled = false;
                if (response.data == "") {
                  this.previous_dest = "";
                  document.getElementById("notification").value =
                    "Customization point not found, verify current file";
                } else if (response.data == "file") {
                  this.file_dest = destination;
                  document.getElementById("filetouploadtr").style.display = "";
                  document.getElementById("customized").disabled = true;
                } else {
                  this.previous_dest = destination;
                  this.previous_cpoint = model_datax[1];
                  this.previous_plan = model_datax[2];
                  document.getElementById("default").value = response.data;
                  document.getElementById("customized").value = response.data;
                }
              })
              .catch(e => {
                this.previous_dest = "";
                document.getElementById("Start/Next").disabled = false;
              });
          }
          this.customization_cus_pos++;
        } else {
          let customized_content = document.getElementById("customized").value;
          if (this.previous_dest != "" && customized_content != "") {
            let model_datax = [];
            model_datax[0] = this.previous_dest;
            model_datax[1] = this.previous_cpoint;
            model_datax[2] = this.previous_plan;
            model_datax[3] = customized_content;
            this.model_data = JSON.stringify(model_datax);
            axios
              .post(
                localStorage["domain_implementation_main_path"] +
                  "ComponentImplementation/customize/onlysave",
                {
                  data: this.model_data,
                  p_pool: localStorage["domain_implementation_pool_path"],
                  p_derived: localStorage["domain_implementation_derived_path"]
                }
              )
              .then(response => {
                //
              })
              .catch(e => {
                this.previous_dest = "";
              });
          }
          this.previous_dest = "";
          document.getElementById("current").value = "";
          document.getElementById("default").value = "";
          document.getElementById("customized").value = "";
          document.getElementById("notification").value =
            "Component succesfully customized, click Start/Next to continue with another component";
          this.customization_cus_pos = 0;
          this.customization_comp_pos++;
        }
      } else {
        let c_header = modalH3("Customization response");
        let c_body = modalSimpleText("Customization completed");
        setupModal(c_header, c_body);
      }
    },
    send_file(event) {
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios
        .post(
          localStorage["domain_implementation_main_path"] +
            "ComponentImplementation/uploadfile?dest=" +
            this.file_dest +
            "&p_derived=" +
            localStorage["domain_implementation_derived_path"],
          formData,
          {
            headers: {
              "Content-Type": undefined
            }
          }
        )
        .then(response => {
          if (response.data == "uploaded") {
            document.getElementById("notification").value =
              "File succesfully uploaded";
          } else {
            document.getElementById("notification").value =
              "Error uploading the file";
          }
        })
        .catch(function() {
          document.getElementById("notification").value =
            "Error uploading the file";
        });
    },
    find_destination_file(id) {
      //collect the information of the components and files to be customized
      let component_root = this.current_graph.getModel().getCell("component");
      let component_relations = this.current_graph
        .getModel()
        .getChildEdges(component_root);

      let destination = "";

      for (let i = 0; i < component_relations.length; i++) {
        let source = component_relations[i].source.getAttribute("label");
        if (source == id) {
          return component_relations[i].source.getAttribute("destination");
          break;
        }
      }

      return "";
    },
    component()
    {
      let c_header = modalH3("Monitoring");
      let default_vals=["target_system"]
      let texts = ["Target system to be controlled: "];
      let inputs = ["target_system"];
      
      let c_body = modalInputTexts(texts, inputs, default_vals);
      let c_footer = modalButton(this.$t("modal_save"), this.generate_graph, this.pid);
     
     
      setupModal(c_header, c_body, c_footer);

      

    },
    generate_graph() {
      let c_header = modalH3(this.$t("generate_graph_title"));
      let value_label=document.getElementById('target_system').value;
      let blank=""
      let c_footer = modalButton("Return", this.component);
      let lista = [];
  
      setupModal(c_header,blank,c_footer);
      let main_modal = document.getElementById("main_modal_body");
      let canvas = document.createElement("canvas");
      
      let prueb2 = [];
      let timef = [];
      let names = [];
      let feedback_control = this.current_graph.getModel().getCell("control");
      let target_system_vertices = this.current_graph.getModel().getChildVertices(feedback_control);
      //navigates through the feature model childs
      for (let i = 0; i < target_system_vertices.length; i++)
       {
        if(target_system_vertices[i].getAttribute("type")=="target_system")
        {
          let target_sys = target_system_vertices[i].getAttribute("label");
          names.push(target_sys)
        }
      }

  

      //  target system variables
      let target;// 
      let target_system_id; // target system id
      let proportional;// proportional value of the target system element
      let derivate;// derivate value of the target system element
      let integral;// integral value of the target system element
      let target_system_relations; // relations target system

      // controller variables
      let id_controller;// controller id
      let controller_relations; // controller relations

      // summing point variables
      let id_summing; // summing point id
      let summing_relations; // summing relations

      // filter variables
      let id_filter; // filter relations
      let filter_relations;

      // set point variables
      let setpoint_value; // value setpoint
      let setpoint_time; // time setpoint
      let setpoints=[]; // array
      let id_set;// id setpoint
      let times=[];

      // branch variables
      let id_branch// id branchpoint
      let branch_relations_targets// target relations branchpoint
      let branch_relations// source relations branchpoint

      // output variables
      let id_output// id output

      // transducer variables
      let value_transducer// value transducer

      let feedback_root = this.current_graph.getModel().getCell("control");
      let childs = this.current_graph.getModel().getChildEdges(feedback_root);
      

      for (let i = 0; i < names.length; i++) 
      {    
        if ( value_label== names[i]  )
        {

          

           for (let i = 0; i < childs.length; i++)
            {
              let source = childs[i].source;
              if(source.getAttribute("type")=="target_system" )
                { //only selected concrete features are analyzed
                   target_system_id = source.getId();
                   proportional = source.getAttribute("Proportional");
                   derivate = source.getAttribute("Derivate");
                   integral = source.getAttribute("Integral"); 
                   
                      
                }

           
            }

            

            target_system_relations = this.current_graph.getModel().getIncomingEdges
            (this.current_graph.getModel().getCell(target_system_id));
            for (let i = 0; i < target_system_relations.length; i++)
            {
            let source = target_system_relations[i].source;    
            if(source.getAttribute("type")=="controller")
              { 
                id_controller = source.getId();
                proportional = source.getAttribute("Proportional");
                derivate = source.getAttribute("Derivate");
                integral = source.getAttribute("Integral"); 
              }
         
            }

            controller_relations = this.current_graph.getModel().getIncomingEdges
            (this.current_graph.getModel().getCell(id_controller));
      
            for (let i = 0; i < controller_relations.length; i++)
            {
              let source = controller_relations[i].source;
              if(source.getAttribute("type")=="summing_point"  )
              {
                id_summing = source.getId();      
              } 
            }

            summing_relations = this.current_graph.getModel().getIncomingEdges
            (this.current_graph.getModel().getCell(id_summing));
            for (let i = 0; i < summing_relations.length; i++)
            {
              let source = summing_relations[i].source;

              if(source.getAttribute("type")=="filter")
              {
                id_filter = source.getId(); 
              }
              else if(source.getAttribute("type")=="set_point"  )
              { 
                id_set = source.getId(); 
                setpoint_value = source.getAttribute("SetPoint"); 
                setpoints.push(setpoint_value);
                setpoint_time = source.getAttribute("Time");
                times.push(setpoint_time);
              }    
            }
               filter_relations =  this.current_graph.getModel().getIncomingEdges
              ( this.current_graph.getModel().getCell(id_filter));
            for (let i = 0; i < filter_relations.length; i++)
            {
               let source = filter_relations[i].source;
              if(source.getAttribute("type")=="branchpoint")
              {
                id_branch = source.getId(); 
              }
              else if(source.getAttribute("type")=="transducer")
              {
                id_branch = source.getId();
                value_transducer=source.getAttribute("InitialPosition");
              }   
            }

            branch_relations_targets =this.current_graph.getModel().getOutgoingEdges
            (this.current_graph.getModel().getCell(id_branch));
            for (let i = 0; i < branch_relations_targets.length; i++)
            {
                let target = branch_relations_targets[i].target;
              if(target.getAttribute("type")=="measured_output")
              {
                id_output= target.getId()
              }
            }

           branch_relations = this.current_graph.getModel().getIncomingEdges
           (this.current_graph.getModel().getCell(id_branch));
          for(let i = 0; i < branch_relations.length; i++)
          {
            let source = branch_relations[i].source;
            if(source.getId() == target_system_id)
            {
            alert("termino");
            }
          }

        }

      }

    

    
      let MiniPID = (function() {
        function MiniPID(kp, ki, kd, dt) {
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
        MiniPID.prototype.getOutput = function(actual, setpoint) {
           var output;
        var Poutput;
        var Ioutput;
        var Doutput;
        var Foutput;
        this.setpoint = setpoint;
        if (this.setpointRange !== 0) {
            setpoint = this.constrain(setpoint, actual - this.setpointRange, actual + this.setpointRange);
        }
        var error = setpoint - actual;
        Foutput = this.F * setpoint;
        Poutput = this.P * error;
        if (this.firstRun) {
            this.lastActual = actual;
            this.lastOutput = Poutput + Foutput;
            this.firstRun = false;
        }
        Doutput = this.D * ((actual - this.lastActual)/this.DT);
        this.lastActual = actual;

        

        Ioutput = this.I * (this.errorSum*this.DT);
        if (this.maxIOutput !== 0) {
            Ioutput = this.constrain(Ioutput, -this.maxIOutput, this.maxIOutput);
        }
        output = Foutput + Poutput + Ioutput + Doutput;
        if (this.minOutput !== this.maxOutput && !this.bounded(output, this.minOutput, this.maxOutput)) {
            this.errorSum = error;
        }
        else if (this.outputRampRate !== 0 && !this.bounded(output, this.lastOutput - this.outputRampRate, this.lastOutput + this.outputRampRate)) {
            this.errorSum = error;
        }
        else if (this.maxIOutput !== 0) {
            this.errorSum = this.constrain(this.errorSum + error, -this.maxError, this.maxError);
        }
        else {
            this.errorSum += error;
        }
        if (this.outputRampRate !== 0) {
            output = this.constrain(output, this.lastOutput - this.outputRampRate, this.lastOutput + this.outputRampRate);
        }
        if (this.minOutput !== this.maxOutput) {
            output = this.constrain(output, this.minOutput, this.maxOutput);
        }
        if (this.outputFilter !== 0) {
            output = this.lastOutput * this.outputFilter + output * (1 - this.outputFilter);
        }
        this.lastOutput = output;
        return output;
    };
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
        return MiniPID;
      })();
      let control_loop = [];
      let listaset=[];
      function main() {
          let miniPID;
          miniPID = new MiniPID(proportional, integral, derivate, setpoint_time);
         // let actual = parseInt(sensor);//
          let actual=0
          let output = 0;
          let times_sum=0;
          alert(setpoint_time)
          let time_float=parseFloat(setpoint_time)
          alert(t)
          for (let i = 0; i < 150; i++) {
            output = miniPID.getOutput(actual, setpoint_value);
            actual = actual + output;
            prueb2.push(actual);
            times_sum=i*time_float;
            times.push(times_sum)
          }
          return prueb2;
          
          
         
        }
        control_loop = main();

        console.log(times)


       

      
      
     

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
      
    },
    adaptation_state_source_code_generation() {
      try {
        let serverUrl =
          localStorage["domain_implementation_main_path"] +
          "AdaptationStateImplementation/generateSourceCode";
        alert(serverUrl);
        let directory = localStorage["domain_implementation_pool_path"];
        alert(directory);
        let modelJson = adaptation_state_actions(
          this.current_graph,
          "serializeJson"
        );
        alert(modelJson);
        downloadFile("BindingStateHardwareModel.json", modelJson);
        axios
          .post(serverUrl, {
            data: modelJson,
            p_pool: directory
          })
          .then(response => {
            downloadFile("Arduino.ino", response.data);
          })
          .catch(e => {
            this.previous_dest = "";
            document.getElementById("Start/Next").disabled = false;
          });
      } catch (ex) {
        alert(ex);
      }
      return "";
    }
  }
};
</script>
<style scoped>
</style>
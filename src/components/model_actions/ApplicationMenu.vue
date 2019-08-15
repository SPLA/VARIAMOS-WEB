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
      <a @click="generate_graph()" class="dropdown-item">{{ $t("generate_graph") }}</a>
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
import { uptime } from 'os';

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
      var c_header = modalH3(this.$t("application_menu_set_app"));
      var default_vals = "";
      var texts = [this.$t("domain_implementation_derived_path")];
      var inputs = ["server_derived_path"];
      if (localStorage["domain_implementation_pool_path"]) {
        default_vals = [localStorage["domain_implementation_derived_path"]];
      } else {
        default_vals = ["uploads/component_derived/"];
      }
      var c_body = modalInputTexts(texts, inputs, default_vals);
      var c_footer = modalButton(this.$t("modal_save"), this.save_parameters);
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
            var c_header = modalH3(
              this.$t("models_actions_derivation_response")
            );
            var c_body = modalSimpleText(response.data);
            setupModal(c_header, c_body);
          })
          .catch(e => {
            this.errors.push(e);
            var c_header = modalH3(this.$t("modal_error"), "error");
            console.log(this.$t("model_actions_backend_problem"));
            var c_body = modalSimpleText(
              e + this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
          });
      } else {
        var c_header = modalH3(this.$t("modal_error"), "error");
        var c_body = modalSimpleText(
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
            var c_header = modalH3(
              this.$t("models_actions_derivation_response")
            );
            var c_body = modalSimpleText(response.data);
            setupModal(c_header, c_body);
          })
          .catch(e => {
            this.errors.push(e);
            var c_header = modalH3(this.$t("modal_error"), "error");
            console.log(this.$t("model_actions_backend_problem"));
            var c_body = modalSimpleText(
              e + this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
          });
      } else {
        var c_header = modalH3(this.$t("modal_error"), "error");
        var c_body = modalSimpleText(
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
          var c_header = modalH3(this.$t("modal_error"), "error");
          var c_body = modalSimpleText("No components to customize");
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
                var default_vals = ["", "", "", "", ""];
                var c_header = modalH3("Start Customization Process");
                var texts = [
                  "Current file",
                  "Default content",
                  "New customized content",
                  "File to upload",
                  "Notification"
                ];
                var inputs = [
                  "current",
                  "default",
                  "customized",
                  "filetoupload",
                  "notification"
                ];
                var c_body = modalCustomization(texts, inputs, default_vals);
                var c_footer = modalButton(
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
                var c_header = modalH3(this.$t("modal_error"), "error");
                console.log(this.$t("model_actions_backend_problem"));
                var c_body = modalSimpleText(
                  e + this.$t("model_actions_backend_problem")
                );
                setupModal(c_header, c_body);
              });
          } else {
            var c_header = modalH3("Customization response");
            var c_body = modalSimpleText("customization completed");
            setupModal(c_header, c_body);
          }
        }
      } else {
        var c_header = modalH3(this.$t("modal_error"), "error");
        var c_body = modalSimpleText(
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
          var current_pos = 2 + this.customization_cus_pos * 3;
          document.getElementById("notification").value = "";
          document.getElementById("default").value = "";
          var customized_content = "";
          if (this.previous_dest != "") {
            customized_content = document.getElementById("customized").value;
          }
          document.getElementById("customized").value = "";
          document.getElementById(
            "current"
          ).value = this.customization_response[this.customization_comp_pos][
            current_pos
          ];
          var destination = this.find_destination_file(
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
            var model_datax = [];
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
          var customized_content = document.getElementById("customized").value;
          if (this.previous_dest != "" && customized_content != "") {
            var model_datax = [];
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
        var c_header = modalH3("Customization response");
        var c_body = modalSimpleText("Customization completed");
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
      var component_root = this.current_graph.getModel().getCell("component");
      var component_relations = this.current_graph
        .getModel()
        .getChildEdges(component_root);

      var destination = "";

      for (var i = 0; i < component_relations.length; i++) {
        var source = component_relations[i].source.getAttribute("label");
        if (source == id) {
          return component_relations[i].source.getAttribute("destination");
          break;
        }
      }

      return "";
    },

    generate_graph() {
      var c_header = modalH3(this.$t("generate_graph_title"));
      /*var c_body = modalSimpleText("");*/
      setupModal(c_header);
      var main_modal = document.getElementById("main_modal_body");
      var canvas = document.createElement("canvas");
    

      canvas.id = "myChart";
      canvas.width = 800;
      canvas.height = 300;
      canvas.className = "my-4 chartjs-render-monitor";
      main_modal.appendChild(canvas);
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: "line",
         data: {
          labels: this.time(),
          datasets: [
            {
              data: this.pid(),
              label: "PV",
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#D83A18",
              borderWidth: 2,
              pointBackgroundColor: "#D83A18",
              pointBorderColor: "transparent",
              pointBackgroundColor:"transparent",
              pointBorderWidth:0
              
            
               
            },
             {
              data: this.setpoint(),
              label: "Set Point",
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#007bff",
              borderWidth: 2,
              pointBackgroundColor: "#007bff",
              pointBorderColor: "transparent",
              pointBackgroundColor:"transparent",
              pointBorderWidth:0
              
            },

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
            display: true,
          }
        }
      });
    },
   
     setpoint()
    {
      var setpoint=[]
      var feedback_root = this.current_graph.getModel().getCell("control");
      var childs = this.current_graph.getModel().getChildVertices(feedback_root);
       for (var i = 0; i < childs.length; i++)
        {
          if (childs[i].getAttribute("type") == "set_point")
          {
          var set = childs[i].getAttribute("SetPoint");
          }
        }
            for (var i = 0; i < 150; i++)
             {
             
           
            setpoint.push(set);
            }
          return setpoint



    },

    time()
    {
      var timef = [];
      var timeto = 0;
      var tiempoDecimal =0
      var feedback_root = this.current_graph.getModel().getCell("control");
      var childs = this.current_graph.getModel().getChildVertices(feedback_root);
       for (var i = 0; i < childs.length; i++)
        {
          if (childs[i].getAttribute("type") == "set_point")
          {
          var set = childs[i].getAttribute("SetPoint");
          var ti = childs[i].getAttribute("Time");
          }
        }
            for (var i = 0; i < 40; i++)
             {
              if (i > 0) 
              {
                timeto = i * ti;
              }
            tiempoDecimal = timeto.toFixed(2);
            timef.push(tiempoDecimal);
            }
          return timef
    },
    pid() {
      var prueb2 = [];
      var timef = [];
      var feedback_root = this.current_graph.getModel().getCell("control");
      var childs = this.current_graph.getModel().getChildVertices(feedback_root);
      var names = [];
      var nuevoSensor = 0;

      //navigates through the feature model childs
      for (var i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("type") == "controller") {
          var proportional = childs[i].getAttribute("Proportional");
          var derivate = childs[i].getAttribute("Derivate");
          var integral = childs[i].getAttribute("Integral");
        }
        if (childs[i].getAttribute("type") == "set_point") {
          var set = childs[i].getAttribute("SetPoint");
          var ti = childs[i].getAttribute("Time");
        }
        if (childs[i].getAttribute("type") == "sensor") {
          var sensor = childs[i].getAttribute("InitialPosition");
          nuevoSensor = sensor;
        }
        else{
          nuevoSensor=0;
        }
      }
      var MiniPID = (function() {
        function MiniPID(kp, ki, kd, dt) {
          this.P = 0;
          this.I = 0;
          this.D = 0;
          this.F = 0;
          this.DT=0;
          this.maxIOutput = 0;
          this.maxError = 0;
          this.errorSum = 0;
          this.maxOutput = 0;
          this.minOutput = 0;
          this.setpoint = 0;
          this.lastActual = 0;
          this.lastError=0;
          this.firstRun = true;
          this.reversed = false;
          this.outputRampRate = 0;
          this.lastOutput = 0;
          this.dt=0;
          this.outputFilter = 0;
          this.setpointRange = 0;
          this.P = kp;
          this.I = ki;
          this.D = kd;
          this.DT=dt;
          this.checkSigns();
        }
        MiniPID.prototype.getOutput = function(actual, setpoint) {
          var output;
          var Poutput;
          var Ioutput;
          var Doutput;
          var Foutput;
          this.setpoint = setpoint;
          if (this.setpointRange !== 0) 
            {
              setpoint = this.constrain(setpoint,actual - this.setpointRange,actual + this.setpointRange);
            }

            
            

          var error = setpoint - actual;// error 
          Foutput = this.F * setpoint; 
          Poutput = this.P * error; // Proportional value
           
          if (this.firstRun) {
            this.lastActual = actual;
            this.lastError= error;
            this.lastOutput = Poutput + Foutput;







            
            this.firstRun = false;
          }

          var dError = (actual - this.lastActual)/this.DT;  // derivate error
            this.lastActual = actual;

         
          Doutput = -this.D * dError;
                
                Ioutput = this.I * (this.errorSum*this.DT);

          if (this.maxIOutput !== 0) {
            Ioutput = this.constrain(
              Ioutput,
              -this.maxIOutput,
              this.maxIOutput
            );
          }
          output = Foutput + Poutput + Ioutput + Doutput; 
          if (
            this.minOutput !== this.maxOutput &&
            !this.bounded(output, this.minOutput, this.maxOutput)
          ) {
            this.errorSum = error;
          } else if (
            this.outputRampRate !== 0 &&
            !this.bounded(
              output,
              this.lastOutput - this.outputRampRate,
              this.lastOutput + this.outputRampRate
            )
          ) {
            this.errorSum = error;
          } else if (this.maxIOutput !== 0) {
            this.errorSum = this.constrain(
              this.errorSum + error,
              -this.maxError,
              this.maxError
            );
          } else {
            this.errorSum += error;
          }
          if (this.outputRampRate !== 0) {
            output = this.constrain(
              output,
              this.lastOutput - this.outputRampRate,
              this.lastOutput + this.outputRampRate
            );
          }
          if (this.minOutput !== this.maxOutput) {
            output = this.constrain(output, this.minOutput, this.maxOutput);
          }
          if (this.outputFilter !== 0) {
            output =
              this.lastOutput * this.outputFilter +
              output * (1 - this.outputFilter);
          }
          this.lastOutput = output;
          return output;
        };
        MiniPID.prototype.constrain = function(value, min, max) {
          if (value > max) {
            return max;
          }
          if (value < min) {
            return min;
          }
          return value;
        };
        MiniPID.prototype.bounded = function(value, min, max) {
          return min < value && value < max;
        };
        MiniPID.prototype.setSetpointRange = function(range) {
          this.setpointRange = range;
        };
        MiniPID.prototype.setSetpoint = function(setpoint) {
          this.setpoint = setpoint;
        };
        MiniPID.prototype.setOutputLimits$double = function(output) {
          this.setOutputLimits$double$double(-output, output);
        };
        MiniPID.prototype.setMaxIOutput = function(maximum) {
          this.maxIOutput = maximum;
          if (this.I !== 0) {
            this.maxError = this.maxIOutput / this.I;
          }
        };
        MiniPID.prototype.setOutputLimits$double$double = function(
          minimum,
          maximum
        ) {
          if (maximum < minimum) return;
          this.maxOutput = maximum;
          this.minOutput = minimum;
          if (this.maxIOutput === 0 || this.maxIOutput > maximum - minimum) {
            this.setMaxIOutput(maximum - minimum);
          }
        };
        MiniPID.prototype.setOutputLimits = function(minimum, maximum) {
          if (
            (typeof minimum === "number" || minimum === null) &&
            (typeof maximum === "number" || maximum === null)
          ) {
            return this.setOutputLimits$double$double(minimum, maximum);
          } else if (
            (typeof minimum === "number" || minimum === null) &&
            maximum === undefined
          ) {
            return this.setOutputLimits$double(minimum);
          } else throw new Error("invalid overload");
        };
        /*private*/ MiniPID.prototype.checkSigns = function() {
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
      
    
      function main()
      {
          var miniPID;
          miniPID = new MiniPID(proportional, integral, derivate, ti);
          miniPID.setOutputLimits$double(100);
          miniPID.setSetpointRange(10);
          var target = set;
          var actual = parseInt(sensor);
          var output = 0;
          miniPID.setSetpoint(0);
          miniPID.setSetpoint(target);
          console.log("Entrada\tPosicion\tSalida\tError\tTiempo\n");
          for (var i = 0; i < 150; i++) {
            output = miniPID.getOutput(actual, target);
            actual = actual + output;
            prueb2.push(actual);
            /*var ouputdecimal = output.toFixed(2);
            var error = (target - actual).toFixed(2);
            var actualdecimal = actual.toFixed(2);*/
           /* console.log(target,"    ",actualdecimal," ",ouputdecimal," ",error," ",tiempoDecimal);*/
          }
          return prueb2
        }
        /*Time control*/
       

      var d=[];
      d=main()
      
       

       return d
    }
  }
};
</script>


<style scoped>
</style>
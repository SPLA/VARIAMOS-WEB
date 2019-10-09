<template>
  <div>
    <a @click="component()" class="dropdown-item">{{ $t("generate_graph") }}</a>
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
    component() {
      // let url = document.URL;
      // var captured = /controlAction=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
      //var controlAction = captured ? captured : 'myDefaultValue';

      var controlAction =
        localStorage["adaptation_binding_state_hardware_controlAction"];

      this.generate_graph(controlAction);
    },
    generate_graph(controlActionLabel) {
      //GENERATE_TRANSFER_CONTROL_GRAPH
      //alert(controlActionLabel);
      let c_header = modalH3(this.$t("generate_graph_title"));
      let value_label = controlActionLabel;
      let blank = "";
      let c_footer = modalButton("Return", this.component);
      let lista = [];

      let result_outputs = [];
      let result_outputs2 = [];
      let result = [];
      let timef = [];
      let names = [];
      let feedback_root = this.current_graph.getModel().getCell("control");
      let childs = this.current_graph
        .getModel()
        .getChildVertices(feedback_root);
      //navigates through the feature model childsld
      for (let i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("type") == "controlAction") {
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
        if (value_label == names[i]) {
          setupModal(c_header, blank, c_footer);
          let main_modal = document.getElementById("main_modal_body");
          let canvas = document.createElement("canvas");

          for (let i = 0; i < childs.length; i++) {
            if (childs[i].getAttribute("type") == "controlAction") {
              //only selected concrete features are analyzed

              if (childs[i].getAttribute("label") == value_label) {
                target_system_id = childs[i].getId();
                proportional = childs[i].getAttribute("Proportional");
                derivate = childs[i].getAttribute("Derivate");
                integral = childs[i].getAttribute("Integral");
                list_elements.push(target_system_id);
              }
            }
          }
          target_system_relations = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(target_system_id)
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
          controller_inner_relations = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(id_summing_plant)
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

          controller_inner_relations = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(id_controller_inner)
            );

          for (let i = 0; i < controller_inner_relations.length; i++) {
            let source = controller_inner_relations[i].source;
            if (source.getAttribute("type") == "summing_point") {
              id_summing = source.getId();

              list_elements.push(id_summing);
              summing_value_inner = source.getAttribute("Direction");
            }
          }

          summing_relations = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(id_summing)
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
            if (source.getAttribute("type") == "controlAction") {
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

          controller_relations = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(id_controller)
            );
          for (let i = 0; i < controller_relations.length; i++) {
            let source = controller_relations[i].source;
            if (source.getAttribute("type") == "summing_point") {
              id_initial_summing = source.getId();
              list_elements.push(id_initial_summing);
              summing_value = source.getAttribute("Direction");
            }
          }
          summing_relations2 = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(id_initial_summing)
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
          filter_relations = this.current_graph
            .getModel()
            .getIncomingEdges(this.current_graph.getModel().getCell(id_filter));
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
          transducer_relations = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(id_transducer)
            );
          for (let i = 0; i < transducer_relations.length; i++) {
            let source = transducer_relations[i].source;
            if (source.getAttribute("type") == "branchpoint") {
              id_final_branch = source.getId();
              list_elements.push(id_branch);
            }
          }
          branch_relations_targets = this.current_graph
            .getModel()
            .getOutgoingEdges(
              this.current_graph.getModel().getCell(id_final_branch)
            );
          for (let i = 0; i < branch_relations_targets.length; i++) {
            let target = branch_relations_targets[i].target;
            if (target.getAttribute("type") == "measured_output") {
              id_output = target.getId();
              list_elements.push(id_output);
            }
          }
          final_branch_relations = this.current_graph
            .getModel()
            .getIncomingEdges(
              this.current_graph.getModel().getCell(id_final_branch)
            );
          for (let i = 0; i < final_branch_relations.length; i++) {
            let source = final_branch_relations[i].source;

            if (source.getAttribute("type") == "branchpoint") {
              id_branch = source.getId();

              list_elements.push(id_branch);
            }
          }

          branch_relations = this.current_graph
            .getModel()
            .getIncomingEdges(this.current_graph.getModel().getCell(id_branch));
          for (let i = 0; i < branch_relations.length; i++) {
            let source = branch_relations[i].source;
            if (
              source.getId() == target_system_id &&
              source.getAttribute("type") == "controlAction"
            ) {
              id_final = source.getId();
            }
          }

          let feedback_root = this.current_graph.getModel().getCell("control");
          let childs2 = this.current_graph
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
              this.current_graph.getModel().setVisible(childs2[i], false);
            } else {
              this.current_graph.getModel().setVisible(childs2[i], true);
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
              Doutput = Doutput =
                -this.D * ((actual - this.lastActual) / this.DT);
              this.lastActual = actual;

              Ioutput = this.I * this.errorSum;
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
                this.errorSum = error * this.DT;
              } else if (
                this.outputRampRate !== 0 &&
                !this.delimited(
                  output,
                  this.lastOutput - this.outputRampRate,
                  this.lastOutput + this.outputRampRate
                )
              ) {
                this.errorSum = error * this.DT;
              } else if (this.maxIOutput !== 0) {
                this.errorSum = this.limit(
                  this.errorSum + error,
                  -this.maxError,
                  this.maxError
                );
              } else {
                this.errorSum += error * this.DT;
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
            let actual = 0;
            let output = 50;
            let actual2;
            let error = 0;
            result_outputs.push(actual);
            let times_sum = 0;
            let time_float = parseFloat(setpoint_time);
            miniPID.setmaxIOutput(2);
            miniPID.RampRateOutput(3);
            if (summing_value_inner == "-/+" || summing_value_inner == "-/-") {
              miniPID.reversedf();
            }
            if (id_set2 == false) {
              for (let i = 0; i < 150; i++) {
                output = miniPID.getOutput(actual, setpoint_value, error);
                if (summing_value_inner == "+/-") {
                  error = setpoint_value - actual;
                } else if (summing_value_inner == "+/+") {
                  error = setpoint_value + actual;
                } else {
                  error = setpoint_value - actual;
                }
                actual = actual + output;
                result_outputs.push(actual);
                times_sum = i * time_float.toFixed(2);
                times_sum = times_sum.toFixed(2);
                times.push(times_sum);
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
                if (summing_value == "+/-") {
                  error = setpoint_value - actual;
                } else if (summing_value == "+/+") {
                  error = setpoint_value + actual;
                }
                actual = actual + output;
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
                result_outputs2.push(actual2);
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
        }
      }
    }
  }
};
</script>


<style scoped>
</style>
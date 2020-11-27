<template>
  <li class="nav-item dropdown">
    <a
      class="nav-link dropdown-toggle"
      id="navbarDropdown"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
      >{{ $t("application_menu") }}</a
    >
    <div
      id="application-menu"
      class="dropdown-menu"
      aria-labelledby="navbarDropdown"
    >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="set_parameters()"
        class="dropdown-item"
        >{{ $t("application_menu_set_app") }}</a
      >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="execute_derivation()"
        class="dropdown-item"
        >{{ $t("domain_implementation_execute") }}</a
      >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="customize_derivation()"
        class="dropdown-item"
        >{{ $t("domain_implementation_customize") }}</a
      >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="verify_derivation()"
        class="dropdown-item"
        >{{ $t("domain_implementation_verify") }}</a
      >
      <a
        data-menudisplay="['adaptation_state','adaptation_hardware','adaptation_behavior_hardware','adaptation_behavior_states','adaptation_behavior_transitions','control']"
        @click="adaptation_state_source_code_generation()"
        class="dropdown-item"
        >Source code generation</a
      >
      <a
        data-menudisplay="['adaptation_architecture']"
        @click="adaptation_state_import_from_architecture()"
        class="dropdown-item"
        >Import from domain architecture model</a
      >
      <a
        data-menudisplay="['adaptation_hardware']"
        @click="adaptation_state_generate_hardware_from_architecture()"
        class="dropdown-item"
        >Generate from architecture</a
      >    
      <component
        :is="dynamicComponent"
        :current_graph="current_graph"
      ></component>
    </div>
    <vue-snotify></vue-snotify>
  </li>
</template>

<script>
import Vue from "vue";
import axios from "axios";

import Snotify, { SnotifyPosition, SnotifyToast } from "vue-snotify";
import VueClipboard from "vue-clipboard2";

import di_actions from "@/assets/js/models/actions/domain_implementation/di_actions.js";
import "@/assets/js/chart/Chart.min.js";

import {
  setupModal,
  modalH3,
  modalSimpleText,
  modalInputTexts,
  modalCustomization,
  modalButton,
  downloadFile,
} from "../../assets/js/common/util.js";

import "vue-snotify/styles/material.css";
import adaptation_state_actions from "@/assets/js/models/actions/domain_implementation/adaptation_state_actions.js";

VueClipboard.config.autoSetContainer = true;
Vue.config.productionTip = false;
Vue.use(Snotify);
Vue.use(VueClipboard);

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
      errors: [], //errors
    };
  },
  props: {
    current_graph: {
      type: Object,
      required: true,
    },
    model_type: {
      type: String,
      required: true,
    },
  },
  computed: {
    // load dynamic application menu actions
    dynamicComponent() {
      this.compo = "./" + this.model_type + "/ApplicationActions.vue";
      let compo = "./" + this.model_type + "/ApplicationActions.vue";
      if (this.model_type == "") {
        // nothing
      } else {
        try {
          let test = require(`${compo}`);
          function imp() {
            return import(`${compo}`);
          }
          return imp;
        } catch (ex) {
          return null;
        }
      }
    },
  },
  methods: {
    // clipboard copy
    doCopy(text) {
      this.$copyText(text).then(
        function(e) {
          console.log(e);
        },
        function(e) {
          console.log(e);
        }
      );
    },
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
              p_derived: localStorage["domain_implementation_derived_path"],
            }
          )
          .then((response) => {
            let c_header = modalH3(
              this.$t("models_actions_derivation_response")
            );
            let c_body = modalSimpleText(response.data);
            setupModal(c_header, c_body);
          })
          .catch((e) => {
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
              p_derived: localStorage["domain_implementation_derived_path"],
            }
          )
          .then((response) => {
            let c_header = modalH3(
              this.$t("models_actions_derivation_response")
            );
            let c_body = modalSimpleText(response.data);
            setupModal(c_header, c_body);
          })
          .catch((e) => {
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
                  p_derived: localStorage["domain_implementation_derived_path"],
                }
              )
              .then((response) => {
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
                  "Notification",
                ];
                let inputs = [
                  "current",
                  "default",
                  "customized",
                  "filetoupload",
                  "notification",
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
              .catch((e) => {
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
                  p_derived: localStorage["domain_implementation_derived_path"],
                }
              )
              .then((response) => {
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
              .catch((e) => {
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
                  p_derived: localStorage["domain_implementation_derived_path"],
                }
              )
              .then((response) => {
                //
              })
              .catch((e) => {
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
              "Content-Type": undefined,
            },
          }
        )
        .then((response) => {
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
    adaptation_state_source_code_generation() {
      try {
        ///let serverUrl = localStorage["domain_implementation_main_path"] + "AdaptationStateImplementation/generateSourceCode";
        let serverUrl = localStorage["domain_implementation_main_path"];

        if (!serverUrl.endsWith("/")) {
          serverUrl += "/";
        }

        serverUrl += "json/test-api";
        // alert(serverUrl);

        let directory = "MiProyecto"; // localStorage["domain_implementation_pool_path"];
        //alert(directory);
        let modelJson = adaptation_state_actions(
          this.current_graph,
          "serializeJson"
        );

        var strModelJson = JSON.stringify(modelJson);
        // alert(strModelJson);
        // downloadFile("BindingStateHardwareModel.json", strModelJson);

        var createCORSRequest = function(method, url) {
          var xhr = new XMLHttpRequest();
          if ("withCredentials" in xhr) {
            // Most browsers.
            xhr.open(method, url, true);
          } else if (typeof XDomainRequest != "undefined") {
            // IE8 & IE9
            xhr = new XDomainRequest();
            xhr.open(method, url);
          } else {
            // CORS not supported.
            xhr = null;
            return;
          }
          return new Promise((resolve, reject) => {
            xhr.onreadystatechange = function() {
              if (xhr.readyState !== 4) return;
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr);
              } else {
                reject({
                  status: xhr.status,
                  statusText: xhr.statusText,
                });
              }
            };
            xhr.send(strModelJson);
          });
        };

        var url = serverUrl;
        var method = "POST";
        let vm = this;

        let snotifyPromise = new Promise((resolve, reject) => {
          createCORSRequest(method, url, snotifyPromise)
            .then((xhr) =>
              resolve({
                title: "Completed",
                body: "The code has been generated.",
                config: {
                  closeOnClick: true,
                  timeout: 10000,
                  showProgressBar: true,
                  closeOnClick: false,
                  pauseOnHover: true,
                  buttons: [
                    {
                      text: "Copy",
                      action: () => vm.doCopy(xhr.responseText),
                      bold: true,
                    },
                    {
                      text: "Get INO",
                      action: () =>
                        downloadFile("Arduino.ino", xhr.responseText),
                      bold: true,
                    },
                    {
                      text: "Get JSON",
                      action: () => downloadFile("Arduino.json", strModelJson),
                      bold: true,
                    },
                    {
                      text: "Close",
                      action: (toast) => vm.$snotify.remove(toast.id),
                    },
                  ],
                },
              })
            )
            .catch(() =>
              reject({
                title: "Error",
                body: "We got an error!",
                config: {
                  closeOnClick: true,
                },
              })
            );
        });

        vm.$snotify.async("Generating code...", "Task", () => snotifyPromise);
      } catch (ex) {
        alert(ex);
      }
      return "";
    },
    adaptation_state_import_from_architecture() {
      adaptation_state_actions(this.current_graph, "importFromArchitecture");
    },
    adaptation_state_generate_hardware_from_architecture() {
      adaptation_state_actions(
        this.current_graph,
        "generateHardwareFromArchitecture"
      );
    },
  },
};
</script>
<style scoped></style>

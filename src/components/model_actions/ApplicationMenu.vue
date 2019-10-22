
<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("application_menu") }}
    </a>
    <div id="application-menu" class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a data-menudisplay="['feature','component','binding_feature_component']" @click="set_parameters()" class="dropdown-item">{{ $t("application_menu_set_app") }}</a>
      <a data-menudisplay="['feature','component','binding_feature_component']" @click="execute_derivation()" class="dropdown-item">{{ $t("domain_implementation_execute") }}</a>      
      <a data-menudisplay="['feature','component','binding_feature_component']" @click="customize_derivation()" class="dropdown-item">{{ $t("domain_implementation_customize") }}</a>
      <a data-menudisplay="['feature','component','binding_feature_component']" @click="verify_derivation()" class="dropdown-item">{{ $t("domain_implementation_verify") }}</a>
      <a data-menudisplay="['adaptation_state','adaptation_hardware','adaptation_binding_state_hardware']" @click="adaptation_state_source_code_generation()" class="dropdown-item">Source code generation</a>
      <component :is="dynamicComponent" :current_graph="current_graph"></component>

    </div>

  </li>
</template>

<script>
import axios from "axios";
import di_actions from '@/assets/js/models/actions/domain_implementation/di_actions.js';
import "@/assets/js/chart/Chart.min.js";
import { setupModal, modalH3, modalSimpleText, modalInputTexts, modalCustomization, modalButton, downloadFile } from '../../assets/js/common/util.js';

import adaptation_state_actions from '@/assets/js/models/actions/domain_implementation/adaptation_state_actions.js';

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
    },
    model_type: {
      type: String,
      required: true
    }
  },
  computed: {
    // load dynamic application menu actions
    dynamicComponent() {
      this.compo = "./"+this.model_type+"/ApplicationActions.vue";
      let compo = "./"+this.model_type+"/ApplicationActions.vue";
      if(this.model_type==""){
        // nothing
      }else{
        try{
          let test = require(`${compo}`);
          function imp(){
            return import(`${compo}`);
          }
          return imp;
        }catch (ex) {
          return null;
        }
      }
    }
  },
  methods: {
    //Start set parameters
    set_parameters(){
      let c_header = modalH3(this.$t("application_menu_set_app"));
      let default_vals = "";
      let texts = [this.$t("domain_implementation_derived_path")];
      let inputs = ["server_derived_path"];
      if (localStorage["domain_implementation_pool_path"]) {
        default_vals = [localStorage["domain_implementation_derived_path"]];
      } else {
        default_vals = ["uploads/component_derived/"];
      }
      let c_body = modalInputTexts(texts,inputs,default_vals);
      let c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body,c_footer);
    },
    //Start execute derivation
    execute_derivation() {
      if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_pool_path"] && localStorage["domain_implementation_derived_path"]) {
        this.errors=[];
        this.model_data=JSON.stringify(di_actions(this.current_graph,"execute"));
        axios.post(localStorage["domain_implementation_main_path"]+'ComponentImplementation/execute', {
          data: this.model_data,
          p_pool: localStorage["domain_implementation_pool_path"],
          p_derived: localStorage["domain_implementation_derived_path"]
        })
        .then(response => {
          let c_header = modalH3(this.$t("models_actions_derivation_response"));
          let c_body = modalSimpleText(response.data);
          setupModal(c_header,c_body);
        })
        .catch(e => {
          this.errors.push(e); 
          let c_header = modalH3(this.$t("modal_error"),"error");
          console.log(this.$t("model_actions_backend_problem"));
          let c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
          setupModal(c_header,c_body);
        });
      }else{
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
        setupModal(c_header,c_body);
      }
    },
    //Start verify derivation
    verify_derivation() {
      if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_derived_path"]) {
        this.errors=[];
        this.model_data=JSON.stringify(di_actions(this.current_graph,"verify"));
        axios.post(localStorage["domain_implementation_main_path"]+'ComponentImplementation/verify', {
          data: this.model_data,
          p_derived: localStorage["domain_implementation_derived_path"]
        })
        .then(response => {
          let c_header = modalH3(this.$t("models_actions_derivation_response"));
          let c_body = modalSimpleText(response.data);
          setupModal(c_header,c_body);
        })
        .catch(e => {
          this.errors.push(e); 
          let c_header = modalH3(this.$t("modal_error"),"error");
          console.log(this.$t("model_actions_backend_problem"));
          let c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
          setupModal(c_header,c_body);
        });
      }else{
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
        setupModal(c_header,c_body);
      }
    },
    //Start customize derivation
    customize_derivation() {
      this.previous_dest="";
      if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_pool_path"] && localStorage["domain_implementation_derived_path"]) {
        this.errors=[];
        this.customization_data=di_actions(this.current_graph,"customize");

        if(this.customization_data.length==0){
          let c_header = modalH3(this.$t("modal_error"),"error");
          let c_body = modalSimpleText("No components to customize");
          setupModal(c_header,c_body);
        }else{
          if(this.customization_data[0]){
            this.model_data=JSON.stringify(this.customization_data);
            axios.post(localStorage["domain_implementation_main_path"]+'ComponentImplementation/customize/start', {
              data: this.model_data,
              p_pool: localStorage["domain_implementation_pool_path"],
              p_derived: localStorage["domain_implementation_derived_path"]
            })
            .then(response => {
              this.customization_response=response.data;
              this.customization_comp_pos=0;
              this.customization_cus_pos=0;
              this.customization_cus_max_pos=0;
              this.customization_comp_max_pos=this.customization_response.length;
              let default_vals = ["","","","",""];
              let c_header = modalH3("Start Customization Process");
              let texts = ["Current file","Default content","New customized content", "File to upload","Notification"];
              let inputs = ["current","default","customized","filetoupload","notification"];
              let c_body = modalCustomization(texts,inputs,default_vals);
              let c_footer = modalButton("Start/Next",this.run_customization);
              setupModal(c_header,c_body, c_footer);
              document.getElementById('filetoupload').onchange=this.send_file;
            })
            .catch(e => {
              this.errors.push(e); 
              let c_header = modalH3(this.$t("modal_error"),"error");
              console.log(this.$t("model_actions_backend_problem"));
              let c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
              setupModal(c_header,c_body);
            });
          }else{
            let c_header = modalH3("Customization response");
            let c_body = modalSimpleText("customization completed");
            setupModal(c_header,c_body);
          }
        }
      }else{
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
        setupModal(c_header,c_body);
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
    run_customization(){
      document.getElementById('filetouploadtr').style.display = "none";
      document.getElementById('customized').disabled = false;
      if(this.customization_comp_pos<this.customization_comp_max_pos){
        this.customization_cus_max_pos=this.customization_response[this.customization_comp_pos][1];
        if(this.customization_cus_pos<this.customization_cus_max_pos){
          let current_pos=2+this.customization_cus_pos*3;
          document.getElementById('notification').value="";
          document.getElementById('default').value="";
          let customized_content="";
          if(this.previous_dest!=""){
            customized_content=document.getElementById('customized').value;
          }
          document.getElementById('customized').value="";
          document.getElementById('current').value=this.customization_response[this.customization_comp_pos][current_pos];
          let destination=this.find_destination_file(this.customization_response[this.customization_comp_pos][current_pos]);
          if(destination==""){
            this.previous_dest="";
            document.getElementById('notification').value="Current file not found, verify the component diagram";
          }else{
            document.getElementById('current').value="ID: " + this.customization_response[this.customization_comp_pos][current_pos] + " - DEST: " + destination;
            let model_datax=[];
            model_datax[0]=destination;
            model_datax[1]=this.customization_response[this.customization_comp_pos][current_pos+1];
            model_datax[2]=this.customization_response[this.customization_comp_pos][current_pos+2];
            if(this.previous_dest!=""){
              model_datax[3]=this.previous_dest;
              model_datax[4]=this.previous_cpoint;
              model_datax[5]=this.previous_plan;
              model_datax[6]=customized_content;
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
      }else{
        let c_header = modalH3("Customization response");
        let c_body = modalSimpleText("Customization completed");
        setupModal(c_header,c_body);
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
      let component_relations = this.current_graph.getModel().getChildEdges(component_root);

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
    hide_control_elements(controlAction){//controlAction es el nombre en string
      let names_control_action = [];
      let target;// 

      let target_system_id; // target system id
      let proportional;// proportional value of the target system element
      let derivate;// derivate value of the target system element
      let integral;// integral value of the target system element
      let target_system_relations; // relations target system
      // controller variables
      let id_controller;// controller id
      let controller_relations; // controller relations
      let id_controller_inner;
      let controller_inner_relations;
      let proportional_inner;// proportional value of the target system element
      let derivate_inner;// derivate value of the target system element
      let integral_inner;// integral value of the target system element
      // summing point variables
      let id_summing; // summing point id
      let summing_relations; // summing relations
      let id_initial_summing; // summing initial id
      let summing_relations2;
      let summing_value;// value summing
      let summing_value_inner; // value summing inner
      let id_summing_plant // id summing plant
      // filter variables
      let id_filter; // filter relations
      let filter_relations;
      // set point variables
      let setpoint_value; // value setpoint
      let setpoint_time;
      let setpoints=[]; // array
      let id_set;// id setpoint
      let times=[];
      let id_set2=false;
      // subtraction
      let id_subtraction;
      let subtraction_relations;
      let subraction_value;
    
      // branch variables
      let id_branch// id branchpoint
      let id_final_branch
      let branch_relations_targets// target relations branchpoint
      let branch_relations_targets2// target relations branchpoint
      let branch_relations// source relations branchpoint
       let final_branch_relations// source relations branchpoint
      // output variables
      let id_output// id output
      let currentoutput// current output
      // transducer variables
      let value_transducer// value transducer
      let id_transducer// id transducer
      let transducer_relations// transducer relations
      // list elements
      let list_elements=[];
      let id_final;


      let feedback_root = this.current_graph.getModel().getCell("control");

      let childs = this.current_graph.getModel().getChildVertices(feedback_root);
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
         if ( "control_led"== names_control_action[i]  )
        {
          
           for (let i = 0; i < childs.length; i++)
            {
                  if (childs[i].getAttribute("type") == "controlAction")
                  { //only selected concrete features are analyzed
                
                    if(childs[i].getAttribute("label")== "control_led")
                    {
                      target_system_id = childs[i].getId(); 
                      list_elements.push(target_system_id);
                    }                 
                  }   
            }

            target_system_relations = this.current_graph.getModel().getIncomingEdges
            (this.current_graph.getModel().getCell(target_system_id));
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
            controller_inner_relations = this.current_graph.getModel().getIncomingEdges
            (this.current_graph.getModel().getCell(id_summing_plant));
      
            for (let i = 0; i < controller_inner_relations.length; i++)
            {
              let source = controller_inner_relations[i].source;
             if(source.getAttribute("type")=="controller")
              { 
                
                id_controller_inner= source.getId();
                list_elements.push(id_controller);
                
                  
                    
              }
              
            }
           
           controller_inner_relations = this.current_graph.getModel().getIncomingEdges
            (this.current_graph.getModel().getCell(id_controller_inner));
      
            for (let i = 0; i < controller_inner_relations.length; i++)
            {
              let source = controller_inner_relations[i].source;
              if(source.getAttribute("type")=="summing_point"  )
              {
                id_summing = source.getId();
                list_elements.push(id_summing);   
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
            
            controller_relations =  this.current_graph.getModel().getIncomingEdges
              ( this.current_graph.getModel().getCell(id_controller));
            for (let i = 0; i < controller_relations.length; i++)
            {
                    let source = controller_relations[i].source;
                    if(source.getAttribute("type")=="summing_point")
              {
                id_initial_summing = source.getId(); 
                 list_elements.push(id_initial_summing);

              }
              
            }
            summing_relations2 =  this.current_graph.getModel().getIncomingEdges
              ( this.current_graph.getModel().getCell(id_initial_summing));
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
               filter_relations =  this.current_graph.getModel().getIncomingEdges
              ( this.current_graph.getModel().getCell(id_filter));
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
             transducer_relations =  this.current_graph.getModel().getIncomingEdges
              ( this.current_graph.getModel().getCell(id_transducer));
            for (let i = 0; i < transducer_relations.length; i++)
            {
               let source = transducer_relations[i].source;
              if(source.getAttribute("type")=="branchpoint")
              {
                id_final_branch = source.getId(); 
                list_elements.push(id_branch); 
              }
               
            }
              branch_relations_targets =this.current_graph.getModel().getOutgoingEdges
            (this.current_graph.getModel().getCell(id_final_branch));
            for (let i = 0; i < branch_relations_targets.length; i++)
            {
                let target = branch_relations_targets[i].target;
              if(target.getAttribute("type")=="measured_output")
              {
                id_output= target.getId();
                 list_elements.push(id_output); 
              }
            }
             final_branch_relations =this.current_graph.getModel().getIncomingEdges
            (this.current_graph.getModel().getCell(id_final_branch));
            for (let i = 0; i < final_branch_relations.length; i++)
            {
                let source = final_branch_relations[i].source;
               
              if(source.getAttribute("type")=="branchpoint")
              {
                id_branch= source.getId();

                 list_elements.push(id_branch); 
              }
              
            }
           
            branch_relations = this.current_graph.getModel().getIncomingEdges
           (this.current_graph.getModel().getCell(id_branch));
          for(let i = 0; i < branch_relations.length; i++)
          {
            let source = branch_relations[i].source;
            if(source.getId() == target_system_id && source.getAttribute("type")=="controlAction")
            {
                 id_final=source.getId();
            }
            
            
          }
            
          let feedback_root = this.current_graph.getModel().getCell("control");
          let childs2 = this.current_graph.getModel().getChildVertices(feedback_root);
          for (let i = 0; i < childs2.length; i++) 
          {
            if(childs2[i].getId()!= target_system_id && childs2[i].getId()!= id_summing && childs2[i].getId()!= id_set
                && childs2[i].getId()!= id_filter && childs2[i].getId()!= id_controller && childs2[i].getId()!= id_branch
                && childs2[i].getId()!= id_output && childs2[i].getId()!= id_controller_inner && childs2[i].getId()!= id_initial_summing
                && childs2[i].getId()!= id_final_branch && childs2[i].getId()!=  id_transducer && childs2[i].getId()!=  id_summing_plant) 
          {
            
           this.current_graph.getModel().setVisible(childs2[i], false)
          }
          else{
            this.current_graph.getModel().setVisible(childs2[i], true)
          }
          }

        }

      }

    },

    adaptation_state_source_code_generation() {
      try {
        let serverUrl =
          localStorage["domain_implementation_main_path"] +
          "AdaptationStateImplementation/generateSourceCode";
        //alert(serverUrl);
        let directory = localStorage["domain_implementation_pool_path"];
        //alert(directory);
        let modelJson = adaptation_state_actions(
          this.current_graph,
          "serializeJson"
        );
        //alert(modelJson);
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
<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("domain_implementation") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a @click="set_parameters()" class="dropdown-item">{{ $t("domain_implementation_set_params") }}</a>
      <a @click="execute_derivation()" class="dropdown-item">{{ $t("domain_implementation_execute") }}</a>
      <a @click="verify_derivation()" class="dropdown-item">{{ $t("domain_implementation_verify") }}</a>
      <a class="dropdown-item">{{ $t("domain_implementation_customize") }}</a>
    </div>

  </li>
</template>

<script>
import axios from "axios";
import di_actions from '@/assets/js/models/actions/domain_implementation/di_actions.js'

export default {
  data: function(){
    return {
      model_data:"",
      errors:[], //errors
    }
  },
  props: {
   current_graph: {
    type: Object,
    required: true
   }
  },
  methods: {
    set_parameters(){
      // modal header
      var c_header = modalH3(this.$t("domain_implementation_set_params"));
      // modal body
      var default_vals = "";
      var texts = [this.$t("domain_implementation_pool_path"),this.$t("domain_implementation_derived_path")];
      var inputs = ["server_component_path","server_derived_path"];
      if (localStorage["domain_implementation_pool_path"]) {
        default_vals = [localStorage["domain_implementation_pool_path"],localStorage["domain_implementation_derived_path"]];
      }else{
        default_vals = ["uploads/component_pool/","uploads/component_derived/"];
      }
      var c_body = modalInputTexts(texts,inputs,default_vals);
      // modal footer
      var c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body,c_footer);
    },
    execute_derivation() {
      if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_pool_path"]) {
        this.errors=[];
        this.model_data=JSON.stringify(di_actions(this.current_graph,"execute"));
        axios.post(localStorage["domain_implementation_main_path"]+'DomainImplementation/execute', {
          data: this.model_data
        })
        .then(response => {
          var c_header = modalH3(this.$t("models_actions_derivation_response"));
          var c_body = modalSimpleText(response.data);
          setupModal(c_header,c_body);
        })
        .catch(e => {
          this.errors.push(e); 
          var c_header = modalH3(this.$t("modal_error"),"error");
          console.log(this.$t("model_actions_backend_problem"));
          var c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
          setupModal(c_header,c_body);
        });
      }else{
        var c_header = modalH3(this.$t("modal_error"),"error");
        var c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
        setupModal(c_header,c_body);
      }
    },
    verify_derivation() {
      if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_pool_path"]) {
        this.errors=[];
        this.model_data=JSON.stringify(di_actions(this.current_graph,"verify"));
        axios.post(localStorage["domain_implementation_main_path"]+'DomainImplementation/verify', {
          data: this.model_data
        })
        .then(response => {
          var c_header = modalH3(this.$t("models_actions_derivation_response"));
          var c_body = modalSimpleText(response.data);
          setupModal(c_header,c_body);
        })
        .catch(e => {
          this.errors.push(e); 
          var c_header = modalH3(this.$t("modal_error"),"error");
          console.log(this.$t("model_actions_backend_problem"));
          var c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
          setupModal(c_header,c_body);
        });
      }else{
        var c_header = modalH3(this.$t("modal_error"),"error");
        var c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
        setupModal(c_header,c_body);
      }
    },
    save_parameters(){
      localStorage["domain_implementation_pool_path"] =  document.getElementById('server_component_path').value;
      localStorage["domain_implementation_derived_path"] =  document.getElementById('server_derived_path').value;
      document.getElementById('main_modal').style.display="none";
    }
  }
}
</script>


<style scoped>
</style>

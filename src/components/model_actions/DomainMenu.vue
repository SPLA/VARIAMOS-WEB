<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("domain_menu") }}
    </a>
    <div id="domain-menu" class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a data-menudisplay="['feature','component','binding_feature_component']" @click="set_parameters()" class="dropdown-item">{{ $t("domain_menu_set_comp") }}</a>
      <component :is="dynamicComponent" :current_graph="current_graph"></component>
    </div>

  </li>
</template>

<script>
import { setupModal, modalH3, modalInputTexts, modalButton, modalSimpleText } from '../../assets/js/common/util.js'
import axios from "axios";

export default {
  data: function(){
    return {
      model_data:"",
      errors:[], //errors
      compo:""
    }
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
    // load dynamic domain menu actions
    dynamicComponent() {
      this.compo="./"+this.model_type+"/DomainActions.vue";
      let compo = "./"+this.model_type+"/DomainActions.vue";
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
      let c_header = modalH3(this.$t("domain_menu_set_comp"));
      let default_vals = "";
      let texts = [this.$t("domain_implementation_pool_path")];
      let inputs = ["server_component_path"];
      if (localStorage["domain_implementation_pool_path"]) {
        default_vals = [localStorage["domain_implementation_pool_path"]];
      }else{
        default_vals = ["uploads/component_pool/"];
      }
      let c_body = modalInputTexts(texts,inputs,default_vals);
      let c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body,c_footer);
    },
    //Start save parameters
    save_parameters(){
      localStorage["domain_implementation_pool_path"] =  document.getElementById('server_component_path').value;
      document.getElementById('main_modal').style.display="none";
    }
  }
}
</script>

<style scoped>
</style>
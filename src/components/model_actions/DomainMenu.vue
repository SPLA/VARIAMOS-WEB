<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("domain_menu") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a @click="set_parameters()" class="dropdown-item">{{ $t("domain_menu_set_comp") }}</a>
      <a @click="show_file_code()" class="dropdown-item">{{ $t("domain_menu_show_file_code") }}</a>
    </div>

  </li>
</template>

<script>
import { setupModal, modalH3, modalInputTexts, modalButton, modalSimpleText } from '../../assets/js/common/util'
import axios from "axios";

export default {
  data: function(){
    return {
      model_data:"",
      errors:[] //errors
    }
  },
  props: {
   current_graph: {
    type: Object,
    required: true
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
    },
    show_file_code(){
      //get selected cell
      let cell = this.current_graph.getSelectionCell(); 
      if(cell==null){
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_menu_sfc_invalid"));
        setupModal(c_header,c_body);
      }else if(cell.getAttribute("type")=="file"){
        let data={};
        data["filename"]=cell.getAttribute("filename");
        data["component"]=cell.getEdgeAt(0).target.getAttribute("label");
        if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_pool_path"]) {
          this.errors=[];
          this.model_data=JSON.stringify(data);
          //execute VariaMos service to get file content
          axios.post(localStorage["domain_implementation_main_path"]+'ComponentImplementation/getFile', {
            data: this.model_data,
            p_pool: localStorage["domain_implementation_pool_path"]
          })
          .then(response => {
            if(response.data=="File not found"){
              let c_header = modalH3(this.$t("modal_error"),"error");
              let c_body = modalSimpleText(this.$t("domain_menu_sfc_not_found"));
              setupModal(c_header,c_body);
            }else{
              //append code to the properties area
              let properties_table = document.getElementById("properties");
              let tr = document.createElement('div');
              let td = document.createElement('div');
              let input = document.createElement('textarea');
              input.style.width = '100%';
              input.setAttribute('rows', 10);
              input.disabled = true;
              input.value = response.data;
              td.appendChild(input);
              tr.appendChild(td); properties_table.appendChild(tr);
            }
          })
          .catch(e => {
            this.errors.push(e); 
            let c_header = modalH3(this.$t("modal_error"),"error");
            let c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
            setupModal(c_header,c_body);
          });
        }else{
          let c_header = modalH3(this.$t("modal_error"),"error");
          let c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
          setupModal(c_header,c_body);
        }
      }else{
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_menu_sfc_invalid"));
        setupModal(c_header,c_body);
      }                   
    }
  }
}
</script>


<style scoped>
</style>

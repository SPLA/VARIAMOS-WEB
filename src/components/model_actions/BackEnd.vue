<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("backend_title") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a @click="set_params()" class="dropdown-item">{{ $t("backend_setup") }}</a>
    </div>
  </li>
</template>

<script>
import { setupModal, modalH3, modalInputTexts, modalButton } from '../../assets/js/common/util'

export default {
  data: function(){
    return {
    }
  },
  methods: {
    set_params(){
      // modal header
      let c_header = modalH3(this.$t("backend_setup"));
      // modal body
      let default_vals = [];
      let texts = [this.$t("backend_setup_path")];
      let inputs = ["server_main_path"];
      if (localStorage["domain_implementation_main_path"]) {
        default_vals[0]  = [localStorage["domain_implementation_main_path"]];
      }else{
        default_vals[0] = "[VARIAMOS SERVICE URL]";
      }
      let c_body = modalInputTexts(texts,inputs,default_vals);
      // modal footer
      let c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body,c_footer);
    },
    save_parameters(){
      localStorage["domain_implementation_main_path"] =  document.getElementById('server_main_path').value;
      document.getElementById('main_modal').style.display="none";
    }
  }
}
</script>


<style scoped>
</style>

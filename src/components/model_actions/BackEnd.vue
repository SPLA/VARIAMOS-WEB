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
      let texts = [this.$t("backend_setup_path"),this.$t("backend_setup_git_token"),this.$t("backend_setup_git_user_login")];
      let inputs = ["server_main_path","server_git_token","server_git_user_login"];
      if (localStorage["domain_implementation_main_path"]) {
        default_vals[0]  = [localStorage["domain_implementation_main_path"]];
      }else{
        default_vals[0] = "[VARIAMOS SERVICE URL]";
      }
      if (localStorage["domain_implementation_git_token"]) {
        default_vals[1] = [localStorage["domain_implementation_git_token"]];
      }else{
        default_vals[1] = "[GITHUB TOKEN]";
      }
      if (localStorage["domain_implementation_user_login"]) {
        default_vals[2] = [localStorage["domain_implementation_user_login"]];
      }else{
        default_vals[2] = "[GIT USER LOGIN]";
      }
      let c_body = modalInputTexts(texts,inputs,default_vals);
      // modal footer
      let c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body,c_footer);
    },
    save_parameters(){
      localStorage["domain_implementation_main_path"] =  document.getElementById('server_main_path').value;
      localStorage["domain_implementation_git_token"] =  document.getElementById('server_git_token').value;
      localStorage["domain_implementation_user_login"] =  document.getElementById('server_git_user_login').value;
      document.getElementById('main_modal').style.display="none";
    }
  }
}
</script>


<style scoped>
</style>

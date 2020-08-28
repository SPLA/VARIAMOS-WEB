<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("samples_title") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a @click="set_params()" class="dropdown-item">{{ $t("samples_title") }}</a>
    </div>

  </li>
</template>

<script>
import { setupModal, modalH3, modalInputTexts, modalButton, modalPickOne } from '../../assets/js/common/util'

export default {
  data: function(){
    return {
    }
  },
  methods: {
    set_params(){
		
	  let available = [
	   {
		"name": "Led with Button",
		"url": "https://cdn.itoxic.me/temp/1.xml" 
	   },
	   {
		"name": "Semaphore with Timer",
		"url": "https://cdn.itoxic.me/temp/2.xml"
	   },
	   {
		"name": "Alarm with TMP36",
		"url": "https://cdn.itoxic.me/temp/3.xml"
	   }
	  ];
		
      // modal header
      let c_header = modalH3(this.$t("samples_title"));
      // modal body
      let default_vals = [];
      let texts = ["Load", "Load", "Load"];
      let inputs = ["server_main_path","server_git_token","server_git_user_login"];
      let c_body = modalPickOne(available,default_vals);
      // modal footer
      //let c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body);
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

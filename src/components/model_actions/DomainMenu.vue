<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("domain_menu") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a @click="set_parameters()" class="dropdown-item">{{ $t("domain_menu_set_comp") }}</a>
    </div>

  </li>
</template>

<script>
export default {
  data: function(){
    return {
      model_data:"",
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
      var c_header = modalH3(this.$t("domain_menu_set_comp"));
      var default_vals = "";
      var texts = [this.$t("domain_implementation_pool_path")];
      var inputs = ["server_component_path"];
      if (localStorage["domain_implementation_pool_path"]) {
        default_vals = [localStorage["domain_implementation_pool_path"]];
      }else{
        default_vals = ["uploads/component_pool/"];
      }
      var c_body = modalInputTexts(texts,inputs,default_vals);
      var c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body,c_footer);
    },
    //Start save parameters
    save_parameters(){
      localStorage["domain_implementation_pool_path"] =  document.getElementById('server_component_path').value;
      document.getElementById('main_modal').style.display="none";
    },
  }
}
</script>


<style scoped>
</style>

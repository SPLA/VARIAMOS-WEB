<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("verification") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a @click="test()" class="dropdown-item">Test sending the model</a>
      <a class="dropdown-item">{{ $t("verification_dead") }}</a>
      <a class="dropdown-item">{{ $t("verification_false") }}</a>
    </div>
  </li>
</template>

<script>
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
    test(){
      if (localStorage["domain_implementation_main_path"]) {
        this.errors=[];
        var encoder = new mxCodec();
        var result = encoder.encode(this.current_graph.getModel());
        var xml = mxUtils.getXml(result);
        axios.post(localStorage["domain_implementation_main_path"]+'Verification/test', {
          data: xml
        })
        .then(response => {
          var c_header = modalH3("Test response");
          var c_body = modalSimpleText(response.data);
          setupModal(c_header,c_body);
        })
        .catch(e => {
          this.errors.push(e); 
          var c_header = modalH3(this.$t("modal_error"),"error");
          var c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
          setupModal(c_header,c_body);
        });
      }else{
        var c_header = modalH3(this.$t("modal_error"),"error");
        var c_body = modalSimpleText(this.$t("verification_path_problem"));
        setupModal(c_header,c_body);
      }
      
    }
  }
}
</script>

<style scoped>
</style>
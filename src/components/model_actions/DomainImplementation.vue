<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("domain_implementation") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a class="dropdown-item">{{ $t("domain_implementation_set_params") }}</a>
      <a @click="execute_derivation()" class="dropdown-item">{{ $t("domain_implementation_execute") }}</a>
      <a class="dropdown-item">{{ $t("domain_implementation_verify") }}</a>
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
    execute_derivation() {
      this.errors=[];
      this.model_data=JSON.stringify(di_actions(this.current_graph,"execute"));
      axios.post('http://localhost:8090/VariaMosServices/DomainImplementation/execute', {
        data: this.model_data
      })
      .then(response => {
        alert(response.data);
      })
      .catch(e => {
        this.errors.push(e); 
        alert(e + messages["model_actions_backend_problem"]);
      });
    }
  }
}
</script>


<style scoped>
</style>

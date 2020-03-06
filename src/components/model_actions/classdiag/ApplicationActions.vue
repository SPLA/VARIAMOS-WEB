<template>
  <div>
    <a @click="generateCode()" class="dropdown-item">Generate Code</a>
  </div>
</template>

<script>
import {
  setupModal,
  modalH3,
  modalInputTexts,
  modalButton,
  modalSimpleText
} from "@/assets/js/common/util.js";
import { handleResize } from "../../../assets/js/models/custom/classdiag/setup_events.js";
import axios from "axios";

export default {
  data: function() {
    return {
      model_data: "",
      errors: [] //errors
    };
  },
  props: {
    current_graph: {
      type: Object,
      required: true
    }
  },
  methods: {
    generateCode() {
      const model = this.current_graph.getModel();
      const classDiagRoot = model.getCell("classdiag");
      
    }
  }
};
</script>


<style scoped>
</style>
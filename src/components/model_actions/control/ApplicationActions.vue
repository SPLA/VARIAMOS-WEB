<template>
  <div>
    <a @click="component()" class="dropdown-item">{{ $t("generate_graph") }}</a>
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
    component() {
    }
  }
};
</script>


<style scoped>
</style>
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
    createClass(elem) {
      const nameContainer = elem.getChildAt(0);
      const className = nameContainer.getAttribute('label');
      const template = 
      `public class ${className} {\n` +
        `\n` +
      `}\n`;
      return template;
    },
    generateCode() {
      const model = this.current_graph.getModel();
      const classDiagRoot = model.getCell("classdiag");
      const nChildren = classDiagRoot.getChildCount();
      const classes = [];
      //Go over the top-level elements of the model and extract classes
      if(nChildren > 0){
        for(let i = 0; i < nChildren; i++){
          const child = classDiagRoot.getChildAt(i);
          const childType = child.getAttribute('type');
          if(childType === 'class'){
            classes.push(child);
          }
        }
      }
      let genText = '';
      classes.forEach(classElem => {
        genText += this.createClass(classElem);
      });
      mxUtils.popup(genText, true);
    }
  }
};
</script>


<style scoped>
</style>
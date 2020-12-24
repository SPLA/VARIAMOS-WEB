<template>
  <div>
    <a
      data-menudisplay="['adaptation_state','adaptation_hardware','adaptation_behavior_hardware','adaptation_behavior_states','adaptation_behavior_transitions','control']"
      @click="adaptation_organize()"
      class="dropdown-item"
      >Organize Diagram</a
    >
  </div>
</template>
<script>

import { GraphUtil } from "@/assets/js/common/graphutil";
import { OrganizerFabric } from "@/assets/js/common/organizers/organizerFabric"; 

export default {
  data: function() {
    return {
      model_data: "",
      errors: [], //errors
    };
  },
  props: {
    current_graph: {
      type: Object,
      required: true,
    },
  },
  methods: {
    adaptation_organize() { 
        let fabric=new OrganizerFabric();
        let organizer = fabric.create(this.current_graph, "adaptation_behavior_transitions");
        organizer.organizeComponents(); 
    },
  },
};
</script>

<style scoped></style>

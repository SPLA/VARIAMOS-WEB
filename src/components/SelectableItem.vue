<template>
  <div id="selectableItem">
    <p align="center">{{ name }}</p>
    <img :src="url" v-bind:class="{ mxToolbarModeSelected: selected }" alt="Arduino image" :width="imgWidth" />
  </div>
</template>

<script>
export default {
  name: "selectableItem",
  props: {
    name: String,
    url: String,
    imgWidth: Number,
    selected: Boolean,
  },
};
</script>

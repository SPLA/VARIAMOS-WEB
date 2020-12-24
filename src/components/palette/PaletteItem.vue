<template>
  <div id="selectableItem" class="col-12">
    <p align="center">{{ label }}</p>
    <span ref="putImageHere"></span>
  </div>
</template>

<script>
export default {
  name: "paletteItem",
  props: {
    label: String,
    image: Object,
  },
  data() {
    return {};
  },
  mounted: function() {
    // var img = new Image();
    // img.src = "/temp.png";
    this.$refs.putImageHere.appendChild(this.image);
  },
};
</script>
